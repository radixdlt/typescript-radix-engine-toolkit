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

import { instanceToPlain } from "class-transformer";
import { Instruction } from ".";

export class InstructionList {
  readonly type: Kind;

  constructor(type: Kind) {
    this.type = type;
  }
}

export type Any = StringInstructions | ParsedInstructions;

export enum Kind {
  String = "String",
  Parsed = "Parsed",
}

export class StringInstructions extends InstructionList {
  value: string;

  constructor(instructions: string) {
    super(Kind.String);
    this.value = instructions;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class ParsedInstructions extends InstructionList {
  value: Array<Instruction.Any>;

  constructor(instructions: Array<Instruction.Any>) {
    super(Kind.Parsed);
    this.value = instructions;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}
