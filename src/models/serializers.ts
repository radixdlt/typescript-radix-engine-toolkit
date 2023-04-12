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

import { TransformFnParams } from "class-transformer";
import Decimal from "decimal.js";
import { Convert } from "..";

type TransformFn = (params: TransformFnParams) => any;

export namespace ByteArrayAsHexString {
  export const serialize: TransformFn = ({ value }: TransformFnParams): any =>
    Convert.Uint8Array.toHexString(value as Uint8Array);

  export const deserialize: TransformFn = ({ value }: TransformFnParams): any =>
    Convert.HexString.toUint8Array(value as string);
}

export namespace NumberAsString {
  export const serialize: TransformFn = ({ value }: TransformFnParams): any =>
    Convert.Number.toString(value as number);

  export const deserialize: TransformFn = ({ value }: TransformFnParams): any =>
    Convert.String.toNumber(value as string);
}

export namespace BigIntAsString {
  export const serialize: TransformFn = ({ value }: TransformFnParams): any =>
    Convert.BigInt.toString(value as bigint);

  export const deserialize: TransformFn = ({ value }: TransformFnParams): any =>
    Convert.String.toBigInt(value as string);
}

export namespace DecimalAsString {
  export const serialize: TransformFn = ({ value }: TransformFnParams): any =>
    Convert.Decimal.toString(value as Decimal);

  export const deserialize: TransformFn = ({ value }: TransformFnParams): any =>
    Convert.String.toDecimal(value as string);
}

export namespace Array1DAsArray2D {
  export const serialize: TransformFn = ({ value }: TransformFnParams): any => {
    let array = [];
    for (let i = 0; i < (value as any[]).length; i += 2) {
      array.push([value[i], value[i + 1]]);
    }
    return array;
  };

  export const deserialize: TransformFn = ({
    value,
  }: TransformFnParams): any => {
    let array = [];
    for (let row of value as any[]) {
      for (let element of row as any[]) {
        array.push(element);
      }
    }
    return array;
  };
}
