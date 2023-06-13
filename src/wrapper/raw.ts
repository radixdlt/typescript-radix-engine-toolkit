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

import { instanceToPlain, plainToInstance } from "class-transformer";
import {
  CompileNotarizedTransactionInput,
  CompileNotarizedTransactionOutput,
  CompileSignedTransactionIntentInput,
  CompileSignedTransactionIntentOutput,
  CompileTransactionIntentInput,
  CompileTransactionIntentOutput,
  ConvertManifestInput,
  ConvertManifestOutput,
  DecodeAddressInput,
  DecodeAddressOutput,
  DecompileNotarizedTransactionIntentInput,
  DecompileNotarizedTransactionIntentOutput,
  DecompileSignedTransactionIntentInput,
  DecompileSignedTransactionIntentOutput,
  DecompileTransactionIntentInput,
  DecompileTransactionIntentOutput,
  DecompileUnknownTransactionIntentInput,
  DecompileUnknownTransactionIntentOutput,
  DecompileUnknownTransactionIntentOutputKind,
  DeriveBabylonAddressFromOlympiaAddressInput,
  DeriveBabylonAddressFromOlympiaAddressOutput,
  DeriveVirtualAccountAddressInput,
  DeriveVirtualAccountAddressOutput,
  DeriveVirtualIdentityAddressInput,
  DeriveVirtualIdentityAddressOutput,
  EncodeAddressInput,
  EncodeAddressOutput,
  ExtractAddressesFromManifestInput,
  ExtractAddressesFromManifestOutput,
  HashNotarizedTransactionInput,
  HashNotarizedTransactionOutput,
  HashSignedTransactionIntentInput,
  HashSignedTransactionIntentOutput,
  HashTransactionIntentInput,
  HashTransactionIntentOutput,
  InformationInput,
  InformationOutput,
  KnownEntityAddressesInput,
  KnownEntityAddressesOutput,
  NotarizedTransaction,
  SborDecodeInput,
  SborDecodeOutput,
  SborEncodeInput,
  SborEncodeOutput,
  SborValue,
  SignedTransactionIntent,
  StaticallyValidateTransactionInput,
  StaticallyValidateTransactionOutput,
  StaticallyValidateTransactionOutputInvalid,
  StaticallyValidateTransactionOutputValid,
  TransactionIntent,
  TransactionManifest,
} from "../models";
import { RadixEngineToolkitWasmWrapper } from "./wasm_wrapper";

/**
 * A global instance of the Radix Engine Toolkit.
 */
export const RET: Promise<RadixEngineToolkitWasmWrapper> =
  RadixEngineToolkitWasmWrapper.new();

/**
 * A facade for the Radix Engine Toolkit which abstracts some of the async and instance logic away
 * from the developers consuming the class. Additionally, this class abstracts the toolkit's invoke
 * process away from the developer.
 */
