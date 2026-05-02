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
  IntentCoreV2,
  NotarizedTransactionV2,
  PreviewTransactionV2,
  RawRadixEngineToolkit,
  Signature,
  SignatureFunction,
  SignatureSource,
  SignatureWithPublicKey,
  SubintentV2,
  TransactionHash,
  TransactionHeaderV2,
  TransactionIntentV2,
  rawRadixEngineToolkit,
  resolveSignatureSource,
} from "..";
import { GeneratedConverter } from "../generated";

export class TransactionV2Builder {
  private readonly radixEngineToolkit: RawRadixEngineToolkit;

  constructor(radixEngineToolkit: RawRadixEngineToolkit) {
    this.radixEngineToolkit = radixEngineToolkit;
  }

  public static async new(): Promise<TransactionV2Builder> {
    return new this(await rawRadixEngineToolkit);
  }

  public header(
    header: TransactionHeaderV2
  ): TransactionV2BuilderIntentStep {
    return new TransactionV2BuilderIntentStep(
      this.radixEngineToolkit,
      header
    );
  }
}

export class TransactionV2BuilderIntentStep {
  private readonly radixEngineToolkit: RawRadixEngineToolkit;
  private readonly transactionHeader: TransactionHeaderV2;

  constructor(
    radixEngineToolkit: RawRadixEngineToolkit,
    transactionHeader: TransactionHeaderV2
  ) {
    this.radixEngineToolkit = radixEngineToolkit;
    this.transactionHeader = transactionHeader;
  }

  public rootIntentCore(
    rootIntentCore: IntentCoreV2
  ): TransactionV2BuilderSignStep {
    return new TransactionV2BuilderSignStep(
      this.radixEngineToolkit,
      this.transactionHeader,
      rootIntentCore
    );
  }
}

export class TransactionV2BuilderSignStep {
  private readonly radixEngineToolkit: RawRadixEngineToolkit;
  private readonly transactionIntent: TransactionIntentV2;
  private readonly nonRootSubintentSignatures: SignatureWithPublicKey[][] = [];
  private readonly transactionIntentSignatures: (
    | { kind: "Signature"; value: SignatureWithPublicKey }
    | {
        kind: "AsyncFunction";
        value: SignatureFunction<Promise<SignatureWithPublicKey>>;
      }
  )[] = [];

  constructor(
    radixEngineToolkit: RawRadixEngineToolkit,
    transactionHeader: TransactionHeaderV2,
    rootIntentCore: IntentCoreV2
  ) {
    this.radixEngineToolkit = radixEngineToolkit;
    this.transactionIntent = {
      transactionHeader,
      rootIntentCore,
      nonRootSubintents: [],
    };
  }

  public addSignedSubintent(
    subintent: SubintentV2,
    signatures: SignatureWithPublicKey[]
  ): this {
    this.transactionIntent.nonRootSubintents.push(subintent);
    this.nonRootSubintentSignatures.push(signatures);
    return this;
  }

  public sign(source: SignatureSource<SignatureWithPublicKey>): this {
    const txIntentHash = this.transactionIntentHash();
    const signature = resolveSignatureSource(
      source,
      txIntentHash.hash,
      ({ curve, signature, publicKey }) => {
        switch (curve) {
          case "Secp256k1":
            return new SignatureWithPublicKey.Secp256k1(signature);
          case "Ed25519":
            return new SignatureWithPublicKey.Ed25519(signature, publicKey);
        }
      }
    );
    this.transactionIntentSignatures.push({
      kind: "Signature",
      value: signature,
    });
    return this;
  }

  public signAsync(
    source: SignatureFunction<Promise<SignatureWithPublicKey>>
  ): this {
    this.transactionIntentSignatures.push({
      kind: "AsyncFunction",
      value: source,
    });
    return this;
  }

  public async notarize(
    source: SignatureSource<Signature>
  ): Promise<NotarizedTransactionV2> {
    const signedIntentHash = await this.signedTransactionIntentHash();
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
      signedTransactionIntent: {
        transactionIntent: this.transactionIntent,
        transactionIntentSignatures:
          await this.resolveTransactionIntentSignatures(),
        nonRootSubintentSignatures: this.nonRootSubintentSignatures,
      },
      notarySignature: signature,
    };
  }

  public async notarizeAsync(
    source: SignatureFunction<Promise<Signature>>
  ): Promise<NotarizedTransactionV2> {
    const signedIntentHash = await this.signedTransactionIntentHash();
    const signature = await source(signedIntentHash.hash);
    return {
      signedTransactionIntent: {
        transactionIntent: this.transactionIntent,
        transactionIntentSignatures:
          await this.resolveTransactionIntentSignatures(),
        nonRootSubintentSignatures: this.nonRootSubintentSignatures,
      },
      notarySignature: signature,
    };
  }

  public buildPreviewTransaction(options: {
    rootSignerPublicKeys: PublicKey[];
    nonRootSubintentSignerPublicKeys?: PublicKey[][];
  }): PreviewTransactionV2 {
    const nonRootSubintentSignerPublicKeys =
      options.nonRootSubintentSignerPublicKeys ??
      this.transactionIntent.nonRootSubintents.map(() => []);

    if (
      nonRootSubintentSignerPublicKeys.length !==
      this.transactionIntent.nonRootSubintents.length
    ) {
      throw new Error(
        "nonRootSubintentSignerPublicKeys length must match non-root subintents length"
      );
    }

    return {
      transactionIntent: this.transactionIntent,
      rootSignerPublicKeys: options.rootSignerPublicKeys,
      nonRootSubintentSignerPublicKeys,
    };
  }

  private async resolveTransactionIntentSignatures(): Promise<
    SignatureWithPublicKey[]
  > {
    return Promise.all(
      this.transactionIntentSignatures.map(async (sig) => {
        switch (sig.kind) {
          case "Signature":
            return Promise.resolve(sig.value);
          case "AsyncFunction":
            return sig.value(this.transactionIntentHash().hash);
        }
      })
    );
  }

  private transactionIntentHash(): TransactionHash {
    const output = this.radixEngineToolkit.transactionIntentV2Hash(
      GeneratedConverter.TransactionIntentV2.toGenerated(
        this.transactionIntent
      )
    );
    return GeneratedConverter.TransactionHash.fromGenerated(output);
  }

  private async signedTransactionIntentHash(): Promise<TransactionHash> {
    const input = {
      transactionIntent: this.transactionIntent,
      transactionIntentSignatures:
        await this.resolveTransactionIntentSignatures(),
      nonRootSubintentSignatures: this.nonRootSubintentSignatures,
    };
    const output = this.radixEngineToolkit.signedTransactionIntentV2Hash(
      GeneratedConverter.SignedTransactionIntentV2.toGenerated(input)
    );
    return GeneratedConverter.TransactionHash.fromGenerated(output);
  }
}
