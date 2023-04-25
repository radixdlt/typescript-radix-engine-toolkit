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
import CryptoJSLib from "crypto-js";

export const serialize = (object: any): string =>
  JSON.stringify(instanceToPlain(object));

export const deserialize = <T>(str: string, Class: ClassConstructor<T>) =>
  plainToInstance(Class, JSON.parse(str));

export const hash = (data: Uint8Array): Uint8Array =>
  blake2b(data, undefined, 32);

export const randomBytes = (nBytes: number): Uint8Array => {
  const randomWordArray = CryptoJSLib.lib.WordArray.random(nBytes);
  const words = randomWordArray.words;
  const masksAndShifts = [
    [0xff000000, 24],
    [0xff0000, 16],
    [0xff00, 8],
    [0xff, 0],
  ];

  let byteArray: number[] = [];
  for (const word of words) {
    for (const [mask, shift] of masksAndShifts) {
      byteArray.push((word & mask) >> shift);
    }
  }

  return new Uint8Array(byteArray);
};

export const randomNonce = () =>
  new DataView(randomBytes(4).buffer, 0).getUint32(0, true);
