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

import {
  Convert,
  EntityType,
  Instruction,
  RadixEngineToolkit,
  Value,
} from "@radixdlt/radix-engine-toolkit";

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

export const destructManifestValueTuple = (value: Value): Value[] => {
  switch (value.kind) {
    case "Tuple":
      return value.fields;
    default:
      throw new Error("Can't destruct a manifest value that is not a tuple");
  }
};

export const isLockFeeCallMethod = async (
  instruction: Extract<Instruction, { kind: "CallMethod" }>,
  faucetComponentAddress: string
): Promise<boolean> => {
  switch (instruction.address.kind) {
    case "Static":
      const entityType = await RadixEngineToolkit.Address.entityType(
        instruction.address.value
      );
      const isAddressAccepted =
        entityType === EntityType.GlobalAccount ||
        entityType === EntityType.GlobalVirtualEd25519Account ||
        entityType === EntityType.GlobalVirtualSecp256k1Account ||
        instruction.address.value === faucetComponentAddress;
      const isMethodNameAccepted = instruction.methodName === "lock_fee";

      return isMethodNameAccepted && isAddressAccepted;
    case "Named":
      return false;
  }
};

export const isFreeXrdCallMethod = async (
  instruction: Extract<Instruction, { kind: "CallMethod" }>,
  faucetComponentAddress: string
): Promise<boolean> => {
  switch (instruction.address.kind) {
    case "Static":
      const entityType = await RadixEngineToolkit.Address.entityType(
        instruction.address.value
      );
      const isAddressAccepted =
        instruction.address.value === faucetComponentAddress;
      const isMethodNameAccepted = instruction.methodName === "free";

      return isMethodNameAccepted && isAddressAccepted;
    case "Named":
      return false;
  }
};

export const isAccountWithdrawCallMethod = async (
  instruction: Extract<Instruction, { kind: "CallMethod" }>
): Promise<boolean> => {
  switch (instruction.address.kind) {
    case "Static":
      const entityType = await RadixEngineToolkit.Address.entityType(
        instruction.address.value
      );
      const isAddressAccepted =
        entityType === EntityType.GlobalAccount ||
        entityType === EntityType.GlobalVirtualEd25519Account ||
        entityType === EntityType.GlobalVirtualSecp256k1Account;
      const isMethodNameAccepted = instruction.methodName === "withdraw";

      return isMethodNameAccepted && isAddressAccepted;
    case "Named":
      return false;
  }
};

export const isAccountDepositCallMethod = async (
  instruction: Extract<Instruction, { kind: "CallMethod" }>
): Promise<boolean> => {
  switch (instruction.address.kind) {
    case "Static":
      const entityType = await RadixEngineToolkit.Address.entityType(
        instruction.address.value
      );
      const isAddressAccepted =
        entityType === EntityType.GlobalAccount ||
        entityType === EntityType.GlobalVirtualEd25519Account ||
        entityType === EntityType.GlobalVirtualSecp256k1Account;
      const isMethodNameAccepted =
        instruction.methodName === "try_deposit_or_abort" ||
        instruction.methodName === "deposit";

      return isMethodNameAccepted && isAddressAccepted;
    case "Named":
      return false;
  }
};

export const castValue = <T = Value["kind"]>(
  value: Value,
  kind: T
): Extract<Value, { kind: T }> => {
  if (value.kind === kind) {
    return value as Extract<Value, { kind: T }>;
  } else {
    throw Error(`Failed to cast value to value of kind: ${kind}`);
  }
};

export const generateRandomNonce = () => Math.floor(Math.random() * 0xffffffff);
