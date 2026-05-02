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

import type {
  PayloadSchema as GeneratedPayloadSchema,
  SerializableLocalTypeId as GeneratedSerializableLocalTypeId,
} from "../../generated";

export type SerializableLocalTypeId = GeneratedSerializableLocalTypeId;
export type PayloadSchema = GeneratedPayloadSchema;

export type StaticValidationResult =
  | { kind: "Valid" }
  | { kind: "Invalid"; error: string };

export interface StaticManifestAnalysisResult {
  encountered_entities: string[];
  accounts_requiring_auth: string[];
  accounts_withdrawn_from: string[];
  accounts_deposited_into: string[];
  classification: string[];
  reserved_instructions: string[];
}

export interface StaticTransactionIntentV2AnalysisResult {
  root_intent: StaticManifestAnalysisResult;
  non_root_subintents: StaticManifestAnalysisResult[];
}

export enum SerializationMode {
  Programmatic = "Programmatic",
  Model = "Model",
  Natural = "Natural",
}

export enum ManifestSborStringRepresentation {
  ManifestString = "ManifestString",
  ProgrammaticJson = "ProgrammaticJson",
  ModelJson = "ModelJson",
  NaturalJson = "NaturalJson",
}
