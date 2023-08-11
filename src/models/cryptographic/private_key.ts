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
import {
  Convert,
  Curve,
  ED25519_PRIVATE_KEY_LENGTH,
  PublicKey,
  SECP256K1_PRIVATE_KEY_LENGTH,
  Signature,
  SignatureWithPublicKey,
} from "../..";
import { Bytes, resolveBytesAndCheckLength } from "./utils";

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

export abstract class PrivateKey implements Signer {
  abstract readonly curve: Curve;
  abstract readonly bytes: Uint8Array;

  static Secp256k1 = class extends PrivateKey implements Signer {
    public readonly curve: Curve = "Secp256k1";
    public readonly bytes: Uint8Array;

    constructor(privateKey: Bytes) {
      super();
      this.bytes = resolveBytesAndCheckLength(
        privateKey,
        SECP256K1_PRIVATE_KEY_LENGTH
      );
    }

    publicKey(): PublicKey {
      return new PublicKey.Secp256k1(this.publicKeyBytes());
    }
    publicKeyBytes(): Uint8Array {
      return publicKeyCreate(this.bytes, true);
    }
    publicKeyHex(): string {
      return Convert.Uint8Array.toHexString(this.publicKeyBytes());
    }
    sign(messageHash: Uint8Array): Uint8Array {
      const { signature, recid } = ecdsaSign(messageHash, this.bytes);
      return new Uint8Array([recid, ...signature]);
    }
    signToSignature(messageHash: Uint8Array): Signature {
      return new Signature.Secp256k1(this.sign(messageHash));
    }
    signToSignatureWithPublicKey(
      messageHash: Uint8Array
    ): SignatureWithPublicKey {
      return new SignatureWithPublicKey.Secp256k1(this.sign(messageHash));
    }
    produceSignature(messageHash: Uint8Array): SignerResponse {
      return super.produceSignature(messageHash);
    }
  };

  static Ed25519 = class extends PrivateKey implements Signer {
    public readonly curve: Curve = "Ed25519";
    public readonly bytes: Uint8Array;

    constructor(privateKey: Bytes) {
      super();
      this.bytes = resolveBytesAndCheckLength(
        privateKey,
        ED25519_PRIVATE_KEY_LENGTH
      );
    }

    publicKey(): PublicKey {
      return new PublicKey.Ed25519(this.publicKeyBytes());
    }
    publicKeyBytes(): Uint8Array {
      return ed.getPublicKey(this.bytes);
    }
    publicKeyHex(): string {
      return Convert.Uint8Array.toHexString(this.publicKeyBytes());
    }
    sign(messageHash: Uint8Array): Uint8Array {
      return ed.sign(messageHash, this.bytes);
    }
    signToSignature(messageHash: Uint8Array): Signature {
      return new Signature.Ed25519(this.sign(messageHash));
    }
    signToSignatureWithPublicKey(
      messageHash: Uint8Array
    ): SignatureWithPublicKey {
      return new SignatureWithPublicKey.Ed25519(
        this.sign(messageHash),
        this.publicKeyBytes()
      );
    }
    produceSignature(messageHash: Uint8Array): SignerResponse {
      return super.produceSignature(messageHash);
    }
  };

  abstract publicKey(): PublicKey;
  abstract publicKeyBytes(): Uint8Array;
  abstract publicKeyHex(): string;
  abstract sign(messageHash: Uint8Array): Uint8Array;
  abstract signToSignature(messageHash: Uint8Array): Signature;
  abstract signToSignatureWithPublicKey(
    messageHash: Uint8Array
  ): SignatureWithPublicKey;
  produceSignature(messageHash: Uint8Array): SignerResponse {
    let signature = this.sign(messageHash);
    let publicKey = this.publicKeyBytes();
    return {
      curve: this.curve,
      signature,
      publicKey,
    };
  }
}

export interface Signer {
  produceSignature: (messageHash: Uint8Array) => SignerResponse;
}

export interface AsyncSigner {
  produceSignature: (messageHash: Uint8Array) => Promise<SignerResponse>;
}

export type SignerResponse = {
  curve: Curve;
  signature: Uint8Array;
  publicKey: Uint8Array;
};