export class RawRadixEngineToolkit {
  public static async information(
    input: InformationInput
  ): Promise<InformationOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(input, ret.exports.information, InformationOutput);
  }

  public static async analyzeManifest(
    input: ExtractAddressesFromManifestInput
  ): Promise<ExtractAddressesFromManifestOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      input,
      ret.exports.information,
      ExtractAddressesFromManifestOutput
    );
  }

  public static async convertManifest(
    input: ConvertManifestInput
  ): Promise<ConvertManifestOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(input, ret.exports.convert_manifest, TransactionManifest);
  }

  public static async compileTransactionIntent(
    input: CompileTransactionIntentInput
  ): Promise<CompileTransactionIntentOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      input,
      ret.exports.compile_transaction_intent,
      CompileTransactionIntentOutput
    );
  }

  public static async hashTransactionIntent(
    input: HashTransactionIntentInput
  ): Promise<HashTransactionIntentOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      input,
      ret.exports.hash_transaction_intent,
      HashTransactionIntentOutput
    );
  }

  public static async hashSignedTransactionIntent(
    input: HashSignedTransactionIntentInput
  ): Promise<HashSignedTransactionIntentOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      input,
      ret.exports.hash_signed_transaction_intent,
      HashSignedTransactionIntentOutput
    );
  }

  public static async hashNotarizedTransaction(
    input: HashNotarizedTransactionInput
  ): Promise<HashNotarizedTransactionOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      input,
      ret.exports.hash_notarized_transaction,
      HashNotarizedTransactionOutput
    );
  }

  public static async compileSignedTransactionIntent(
    input: CompileSignedTransactionIntentInput
  ): Promise<CompileSignedTransactionIntentOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      input,
      ret.exports.compile_signed_transaction_intent,
      CompileSignedTransactionIntentOutput
    );
  }

  public static async compileNotarizedTransactionIntent(
    input: CompileNotarizedTransactionInput
  ): Promise<CompileNotarizedTransactionOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      input,
      ret.exports.compile_notarized_transaction,
      CompileNotarizedTransactionOutput
    );
  }

  public static async decompileTransactionIntent(
    input: DecompileTransactionIntentInput
  ): Promise<DecompileTransactionIntentOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      input,
      ret.exports.decompile_transaction_intent,
      TransactionIntent
    );
  }

  public static async decompileSignedTransactionIntent(
    input: DecompileSignedTransactionIntentInput
  ): Promise<DecompileSignedTransactionIntentOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      input,
      ret.exports.decompile_signed_transaction_intent,
      SignedTransactionIntent
    );
  }

  public static async decompileNotarizedTransactionIntent(
    input: DecompileNotarizedTransactionIntentInput
  ): Promise<DecompileNotarizedTransactionIntentOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      input,
      ret.exports.decompile_notarized_transaction,
      NotarizedTransaction
    );
  }

  public static async decompileUnknownTransactionIntent(
    input: DecompileUnknownTransactionIntentInput
  ): Promise<DecompileUnknownTransactionIntentOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    const output = ret.invoke(
      input,
      ret.exports.decompile_unknown_transaction_intent,
      DecompileUnknownTransactionIntentOutput
    );
    if (
      output.type ===
      DecompileUnknownTransactionIntentOutputKind.TransactionIntent
    ) {
      output.value = plainToInstance(
        TransactionIntent,
        instanceToPlain(output.value)
      );
    } else if (
      output.type ===
      DecompileUnknownTransactionIntentOutputKind.SignedTransactionIntent
    ) {
      output.value = plainToInstance(
        SignedTransactionIntent,
        instanceToPlain(output.value)
      );
    } else if (
      output.type ===
      DecompileUnknownTransactionIntentOutputKind.NotarizedTransactionIntent
    ) {
      output.value = plainToInstance(
        NotarizedTransaction,
        instanceToPlain(output.value)
      );
    }

    return output;
  }

  public static async encodeAddress(
    input: EncodeAddressInput
  ): Promise<EncodeAddressOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    const output = ret.invoke(
      input,
      ret.exports.encode_address,
      EncodeAddressOutput
    );

    return output;
  }

  public static async decodeAddress(
    input: DecodeAddressInput
  ): Promise<DecodeAddressOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(input, ret.exports.decode_address, DecodeAddressOutput);
  }

  public static async sborEncode(
    input: SborEncodeInput
  ): Promise<SborEncodeOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(input, ret.exports.sbor_encode, SborEncodeOutput);
  }

  public static async sborDecode(
    input: SborDecodeInput
  ): Promise<SborDecodeOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    let output = ret.invoke(input, ret.exports.sbor_decode, SborValue.Value);
    if (output.type === "ScryptoSbor") {
      output = plainToInstance(SborValue.ScryptoSbor, instanceToPlain(output));
    } else if (output.type === "ManifestSbor") {
      output = plainToInstance(SborValue.ManifestSbor, instanceToPlain(output));
    }
    return output;
  }

  public static async deriveVirtualAccountAddress(
    input: DeriveVirtualAccountAddressInput
  ): Promise<DeriveVirtualAccountAddressOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      input,
      ret.exports.derive_virtual_account_address,
      DeriveVirtualAccountAddressOutput
    );
  }

  public static async deriveVirtualIdentityAddress(
    input: DeriveVirtualIdentityAddressInput
  ): Promise<DeriveVirtualIdentityAddressOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      input,
      ret.exports.derive_virtual_identity_address,
      DeriveVirtualIdentityAddressOutput
    );
  }

  public static async deriveBabylonAddressFromOlympiaAddress(
    input: DeriveBabylonAddressFromOlympiaAddressInput
  ): Promise<DeriveBabylonAddressFromOlympiaAddressOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      input,
      ret.exports.derive_babylon_address_from_olympia_address,
      DeriveBabylonAddressFromOlympiaAddressOutput
    );
  }

  public static async knownEntityAddresses(
    input: KnownEntityAddressesInput
  ): Promise<KnownEntityAddressesOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      input,
      ret.exports.known_entity_addresses,
      KnownEntityAddressesOutput
    );
  }

  public static async staticallyValidateTransaction(
    input: StaticallyValidateTransactionInput
  ): Promise<StaticallyValidateTransactionOutput> {
    // Get the instance of the Radix Engine Toolkit
    const ret = await RET;

    // Invoke the Radix Engine Toolkit
    let output = ret.invoke(
      input,
      ret.exports.statically_validate_transaction,
      StaticallyValidateTransactionOutput
    );
    if (output.validity === "Valid") {
      output = plainToInstance(
        StaticallyValidateTransactionOutputValid,
        instanceToPlain(output)
      );
    } else if (output.validity === "Invalid") {
      output = plainToInstance(
        StaticallyValidateTransactionOutputInvalid,
        instanceToPlain(output)
      );
    }
    return output;
  }
}
