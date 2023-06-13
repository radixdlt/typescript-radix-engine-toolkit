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

import { Expose, Transform, Type, instanceToPlain } from "class-transformer";
import * as Serializers from "../serializers";
import { InstructionList, TransactionManifest } from "../transaction";

/**
 * Clients have a need to be able to read, parse, understand, and interrogate transaction manifests
 * to get more information on what a transactions might be doing. Transaction manifests have so far
 * existed in one format: as strings. While the string format is very human readable, it is not
 * easily readable by machines as a lexer and parser are needed to make sense of them; thus, it is
 * for clients to programmatically make sense of transactions. As such, there is a need for another
 * transaction manifest format (to supplement, NOT replace) which machines can easily make sense of
 * without the need to implement a lexer and parser.
 *
 * Therefore, this library introduces a `Parsed` format for transaction manifests which clients can
 * use when wanting to read and interrogate their transaction manifests in code. The transaction
 * manifest `Parsed` format has a 1:1 mapping to the string format of transaction manifests,
 * meaning that anything which can be done in the string format of transaction manifests, can be
 * done in the `Parsed` format as well. If a JSON interface for the Radix Engine Toolkit is used,
 * then the parsed instructions will be all in JSON.
 *
 * This function allows the client the convert their manifest between the two supported manifest
 * types: string and parsed.
 */
export class ConvertManifestInput {
  /**
   * An unsigned 8 bit integer serialized as a string which represents the ID of the network that
   * the manifest will be used on. The primary use of this is for any Bech32m encoding or decoding
   * of addresses
   */
  @Expose({ name: "network_id" })
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  networkId: number;

  /**
   * Defines the output format that we would like the manifest to be in after this input is
   * performed.
   */
  @Expose({ name: "instructions_output_kind" })
  instructionsOutputKind: InstructionList.Kind;

  /**
   * The manifest to convert to the format described by `instructions_output_kind`
   */
  @Expose()
  @Type(() => TransactionManifest)
  manifest: TransactionManifest;

  constructor(
    networkId: number,
    instructionsOutputKind: InstructionList.Kind,
    manifest: TransactionManifest
  ) {
    this.networkId = networkId;
    this.instructionsOutputKind = instructionsOutputKind;
    this.manifest = manifest;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

/**
 * The output of the [`ConvertManifestInput`]
 */
export type ConvertManifestOutput = TransactionManifest;
