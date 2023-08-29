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
  Intent,
  NotarizedTransaction,
  RawRadixEngineToolkit,
  Signature,
  SignatureFunction,
  SignatureSource,
  SignatureWithPublicKey,
  TransactionHash,
  TransactionHeader,
  TransactionManifest,
  rawRadixEngineToolkit,
  resolveSignatureSource,
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
  private readonly radixEngineToolkit: RawRadixEngineToolkit;
  private readonly intent: Intent;
  private readonly intentSignatures: (
    | { kind: "Signature"; value: SignatureWithPublicKey }
    | {
        kind: "AsyncFunction";
        value: SignatureFunction<Promise<SignatureWithPublicKey>>;
      }
  )[];

  constructor(
    radixEngineToolkit: RawRadixEngineToolkit,
    header: TransactionHeader,
    manifest: TransactionManifest
  ) {
    this.radixEngineToolkit = radixEngineToolkit;
    this.intent = {
      header,
      manifest,
    };
    this.intentSignatures = [];
  }

  public sign(source: SignatureSource<SignatureWithPublicKey>): this {
    const intentHash = this.intentHash();
    const signature = resolveSignatureSource(
      source,
      intentHash.hash,
      ({ curve, signature, publicKey }) => {
        switch (curve) {
          case "Secp256k1":
            return new SignatureWithPublicKey.Secp256k1(signature);
          case "Ed25519":
            return new SignatureWithPublicKey.Ed25519(signature, publicKey);
        }
      }
    );
    this.intentSignatures.push({ kind: "Signature", value: signature });
    return this;
  }

  public signAsync(
    source: SignatureFunction<Promise<SignatureWithPublicKey>>
  ): this {
    this.intentSignatures.push({ kind: "AsyncFunction", value: source });
    return this;
  }

  public async notarize(
    source: SignatureSource<Signature>
  ): Promise<NotarizedTransaction> {
    const signedIntentHash = await this.signedIntentHash();
    const signature = resolveSignatureSource(
      source,
      signedIntentHash.hash,
      ({ curve, signature }) => {
        switch (curve) {
          case "Secp256k1":
            return new Signature.Secp256k1(signature);
          case "Ed25519":
            return new Signature.Ed25519(signature);
        }
      }
    );
    return {
      signedIntent: {
        intent: this.intent,
        intentSignatures: await this.resolveIntentSignatures(),
      },
      notarySignature: signature,
    };
  }

  public async notarizeAsync(
    source: SignatureFunction<Promise<Signature>>
  ): Promise<NotarizedTransaction> {
    const signedIntentHash = await this.signedIntentHash();
    const signature = await source(signedIntentHash.hash);
    return {
      signedIntent: {
        intent: this.intent,
        intentSignatures: await this.resolveIntentSignatures(),
      },
      notarySignature: signature,
    };
  }

  private async resolveIntentSignatures(): Promise<SignatureWithPublicKey[]> {
    return Promise.all(
      this.intentSignatures.map(async (intentSignature) => {
        switch (intentSignature.kind) {
          case "Signature":
            return Promise.resolve(intentSignature.value);
          case "AsyncFunction":
            return intentSignature.value(this.intentHash().hash);
        }
      })
    );
  }

  private intentHash(): TransactionHash {
    const input = this.intent;
    const output = this.radixEngineToolkit.intentHash(
      GeneratedConverter.Intent.toGenerated(input)
    );
    return GeneratedConverter.TransactionHash.fromGenerated(output);
  }

  private async signedIntentHash(): Promise<TransactionHash> {
    const input = {
      intent: this.intent,
      intentSignatures: await this.resolveIntentSignatures(),
    };
    const output = this.radixEngineToolkit.signedIntentHash(
      GeneratedConverter.SignedIntent.toGenerated(input)
    );
    return GeneratedConverter.TransactionHash.fromGenerated(output);
  }
}
