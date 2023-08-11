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
  Curve,
  ED25519_PUBLIC_KEY_LENGTH,
  ED25519_SIGNATURE_LENGTH,
  SECP256K1_SIGNATURE_LENGTH,
} from "../..";
import { Bytes, resolveBytesAndCheckLength } from "./utils";

export abstract class SignatureWithPublicKey {
  abstract readonly curve: Curve;
  abstract readonly signature: Uint8Array;
  abstract readonly publicKey: Uint8Array | undefined;

  static Secp256k1 = class extends SignatureWithPublicKey {
    public readonly curve: Curve = "Secp256k1";
    public readonly signature: Uint8Array;
    public readonly publicKey: undefined;

    constructor(signature: Bytes) {
      super();
      this.signature = resolveBytesAndCheckLength(
        signature,
        SECP256K1_SIGNATURE_LENGTH
      );
    }
  };

  static Ed25519 = class extends SignatureWithPublicKey {
    public readonly curve: Curve = "Ed25519";
    public readonly signature: Uint8Array;
    public readonly publicKey: Uint8Array;

    constructor(signature: Bytes, publicKey: Bytes) {
      super();
      this.signature = resolveBytesAndCheckLength(
        signature,
        ED25519_SIGNATURE_LENGTH
      );
      this.publicKey = resolveBytesAndCheckLength(
        publicKey,
        ED25519_PUBLIC_KEY_LENGTH
      );
    }
  };
}
