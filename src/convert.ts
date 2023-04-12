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

export namespace Number {
  export const toString = (num: number): string => {
    return num.toLocaleString("fullwide", { useGrouping: false });
  };
}

export namespace String {
  export const toNumber = (str: string): number => {
    return globalThis.Number(str);
  };
}

export namespace HexString {
  export const toUint8Array = (str: string): globalThis.Uint8Array => {
    return globalThis.Uint8Array.from(
      str.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );
  };
}

export namespace Uint8Array {
  export const from = (
    arg: string | globalThis.Uint8Array | null | undefined
  ): globalThis.Uint8Array => {
    if (arg === null || arg === undefined) {
      return new globalThis.Uint8Array();
    } else if (typeof arg === "string") {
      return HexString.toUint8Array(arg);
    } else if (arg instanceof globalThis.Uint8Array) {
      return arg;
    } else {
      throw new TypeError("Passed argument is not of a valid type");
    }
  };

  export const toHexString = (array: globalThis.Uint8Array): string => {
    return Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };
}
