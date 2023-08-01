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

/**
 * Hashes some byte array of data through the Blake 2b algorithm producing 32-byte long hash digests
 * which follows the hashing algorithm used in Scrypto and the Radix Engine.
 * @param data The data to hash.
 * @returns The hash of the data.
 */
export const hash = (data: Uint8Array): Uint8Array =>
  blake2b(data, undefined, 32);

export const generateRandomNonce = () => Math.floor(Math.random() * 0xffffffff);
