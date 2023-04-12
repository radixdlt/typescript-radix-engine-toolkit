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
import { instanceToPlain } from "class-transformer";
import { ecdsaSign, publicKeyCreate } from "secp256k1";
import { PublicKey, Signature, SignatureWithPublicKey } from ".";
import { Convert } from "../..";
import { hash } from "../../utils";

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

export class EcdsaSecp256k1 implements IPrivateKey {
  public readonly bytes: Uint8Array;

  constructor(privateKey: Uint8Array | string) {
    this.bytes = Convert.Uint8Array.from(privateKey);
  }

  publicKey(): PublicKey.EcdsaSecp256k1 {
    return new PublicKey.EcdsaSecp256k1(this.publicKeyBytes());
  }

  publicKeyBytes(): Uint8Array {
    return publicKeyCreate(this.bytes, true);
  }

  publicKeyHex(): string {
    return Convert.Uint8Array.toHexString(this.publicKeyBytes());
  }

  sign(data: Uint8Array): Uint8Array {
    let messageHash = hash(data);
    let { signature, recid } = ecdsaSign(messageHash, this.bytes);
    return new Uint8Array([recid, ...signature]);
  }

  signToSignature(data: Uint8Array): Signature.EcdsaSecp256k1 {
    return new Signature.EcdsaSecp256k1(this.sign(data));
  }

  signToSignatureWithPublicKey(
    data: Uint8Array
  ): SignatureWithPublicKey.EcdsaSecp256k1 {
    return new SignatureWithPublicKey.EcdsaSecp256k1(this.sign(data));
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class EddsaEd25519 implements IPrivateKey {
  public readonly bytes: Uint8Array;

  constructor(privateKey: Uint8Array | string) {
    this.bytes = Convert.Uint8Array.from(privateKey);
  }

  publicKey(): PublicKey.EddsaEd25519 {
    return new PublicKey.EddsaEd25519(this.publicKeyBytes());
  }

  publicKeyBytes(): Uint8Array {
    return ed.getPublicKey(this.bytes);
  }

  publicKeyHex(): string {
    return Convert.Uint8Array.toHexString(this.publicKeyBytes());
  }

  sign(data: Uint8Array): Uint8Array {
    let messageHash = hash(data);
    let signature = ed.sign(messageHash, this.bytes);
    return signature;
  }

  signToSignature(data: Uint8Array): Signature.EddsaEd25519 {
    return new Signature.EddsaEd25519(this.sign(data));
  }

  signToSignatureWithPublicKey(
    data: Uint8Array
  ): SignatureWithPublicKey.EddsaEd25519 {
    return new SignatureWithPublicKey.EddsaEd25519(
      this.sign(data),
      this.publicKeyBytes()
    );
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export interface IPrivateKey {
  publicKey: () => PublicKey.Any;
  publicKeyBytes: () => Uint8Array;
  publicKeyHex: () => string;
  sign: (data: Uint8Array) => Uint8Array;
  signToSignature: (data: Uint8Array) => Signature.Any;
  signToSignatureWithPublicKey: (
    data: Uint8Array
  ) => SignatureWithPublicKey.Any;
}
