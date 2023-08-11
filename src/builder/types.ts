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

import { Signer, SignerResponse } from "../";

export type SignatureSource<T> = Signer | T | SignatureFunction<T>;
export type SignatureFunction<T> = (messageHash: Uint8Array) => T;

export const resolveSignatureSource = <T>(
  source: SignatureSource<T>,
  messageHash: Uint8Array,
  signerResponseCallback: (signerResponse: SignerResponse) => T
): T => {
  if (typeof source === "function") {
    return (source as SignatureFunction<T>)(messageHash);
  } else if ("produceSignature" in (source as Signer)) {
    return signerResponseCallback(
      (source as Signer).produceSignature(messageHash)
    );
  } else {
    return source as T;
  }
};
