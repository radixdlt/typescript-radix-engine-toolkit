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

import * as fs from "fs";
import * as path from "path";
import { describe, expect, test } from "vitest";
import {
  ConvertManifestRequest,
  InstructionList,
  RawRadixEngineToolkit,
  TransactionManifest,
} from "../../src";
import { StringInstructions } from "../../src/models/transaction/instruction_list";

describe.each([
  "../test_vectors/manifests/access_controller/new.rtm",
  "../test_vectors/manifests/royalty/royalty.rtm",
  "../test_vectors/manifests/identity/new.rtm",
  "../test_vectors/manifests/resources/recall.rtm",
  "../test_vectors/manifests/resources/auth_zone.rtm",
  "../test_vectors/manifests/resources/worktop.rtm",
  "../test_vectors/manifests/resources/mint/non_fungible/mint.rtm",
  "../test_vectors/manifests/resources/mint/fungible/mint.rtm",
  "../test_vectors/manifests/resources/creation/non_fungible/no_initial_supply.rtm",
  "../test_vectors/manifests/resources/creation/non_fungible/with_initial_supply.rtm",
  "../test_vectors/manifests/resources/creation/fungible/no_initial_supply.rtm",
  "../test_vectors/manifests/resources/creation/fungible/with_initial_supply.rtm",
  "../test_vectors/manifests/values/values.rtm",
  "../test_vectors/manifests/call/call_method.rtm",
  "../test_vectors/manifests/call/call_function.rtm",
  "../test_vectors/manifests/faucet/free_funds.rtm",
  "../test_vectors/manifests/access_rule/assert_access_rule.rtm",
  "../test_vectors/manifests/access_rule/access_rule.rtm",
  "../test_vectors/manifests/account/multi_account_resource_transfer.rtm",
  "../test_vectors/manifests/account/new.rtm",
  "../test_vectors/manifests/account/resource_transfer.rtm",
  "../test_vectors/manifests/metadata/metadata.rtm",
  "../test_vectors/manifests/package/publish.rtm",
])("Convert manifest works for $0", (path) => {
  test(`${path} can be converted to String`, async () => {
    // Arrange
    let manifest = prepareManifest(path);

    // Act
    let convertedManifest = await RawRadixEngineToolkit.convertManifest(
      new ConvertManifestRequest(0xf2, InstructionList.Kind.String, manifest)
    );

    // Act
    expect(convertedManifest.blobs).toEqual([new Uint8Array([10])]);
  });

  test(`${path} can be converted to Parsed`, async () => {
    // Arrange
    let manifest = prepareManifest(path);

    // Act
    let convertedManifest = await RawRadixEngineToolkit.convertManifest(
      new ConvertManifestRequest(0xf2, InstructionList.Kind.Parsed, manifest)
    );

    // Act
    expect(convertedManifest.blobs).toEqual([new Uint8Array([10])]);
  });
});

const prepareManifest = (manifestPath: string): TransactionManifest => {
  // Read the manifest at the given path
  let fileContent = fs.readFileSync(
    path.join(__dirname, manifestPath),
    "utf-8"
  );

  // Perform replacements on the manifest string
  let stringManifest = fileContent
    // @ts-ignore
    .replaceAll("${", "{")
    .replaceAll(
      "{xrd_resource_address}",
      "resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k"
    )
    .replaceAll(
      "{faucet_component_address}",
      "component_sim1q0kryz5scup945usk39qjc2yjh6l5zsyuh8t7v5pk0tshjs68x"
    )
    .replaceAll(
      "{this_account_component_address}",
      "account_sim1qspjlnwx4gdcazhral74rjgzgysrslf8ngrfmprecrrss3p9md"
    )
    .replaceAll(
      "{account_component_address}",
      "account_sim1qspjlnwx4gdcazhral74rjgzgysrslf8ngrfmprecrrss3p9md"
    )
    .replaceAll(
      "{other_account_component_address}",
      "account_sim1qspjlnwx4gdcazhral74rjgzgysrslf8ngrfmprecrrss3p9md"
    )
    .replaceAll(
      "{account_a_component_address}",
      "account_sim1qspjlnwx4gdcazhral74rjgzgysrslf8ngrfmprecrrss3p9md"
    )
    .replaceAll(
      "{account_b_component_address}",
      "account_sim1qspjlnwx4gdcazhral74rjgzgysrslf8ngrfmprecrrss3p9md"
    )
    .replaceAll(
      "{account_c_component_address}",
      "account_sim1qspjlnwx4gdcazhral74rjgzgysrslf8ngrfmprecrrss3p9md"
    )
    .replaceAll(
      "{owner_badge_resource_address}",
      "resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k"
    )
    .replaceAll(
      "{minter_badge_resource_address}",
      "resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k"
    )
    .replaceAll(
      "{auth_badge_resource_address}",
      "resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k"
    )
    .replaceAll(
      "{mintable_resource_address}",
      "resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k"
    )
    .replaceAll("{owner_badge_non_fungible_local_id}", "#1#")
    .replaceAll("{auth_badge_non_fungible_local_id}", "#1#")
    .replaceAll(
      "{code_blob_hash}",
      "5b4b01a4a3892ea3751793da57f072ae08eec694ddcda872239fc8239e4bcd1b"
    )
    .replaceAll(
      "{schema_blob_hash}",
      "5b4b01a4a3892ea3751793da57f072ae08eec694ddcda872239fc8239e4bcd1b"
    )
    .replaceAll("{initial_supply}", "12")
    .replaceAll("{mint_amount}", "12")
    .replaceAll("{non_fungible_local_id}", "#1#");

  return new TransactionManifest(new StringInstructions(stringManifest), [
    new Uint8Array([10]),
  ]);
};
