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

import { describe, expect, it } from "vitest";
import {
  LTSRadixEngineToolkit,
  NetworkId,
  PrivateKey,
  RadixEngineToolkit,
} from "../src";

describe("Address Class", () => {
  it("account components are picked up by the toolkit", async () => {
    // Arrange
    const privateKey = new PrivateKey.EcdsaSecp256k1(
      "3b840a679a9728ef0d844fd1a8c963482ecacc8328f2a0de0184954abe04aba1"
    );
    const publicKey = privateKey.publicKey();
    const virtualAccountAddress =
      await RadixEngineToolkit.deriveVirtualAccountAddress(
        publicKey,
        NetworkId.Mainnet
      );

    // Act
    const isAccountAddress =
      await LTSRadixEngineToolkit.Address.isGlobalAccount(
        virtualAccountAddress
      );

    // Assert
    expect(isAccountAddress).toBeTruthy();
  });

  it("fungible resource addresses are picked up by the toolkit", async () => {
    // Arrange
    const knownAddresses = await LTSRadixEngineToolkit.Derive.knownAddresses(
      NetworkId.RCnetV1
    );
    const xrdResourceAddress = knownAddresses.resources.xrdResource;

    // Act
    let isResourceAddress =
      await LTSRadixEngineToolkit.Address.isFungibleResource(
        xrdResourceAddress
      );

    // Assert
    expect(isResourceAddress).toBeTruthy();
  });

  it("non-fungible resource addresses are picked up by the toolkit", async () => {
    // Arrange
    const knownAddresses = await LTSRadixEngineToolkit.Derive.knownAddresses(
      NetworkId.RCnetV1
    );
    const xrdResourceAddress = knownAddresses.resources.ecdsaSecp256k1Resource;

    // Act
    let isResourceAddress =
      await LTSRadixEngineToolkit.Address.isNonFungibleResource(
        xrdResourceAddress
      );

    // Assert
    expect(isResourceAddress).toBeTruthy();
  });
});
