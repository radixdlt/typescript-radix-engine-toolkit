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

import { Convert } from "../../";

export type Bytes = Uint8Array | string;

export const resolveBytes = (bytes: Bytes): Uint8Array => {
  if (typeof bytes === "string") {
    return Convert.HexString.toUint8Array(bytes);
  } else if (bytes.constructor === Uint8Array) {
    return bytes;
  } else {
    throw new Error(
      "Resolution of bytes can only happen on a HexString or a Uint8Array."
    );
  }
};

export const resolveBytesAndCheckLength = (
  bytes: Bytes,
  expectedLength: number
): Uint8Array => {
  const resolvedBytes = resolveBytes(bytes);
  if (resolvedBytes.length != expectedLength) {
    throw new Error(
      `Expected bytes of length ${expectedLength} but was actually: ${resolvedBytes.length}`
    );
  }
  return resolvedBytes;
};
