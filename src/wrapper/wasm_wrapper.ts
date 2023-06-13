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

import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from "class-transformer";
import radixEngineToolkitWasm from "../../resources/radix-engine-toolkit.wasm";

/**
 * Wraps a Radix Engine Toolkit WASM instance providing a high level API for making calls to the
 * Radix Engine Toolkit.
 */
class RadixEngineToolkitWasmWrapper {
  /**
   * An object containing objects and functions exported by the Radix Engine Toolkit WASM module.
   */
  public exports: RadixEngineToolkitExports;

  /**
   * An instance created from the Radix Engine Toolkit module.
   * @private
   */
  private instance: WebAssembly.Instance;

  /**
   * The encoder used to UTF-8 encode strings
   */
  private encoder: TextEncoder = new TextEncoder();

  /**
   * The decoder used to decode strings from UTF-8 bytes.
   */
  private decoder: TextDecoder = new TextDecoder();

  constructor(instance: WebAssembly.Instance) {
    this.instance = instance;
    this.exports = instance.exports as unknown as RadixEngineToolkitExports;
  }

  public static async new(): Promise<RadixEngineToolkitWasmWrapper> {
    const instance = await radixEngineToolkitWasm({});
    return new RadixEngineToolkitWasmWrapper(instance.instance);
  }

  /**
   * A high-level method for calling functions from the `RadixEngineToolkitFFI` through a simple
   * interface.
   *
   * The main purpose of this method is to provide a higher-level interface for calling into the
   * `RadixEngineToolkit`, as such, this method performs all required memory allocation,
   * deallocation, object serialization, deserialization encoding, and decoding required for any
   * call into the RadixEngineToolkit
   * @param input An object containing the input payload
   * @param fn The function to call of the `RadixEngineToolkitFFI`
   * @param Output The constructor function. This constructor will not actually be used to
   * construct any objects. Rather, it will be used as the type to cast the object to after it has
   * been deserialized.
   * @return A generic object of type `O` of the output to the input
   * @private
   */
  public invoke<I, O>(
    input: I,
    fn: (pointer: number) => number,
    Output: ClassConstructor<O>
  ): O {
    // Write the input object to memory and get a pointer to where it was written
    const inputPointer = this.writeObjectToMemory(input);

    // Call the WASM function with the input pointer
    const outputPointer = fn(inputPointer);

    // Read and deserialize the output
    const outputString = this.readStringFromMemory(outputPointer);
    const parsedOutput = JSON.parse(outputString);
    if (isRetInvocationError(parsedOutput?.["type"])) {
      throw new Error(
        `Invocation Error. Invocation: """${JSON.stringify(
          input
        )}""". Output: """${JSON.stringify(parsedOutput)}"""`
      );
    }

    const output = plainToInstance(Output, parsedOutput);

    // Deallocate the input and output pointers
    this.deallocateMemory(inputPointer);
    this.deallocateMemory(outputPointer);

    // Return the object back to the caller
    return output as O;
  }

  /**
   * Deallocates memory beginning from the provided memory pointer and ending at the first
   * null-terminator found
   * @param pointer A memory pointer to the starting location of the memory to deallocate
   */
  private deallocateMemory(pointer: number) {
    this.exports.toolkit_free_c_string(pointer);
  }

  /**
   * This method reads a UTF-8 null-terminated string the instance's linear memory and returns it
   * as a JS string.
   * @param pointer A pointer to the memory location containing the string
   * @return A JS string of the read and decoded string
   */
  private readStringFromMemory(pointer: number): string {
    // Determine the length of the string based on the first null terminator
    const view = new Uint8Array(this.exports.memory.buffer, pointer);
    const length = view.findIndex((byte) => byte === 0);

    if (length == -1) {
      throw new Error("No null terminator found");
    } else {
      // Read the UTF-8 encoded string from memory
      const nullTerminatedUtf8EncodedString = new Uint8Array(
        this.exports.memory.buffer,
        pointer,
        length
      );

      try {
        // Decode the string and return it back to the caller
        return this.decoder.decode(nullTerminatedUtf8EncodedString);
      } catch {
        throw new Error("Failed to decode string in UTF-8");
      }
    }
  }

  /**
   * Writes an object to memory by serializing it to JSON and UTF-8 encoding the serialized string.
   * @param obj The object to write to the instance's linear memory.
   * @return A pointer to the location of the object in memory
   */
  private writeObjectToMemory(obj: any): number {
    // Serialize the object to json
    const serializedObject: string = this.serializeObject(obj);

    // Write the string to memory and return the pointer
    return this.writeStringToMemory(serializedObject);
  }

