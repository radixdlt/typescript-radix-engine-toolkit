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

import { InstructionList, TransactionManifest } from "../../models/transaction";
import { numberToString, serialize, stringToNumber } from "../../utils";

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
export class ConvertManifestRequest {
  /**
   * An unsigned 8 bit integer serialized as a string which represents the ID of the network that
   * the manifest will be used on. The primary use of this is for any Bech32m encoding or decoding
   * of addresses
   */
  private _networkId: string;

  /**
   * Defines the output format that we would like the manifest to be in after this request is
   * performed.
   */
  private _instructionsOutputKind: InstructionList.Kind;

  /**
   * The manifest to convert to the format described by `instructions_output_kind`
   */
  private _manifest: TransactionManifest;

  public get manifest(): TransactionManifest {
    return this._manifest;
  }
  public set manifest(value: TransactionManifest) {
    this._manifest = value;
  }

  public get instructionsOutputKind(): InstructionList.Kind {
    return this._instructionsOutputKind;
  }
  public set instructionsOutputKind(value: InstructionList.Kind) {
    this._instructionsOutputKind = value;
  }

  public get networkId(): number {
    return stringToNumber(this._networkId);
  }
  public set networkId(value: number) {
    this._networkId = numberToString(value);
  }

  constructor(
    networkId: number,
    instructionsOutputKind: InstructionList.Kind,
    manifest: TransactionManifest
  ) {
    this._networkId = numberToString(networkId);
    this._instructionsOutputKind = instructionsOutputKind;
    this._manifest = manifest;
  }

  toString(): string {
    return serialize(this);
  }
}

/**
 * The response of the [`ConvertManifestRequest`]
 */
export type ConvertManifestResponse = TransactionManifest;
