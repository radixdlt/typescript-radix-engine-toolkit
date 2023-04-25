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
import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from "class-transformer";

export const serialize = (object: any): string =>
  JSON.stringify(instanceToPlain(object));

export const deserialize = <T>(str: string, Class: ClassConstructor<T>) =>
  plainToInstance(Class, JSON.parse(str));

export const hash = (data: Uint8Array): Uint8Array =>
  blake2b(data, undefined, 32);

async function getWebCrypto(): Promise<Crypto> {
  if (typeof window !== "undefined" && window.crypto) {
    return Promise.resolve(window.crypto);
  }
  if (typeof global !== "undefined" && global.crypto) {
    return Promise.resolve(global.crypto);
  }
  try {
    // Attempt importing from NodeJS - webcrypto was added in NodeJS 15.0.0
    // Note that rollup/vite will convert this into Promise.resolve(require("crypto"))
    // if the build is targetting CommonJS/UMD
    const crypto = await import("crypto");
    if (crypto && crypto.webcrypto) {
      return Promise.resolve(crypto.webcrypto as any);
    }
  } catch (ex) {}
  throw new Error(
    "No crypto implementation found - must be run in modern browser or Node 15+"
  );
}

export async function generateSecureRandomBytes(
  count: number
): Promise<Uint8Array> {
  var byteArray = new Uint8Array(count);
  (await getWebCrypto()).getRandomValues(byteArray);
  return byteArray;
}

export async function generateRandomNonce(): Promise<number> {
  const randomBytes = await generateSecureRandomBytes(4);
  return new DataView(randomBytes.buffer, 0).getUint32(0, true);
}