  /**
   * Allocates memory of a certain capacity on the WebAssembly instance's linear memory through the
   * `RadixEngineToolkit`'s internal memory allocator
   * @param capacity The capacity of the memory to allocate
   * @return A memory pointer of the allocated memory
   */
  private allocateMemory(capacity: number): number {
    return this.exports.toolkit_alloc(capacity);
  }

  /**
   * Serializes an object to a JSON string
   * @param object The object to serialize
   * @return A string of the serialized representation
   */
  private serializeObject(obj: any): string {
    return JSON.stringify(instanceToPlain(obj));
  }

  /**
   * A method to write strings to memory in the way expected by the Radix Engine Toolkit.
   *
   * This method first UTF-8 encodes the passed string and adds a null-terminator to it. It then
   * allocates enough memory for the encoded string and writes it to memory. Finally, this method
   * returns the pointer back to the caller to use.
   *
   * Note: Since the pointer is returned to the caller, it is now the caller's burden to deallocate
   * this memory when it is no longer needed.
   *
   * @param str A string to write to memory
   * @return A pointer to the memory location containing the null-terminated UTF-8 encoded string
   */
  private writeStringToMemory(str: string): number {
    // UTF-8 encode the string and add the null terminator to it.
    const nullTerminatedUtf8EncodedString: Uint8Array = new Uint8Array([
      ...this.encoder.encode(str),
      0,
    ]);

    // Allocate memory for the string
    const memoryPointer: number = this.allocateMemory(
      nullTerminatedUtf8EncodedString.length
    );

    // Write the string to the instance's linear memory
    const view: Uint8Array = new Uint8Array(
      this.exports.memory.buffer,
      memoryPointer
    );
    view.set(nullTerminatedUtf8EncodedString);

    // return the memory pointer back to the caller
    return memoryPointer;
  }
}

/**
 * Defines the exports of the Radix Engine Toolkit WASM module
 */
interface RadixEngineToolkitExports {
  /**
   * The Radix Engine Toolkit WASM exports its own memory and does not require any memory imports.
   * This is the memory exported by the WebAssembly instance.
   */
  memory: WebAssembly.Memory;

  information(pointer: number): number;

  convert_manifest(pointer: number): number;

  extract_addresses_from_manifest(pointer: number): number;

  compile_transaction_intent(pointer: number): number;

  compile_signed_transaction_intent(pointer: number): number;

  compile_notarized_transaction(pointer: number): number;

  decompile_transaction_intent(pointer: number): number;

  decompile_signed_transaction_intent(pointer: number): number;

  decompile_notarized_transaction(pointer: number): number;

  decompile_unknown_transaction_intent(pointer: number): number;

  hash_transaction_intent(pointer: number): number;

  hash_signed_transaction_intent(pointer: number): number;

  hash_notarized_transaction(pointer: number): number;

  derive_babylon_address_from_olympia_address(pointer: number): number;

  derive_virtual_account_address(pointer: number): number;

  derive_virtual_identity_address(pointer: number): number;

  derive_non_fungible_global_id_from_private_key(pointer: number): number;

  encode_address(pointer: number): number;

  decode_address(pointer: number): number;

  sbor_encode(pointer: number): number;

  sbor_decode(pointer: number): number;

  known_entity_addresses(pointer: number): number;

  statically_validate_transaction(pointer: number): number;

  hash(pointer: number): number;

  /**
   * A foreign function interface for the toolkit function responsible for all allocation of memory
   * used in the toolkit
   * @param capacity The capacity of the memory to allocate.
   * @return A memory pointer pointing to the start of the allocated memory
   */
  toolkit_alloc(capacity: number): number;

  /**
   * A foreign function interface for the toolkit function responsible for the deallocation of
   * memory.
   *
   * It should be noted that this function operates with two main assumptions:
   * 1. That the memory that will be freed has been allocated with the same allocator.
   * 2. That the memory contains a null-terminated c-string.
   *
   * Therefore, this function does not require any additional information as to the size of the
   * memory to deallocate, this will be determined based on the first null-terminator encountered.
   *
   * @param pointer A pointer to the start of the memory to free.
   */
  toolkit_free_c_string(pointer: number): void;
}

const isRetInvocationError = (str: any) =>
  str === undefined
    ? false
    : ["InvocationHandlingError", "InvocationInterpretationError"].includes(
        str
      );

export { RadixEngineToolkitWasmWrapper };
