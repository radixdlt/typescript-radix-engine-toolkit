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

import { describe, expect, test } from "vitest";
import { EntityAddress, PublicKey, RadixEngineToolkit } from "../../src";
import { stringToUint8Array } from "../../src/utils";

describe.each([
  {
    expectedPublicKey: new PublicKey.EcdsaSecp256k1(
      stringToUint8Array(
        "03c32f9761dd3f961a3d12747e54db6b821bd022ef92b9ebf591bfe186885baa21"
      )
    ),
    expectedAccountAddress: new EntityAddress.ComponentAddress(
      "account_sim1ppkfdmv0q2cwz9cjxk5t8u0zx6pdydd9p2jv22nuwdhqyn4rgj"
    ),
    expectedIdentityAddress: new EntityAddress.ComponentAddress(
      "identity_sim1pdkfdmv0q2cwz9cjxk5t8u0zx6pdydd9p2jv22nuwdhqkcvkcq"
    ),
    expectedOlympiaAddress:
      "rdx1qspuxtuhv8wnl9s685f8glj5md4cyx7sythe9w0t7kgmlcvx3pd65gg593xqj",
  },
])(
  "Address derivation test",
  ({
    expectedPublicKey,
    expectedAccountAddress,
    expectedIdentityAddress,
    expectedOlympiaAddress,
  }) => {
    test(`account address for ${expectedPublicKey} should be ${expectedAccountAddress}`, async () => {
      // Act
      let virtualAddress = (
        await RadixEngineToolkit.deriveVirtualAccountAddress(
          0xf2,
          expectedPublicKey
        )
      )._unsafeUnwrap().virtualAccountAddress;

      // Assert
      expect(virtualAddress).toEqual(expectedAccountAddress);
    });

    test(`identity address for ${expectedPublicKey} should be ${expectedIdentityAddress}`, async () => {
      // Act
      let virtualAddress = (
        await RadixEngineToolkit.deriveVirtualIdentityAddress(
          0xf2,
          expectedPublicKey
        )
      )._unsafeUnwrap().virtualIdentityAddress;

      // Assert
      expect(virtualAddress).toEqual(expectedIdentityAddress);
    });

    test(`Olympia address for ${expectedPublicKey} should be ${expectedOlympiaAddress}`, async () => {
      // Act
      let publicKey = (
        await RadixEngineToolkit.deriveBabylonAddressFromOlympiaAddress(
          0xf2,
          expectedOlympiaAddress
        )
      )._unsafeUnwrap().publicKey;

      // Assert
      expect(publicKey).toEqual(expectedPublicKey);
    });
  }
);
