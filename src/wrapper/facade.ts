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
  CompileNotarizedTransactionResponse,
  CompileSignedTransactionIntentResponse,
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
  InstructionList,
  KnownEntityAddressesRequest,
  KnownEntityAddressesResponse,
  NotarizedTransaction,
  PublicKey,
  SborDecodeRequest,
  SborDecodeResponse,
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
  ValidationConfig,
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
class RadixEngineToolkit {
  public static async information(): Promise<InformationResponse> {
    // Construct the request
    let request = new InformationRequest();

    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(request, ret.exports.information, InformationResponse);
  }

  public static async convertManifest(
    manifest: TransactionManifest,
    instructionsOutputKind: InstructionList.Kind,
    networkId: number
  ): Promise<ConvertManifestResponse> {
    // Construct the request
    let request = new ConvertManifestRequest(
      networkId,
      instructionsOutputKind,
      manifest
    );

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
    transactionIntent: TransactionIntent
  ): Promise<CompileTransactionIntentResponse> {
    // Construct the request
    let request = transactionIntent;

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
    signedTransactionIntent: SignedTransactionIntent
  ): Promise<CompileSignedTransactionIntentResponse> {
    // Construct the request
    let request = signedTransactionIntent;

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
    notarizedTransactionIntent: NotarizedTransaction
  ): Promise<CompileNotarizedTransactionResponse> {
    // Construct the request
    let request = notarizedTransactionIntent;

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
    compiledIntent: Uint8Array,
    instructionsOutputKind: InstructionList.Kind = InstructionList.Kind.String
  ): Promise<DecompileTransactionIntentResponse> {
    // Construct the request
    let request = new DecompileTransactionIntentRequest(
      instructionsOutputKind,
      compiledIntent
    );

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
    compiledIntent: Uint8Array,
    instructionsOutputKind: InstructionList.Kind = InstructionList.Kind.String
  ): Promise<DecompileSignedTransactionIntentResponse> {
    // Construct the request
    let request = new DecompileSignedTransactionIntentRequest(
      instructionsOutputKind,
      compiledIntent
    );

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
    compiledIntent: Uint8Array,
    instructionsOutputKind: InstructionList.Kind = InstructionList.Kind.String
  ): Promise<DecompileNotarizedTransactionIntentResponse> {
    // Construct the request
    let request = new DecompileNotarizedTransactionIntentRequest(
      instructionsOutputKind,
      compiledIntent
    );

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
    compiledIntent: Uint8Array,
    instructionsOutputKind: InstructionList.Kind = InstructionList.Kind.String
  ): Promise<DecompileUnknownTransactionIntentResponse> {
    // Construct the request
    let request = new DecompileUnknownTransactionIntentRequest(
      instructionsOutputKind,
      compiledIntent
    );

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
    addressBytes: Uint8Array,
    networkId: number
  ): Promise<EncodeAddressResponse> {
    // Construct the request
    let request = new EncodeAddressRequest(addressBytes, networkId);

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
    address: string
  ): Promise<DecodeAddressResponse> {
    // Construct the request
    let request = new DecodeAddressRequest(address);

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
    sbor_value: SborValue.Any
  ): Promise<SborEncodeResponse> {
    // Construct the request
    let request = sbor_value;

    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret.invoke(request, ret.exports.sbor_encode, SborEncodeResponse);
  }

  public static async sborDecode(
    encodedValue: Uint8Array,
    networkId: number
  ): Promise<SborDecodeResponse> {
    // Construct the request
    let request = new SborDecodeRequest(encodedValue, networkId);

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
    networkId: number,
    publicKey: PublicKey.Any
  ): Promise<DeriveVirtualAccountAddressResponse> {
    // Construct the request
    let request = new DeriveVirtualAccountAddressRequest(networkId, publicKey);

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
    networkId: number,
    publicKey: PublicKey.Any
  ): Promise<DeriveVirtualIdentityAddressResponse> {
    // Construct the request
    let request = new DeriveVirtualIdentityAddressRequest(networkId, publicKey);

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
    networkId: number,
    olympiaAddress: string
  ): Promise<DeriveBabylonAddressFromOlympiaAddressResponse> {
    // Construct the request
    let request = new DeriveBabylonAddressFromOlympiaAddressRequest(
      networkId,
      olympiaAddress
    );

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
    networkId: number
  ): Promise<KnownEntityAddressesResponse> {
    // Construct the request
    let request = new KnownEntityAddressesRequest(networkId);

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
    compiledNotarizedIntent: Uint8Array,
    validationConfig: ValidationConfig
  ): Promise<StaticallyValidateTransactionResponse> {
    // Construct the request
    let request = new StaticallyValidateTransactionRequest(
      compiledNotarizedIntent,
      validationConfig
    );

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

export { RadixEngineToolkit };
