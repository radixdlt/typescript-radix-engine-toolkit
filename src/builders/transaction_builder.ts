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
import { RET } from "../wrapper/facade";
import { RadixEngineToolkitWasmWrapper } from "../wrapper/wasm_wrapper";

export class TransactionBuilder {
  private retWrapper: RadixEngineToolkitWasmWrapper;

  constructor(retWrapper: RadixEngineToolkitWasmWrapper) {
    this.retWrapper = retWrapper;
  }

  public static async new(): Promise<TransactionBuilder> {
    let ret = await RET;
    return new TransactionBuilder(ret);
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
  private intentSignatures: Array<SignatureWithPublicKey.Any> = [];

  constructor(
    retWrapper: RadixEngineToolkitWasmWrapper,
    header: TransactionHeader,
    manifest: TransactionManifest
  ) {
    this.retWrapper = retWrapper;
    this.intent = new TransactionIntent(header, manifest);
  }

  public sign(
    key: IPrivateKey | ((hashToSign: Uint8Array) => SignatureWithPublicKey.Any)
  ): TransactionBuilderIntentSignaturesStep {
    // Compile the transaction intent
    let request = this.intent;
    let response = this.retWrapper.invoke(
      request,
      this.retWrapper.exports.compile_transaction_intent,
      CompileTransactionIntentResponse
    );
    let compiledIntent = response.compiledIntent;

    // If the key is a function, then invoke that function with the hashed compiled transaction
    // intent, otherwise, call the private key to sign.
    if (typeof key === "function") {
      let hashedCompiledIntent = hash(compiledIntent);
      this.intentSignatures.push(key(hashedCompiledIntent));
    } else {
      this.intentSignatures.push(
        key.signToSignatureWithPublicKey(compiledIntent)
      );
    }

    return this;
  }

  public notarize(
    key: IPrivateKey | ((hashToSign: Uint8Array) => Signature.Any)
  ): NotarizedTransaction {
    // Construct a signed transaction intent and compile it
    let signedIntent = new SignedTransactionIntent(
      this.intent,
      this.intentSignatures
    );
    let response = this.retWrapper.invoke(
      signedIntent,
      this.retWrapper.exports.compile_signed_transaction_intent,
      CompileSignedTransactionIntentResponse
    );
    let compiledIntent = response.compiledIntent;

    // If the key is a function, then invoke that function with the hashed compiled transaction
    // intent, otherwise, call the private key to sign.
    if (typeof key === "function") {
      let hashedCompiledIntent = hash(compiledIntent);
      let signature = key(hashedCompiledIntent);
      return new NotarizedTransaction(signedIntent, signature);
    } else {
      let signature = key.signToSignature(compiledIntent);
      return new NotarizedTransaction(signedIntent, signature);
    }
  }
}
