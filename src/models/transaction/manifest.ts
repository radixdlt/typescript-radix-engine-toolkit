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

import { InstructionList } from ".";
import { stringToUint8Array, uint8ArrayToString } from "../../utils";

export class TransactionManifest {
  private _instructions: InstructionList.Any;
  private _blobs: Array<string>;

  public get instructions(): InstructionList.Any {
    return this._instructions;
  }
  public set instructions(value: InstructionList.Any) {
    this._instructions = value;
  }

  public get blobs(): Array<Uint8Array> {
    return this._blobs.map(stringToUint8Array);
  }
  public set blobs(value: Array<Uint8Array>) {
    this._blobs = value.map(uint8ArrayToString);
  }

  constructor(
    instructions: InstructionList.Any,
    blobs: Array<Uint8Array> = []
  ) {
    this._instructions = instructions;
    this._blobs = blobs.map(uint8ArrayToString);
  }
}
