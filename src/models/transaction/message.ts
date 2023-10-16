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

export type Message =
  | { kind: "None" }
  | { kind: "PlainText"; value: PlainTextMessage }
  | {
      kind: "Encrypted";
      value: EncryptedMessage;
    };

export interface PlainTextMessage {
  mimeType: string;
  message: MessageContent;
}

export type MessageContent =
  | { kind: "String"; value: string }
  | { kind: "Bytes"; value: Uint8Array };

export interface EncryptedMessage {
  encrypted: Uint8Array;
  decryptorsByCurve: Record<Curve, DecryptorsByCurve>;
}

export type DecryptorsByCurve =
  | {
      kind: "Ed25519";
      value: {
        dhEphemeralPublicKey: Uint8Array;
        decryptors: [Uint8Array, Uint8Array][];
      };
    }
  | {
      kind: "Secp256k1";
      value: {
        dhEphemeralPublicKey: Uint8Array;
        decryptors: [Uint8Array, Uint8Array][];
      };
    };
