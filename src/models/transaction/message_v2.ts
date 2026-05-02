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

import { Curve } from "../cryptographic";
import { PlainTextMessage } from "./message";

export type MessageV2 =
  | { kind: "None" }
  | { kind: "PlainText"; value: PlainTextMessage }
  | {
      kind: "Encrypted";
      value: EncryptedMessageV2;
    };

export interface EncryptedMessageV2 {
  encrypted: Uint8Array;
  decryptorsByCurve: Record<Curve, DecryptorsByCurveV2>;
}

export type DecryptorsByCurveV2 =
  | {
      kind: "Ed25519";
      value: {
        dhEphemeralPublicKey: Uint8Array;
        decryptors: Record<string, string>;
      };
    }
  | {
      kind: "Secp256k1";
      value: {
        dhEphemeralPublicKey: Uint8Array;
        decryptors: Record<string, string>;
      };
    };
