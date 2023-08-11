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
  Convert,
  Curve,
  ED25519_PUBLIC_KEY_LENGTH,
  SECP256K1_PUBLIC_KEY_LENGTH,
} from "../..";
import { Bytes, resolveBytesAndCheckLength } from "./utils";

export abstract class PublicKey {
  abstract readonly curve: Curve;
  abstract readonly bytes: Uint8Array;

  static Secp256k1 = class extends PublicKey {
    public readonly curve: Curve = "Secp256k1";
    public readonly bytes: Uint8Array;

    constructor(bytes: Bytes) {
      super();
      this.bytes = resolveBytesAndCheckLength(
        bytes,
        SECP256K1_PUBLIC_KEY_LENGTH
      );
    }
  };

  static Ed25519 = class extends PublicKey {
    public readonly curve: Curve = "Ed25519";
    public readonly bytes: Uint8Array;

    constructor(bytes: Bytes) {
      super();
      this.bytes = resolveBytesAndCheckLength(bytes, ED25519_PUBLIC_KEY_LENGTH);
    }
  };

  rawBytes = (): Uint8Array => this.bytes;
  hexString = (): string => Convert.Uint8Array.toHexString(this.bytes);
  toString = this.hexString;

  get publicKey(): Uint8Array {
    return this.rawBytes();
  }
}
