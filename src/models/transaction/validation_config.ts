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

export interface MessageValidationConfig {
  maxPlaintextMessageLength: bigint;
  maxEncryptedMessageLength: bigint;
  maxMimeTypeLength: bigint;
  maxDecryptors: bigint;
}

export interface PreparationSettings {
  v2TransactionsPermitted: boolean;
  maxUserPayloadLength: bigint;
  maxLedgerPayloadLength: bigint;
  maxChildSubintentsPerIntent: bigint;
  maxSubintentsPerTransaction: bigint;
  maxBlobs: bigint;
}

export type ManifestValidationRuleset =
  | { kind: "BabylonBasicValidator" }
  | { kind: "Interpreter"; value: InterpreterValidationRulesetSpecifier };

export enum InterpreterValidationRulesetSpecifier {
  AllValidations = "AllValidations",
  Cuttlefish = "Cuttlefish",
}

export interface ValidationConfig {
  maxSignerSignaturesPerIntent: bigint;
  maxReferencesPerIntent: bigint;
  minTipPercentage: number;
  maxTipPercentage: number;
  maxEpochRange: bigint;
  maxInstructions: bigint;
  messageValidation: MessageValidationConfig;
  v1TransactionsAllowNotaryToDuplicateSigner: boolean;
  preparationSettings: PreparationSettings;
  manifestValidation: ManifestValidationRuleset;
  v2TransactionsAllowed: boolean;
  minTipBasisPoints: number;
  maxTipBasisPoints: number;
  maxSubintentDepth: bigint;
  maxTotalSignatureValidations: bigint;
  maxTotalReferences: bigint;
}
