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
  ConvertManifestInput,
  InstructionList,
  RawRadixEngineToolkit,
  TransactionManifest,
} from "../../src";
import { StringInstructions } from "../../src/models/transaction/instruction_list";

describe.each([
  "../test_vectors/manifest/access_controller/new.rtm",
  "../test_vectors/manifest/access_rule/access_rule.rtm",
  "../test_vectors/manifest/account/multi_account_resource_transfer.rtm",
  "../test_vectors/manifest/account/new.rtm",
  "../test_vectors/manifest/account/resource_transfer.rtm",
  "../test_vectors/manifest/call/call_function.rtm",
  "../test_vectors/manifest/call/call_method.rtm",
  "../test_vectors/manifest/faucet/free_funds.rtm",
  "../test_vectors/manifest/identity/new.rtm",
  "../test_vectors/manifest/metadata/metadata.rtm",
  "../test_vectors/manifest/package/publish.rtm",
  "../test_vectors/manifest/resources/creation/fungible/no_initial_supply.rtm",
  "../test_vectors/manifest/resources/creation/fungible/with_initial_supply.rtm",
  "../test_vectors/manifest/resources/creation/non_fungible/no_initial_supply.rtm",
  "../test_vectors/manifest/resources/creation/non_fungible/with_initial_supply.rtm",
  "../test_vectors/manifest/resources/mint/fungible/mint.rtm",
  "../test_vectors/manifest/resources/mint/non_fungible/mint.rtm",
  "../test_vectors/manifest/resources/auth_zone.rtm",
  "../test_vectors/manifest/resources/recall.rtm",
  "../test_vectors/manifest/resources/worktop.rtm",
  "../test_vectors/manifest/royalty/royalty.rtm",
  "../test_vectors/manifest/values/values.rtm",
])("Convert manifest works for $0", (path) => {
  test(`${path} can be converted to String`, async () => {
    // Arrange
    let manifest = prepareManifest(path);

    // Act
    let convertedManifest = await RawRadixEngineToolkit.convertManifest(
      new ConvertManifestInput(0xf2, InstructionList.Kind.String, manifest)
    );

    // Act
    expect(convertedManifest.blobs).toEqual([new Uint8Array([10])]);
  });

  test(`${path} can be converted to Parsed`, async () => {
    // Arrange
    let manifest = prepareManifest(path);

    // Act
    let convertedManifest = await RawRadixEngineToolkit.convertManifest(
      new ConvertManifestInput(0xf2, InstructionList.Kind.Parsed, manifest)
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
    .replaceAll(
      "${xrd_resource_address}",
      "resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3"
    )
    .replaceAll(
      "${fungible_resource_address}",
      "resource_sim1thvwu8dh6lk4y9mntemkvj25wllq8adq42skzufp4m8wxxuemugnez"
    )
    .replaceAll(
      "${resource_address}",
      "resource_sim1thvwu8dh6lk4y9mntemkvj25wllq8adq42skzufp4m8wxxuemugnez"
    )
    .replaceAll(
      "${gumball_resource_address}",
      "resource_sim1thvwu8dh6lk4y9mntemkvj25wllq8adq42skzufp4m8wxxuemugnez"
    )
    .replaceAll(
      "${non_fungible_resource_address}",
      "resource_sim1ngktvyeenvvqetnqwysevcx5fyvl6hqe36y3rkhdfdn6uzvt5366ha"
    )
    .replaceAll(
      "${badge_resource_address}",
      "resource_sim1ngktvyeenvvqetnqwysevcx5fyvl6hqe36y3rkhdfdn6uzvt5366ha"
    )
    .replaceAll(
      "${account_address}",
      "account_sim1cyvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve475w0q"
    )
    .replaceAll(
      "${this_account_address}",
      "account_sim1cyvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve475w0q"
    )
    .replaceAll(
      "${account_a_component_address}",
      "account_sim1cyvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve475w0q"
    )
    .replaceAll(
      "${account_b_component_address}",
      "account_sim1cyvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve475w0q"
    )
    .replaceAll(
      "${account_c_component_address}",
      "account_sim1cyvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cve475w0q"
    )
    .replaceAll(
      "${other_account_address}",
      "account_sim1cyzfj6p254jy6lhr237s7pcp8qqz6c8ahq9mn6nkdjxxxat5syrgz9"
    )
    .replaceAll(
      "${component_address}",
      "component_sim1cqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cvemygpmu"
    )
    .replaceAll(
      "${faucet_component_address}",
      "component_sim1cqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cvemygpmu"
    )
    .replaceAll(
      "${package_address}",
      "package_sim1p4r4955skdjq9swg8s5jguvcjvyj7tsxct87a9z6sw76cdfd2jg3zk"
    )
    .replaceAll(
      "${minter_badge_resource_address}",
      "resource_sim1ngktvyeenvvqetnqwysevcx5fyvl6hqe36y3rkhdfdn6uzvt5366ha"
    )
    .replaceAll(
      "${mintable_resource_address}",
      "resource_sim1nfhtg7ttszgjwysfglx8jcjtvv8q02fg9s2y6qpnvtw5jsy3wvlhj6"
    )
    .replaceAll(
      "${vault_address}",
      "internal_vault_sim1tqvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cvevp72ff"
    )
    .replaceAll("${owner_badge_non_fungible_local_id}", "#1#")
    .replaceAll(
      "${code_blob_hash}",
      "5b4b01a4a3892ea3751793da57f072ae08eec694ddcda872239fc8239e4bcd1b"
    )
    .replaceAll("${initial_supply}", "12")
    .replaceAll("${mint_amount}", "12")
    .replaceAll("${non_fungible_local_id}", "#12#")
    .replaceAll(
      "${auth_badge_resource_address}",
      "resource_sim1n24hvnrgmhj6j8dpjuu85vfsagdjafcl5x4ewc9yh436jh2hpu4qdj"
    )
    .replaceAll("${auth_badge_non_fungible_local_id}", "#1#")
    .replaceAll(
      "${package_address}",
      "package_sim1p4r4955skdjq9swg8s5jguvcjvyj7tsxct87a9z6sw76cdfd2jg3zk"
    )
    .replaceAll(
      "${consensusmanager_address}",
      "consensusmanager_sim1sexxxxxxxxxxephmgrxxxxxxxxx009352500589xxxxxxxxx82g6cl"
    )
    .replaceAll(
      "${clock_address}",
      "clock_sim1skxxxxxxxxxxclckxxxxxxxxxxx002253583992xxxxxxxxxx58hk6"
    )
    .replaceAll(
      "${validator_address}",
      "validator_sim1sgvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cvedzgr3l"
    )
    .replaceAll(
      "${accesscontroller_address}",
      "accesscontroller_sim1cvvgx33089ukm2pl97pv4max0x40ruvfy4lt60yvya744cvexaj7at"
    );

  return new TransactionManifest(new StringInstructions(stringManifest), [
    new Uint8Array([10]),
  ]);
};
