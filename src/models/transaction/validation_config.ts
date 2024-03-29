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

export interface MessageValidationConfig {
  maxPlaintextMessageLength: bigint;
  maxEncryptedMessageLength: bigint;
  maxMimeTypeLength: bigint;
  maxDecryptors: bigint;
}

export interface ValidationConfig {
  networkId: number;
  maxNotarizedPayloadSize: bigint;
  minTipPercentage: number;
  maxTipPercentage: number;
  maxEpochRange: bigint;
  messageValidation: MessageValidationConfig;
}

export const defaultValidationConfig = (
  networkId: number
): ValidationConfig => {
  return {
    networkId: networkId,
    maxNotarizedPayloadSize: BigInt(1048576),
    minTipPercentage: 0,
    maxTipPercentage: 65535,
    maxEpochRange: BigInt(8640),
    messageValidation: {
      maxPlaintextMessageLength: BigInt(2048),
      maxEncryptedMessageLength: BigInt(2076),
      maxMimeTypeLength: BigInt(128),
      maxDecryptors: BigInt(20),
    },
  };
};
