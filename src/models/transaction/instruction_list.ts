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

import { Instruction } from "./instruction";

export type InstructionList = StringInstructions | ParsedInstructions;

export enum Kind {
  String = "String",
  Parsed = "Parsed",
}

export class StringInstructions {
  private _instruction: Kind = Kind.String;
  private _value: string;

  public get instruction(): Kind {
    return this._instruction;
  }

  public get value(): string {
    return this._value;
  }
  public set value(value: string) {
    this._value = value;
  }

  constructor(instructions: string) {
    this._value = instructions;
  }
}

export class ParsedInstructions {
  private _instruction: Kind = Kind.Parsed;
  private _value: Array<Instruction>;

  public get instruction(): Kind {
    return this._instruction;
  }

  public get value(): Array<Instruction> {
    return this._value;
  }
  public set value(value: Array<Instruction>) {
    this._value = value;
  }

  constructor(instructions: Array<Instruction>) {
    this._value = instructions;
  }
}
