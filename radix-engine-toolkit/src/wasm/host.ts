// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

/**
 * A class representing the WASM host of the Radix Engine Toolkit. This class does not understand
 * what functions exist in the toolkit, it simply understands that the toolkit is a WASM module of
 * which we can create instances,
 *
 * - The Radix Engine Toolkit is a WASM module of which we can create WASM instances which expose
 * some memory and some unknown methods.
 * - The semantics of how to call methods in the Radix Engine Toolkit (by serializing to JSON,
 * allocating memory, and other operations.).
 *
 * It's important to note that this class doesn't know what functions exist on the RET. It's simply
 * the runtime of the RET with nothing else on-top.
 *
 * This class has a generic parameter {@link Exports}. In this case, {@link Exports} is the type of
 * the exports of the RET which is determined by classes that make use of this class.
 */
export abstract class Host<Exports> {
  /**
   * The exports of the Radix Engine Toolkit as defined by the calling code that defines what
   * functions exist on the toolkit.
   */
  public exports: Exports;

  /** Used for UTF-8 encoding text */
  private textEncoder: TextEncoder = new TextEncoder();

  /** Used for UTF-8 decoding text */
  private textDecoder: TextDecoder = new TextDecoder();

  constructor(exports: Exports) {
    this.exports = exports;
  }

  /**
   * Provides an abstract way of calling functions on the Radix Engine Toolkit handling memory
   * allocation/deallocation and input/output encoding/decoding on behalf of the caller. Allowing
   * for a higher-level API for calling into the RET and getting responses.
   * @param input The input of the Radix Engine Toolkit function.
   * @param fn The Radix Engine Toolkit function to invoke.
   * @returns An object of the generic type {@link O} of the expected output from the function.
   */
  public callFunction<O>(input: any, fn: (input: number) => number): O {
    const inputPointer = this.writeObjectToMemory(input);
    const outputPointer = fn(inputPointer);
    const output = this.readObjectFromMemory<O>(outputPointer);
    return output;
  }

  /**
   * An abstract function that allocates the specified required capacity of memory and returns a
   * pointer of the allocated memory.
   *
   * This is an abstract function since this class has no understanding of the function in the Radix
   * Engine Toolkit, just of how the be a WASM host and do some low level calls into the toolkit.
   * @param capacity The size of memory to allocate.
   * @returns A pointer to the allocated memory.
   */
  abstract allocateMemory(capacity: number): number;

  /**
   * An abstract function that deallocates the memory at a given pointer through the Radix Engine
   * Toolkit's allocator. This function assumes that the given pointer is to a memory location
   * containing a null-terminated c-string and the length of the memory to deallocate is determined
   * based on the position of the null terminator of the string.
   *
   * This is an abstract function since this class has no understanding of the function in the Radix
   * Engine Toolkit, just of how the be a WASM host and do some low level calls into the toolkit.
   * @param pointer A pointer to the memory location to deallocate.
   */
  abstract deallocateMemory(pointer: number): void;

  /**
   * An abstract function that returns the memory of the WASM instance.
   * @returns The memory in use by the WASM instance based on the exports.
   */
  abstract memory(): WebAssembly.Memory;

  /**
   * Writes an object to the WASM's linear memory in the standard Radix Engine Toolkit serialization
   * format and returns a pointer to the object in memory.
   *
   * During communication with the Radix Engine Toolkit, objects are expected to be serialized in
   * the following way:
   * - Serialized to JSON.
   * - UTF-8 Encoded with a null terminator at the end.
   *
   * Thus, this function writes the null-terminated utf-8 encoded JSON serialization of the object
   * to memory and returns it's address.
   *
   * This function performs all of the necessary memory allocations through the memory allocator
   * exposed by the Radix Engine Toolkit. No memory allocation happens outside this function.
   * @param obj The JS object to write to memory, can be of any type.
   * @returns A pointer to the object in the memory of the WASM instance.
   */
  private writeObjectToMemory(obj: any): number {
    const serializedObject = JSON.stringify(obj);
    const encodedObject = this.textEncoder.encode(serializedObject);
    const nullTerminatedEncodedObject = new Uint8Array([...encodedObject, 0]);
    const requiredCapacity = nullTerminatedEncodedObject.length;

    const memoryPointer = this.allocateMemory(requiredCapacity);
    const view: Uint8Array = new Uint8Array(
      this.memory().buffer,
      memoryPointer
    );
    view.set(nullTerminatedEncodedObject);

    return memoryPointer;
  }

  /**
   * Reads objects from the WASM's memory in the standard Radix Engine Toolkit serialization format
   * which is identical to that described in the {@link writeObjectToMemory} function documentation.
   *
   * After reading the memory, this function deallocates the provided pointer meaning that the
   * calling code is no-longer able to read or write to this memory pointer any-longer.
   *
   * Note that this function offers no guarantees that the output of the Radix Engine Toolkit
   * conforms to {@link T}, the generic in this function is provided only as a type hint to the
   * client and not for verification.
   *
   * @param pointer A pointer to the location in memory to read from.
   * @returns A parsed object of type {@link T} that has been read from the WASM memory. See note
   * above on the guaranteed provided by the RET for this.
   * @throws This function throws an exception in the following cases:
   * - If we fail to find the null terminator of the object in memory.
   * - If we fail to UTF-8 decode the data that's been read.
   */
  private readObjectFromMemory<T>(pointer: number): T {
    const memoryBuffer = this.memory().buffer;
    const view = new Uint8Array(memoryBuffer, pointer);
    const length = view.findIndex((byte) => byte === 0);
    if (length === -1) {
      throw new Error(
        "Failed to find the null-terminator in the response from the RET."
      );
    }

    const nullTerminatedEncodedObject = new Uint8Array(
      memoryBuffer,
      pointer,
      length
    );

    let output: T;
    try {
      const decodedOutput = this.textDecoder.decode(
        nullTerminatedEncodedObject
      );
      output = JSON.parse(decodedOutput);
    } catch {
      throw new Error(
        `Attempted to UTF-8 decode the response from the RET but failed: ${nullTerminatedEncodedObject}`
      );
    }

    this.deallocateMemory(pointer);
    return output;
  }
}
