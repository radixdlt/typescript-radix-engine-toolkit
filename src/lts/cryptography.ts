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

import { Convert } from "..";
import {
  ED25519_PRIVATE_KEY_LENGTH,
  ED25519_PUBLIC_KEY_LENGTH,
  ED25519_SIGNATURE_LENGTH,
  SECP256K1_PRIVATE_KEY_LENGTH,
  SECP256K1_PUBLIC_KEY_LENGTH,
  SECP256K1_SIGNATURE_LENGTH,
} from "./constants";
import { Bytes, resolveBytesAndCheckLength } from "./utils";

import * as RetPrivateKey from "../models/cryptographic/private_key";

export enum Curve {
  Secp256k1 = "Secp256k1",
  Ed25519 = "Ed25519",
}

export abstract class PublicKey {
  abstract readonly curve: Curve;
  abstract readonly bytes: Uint8Array;

  static Secp256k1 = class extends PublicKey {
    public readonly curve: Curve = Curve.Secp256k1;
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
    public readonly curve: Curve = Curve.Ed25519;
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

export abstract class Signature {
  abstract readonly curve: Curve;
  abstract readonly bytes: Uint8Array;

  static Secp256k1 = class extends Signature {
    public readonly curve: Curve = Curve.Secp256k1;
    public readonly bytes: Uint8Array;

    constructor(bytes: Bytes) {
      super();
      this.bytes = resolveBytesAndCheckLength(
        bytes,
        SECP256K1_SIGNATURE_LENGTH
      );
    }
  };

  static Ed25519 = class extends Signature {
    public readonly curve: Curve = Curve.Ed25519;
    public readonly bytes: Uint8Array;

    constructor(bytes: Bytes) {
      super();
      this.bytes = resolveBytesAndCheckLength(bytes, ED25519_SIGNATURE_LENGTH);
    }
  };

  rawBytes = (): Uint8Array => this.bytes;
  hexString = (): string => Convert.Uint8Array.toHexString(this.bytes);
  toString = this.hexString;

  get signature(): Uint8Array {
    return this.rawBytes();
  }
}

export abstract class SignatureWithPublicKey {
  abstract readonly curve: Curve;
  abstract readonly signature: Uint8Array;
  abstract readonly publicKey: Uint8Array | undefined;

  static Secp256k1 = class extends SignatureWithPublicKey {
    public readonly curve: Curve = Curve.Secp256k1;
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
    public readonly curve: Curve = Curve.Ed25519;
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
        ED25519_SIGNATURE_LENGTH
      );
    }
  };
}

export abstract class PrivateKey implements IPrivateKey {
  abstract readonly curve: Curve;
  abstract readonly bytes: Uint8Array;

  static Secp256k1 = class extends PrivateKey implements IPrivateKey {
    public readonly curve: Curve = Curve.Secp256k1;
    public readonly bytes: Uint8Array;
    private readonly retPrivateKey: RetPrivateKey.PrivateKey;

    constructor(privateKey: Bytes) {
      super();
      this.bytes = resolveBytesAndCheckLength(
        privateKey,
        SECP256K1_PRIVATE_KEY_LENGTH
      );
      this.retPrivateKey = {
        kind: "Secp256k1",
        privateKey: this.bytes,
      };
    }

    publicKey(): PublicKey {
      return new PublicKey.Secp256k1(this.publicKeyBytes());
    }
    publicKeyBytes(): Uint8Array {
      return RetPrivateKey.publicKey(this.retPrivateKey).publicKey;
    }
    publicKeyHex(): string {
      return Convert.Uint8Array.toHexString(this.publicKeyBytes());
    }
    sign(messageHash: Uint8Array): Uint8Array {
      return RetPrivateKey.sign(this.retPrivateKey, messageHash);
    }
    signToSignature(messageHash: Uint8Array): Signature {
      return new Signature.Secp256k1(this.sign(messageHash));
    }
    signToSignatureWithPublicKey(
      messageHash: Uint8Array
    ): SignatureWithPublicKey {
      return new SignatureWithPublicKey.Secp256k1(this.sign(messageHash));
    }
  };

  static Ed25519 = class extends PrivateKey implements IPrivateKey {
    public readonly curve: Curve = Curve.Ed25519;
    public readonly bytes: Uint8Array;
    private readonly retPrivateKey: RetPrivateKey.PrivateKey;

    constructor(privateKey: Bytes) {
      super();
      this.bytes = resolveBytesAndCheckLength(
        privateKey,
        ED25519_PRIVATE_KEY_LENGTH
      );
      this.retPrivateKey = {
        kind: "Ed25519",
        privateKey: this.bytes,
      };
    }

    publicKey(): PublicKey {
      return new PublicKey.Ed25519(this.publicKeyBytes());
    }
    publicKeyBytes(): Uint8Array {
      return RetPrivateKey.publicKey(this.retPrivateKey).publicKey;
    }
    publicKeyHex(): string {
      return Convert.Uint8Array.toHexString(this.publicKeyBytes());
    }
    sign(messageHash: Uint8Array): Uint8Array {
      return RetPrivateKey.sign(this.retPrivateKey, messageHash);
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
  };

  abstract publicKey(): PublicKey;
  abstract publicKeyBytes(): Uint8Array;
  abstract publicKeyHex(): string;
  abstract sign(messageHash: Uint8Array): Uint8Array;
  abstract signToSignature(messageHash: Uint8Array): Signature;
  abstract signToSignatureWithPublicKey(
    messageHash: Uint8Array
  ): SignatureWithPublicKey;
}

export interface IPrivateKey {
  publicKey: () => PublicKey;
  publicKeyBytes: () => Uint8Array;
  publicKeyHex: () => string;
  sign: (messageHash: Uint8Array) => Uint8Array;
  signToSignature: (messageHash: Uint8Array) => Signature;
  signToSignatureWithPublicKey: (
    messageHash: Uint8Array
  ) => SignatureWithPublicKey;
}
