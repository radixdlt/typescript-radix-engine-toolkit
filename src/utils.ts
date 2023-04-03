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
 * Converts a Uint8Array to a bigInt
 * @param num The Uint8Array to convert to a bigInt
 * @returns The decimal Uint8Array represented as a bigInt
 */
export const uint8ArrayToString = (array: Uint8Array): string => {
  return Buffer.from(array).toString("hex");
};

/**
 * Converts a string to a `Uint8Array`
 * @param num The string to convert to a `Uint8Array`
 * @returns The decimal string represented as a `Uint8Array`
 */
export const stringToUint8Array = (str: string): Uint8Array => {
  return Uint8Array.from(Buffer.from(str, "hex"));
};
