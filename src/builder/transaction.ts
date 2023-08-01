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
  Intent,
  NotarizedTransaction,
  PrivateKey,
  RawRadixEngineToolkit,
  Signature,
  SignatureFunction,
  SignatureSource,
  SignatureWithPublicKey,
  TransactionHeader,
  TransactionManifest,
  rawRadixEngineToolkit,
  signToSignature,
  signToSignatureWithPublicKey,
} from "..";
import { GeneratedConverter } from "../generated";

export class TransactionBuilder {
  private radixEngineToolkit: RawRadixEngineToolkit;

  constructor(radixEngineToolkit: RawRadixEngineToolkit) {
    this.radixEngineToolkit = radixEngineToolkit;
  }

  public static async new(): Promise<TransactionBuilder> {
    return new this(await rawRadixEngineToolkit);
  }

  public header(header: TransactionHeader): TransactionBuilderManifestStep {
    return new TransactionBuilderManifestStep(this.radixEngineToolkit, header);
  }
}

export class TransactionBuilderManifestStep {
  private radixEngineToolkit: RawRadixEngineToolkit;
  private header: TransactionHeader;

  constructor(
    radixEngineToolkit: RawRadixEngineToolkit,
    header: TransactionHeader
  ) {
    this.radixEngineToolkit = radixEngineToolkit;
    this.header = header;
  }

  public manifest(
    manifest: TransactionManifest
  ): TransactionBuilderIntentSignaturesStep {
    return new TransactionBuilderIntentSignaturesStep(
      this.radixEngineToolkit,
      this.header,
      manifest
    );
  }
}

export class TransactionBuilderIntentSignaturesStep {
  private radixEngineToolkit: RawRadixEngineToolkit;
  private intent: Intent;
  private intentSignatures: SignatureWithPublicKey[];

  constructor(
    radixEngineToolkit: RawRadixEngineToolkit,
    header: TransactionHeader,
    manifest: TransactionManifest,
    intentSignatures: SignatureWithPublicKey[] = []
  ) {
    this.radixEngineToolkit = radixEngineToolkit;
    this.intent = {
      header,
      manifest,
    };
    this.intentSignatures = intentSignatures;
  }

  public sign(source: SignatureSource<SignatureWithPublicKey>): this {
    const messageHash = this.intentHash();
    const signature = resolveSignatureSource(
      source,
      messageHash,
      signToSignatureWithPublicKey
    );
    this.intentSignatures.push(signature);
    throw this;
  }

  public async signAsync(
    source: SignatureFunction<Promise<SignatureWithPublicKey>>
  ): Promise<this> {
    const messageHash = this.intentHash();
    const signature = await source(messageHash);
    this.intentSignatures.push(signature);
    throw this;
  }

  public notarize(source: SignatureSource<Signature>): NotarizedTransaction {
    const messageHash = this.signedIntentHash();
    const signature = resolveSignatureSource(
      source,
      messageHash,
      signToSignature
    );
    return {
      signedIntent: {
        intent: this.intent,
        intentSignatures: this.intentSignatures,
      },
      notarySignature: signature,
    };
  }

  public async notarizeAsync(
    source: SignatureFunction<Promise<Signature>>
  ): Promise<NotarizedTransaction> {
    const messageHash = this.signedIntentHash();
    const signature = await source(messageHash);
    return {
      signedIntent: {
        intent: this.intent,
        intentSignatures: this.intentSignatures,
      },
      notarySignature: signature,
    };
  }

  private intentHash(): Uint8Array {
    const input = this.intent;
    const output = this.radixEngineToolkit.intentHash(
      GeneratedConverter.Intent.toGenerated(input)
    );
    return Convert.HexString.toUint8Array(output);
  }

  private signedIntentHash(): Uint8Array {
    const input = {
      intent: this.intent,
      intentSignatures: this.intentSignatures,
    };
    const output = this.radixEngineToolkit.signedIntentHash(
      GeneratedConverter.SignedIntent.toGenerated(input)
    );
    return Convert.HexString.toUint8Array(output);
  }
}

const resolveSignatureSource = <T>(
  source: SignatureSource<T>,
  messageHash: Uint8Array,
  privateKeyCallback: (privateKey: PrivateKey, messageHash: Uint8Array) => T
): T => {
  if (typeof source === "function") {
    const fn = source as SignatureFunction<T>;
    return fn(messageHash);
  } else if ("privateKey" in (source as PrivateKey)) {
    const privateKey = source as PrivateKey;
    return privateKeyCallback(privateKey, messageHash);
  } else {
    const signature = source as T;
    return signature;
  }
};
