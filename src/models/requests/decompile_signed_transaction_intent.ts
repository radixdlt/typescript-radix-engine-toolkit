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
import { InstructionList, SignedTransactionIntent } from "models/transaction";
import { Convert } from "../..";
import * as Serializers from "../serializers";

export class DecompileSignedTransactionIntentRequest {
  @Expose({ name: "instructions_output_kind" })
  instructionsOutputKind: InstructionList.Kind;

  @Expose({ name: "compiled_signed_intent" })
  @Type(() => Uint8Array)
  @Transform(Serializers.ByteArrayAsHexString.serialize, { toPlainOnly: true })
  @Transform(Serializers.ByteArrayAsHexString.deserialize, {
    toClassOnly: true,
  })
  compiledSignedIntent: Uint8Array;

  constructor(
    instructionsOutputKind: InstructionList.Kind,
    compiledSignedIntent: Uint8Array | string
  ) {
    this.instructionsOutputKind = instructionsOutputKind;
    this.compiledSignedIntent = Convert.Uint8Array.from(compiledSignedIntent);
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export type DecompileSignedTransactionIntentResponse = SignedTransactionIntent;
