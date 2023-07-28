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

export class Convert {
  static String = class {
    static toNumber = (str: string): number => globalThis.Number(str);
    static toBigInt = (str: string): bigint => globalThis.BigInt(str);
  };

  static Number = class {
    static toString = (num: number): string =>
      num.toLocaleString("fullwide", { useGrouping: false });
  };

  static Uint8Array = class {
    static toHexString = (array: Uint8Array): string =>
      Array.from(array)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
  };

  static HexString = class {
    static toUint8Array = (str: string): Uint8Array =>
      Uint8Array.from(str.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
  };
}
