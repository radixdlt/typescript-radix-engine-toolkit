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

import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";
import { ecdsaSign, publicKeyCreate } from "secp256k1";
import { PublicKey, Signature, SignatureWithPublicKey } from "../..";

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

export type PrivateKey =
  | { kind: "Secp256k1"; privateKey: Uint8Array }
  | { kind: "Ed25519"; privateKey: Uint8Array };

export const publicKey = (privateKey: PrivateKey): PublicKey => {
  switch (privateKey.kind) {
    case "Secp256k1":
      return {
        kind: "Secp256k1",
        publicKey: publicKeyCreate(privateKey.privateKey, true),
      };
    case "Ed25519":
      return {
        kind: "Ed25519",
        publicKey: ed.getPublicKey(privateKey.privateKey),
      };
  }
};

export const sign = (
  privateKey: PrivateKey,
  messageHash: Uint8Array
): Uint8Array => {
  switch (privateKey.kind) {
    case "Secp256k1":
      const { signature, recid } = ecdsaSign(
        messageHash,
        privateKey.privateKey
      );
      return new Uint8Array([recid, ...signature]);
    case "Ed25519":
      return ed.sign(messageHash, privateKey.privateKey);
  }
};

export const signToSignature = (
  privateKey: PrivateKey,
  messageHash: Uint8Array
): Signature => {
  return {
    kind: privateKey.kind,
    signature: sign(privateKey, messageHash),
  };
};

export const signToSignatureWithPublicKey = (
  privateKey: PrivateKey,
  messageHash: Uint8Array
): SignatureWithPublicKey => {
  switch (privateKey.kind) {
    case "Secp256k1":
      return {
        kind: "Secp256k1",
        signature: sign(privateKey, messageHash),
      };
    case "Ed25519":
      return {
        kind: "Ed25519",
        signature: sign(privateKey, messageHash),
        publicKey: publicKey(privateKey).publicKey,
      };
  }
};
