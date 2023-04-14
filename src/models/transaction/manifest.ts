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
import { InstructionList } from ".";
import { Convert, RadixEngineToolkit } from "../..";
import * as Serializers from "../serializers";

export class TransactionManifest {
  @Expose()
  @Type(() => InstructionList.InstructionList, {
    discriminator: {
      property: "type",
      subTypes: [
        { name: "String", value: InstructionList.StringInstructions },
        { name: "Parsed", value: InstructionList.ParsedInstructions },
      ],
    },
  })
  instructions: InstructionList.InstructionList;

  @Expose()
  @Type(() => Uint8Array)
  @Transform(Serializers.TwoDimensionalByteArrayAsArrayOfHexString.serialize, {
    toPlainOnly: true,
  })
  @Transform(
    Serializers.TwoDimensionalByteArrayAsArrayOfHexString.deserialize,
    {
      toClassOnly: true,
    }
  )
  blobs: Array<Uint8Array>;

  constructor(
    instructions: InstructionList.InstructionList,
    blobs: Array<Uint8Array | string> = []
  ) {
    this.instructions = instructions;
    this.blobs = blobs.map(Convert.Uint8Array.from);
  }

  async convert(
    instructionFormat: InstructionList.Kind,
    networkId: number
  ): Promise<TransactionManifest> {
    return RadixEngineToolkit.convertManifest(
      this,
      instructionFormat,
      networkId
    );
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}
