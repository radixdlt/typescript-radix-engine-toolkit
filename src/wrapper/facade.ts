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

import { Result } from "neverthrow";
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
  EncodeAddressRequest,
  EncodeAddressResponse,
  EntityAddress,
  InformationRequest,
  InformationResponse,
  InstructionList,
  NotarizedTransaction,
  SignedTransactionIntent,
  TransactionIntent,
  TransactionManifest,
} from "../models";
import {
  RadixEngineToolkitWasmWrapper,
  RadixEngineToolkitWrapperError,
} from "./wasm_wrapper";

/**
 * A global instance of the Radix Engine Toolkit.
 */
const RET: Promise<RadixEngineToolkitWasmWrapper> =
  RadixEngineToolkitWasmWrapper.new();

/**
 * A facade for the Radix Engine Toolkit which abstracts some of the async and instance logic away
 * from the developers consuming the class. Additionally, this class abstracts the toolkit's invoke
 * process away from the developer.
 */
class RadixEngineToolkit {
  public static async information(): Promise<
    Result<InformationResponse, RadixEngineToolkitWrapperError>
  > {
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
  ): Promise<Result<ConvertManifestResponse, RadixEngineToolkitWrapperError>> {
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
  ): Promise<
    Result<CompileTransactionIntentResponse, RadixEngineToolkitWrapperError>
  > {
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
  ): Promise<
    Result<
      CompileSignedTransactionIntentResponse,
      RadixEngineToolkitWrapperError
    >
  > {
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
  ): Promise<
    Result<CompileNotarizedTransactionResponse, RadixEngineToolkitWrapperError>
  > {
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
  ): Promise<
    Result<DecompileTransactionIntentResponse, RadixEngineToolkitWrapperError>
  > {
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
  ): Promise<
    Result<
      DecompileSignedTransactionIntentResponse,
      RadixEngineToolkitWrapperError
    >
  > {
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
  ): Promise<
    Result<
      DecompileNotarizedTransactionIntentResponse,
      RadixEngineToolkitWrapperError
    >
  > {
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
  ): Promise<
    Result<
      DecompileUnknownTransactionIntentResponse,
      RadixEngineToolkitWrapperError
    >
  > {
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
  ): Promise<Result<EncodeAddressResponse, RadixEngineToolkitWrapperError>> {
    // Construct the request
    let request = new EncodeAddressRequest(addressBytes, networkId);

    // Get the instance of the Radix Engine Toolkit
    let ret = await RET;

    // Invoke the Radix Engine Toolkit
    return ret
      .invoke(request, ret.exports.encode_address, Object)
      .map((object: Object) => {
        // @ts-ignore
        let type: string | undefined = object?.["_type"];
        if (type === EntityAddress.Kind.ComponentAddress.toString()) {
          return Object.setPrototypeOf(object, EntityAddress.ComponentAddress);
        } else if (type === EntityAddress.Kind.PackageAddress.toString()) {
          return Object.setPrototypeOf(object, EntityAddress.PackageAddress);
        } else if (type === EntityAddress.Kind.ResourceAddress.toString()) {
          return Object.setPrototypeOf(object, EntityAddress.ResourceAddress);
        } else {
          throw new Error("no _type key found for address");
        }
      });
  }

  public static async decodeAddress(
    address: string
  ): Promise<Result<DecodeAddressResponse, RadixEngineToolkitWrapperError>> {
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
}

export { RadixEngineToolkit };
