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

import { blake2b } from "blakejs";
import * as changeCase from "change-case";
import Decimal from "decimal.js";

/**
 * Converts a number to a string
 * @param num The number to convert to a string
 * @returns The decimal number represented as a string
 */
export const numberToString = (num: number): string => {
  return num.toLocaleString("fullwide", { useGrouping: false });
};

/**
 * Converts a string to a number
 * @param num The string to convert to a number
 * @returns The decimal string represented as a number
 */
export const stringToNumber = (num: string): number => {
  return Number(num);
};

/**
 * Converts a bigInt to a string
 * @param num The bigInt to convert to a string
 * @returns The decimal bigInt represented as a string
 */
export const bigIntToString = (num: BigInt): string => {
  return num.toLocaleString("fullwide", { useGrouping: false });
};

/**
 * Converts a string to a bigInt
 * @param num The string to convert to a bigInt
 * @returns The decimal string represented as a bigInt
 */
export const stringToBigInt = (num: string): BigInt => {
  return BigInt(num);
};

/**
 * Converts a Uint8Array to a string
 * @param num The Uint8Array to convert to a string
 * @returns The decimal Uint8Array represented as a string
 */
export const uint8ArrayToString = (array: Uint8Array): string => {
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

/**
 * Converts a string to a `Uint8Array`
 * @param num The string to convert to a `Uint8Array`
 * @returns The decimal string represented as a `Uint8Array`
 */
export const stringToUint8Array = (str: string): Uint8Array => {
  return Uint8Array.from(
    str.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
};

/**
 * Converts a Uint8Array to a string
 * @param num The Uint8Array to convert to a string
 * @returns The decimal Uint8Array represented as a string
 */
export const decimalToString = (decimal: Decimal): string => {
  return decimal.toFixed();
};

/**
 * Converts a string to a `Decimal`
 * @param num The string to convert to a `Decimal`
 * @returns The decimal string represented as a `Decimal`
 */
export const stringToDecimal = (str: string): Decimal => {
  return new Decimal(str);
};

export const toSnakeCase = (input: string): string => {
  return changeCase.snakeCase(input);
};

export const toCamelCase = (input: string): string => {
  return changeCase.camelCase(input);
};

export const trim = (character: string): ((input: string) => string) => {
  return (input: string) =>
    input
      .replace(new RegExp(`^${character}+`), "")
      .replace(new RegExp(`${character}+$`), "");
};

export const prefix = (prefix: string): ((input: string) => string) => {
  return (input: string) => prefix + input;
};

export const replace = (
  old: string,
  replacement: string
): ((input: string) => string) => {
  return (input: string) => (input === old ? replacement : old);
};

export const traverseObjectForKeys = <T>(
  input: T,
  callbacks: Array<(key: string) => string>
): T => {
  if (Array.isArray(input)) {
    return input.map((value) => traverseObjectForKeys(value, callbacks)) as T;
  } else if (typeof input === "object" && input !== null) {
    const updatedObject: any = {};
    for (const [key, value] of Object.entries(input)) {
      let updatedKey = key;
      for (const callback of callbacks) {
        updatedKey = callback(updatedKey);
      }
      updatedObject[updatedKey] = traverseObjectForKeys(value, callbacks);
    }
    return updatedObject as T;
  } else {
    return input;
  }
};

/**
 * This function serializes objects through the serialization strategy followed by the Radix Engine
 * toolkit. This strategy performs the following before the serialization is done:
 *    - trims any underscore ('_') symbol from the beginning or end of the keys of the objects
 *    - converts the key names from any casing to being in snake case.
 * @param object The object to JSON serialize
 * @returns A string of the object after it has been JSON serialized
 */
export const serialize = (object: Object): string =>
  JSON.stringify(traverseObjectForKeys(object, [trim("_"), toSnakeCase]));

/**
 * This function deserializes strings to objects through the Radix Engine Toolkit's deserialization
 * strategy which is composed of the following:
 *    - prefixing all keys in objects with an underscore ('_').
 *    - converting the keys from snake case to camelCase.
 *    - replacing the key `_type` with `type` since `type` is special
 * @param str The string to deserialize as an object of the generic type T
 * @param constructorFn The constructor function. This constructor will not actually be used to
 * construct any objects. Rather, it will be used as the type to cast the object to after it has
 * been deserialized.
 * @returns The deserialized object
 */
export const deserialize = <T>(
  str: string,
  constructorFn: new (...args: any) => T
): T =>
  Object.setPrototypeOf(
    traverseObjectForKeys(JSON.parse(str), [toCamelCase, prefix("_")]),
    constructorFn.prototype
  );

export const hash = (data: Uint8Array): Uint8Array =>
  blake2b(data, undefined, 32);

export const resolveBytes = (bytes: Uint8Array | string) => {
  if (typeof bytes === "string") {
    return stringToUint8Array(bytes);
  } else if (bytes instanceof Uint8Array) {
    return bytes;
  } else {
    throw new TypeError("Passed argument is not of a valid type");
  }
};
