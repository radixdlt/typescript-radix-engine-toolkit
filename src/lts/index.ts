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
  PrivateKey as LTSPrivateKey,
  PublicKey as LTSPublicKey,
  Signature as LTSSignature,
  SignatureWithPublicKey as LTSSignatureWithPublicKey,
} from "./cryptography";
import { RadixEngineToolkit as LTSRadixEngineToolkit } from "./toolkit";
import {
  CompiledNotarizedTransaction as LTSCompiledNotarizedTransaction,
  CompiledSignedTransactionIntent as LTSCompiledSignedTransactionIntent,
  NotarizedTransaction as LTSNotarizedTransaction,
  SignedTransactionIntent as LTSSignedTransactionIntent,
  TransactionIntent as LTSTransactionIntent,
} from "./transaction";

/**
 * Class Re-exports.
 *
 * This namespace re-exports the classes defined in the LTS module as static class members under the
 * LTS namespace.
 */
export namespace LTS {
  /* Toolkit Wrapper */
  export type RadixEngineToolkit = LTSRadixEngineToolkit;

  /* Cryptography */
  export type PublicKey = LTSPublicKey;
  export type Signature = LTSSignature;
  export type PrivateKey = LTSPrivateKey;
  export type SignatureWithPublicKey = LTSSignatureWithPublicKey;

  /* Transaction */
  export type TransactionIntent = LTSTransactionIntent;
  export type SignedTransactionIntent = LTSSignedTransactionIntent;
  export type NotarizedTransaction = LTSNotarizedTransaction;
  export type CompiledSignedTransactionIntent =
    LTSCompiledSignedTransactionIntent;
  export type CompiledNotarizedTransaction = LTSCompiledNotarizedTransaction;
}
