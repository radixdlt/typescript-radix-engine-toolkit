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
  AnalyzeManifestRequest,
  AnalyzeManifestResponse,
  CompileNotarizedTransactionRequest,
  CompileNotarizedTransactionResponse,
  CompileSignedTransactionIntentRequest,
  CompileSignedTransactionIntentResponse,
  CompileTransactionIntentRequest,
  CompileTransactionIntentResponse,
  ConvertManifestRequest,
  ConvertManifestResponse,
  DecodeAddressRequest,
  DecodeAddressResponse,
  DecompileNotarizedTransactionIntentRequest,
  DecompileNotarizedTransactionIntentResponse,
  DecompileSignedTransactionIntentRequest,
  DecompileSignedTransactionIntentResponse,
  DecompileTransactionIntentRequest,
  DecompileTransactionIntentResponse,
  DecompileUnknownTransactionIntentRequest,
  DecompileUnknownTransactionIntentResponse,
  DeriveBabylonAddressFromOlympiaAddressRequest,
  DeriveBabylonAddressFromOlympiaAddressResponse,
  DeriveVirtualAccountAddressRequest,
  DeriveVirtualAccountAddressResponse,
  DeriveVirtualIdentityAddressRequest,
  DeriveVirtualIdentityAddressResponse,
  EncodeAddressRequest,
  EncodeAddressResponse,
  EntityAddress,
  InformationRequest,
  InformationResponse,
  KnownEntityAddressesRequest,
  KnownEntityAddressesResponse,
  NotarizedTransaction,
  SborDecodeRequest,
  SborDecodeResponse,
  SborEncodeRequest,
  SborEncodeResponse,
  SborValue,
  SignedTransactionIntent,
  StaticallyValidateTransactionRequest,
  StaticallyValidateTransactionResponse,
  StaticallyValidateTransactionResponseInvalid,
  StaticallyValidateTransactionResponseKind,
  StaticallyValidateTransactionResponseValid,
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
    request: InformationRequest
  ): Promise<InformationResponse> {
    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(request, ret.exports.information, InformationResponse);
  }

  public static async analyzeManifest(
    request: AnalyzeManifestRequest
  ): Promise<AnalyzeManifestResponse> {
    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      request,
      ret.exports.information,
      AnalyzeManifestResponse
    );
  }

  public static async convertManifest(
    request: ConvertManifestRequest
  ): Promise<ConvertManifestResponse> {
    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      request,
      ret.exports.convert_manifest,
      TransactionManifest
    );
  }

  public static async compileTransactionIntent(
    request: CompileTransactionIntentRequest
  ): Promise<CompileTransactionIntentResponse> {
    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      request,
      ret.exports.compile_transaction_intent,
      CompileTransactionIntentResponse
    );
  }

  public static async compileSignedTransactionIntent(
    request: CompileSignedTransactionIntentRequest
  ): Promise<CompileSignedTransactionIntentResponse> {
    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      request,
      ret.exports.compile_signed_transaction_intent,
      CompileSignedTransactionIntentResponse
    );
  }

  public static async compileNotarizedTransactionIntent(
    request: CompileNotarizedTransactionRequest
  ): Promise<CompileNotarizedTransactionResponse> {
    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      request,
      ret.exports.compile_notarized_transaction,
      CompileNotarizedTransactionResponse
    );
  }

  public static async decompileTransactionIntent(
    request: DecompileTransactionIntentRequest
  ): Promise<DecompileTransactionIntentResponse> {
    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      request,
      ret.exports.decompile_transaction_intent,
      TransactionIntent
    );
  }

  public static async decompileSignedTransactionIntent(
    request: DecompileSignedTransactionIntentRequest
  ): Promise<DecompileSignedTransactionIntentResponse> {
    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      request,
      ret.exports.decompile_signed_transaction_intent,
      SignedTransactionIntent
    );
  }

  public static async decompileNotarizedTransactionIntent(
    request: DecompileNotarizedTransactionIntentRequest
  ): Promise<DecompileNotarizedTransactionIntentResponse> {
    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      request,
      ret.exports.decompile_notarized_transaction,
      NotarizedTransaction
    );
  }

  public static async decompileUnknownTransactionIntent(
    request: DecompileUnknownTransactionIntentRequest
  ): Promise<DecompileUnknownTransactionIntentResponse> {
    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      request,
      ret.exports.decompile_unknown_transaction_intent,
      DecompileUnknownTransactionIntentResponse
    );
  }

  public static async encodeAddress(
    request: EncodeAddressRequest
  ): Promise<EncodeAddressResponse> {
    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    let response = ret.invoke(request, ret.exports.encode_address, Object);
    // @ts-ignore
    let type: EntityAddress.Kind | undefined = response?.[
      "_type"
    ] as EntityAddress.Kind;
    if (type === EntityAddress.Kind.ComponentAddress) {
      return Object.setPrototypeOf(
        response,
        EntityAddress.ComponentAddress.prototype
      );
    } else if (type === EntityAddress.Kind.PackageAddress) {
      return Object.setPrototypeOf(
        response,
        EntityAddress.PackageAddress.prototype
      );
    } else if (type === EntityAddress.Kind.ResourceAddress) {
      return Object.setPrototypeOf(
        response,
        EntityAddress.ResourceAddress.prototype
      );
    } else {
      throw new Error("no _type key found for address");
    }
  }

  public static async decodeAddress(
    request: DecodeAddressRequest
  ): Promise<DecodeAddressResponse> {
    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      request,
      ret.exports.decode_address,
      DecodeAddressResponse
    );
  }

  public static async sborEncode(
    request: SborEncodeRequest
  ): Promise<SborEncodeResponse> {
    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(request, ret.exports.sbor_encode, SborEncodeResponse);
  }

  public static async sborDecode(
    request: SborDecodeRequest
  ): Promise<SborDecodeResponse> {
    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    let response = ret.invoke(request, ret.exports.sbor_decode, Object);
    // @ts-ignore
    let type: SborValue.Kind | undefined = response?.[
      "_type"
    ] as SborValue.Kind;
    if (type === SborValue.Kind.ScryptoSbor) {
      return Object.setPrototypeOf(response, SborValue.ScryptoSbor.prototype);
    } else if (type === SborValue.Kind.ManifestSbor) {
      return Object.setPrototypeOf(response, SborValue.ManifestSbor.prototype);
    } else {
      throw new Error("no _type key found for address");
    }
  }

  public static async deriveVirtualAccountAddress(
    request: DeriveVirtualAccountAddressRequest
  ): Promise<DeriveVirtualAccountAddressResponse> {
    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      request,
      ret.exports.derive_virtual_account_address,
      DeriveVirtualAccountAddressResponse
    );
  }

  public static async deriveVirtualIdentityAddress(
    request: DeriveVirtualIdentityAddressRequest
  ): Promise<DeriveVirtualIdentityAddressResponse> {
    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      request,
      ret.exports.derive_virtual_identity_address,
      DeriveVirtualIdentityAddressResponse
    );
  }

  public static async deriveBabylonAddressFromOlympiaAddress(
    request: DeriveBabylonAddressFromOlympiaAddressRequest
  ): Promise<DeriveBabylonAddressFromOlympiaAddressResponse> {
    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      request,
      ret.exports.derive_babylon_address_from_olympia_address,
      DeriveBabylonAddressFromOlympiaAddressResponse
    );
  }

  public static async knownEntityAddresses(
    request: KnownEntityAddressesRequest
  ): Promise<KnownEntityAddressesResponse> {
    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(
      request,
      ret.exports.known_entity_addresses,
      KnownEntityAddressesResponse
    );
  }

  public static async staticallyValidateTransaction(
    request: StaticallyValidateTransactionRequest
  ): Promise<StaticallyValidateTransactionResponse> {
    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    let response = ret.invoke(
      request,
      ret.exports.statically_validate_transaction,
      Object
    );
    // @ts-ignore
    let validity: StaticallyValidateTransactionResponseKind | undefined =
      // @ts-ignore
      response?.["_validity"] as StaticallyValidateTransactionResponseKind;
    if (validity === StaticallyValidateTransactionResponseKind.Valid) {
      return Object.setPrototypeOf(
        response,
        StaticallyValidateTransactionResponseValid.prototype
      );
    } else if (validity === StaticallyValidateTransactionResponseKind.Invalid) {
      return Object.setPrototypeOf(
        response,
        StaticallyValidateTransactionResponseInvalid.prototype
      );
    } else {
      throw new Error("no _type key found for address");
    }
  }
}
