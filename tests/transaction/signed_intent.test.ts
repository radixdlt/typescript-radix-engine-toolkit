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
import {
  InstructionList,
  PublicKey,
  SignatureWithPublicKey,
  SignedTransactionIntent,
  TransactionHeader,
  TransactionIntent,
  TransactionManifest,
} from "../../src";
import { DropAllProofs } from "../../src/models/transaction/instruction";
import { deserialize, serialize } from "../../src/utils";
import { assertSerializationEquals } from "../test_utils";

describe.each([
  {
    expectedObject: new SignedTransactionIntent(
      new TransactionIntent(
        new TransactionHeader(
          1,
          1,
          100,
          105,
          5144,
          new PublicKey.EcdsaSecp256k1(
            "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"
          ),
          false,
          100000000,
          12
        ),
        new TransactionManifest(
          new InstructionList.ParsedInstructions([new DropAllProofs()]),
          []
        )
      ),
      [
        new SignatureWithPublicKey.EcdsaSecp256k1(
          "008db363f3dfda37dfc9e7d45eb72c2405939124b3b962df506fa9cca0017be0092e1341b79694228c4f53c80e790ef9258aafbf5051769a126ddf588016ad282f"
        ),

        new SignatureWithPublicKey.EcdsaSecp256k1(
          "0174adbe3362c446ea2368ee1986864edc18f3eefc8b9ea0162756f04ffed310450a327cb3f8873070fc607844acec45b46490b4892fc4110c920ae28251b79100"
        ),

        new SignatureWithPublicKey.EcdsaSecp256k1(
          "01f55560f0fd9c1a90fca4a01c0e6cb613840ecd0a07fec7401e5e51b93f44df15586ec4a3d33a1811a6238e397e9964a1126ff32378dc5626c5126499ba3aac44"
        ),

        new SignatureWithPublicKey.EcdsaSecp256k1(
          "003fbca8a171f60a9a30a93fce9e846f130fee2a5989b7a93212877bf38f0afbb82ba7c9b718882bbf99a97f74fca1fe86ab4e6d85238873b29e851c193a48222e"
        ),

        new SignatureWithPublicKey.EddsaEd25519(
          "0903d71eb96aa704338365d3ae15c0e8ca08d29aa1828a0439ecd0f0b64ba3fbee4f44c0bd694d08be51ebbb7d07c61961875894938b827627e5a77367b7320d",
          "7422b9887598068e32c4448a949adb290d0f4e35b9e01b0ee5f1a1e600fe2674"
        ),

        new SignatureWithPublicKey.EddsaEd25519(
          "fce6e33719e6bf51f0ebe35cfe1ba26ce167063da7c7eaf48ecde64e3eb21bfcc2752c793c36a04493f52798bfcaaca66af70d889655067b1b5f3014f6cc7b0b",
          "f381626e41e7027ea431bfe3009e94bdd25a746beec468948d6c3c7c5dc9a54b"
        ),

        new SignatureWithPublicKey.EddsaEd25519(
          "0a57400709fa697cc26268e959f29b1bc1d5fb6ed9b6a75381ca610cb9208f3a51ea72eced28e8e0636693a27e5019435827624e599aad30bfca4abbdae58b09",
          "fd50b8e3b144ea244fbf7737f550bc8dd0c2650bbc1aada833ca17ff8dbf329b"
        ),

        new SignatureWithPublicKey.EddsaEd25519(
          "b3e149d3ce05f5e0e692e449095c8c0afbf0e51bd226ce087dd6f927c351240481440518695ed9521af29abac1e4fd59bf58ed251c0522dd55eda773d2b83504",
          "fde4fba030ad002f7c2f7d4c331f49d13fb0ec747eceebec634f1ff4cbca9def"
        ),
      ]
    ),
    expectedSerialization: `{"intent":{"header":{"version":"1","network_id":"1","start_epoch_inclusive":"100","end_epoch_exclusive":"105","nonce":"5144","notary_public_key":{"curve":"EcdsaSecp256k1","public_key":"0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"},"notary_as_signatory":false,"cost_unit_limit":"100000000","tip_percentage":"12"},"manifest":{"instructions":{"type":"Parsed","value":[{"instruction":"DROP_ALL_PROOFS"}]},"blobs":[]}},"intent_signatures":[{"curve":"EcdsaSecp256k1","signature":"008db363f3dfda37dfc9e7d45eb72c2405939124b3b962df506fa9cca0017be0092e1341b79694228c4f53c80e790ef9258aafbf5051769a126ddf588016ad282f"},{"curve":"EcdsaSecp256k1","signature":"0174adbe3362c446ea2368ee1986864edc18f3eefc8b9ea0162756f04ffed310450a327cb3f8873070fc607844acec45b46490b4892fc4110c920ae28251b79100"},{"curve":"EcdsaSecp256k1","signature":"01f55560f0fd9c1a90fca4a01c0e6cb613840ecd0a07fec7401e5e51b93f44df15586ec4a3d33a1811a6238e397e9964a1126ff32378dc5626c5126499ba3aac44"},{"curve":"EcdsaSecp256k1","signature":"003fbca8a171f60a9a30a93fce9e846f130fee2a5989b7a93212877bf38f0afbb82ba7c9b718882bbf99a97f74fca1fe86ab4e6d85238873b29e851c193a48222e"},{"curve":"EddsaEd25519","signature":"0903d71eb96aa704338365d3ae15c0e8ca08d29aa1828a0439ecd0f0b64ba3fbee4f44c0bd694d08be51ebbb7d07c61961875894938b827627e5a77367b7320d","public_key":"7422b9887598068e32c4448a949adb290d0f4e35b9e01b0ee5f1a1e600fe2674"},{"curve":"EddsaEd25519","signature":"fce6e33719e6bf51f0ebe35cfe1ba26ce167063da7c7eaf48ecde64e3eb21bfcc2752c793c36a04493f52798bfcaaca66af70d889655067b1b5f3014f6cc7b0b","public_key":"f381626e41e7027ea431bfe3009e94bdd25a746beec468948d6c3c7c5dc9a54b"},{"curve":"EddsaEd25519","signature":"0a57400709fa697cc26268e959f29b1bc1d5fb6ed9b6a75381ca610cb9208f3a51ea72eced28e8e0636693a27e5019435827624e599aad30bfca4abbdae58b09","public_key":"fd50b8e3b144ea244fbf7737f550bc8dd0c2650bbc1aada833ca17ff8dbf329b"},{"curve":"EddsaEd25519","signature":"b3e149d3ce05f5e0e692e449095c8c0afbf0e51bd226ce087dd6f927c351240481440518695ed9521af29abac1e4fd59bf58ed251c0522dd55eda773d2b83504","public_key":"fde4fba030ad002f7c2f7d4c331f49d13fb0ec747eceebec634f1ff4cbca9def"}]}`,
  },
])(
  "Serialization test for $expectedSerialization",
  ({ expectedObject, expectedSerialization }) => {
    test(`${expectedObject} is serialized as expected`, () => {
      // Act
      let actualSerialization = serialize(expectedObject);

      // Assert
      assertSerializationEquals(actualSerialization, expectedSerialization);
    });

    test(`${expectedSerialization} is deserialized as expected`, () => {
      // Act
      let actualObject = deserialize(
        expectedSerialization,
        // @ts-ignore
        expectedObject.constructor
      );

      // Assert
      expect(actualObject).toEqual(expectedObject);
    });
  }
);
