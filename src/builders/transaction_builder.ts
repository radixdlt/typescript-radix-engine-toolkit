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

import { IPrivateKey } from "models/crypto/private_key";
import {
  CompileSignedTransactionIntentResponse,
  CompileTransactionIntentResponse,
  NotarizedTransaction,
  Signature,
  SignatureWithPublicKey,
  SignedTransactionIntent,
  TransactionHeader,
  TransactionIntent,
  TransactionManifest,
} from "../models";
import { hash } from "../utils";
import { RET } from "../wrapper/raw";
import { RadixEngineToolkitWasmWrapper } from "../wrapper/wasm_wrapper";

type signIntentFn = (
  hashToSign: Uint8Array
) => SignatureWithPublicKey.SignatureWithPublicKey;
type notarizationFn = (hashToSign: Uint8Array) => Signature.Signature;

export class TransactionBuilder {
  private retWrapper: RadixEngineToolkitWasmWrapper;

  constructor(retWrapper: RadixEngineToolkitWasmWrapper) {
    this.retWrapper = retWrapper;
  }

  public static async new(): Promise<TransactionBuilder> {
    let ret = await RET;
    return new TransactionBuilder(ret);
  }

  public static async from(
    transactionIntent: TransactionIntent | SignedTransactionIntent
  ): Promise<TransactionBuilderIntentSignaturesStep> {
    let builder = await TransactionBuilder.new();
    if (transactionIntent instanceof TransactionIntent) {
      return builder
        .header(transactionIntent.header)
        .manifest(transactionIntent.manifest);
    } else if (transactionIntent instanceof SignedTransactionIntent) {
      return new TransactionBuilderIntentSignaturesStep(
        builder.retWrapper,
        transactionIntent.intent.header,
        transactionIntent.intent.manifest,
        transactionIntent.intentSignatures
      );
    } else {
      throw new TypeError("Invalid type passed in for transaction intent");
    }
  }

  public header(header: TransactionHeader): TransactionBuilderManifestStep {
    return new TransactionBuilderManifestStep(this.retWrapper, header);
  }
}

export class TransactionBuilderManifestStep {
  private retWrapper: RadixEngineToolkitWasmWrapper;
  private header: TransactionHeader;

  constructor(
    retWrapper: RadixEngineToolkitWasmWrapper,
    header: TransactionHeader
  ) {
    this.retWrapper = retWrapper;
    this.header = header;
  }

  public manifest(
    manifest: TransactionManifest
  ): TransactionBuilderIntentSignaturesStep {
    return new TransactionBuilderIntentSignaturesStep(
      this.retWrapper,
      this.header,
      manifest
    );
  }
}

export class TransactionBuilderIntentSignaturesStep {
  private retWrapper: RadixEngineToolkitWasmWrapper;
  private intent: TransactionIntent;
  private intentSignatures: Array<SignatureWithPublicKey.SignatureWithPublicKey>;

  constructor(
    retWrapper: RadixEngineToolkitWasmWrapper,
    header: TransactionHeader,
    manifest: TransactionManifest,
    intentSignatures: Array<SignatureWithPublicKey.SignatureWithPublicKey> = []
  ) {
    this.retWrapper = retWrapper;
    this.intent = new TransactionIntent(header, manifest);
    this.intentSignatures = intentSignatures;
  }

  public sign(
    key: IPrivateKey | signIntentFn
  ): TransactionBuilderIntentSignaturesStep {
    // Compile the transaction intent
    let { compiledTransactionIntent, hashToSign } =
      this.buildTransactionIntent();

    // If the key is a function, then invoke that function with the hashed compiled transaction
    // intent, otherwise, call the private key to sign.
    if (typeof key === "function") {
      this.intentSignatures.push(key(hashToSign));
    } else {
      this.intentSignatures.push(
        key.signToSignatureWithPublicKey(compiledTransactionIntent)
      );
    }

    return this;
  }

  public notarize(key: IPrivateKey | notarizationFn): NotarizedTransaction {
    // Construct a signed transaction intent and compile it
    let {
      compiledSignedTransactionIntent,
      signedTransactionIntent,
      hashToSign,
    } = this.buildSignedTransactionIntent();

    // If the key is a function, then invoke that function with the hashed compiled transaction
    // intent, otherwise, call the private key to sign.
    if (typeof key === "function") {
      let signature = key(hashToSign);
      return new NotarizedTransaction(signedTransactionIntent, signature);
    } else {
      let signature = key.signToSignature(compiledSignedTransactionIntent);
      return new NotarizedTransaction(signedTransactionIntent, signature);
    }
  }

  public buildTransactionIntent(): {
    compiledTransactionIntent: Uint8Array;
    transactionIntent: TransactionIntent;
    hashToSign: Uint8Array;
  } {
    let request = this.intent;
    let response = this.retWrapper.invoke(
      request,
      this.retWrapper.exports.compile_transaction_intent,
      CompileTransactionIntentResponse
    );
    let compiledTransactionIntent = response.compiledIntent;

    let transactionIntentHash = hash(compiledTransactionIntent);
    return {
      compiledTransactionIntent,
      transactionIntent: this.intent,
      hashToSign: transactionIntentHash,
    };
  }

  public buildSignedTransactionIntent(): {
    compiledSignedTransactionIntent: Uint8Array;
    signedTransactionIntent: SignedTransactionIntent;
    hashToSign: Uint8Array;
  } {
    let signedIntent = new SignedTransactionIntent(
      this.intent,
      this.intentSignatures
    );
    let response = this.retWrapper.invoke(
      signedIntent,
      this.retWrapper.exports.compile_signed_transaction_intent,
      CompileSignedTransactionIntentResponse
    );
    let compiledSignedTransactionIntent = response.compiledIntent;

    let signedTransactionIntentHash = hash(compiledSignedTransactionIntent);
    return {
      compiledSignedTransactionIntent,
      signedTransactionIntent: signedIntent,
      hashToSign: signedTransactionIntentHash,
    };
  }
}
