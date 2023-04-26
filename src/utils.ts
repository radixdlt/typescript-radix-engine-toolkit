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

/**
 * The transaction nonce is only used to ensure that a given intent can be repeated
 * if it needs to be submitted more than once.
 *
 * The nonce therefore doesn't need to be securely random, it can just
 * be any random number which makes it very unlikely for a duplicate intent to
 * be constructed.
 * @returns a random 32-bit integer
 */
export const generateRandomNonce = () => Math.floor(Math.random() * 0xffffffff);
