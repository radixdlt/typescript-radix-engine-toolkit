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
  AuthorizedDepositorsChanges,
  Convert,
  DecimalSource,
  DefaultDepositRule,
  EntityType,
  ExecutionAnalysis,
  Expression,
  FeeLocks,
  FeeSummary,
  Instruction,
  Instructions,
  Intent,
  ManifestAddress,
  ManifestSborStringRepresentation,
  MessageValidationConfig,
  NonFungibleLocalIdArraySource,
  NotarizedTransaction,
  OlympiaNetwork,
  PublicKey,
  ReservedInstruction,
  ResourceOrNonFungible,
  ResourcePreference,
  ResourcePreferenceAction,
  ResourceSpecifier,
  ResourceTracker,
  Resources,
  SerializationMode,
  Signature,
  SignatureWithPublicKey,
  SignedIntent,
  TransactionHeader,
  TransactionManifest,
  TransactionType,
  ValidationConfig,
  Value,
  ValueKind,
} from "../index";
import {
  ExecutionAnalyzeOutput,
  SerializableAuthorizedDepositorsChanges,
  SerializableDecimal,
  SerializableDefaultDepositRule,
  SerializableEntityType,
  SerializableExpression,
  SerializableFeeLocks,
  SerializableFeeSummary,
  SerializableInstruction,
  SerializableInstructions,
  SerializableIntent,
  SerializableManifestAddress,
  SerializableManifestSborStringRepresentation,
  SerializableManifestValue,
  SerializableManifestValueKind,
  SerializableMessageValidationConfig,
  SerializableNonFungibleLocalId,
  SerializableNotarizedTransaction,
  SerializableOlympiaNetwork,
  SerializablePublicKey,
  SerializableReservedInstruction,
  SerializableResourceOrNonFungible,
  SerializableResourcePreference,
  SerializableResourcePreferenceAction,
  SerializableResourceSpecifier,
  SerializableResourceTracker,
  SerializableResources,
  SerializableSerializationMode,
  SerializableSignature,
  SerializableSignatureWithPublicKey,
  SerializableSignedIntent,
  SerializableSource,
  SerializableTransactionHeader,
  SerializableTransactionManifest,
  SerializableTransactionType,
  SerializableValidationConfig,
} from "./generated";

/**
 * A class that provides functionality for converting the generated models to their hand-written
 * counterparts.
 */
export class GeneratedConverter {
  static PublicKey = class {
    static toGenerated(value: PublicKey): SerializablePublicKey {
      return {
        kind: value.curve,
        value: Convert.Uint8Array.toHexString(value.publicKey),
      };
    }

    static fromGenerated(value: SerializablePublicKey): PublicKey {
      switch (value.kind) {
        case "Secp256k1":
          return new PublicKey.Secp256k1(
            Convert.HexString.toUint8Array(value.value)
          );
        case "Ed25519":
          return new PublicKey.Ed25519(
            Convert.HexString.toUint8Array(value.value)
          );
      }
    }
  };

  static Signature = class {
    static toGenerated(value: Signature): SerializableSignature {
      return {
        kind: value.curve,
        value: Convert.Uint8Array.toHexString(value.signature),
      };
    }

    static fromGenerated(value: SerializableSignature): Signature {
      switch (value.kind) {
        case "Secp256k1":
          return new Signature.Secp256k1(
            Convert.HexString.toUint8Array(value.value)
          );
        case "Ed25519":
          return new Signature.Ed25519(
            Convert.HexString.toUint8Array(value.value)
          );
      }
    }
  };

  static SignatureWithPublicKey = class {
    static toGenerated(
      value: SignatureWithPublicKey
    ): SerializableSignatureWithPublicKey {
      switch (value.curve) {
        case "Ed25519":
          return {
            kind: "Ed25519",
            value: {
              public_key: Convert.Uint8Array.toHexString(value.publicKey!),
              signature: Convert.Uint8Array.toHexString(value.signature),
            },
          };
        case "Secp256k1":
          return {
            kind: "Secp256k1",
            value: {
              signature: Convert.Uint8Array.toHexString(value.signature),
            },
          };
      }
    }

    static fromGenerated(
      value: SerializableSignatureWithPublicKey
    ): SignatureWithPublicKey {
      switch (value.kind) {
        case "Secp256k1":
          return new SignatureWithPublicKey.Secp256k1(
            Convert.HexString.toUint8Array(value.value.signature)
          );
        case "Ed25519":
          return new SignatureWithPublicKey.Ed25519(
            Convert.HexString.toUint8Array(value.value.signature),
            Convert.HexString.toUint8Array(value.value.public_key)
          );
      }
    }
  };

  static OlympiaNetwork = class {
    static toGenerated(value: OlympiaNetwork): SerializableOlympiaNetwork {
      return SerializableOlympiaNetwork[OlympiaNetwork[value]];
    }

    static fromGenerated(value: SerializableOlympiaNetwork): OlympiaNetwork {
      return OlympiaNetwork[SerializableOlympiaNetwork[value]];
    }
  };

  static SerializationMode = class {
    static toGenerated(
      value: SerializationMode
    ): SerializableSerializationMode {
      return SerializableSerializationMode[SerializationMode[value]];
    }

    static fromGenerated(
      value: SerializableSerializationMode
    ): SerializationMode {
      return SerializationMode[SerializableSerializationMode[value]];
    }
  };

  static ManifestSborStringRepresentation = class {
    static toGenerated(
      value: ManifestSborStringRepresentation
    ): SerializableManifestSborStringRepresentation {
      switch (value) {
        case ManifestSborStringRepresentation.ManifestString:
          return {
            kind: "ManifestString",
          };
        case ManifestSborStringRepresentation.ProgrammaticJson:
          return {
            kind: "Json",
            value: SerializableSerializationMode.Programmatic,
          };
        case ManifestSborStringRepresentation.NaturalJson:
          return {
            kind: "Json",
            value: SerializableSerializationMode.Natural,
          };
        case ManifestSborStringRepresentation.ModelJson:
          return {
            kind: "Json",
            value: SerializableSerializationMode.Model,
          };
      }
    }

    static fromGenerated(
      value: SerializableManifestSborStringRepresentation
    ): ManifestSborStringRepresentation {
      switch (value.kind) {
        case "ManifestString":
          return ManifestSborStringRepresentation.ManifestString;
        case "Json":
          switch (value.value) {
            case SerializableSerializationMode.Programmatic:
              return ManifestSborStringRepresentation.ProgrammaticJson;
            case SerializableSerializationMode.Natural:
              return ManifestSborStringRepresentation.NaturalJson;
            case SerializableSerializationMode.Model:
              return ManifestSborStringRepresentation.ModelJson;
          }
      }
    }
  };

  static ManifestValueKind = class {
    static toGenerated(value: ValueKind): SerializableManifestValueKind {
      return SerializableManifestValueKind[ValueKind[value]];
    }

    static fromGenerated(value: SerializableManifestValueKind): ValueKind {
      return ValueKind[SerializableManifestValueKind[value]];
    }
  };

  static Expression = class {
    static toGenerated(value: Expression): SerializableExpression {
      return SerializableExpression[Expression[value]];
    }

    static fromGenerated(value: SerializableExpression): Expression {
      return Expression[SerializableExpression[value]];
    }
  };

  static ManifestAddress = class {
    static toGenerated(value: ManifestAddress): SerializableManifestAddress {
      switch (value.kind) {
        case "Named":
          return {
            kind: value.kind,
            value: Convert.Number.toString(value.value),
          };
        case "Static":
          return {
            kind: value.kind,
            value: value.value,
          };
      }
    }

    static fromGenerated(value: SerializableManifestAddress): ManifestAddress {
      switch (value.kind) {
        case "Named":
          return {
            kind: value.kind,
            value: Convert.String.toNumber(value.value),
          };
        case "Static":
          return {
            kind: value.kind,
            value: value.value,
          };
      }
    }
  };

  static ManifestValue = class {
    static toGenerated(value: Value): SerializableManifestValue {
      switch (value.kind) {
        case ValueKind.Bool:
          return {
            kind: value.kind,
            value: {
              value: value.value,
            },
          };
        /* Numeric Types converted to strings */
        case ValueKind.I8:
        case ValueKind.I16:
        case ValueKind.I32:
        case ValueKind.U8:
        case ValueKind.U16:
        case ValueKind.U32:
        case ValueKind.Bucket:
        case ValueKind.Proof:
        case ValueKind.AddressReservation:
          return {
            kind: ValueKind[value.kind],
            value: {
              value: Convert.Number.toString(value.value),
            },
          };
        /* BigInt types converted to strings */
        case ValueKind.I64:
        case ValueKind.I128:
        case ValueKind.U64:
        case ValueKind.U128:
          return {
            kind: ValueKind[value.kind],
            value: {
              value: Convert.BigInt.toString(value.value),
            },
          };
        /* String values */
        case ValueKind.Blob:
          return {
            kind: ValueKind[value.kind],
            value: {
              value: Convert.Uint8Array.toHexString(value.value),
            },
          };
        case ValueKind.String:
        case ValueKind.NonFungibleLocalId:
          return {
            kind: ValueKind[value.kind],
            value: {
              value: value.value,
            },
          };
        /* Decimal conversions */
        case ValueKind.Decimal:
        case ValueKind.PreciseDecimal:
          return {
            kind: ValueKind[value.kind],
            value: {
              value: Convert.Decimal.toString(value.value),
            },
          };
        /* Sum and Product Types */
        case ValueKind.Enum:
          return {
            kind: value.kind,
            value: {
              discriminator: Convert.Number.toString(value.discriminator),
              fields: value.fields.map(
                GeneratedConverter.ManifestValue.toGenerated
              ),
            },
          };
        case ValueKind.Array:
          return {
            kind: value.kind,
            value: {
              element_value_kind:
                SerializableManifestValueKind[value.elementValueKind],
              elements: value.elements.map(
                GeneratedConverter.ManifestValue.toGenerated
              ),
            },
          };
        case ValueKind.Tuple:
          return {
            kind: value.kind,
            value: {
              fields: value.fields.map(
                GeneratedConverter.ManifestValue.toGenerated
              ),
            },
          };
        case ValueKind.Map:
          return {
            kind: value.kind,
            value: {
              key_value_kind: SerializableManifestValueKind[value.keyValueKind],
              value_value_kind:
                SerializableManifestValueKind[value.valueValueKind],
              entries: value.entries.map((mapEntry) => {
                return {
                  key: GeneratedConverter.ManifestValue.toGenerated(
                    mapEntry.key
                  ),
                  value: GeneratedConverter.ManifestValue.toGenerated(
                    mapEntry.value
                  ),
                };
              }),
            },
          };
        /* Misc */
        case ValueKind.Address:
          return {
            kind: value.kind,
            value: {
              value: GeneratedConverter.ManifestAddress.toGenerated(
                value.value
              ),
            },
          };
        case ValueKind.Expression:
          return {
            kind: value.kind,
            value: {
              value: GeneratedConverter.Expression.toGenerated(value.value),
            },
          };
      }
    }

    static fromGenerated(value: SerializableManifestValue): Value {
      switch (value.kind) {
        case "Bool":
          return {
            kind: ValueKind.Bool,
            value: value.value.value,
          };
        case "I8":
        case "I16":
        case "I32":
        case "U8":
        case "U16":
        case "U32":
        case "Bucket":
        case "Proof":
        case "AddressReservation":
          return {
            kind: ValueKind[value.kind],
            value: Convert.String.toNumber(value.value.value),
          };
        case "I64":
        case "I128":
        case "U64":
        case "U128":
          return {
            kind: ValueKind[value.kind],
            value: Convert.String.toBigInt(value.value.value),
          };
        case "Blob":
          return {
            kind: ValueKind[value.kind],
            value: Convert.HexString.toUint8Array(value.value.value),
          };
        case "String":
        case "NonFungibleLocalId":
          return {
            kind: ValueKind[value.kind],
            value: value.value.value,
          };
        case "Decimal":
        case "PreciseDecimal":
          return {
            kind: ValueKind[value.kind],
            value: Convert.String.toDecimal(value.value.value),
          };
        case "Enum":
          return {
            kind: ValueKind.Enum,
            discriminator: Convert.String.toNumber(value.value.discriminator),
            fields: value.value.fields.map(
              GeneratedConverter.ManifestValue.fromGenerated
            ),
          };
        case "Array":
          return {
            kind: ValueKind.Array,
            elementValueKind: ValueKind[value.value.element_value_kind],
            elements: value.value.elements.map(
              GeneratedConverter.ManifestValue.fromGenerated
            ),
          };
        case "Tuple":
          return {
            kind: ValueKind.Tuple,
            fields: value.value.fields.map(
              GeneratedConverter.ManifestValue.fromGenerated
            ),
          };
        case "Map":
          return {
            kind: ValueKind.Map,
            keyValueKind: ValueKind[value.value.key_value_kind],
            valueValueKind: ValueKind[value.value.value_value_kind],
            entries: value.value.entries.map((entry) => {
              return {
                key: GeneratedConverter.ManifestValue.fromGenerated(entry.key),
                value: GeneratedConverter.ManifestValue.fromGenerated(
                  entry.value
                ),
              };
            }),
          };
        case "Address":
          return {
            kind: ValueKind.Address,
            value: GeneratedConverter.ManifestAddress.fromGenerated(
              value.value.value
            ),
          };
        case "Expression":
          return {
            kind: ValueKind.Expression,
            value: GeneratedConverter.Expression.fromGenerated(
              value.value.value
            ),
          };
      }
    }
  };

  static Instruction = class {
    static toGenerated(value: Instruction): SerializableInstruction {
      switch (value.kind) {
        case "TakeAllFromWorktop":
          return {
            kind: value.kind,
            value: {
              resource_address: value.resourceAddress,
            },
          };
        case "TakeFromWorktop":
          return {
            kind: value.kind,
            value: {
              resource_address: value.resourceAddress,
              amount: Convert.Decimal.toString(value.amount),
            },
          };
        case "TakeNonFungiblesFromWorktop":
          return {
            kind: value.kind,
            value: {
              resource_address: value.resourceAddress,
              ids: value.ids,
            },
          };
        case "ReturnToWorktop":
          return {
            kind: value.kind,
            value: {
              bucket_id: Convert.Number.toString(value.bucketId),
            },
          };
        case "AssertWorktopContainsAny":
          return {
            kind: value.kind,
            value: {
              resource_address: value.resourceAddress,
            },
          };
        case "AssertWorktopContains":
          return {
            kind: value.kind,
            value: {
              resource_address: value.resourceAddress,
              amount: Convert.Decimal.toString(value.amount),
            },
          };
        case "AssertWorktopContainsNonFungibles":
          return {
            kind: value.kind,
            value: {
              resource_address: value.resourceAddress,
              ids: value.ids,
            },
          };
        case "PopFromAuthZone":
          return {
            kind: value.kind,
          };
        case "PushToAuthZone":
          return {
            kind: value.kind,
            value: {
              proof_id: Convert.Number.toString(value.proofId),
            },
          };
        case "DropNamedProofs":
        case "DropAuthZoneProofs":
        case "DropAuthZoneRegularProofs":
        case "DropAuthZoneSignatureProofs":
          return {
            kind: value.kind,
          };
        case "CreateProofFromAuthZoneOfAmount":
          return {
            kind: value.kind,
            value: {
              resource_address: value.resourceAddress,
              amount: Convert.Decimal.toString(value.amount),
            },
          };
        case "CreateProofFromAuthZoneOfNonFungibles":
          return {
            kind: value.kind,
            value: {
              resource_address: value.resourceAddress,
              ids: value.ids,
            },
          };
        case "CreateProofFromAuthZoneOfAll":
          return {
            kind: value.kind,
            value: {
              resource_address: value.resourceAddress,
            },
          };

        case "CreateProofFromBucketOfAmount":
          return {
            kind: value.kind,
            value: {
              bucket_id: Convert.Number.toString(value.bucketId),
              amount: Convert.Decimal.toString(value.amount),
            },
          };
        case "CreateProofFromBucketOfNonFungibles":
          return {
            kind: value.kind,
            value: {
              bucket_id: Convert.Number.toString(value.bucketId),
              ids: value.ids,
            },
          };
        case "CreateProofFromBucketOfAll":
          return {
            kind: value.kind,
            value: {
              bucket_id: Convert.Number.toString(value.bucketId),
            },
          };
        case "BurnResource":
          return {
            kind: value.kind,
            value: {
              bucket_id: Convert.Number.toString(value.bucketId),
            },
          };
        case "CloneProof":
          return {
            kind: value.kind,
            value: {
              proof_id: Convert.Number.toString(value.proofId),
            },
          };
        case "DropProof":
          return {
            kind: value.kind,
            value: {
              proof_id: Convert.Number.toString(value.proofId),
            },
          };
        case "CallFunction":
          return {
            kind: value.kind,
            value: {
              package_address: GeneratedConverter.ManifestAddress.toGenerated(
                value.packageAddress
              ),
              blueprint_name: value.blueprintName,
              function_name: value.functionName,
              args: GeneratedConverter.ManifestValue.toGenerated(value.args),
            },
          };
        case "CallMethod":
        case "CallRoyaltyMethod":
        case "CallMetadataMethod":
        case "CallRoleAssignmentMethod":
          return {
            kind: value.kind,
            value: {
              address: GeneratedConverter.ManifestAddress.toGenerated(
                value.address
              ),
              method_name: value.methodName,
              args: GeneratedConverter.ManifestValue.toGenerated(value.args),
            },
          };
        case "CallDirectVaultMethod":
          return {
            kind: value.kind,
            value: {
              address: value.address,
              method_name: value.methodName,
              args: GeneratedConverter.ManifestValue.toGenerated(value.args),
            },
          };
        case "DropAllProofs":
          return {
            kind: value.kind,
          };
        case "AllocateGlobalAddress":
          return {
            kind: value.kind,
            value: {
              package_address: value.packageAddress,
              blueprint_name: value.blueprintName,
            },
          };
      }
    }

    static fromGenerated(value: SerializableInstruction): Instruction {
      switch (value.kind) {
        case "TakeAllFromWorktop":
          return {
            kind: value.kind,
            resourceAddress: value.value.resource_address,
          };
        case "TakeFromWorktop":
          return {
            kind: value.kind,
            resourceAddress: value.value.resource_address,
            amount: Convert.String.toDecimal(value.value.amount),
          };
        case "TakeNonFungiblesFromWorktop":
          return {
            kind: value.kind,
            resourceAddress: value.value.resource_address,
            ids: value.value.ids,
          };
        case "ReturnToWorktop":
          return {
            kind: value.kind,
            bucketId: Convert.String.toNumber(value.value.bucket_id),
          };
        case "AssertWorktopContainsAny":
          return {
            kind: value.kind,
            resourceAddress: value.value.resource_address,
          };
        case "AssertWorktopContains":
          return {
            kind: value.kind,
            resourceAddress: value.value.resource_address,
            amount: Convert.String.toDecimal(value.value.amount),
          };
        case "AssertWorktopContainsNonFungibles":
          return {
            kind: value.kind,
            resourceAddress: value.value.resource_address,
            ids: value.value.ids,
          };
        case "PopFromAuthZone":
          return {
            kind: value.kind,
          };
        case "PushToAuthZone":
          return {
            kind: value.kind,
            proofId: Convert.String.toNumber(value.value.proof_id),
          };
        case "DropNamedProofs":
        case "DropAuthZoneProofs":
        case "DropAuthZoneRegularProofs":
        case "DropAuthZoneSignatureProofs":
          return {
            kind: value.kind,
          };
        case "CreateProofFromAuthZoneOfAmount":
          return {
            kind: value.kind,
            resourceAddress: value.value.resource_address,
            amount: Convert.String.toDecimal(value.value.amount),
          };
        case "CreateProofFromAuthZoneOfNonFungibles":
          return {
            kind: value.kind,
            resourceAddress: value.value.resource_address,
            ids: value.value.ids,
          };
        case "CreateProofFromAuthZoneOfAll":
          return {
            kind: value.kind,
            resourceAddress: value.value.resource_address,
          };
        case "CreateProofFromBucketOfAmount":
          return {
            kind: value.kind,
            bucketId: Convert.String.toNumber(value.value.bucket_id),
            amount: Convert.String.toDecimal(value.value.amount),
          };
        case "CreateProofFromBucketOfNonFungibles":
          return {
            kind: value.kind,
            bucketId: Convert.String.toNumber(value.value.bucket_id),
            ids: value.value.ids,
          };
        case "CreateProofFromBucketOfAll":
          return {
            kind: value.kind,
            bucketId: Convert.String.toNumber(value.value.bucket_id),
          };
        case "BurnResource":
          return {
            kind: value.kind,
            bucketId: Convert.String.toNumber(value.value.bucket_id),
          };
        case "CloneProof":
          return {
            kind: value.kind,
            proofId: Convert.String.toNumber(value.value.proof_id),
          };
        case "DropProof":
          return {
            kind: value.kind,
            proofId: Convert.String.toNumber(value.value.proof_id),
          };
        case "CallFunction":
          return {
            kind: value.kind,
            packageAddress: GeneratedConverter.ManifestAddress.fromGenerated(
              value.value.package_address
            ),
            blueprintName: value.value.blueprint_name,
            functionName: value.value.function_name,
            args: GeneratedConverter.ManifestValue.fromGenerated(
              value.value.args
            ),
          };
        case "CallMethod":
        case "CallRoyaltyMethod":
        case "CallMetadataMethod":
        case "CallRoleAssignmentMethod":
          return {
            kind: value.kind,
            address: GeneratedConverter.ManifestAddress.fromGenerated(
              value.value.address
            ),
            methodName: value.value.method_name,
            args: GeneratedConverter.ManifestValue.fromGenerated(
              value.value.args
            ),
          };
        case "CallDirectVaultMethod":
          return {
            kind: value.kind,
            address: value.value.address,
            methodName: value.value.method_name,
            args: GeneratedConverter.ManifestValue.fromGenerated(
              value.value.args
            ),
          };
        case "DropAllProofs":
          return {
            kind: value.kind,
          };
        case "AllocateGlobalAddress":
          return {
            kind: value.kind,
            packageAddress: value.value.package_address,
            blueprintName: value.value.blueprint_name,
          };
      }
    }
  };

  static Instructions = class {
    static toGenerated(value: Instructions): SerializableInstructions {
      switch (value.kind) {
        case "String":
          return value;
        case "Parsed":
          return {
            kind: "Parsed",
            value: value.value.map(GeneratedConverter.Instruction.toGenerated),
          };
      }
    }

    static fromGenerated(value: SerializableInstructions): Instructions {
      switch (value.kind) {
        case "String":
          return value;
        case "Parsed":
          return {
            kind: "Parsed",
            value: value.value.map(
              GeneratedConverter.Instruction.fromGenerated
            ),
          };
      }
    }
  };

  static TransactionManifest = class {
    static toGenerated(
      value: TransactionManifest
    ): SerializableTransactionManifest {
      return {
        instructions: GeneratedConverter.Instructions.toGenerated(
          value.instructions
        ),
        blobs: value.blobs.map(Convert.Uint8Array.toString),
      };
    }

    static fromGenerated(
      value: SerializableTransactionManifest
    ): TransactionManifest {
      return {
        instructions: GeneratedConverter.Instructions.fromGenerated(
          value.instructions
        ),
        blobs: value.blobs.map(Convert.HexString.toUint8Array),
      };
    }
  };

  static TransactionHeader = class {
    static toGenerated(
      value: TransactionHeader
    ): SerializableTransactionHeader {
      return {
        network_id: Convert.Number.toString(value.networkId),
        start_epoch_inclusive: Convert.Number.toString(
          value.startEpochInclusive
        ),
        end_epoch_exclusive: Convert.Number.toString(value.endEpochExclusive),
        nonce: Convert.Number.toString(value.nonce),
        notary_is_signatory: value.notaryIsSignatory,
        notary_public_key: GeneratedConverter.PublicKey.toGenerated(
          value.notaryPublicKey
        ),
        tip_percentage: Convert.Number.toString(value.tipPercentage),
      };
    }

    static fromGenerated(
      value: SerializableTransactionHeader
    ): TransactionHeader {
      return {
        networkId: Convert.String.toNumber(value.network_id),
        startEpochInclusive: Convert.String.toNumber(
          value.start_epoch_inclusive
        ),
        endEpochExclusive: Convert.String.toNumber(value.end_epoch_exclusive),
        nonce: Convert.String.toNumber(value.nonce),
        notaryPublicKey: GeneratedConverter.PublicKey.fromGenerated(
          value.notary_public_key
        ),
        notaryIsSignatory: value.notary_is_signatory,
        tipPercentage: Convert.String.toNumber(value.tip_percentage),
      };
    }
  };

  static Intent = class {
    static toGenerated(value: Intent): SerializableIntent {
      return {
        header: GeneratedConverter.TransactionHeader.toGenerated(value.header),
        manifest: GeneratedConverter.TransactionManifest.toGenerated(
          value.manifest
        ),
        message: {
          kind: "None",
        },
      };
    }

    static fromGenerated(value: SerializableIntent): Intent {
      return {
        manifest: GeneratedConverter.TransactionManifest.fromGenerated(
          value.manifest
        ),
        header: GeneratedConverter.TransactionHeader.fromGenerated(
          value.header
        ),
      };
    }
  };

  static SignedIntent = class {
    static toGenerated(value: SignedIntent): SerializableSignedIntent {
      return {
        intent: GeneratedConverter.Intent.toGenerated(value.intent),
        intent_signatures: value.intentSignatures.map(
          GeneratedConverter.SignatureWithPublicKey.toGenerated
        ),
      };
    }

    static fromGenerated(value: SerializableSignedIntent): SignedIntent {
      return {
        intent: GeneratedConverter.Intent.fromGenerated(value.intent),
        intentSignatures: value.intent_signatures.map(
          GeneratedConverter.SignatureWithPublicKey.fromGenerated
        ),
      };
    }
  };

  static NotarizedTransaction = class {
    static toGenerated(
      value: NotarizedTransaction
    ): SerializableNotarizedTransaction {
      return {
        signed_intent: GeneratedConverter.SignedIntent.toGenerated(
          value.signedIntent
        ),
        notary_signature: GeneratedConverter.Signature.toGenerated(
          value.notarySignature
        ),
      };
    }

    static fromGenerated(
      value: SerializableNotarizedTransaction
    ): NotarizedTransaction {
      return {
        signedIntent: GeneratedConverter.SignedIntent.fromGenerated(
          value.signed_intent
        ),
        notarySignature: GeneratedConverter.Signature.fromGenerated(
          value.notary_signature
        ),
      };
    }
  };

  static EntityType = class {
    static toGenerated(value: EntityType): SerializableEntityType {
      return SerializableEntityType[EntityType[value]];
    }

    static fromGenerated(value: SerializableEntityType): EntityType {
      return EntityType[SerializableEntityType[value]];
    }
  };

  static MessageValidationConfig = class {
    static toGenerated(
      value: MessageValidationConfig
    ): SerializableMessageValidationConfig {
      return {
        max_plaintext_message_length: Convert.BigInt.toString(
          value.maxPlaintextMessageLength
        ),
        max_encrypted_message_length: Convert.BigInt.toString(
          value.maxEncryptedMessageLength
        ),
        max_mime_type_length: Convert.BigInt.toString(value.maxMimeTypeLength),
        max_decryptors: Convert.BigInt.toString(value.maxDecryptors),
      };
    }

    static fromGenerated(
      value: SerializableMessageValidationConfig
    ): MessageValidationConfig {
      return {
        maxPlaintextMessageLength: Convert.String.toBigInt(
          value.max_plaintext_message_length
        ),
        maxEncryptedMessageLength: Convert.String.toBigInt(
          value.max_encrypted_message_length
        ),
        maxMimeTypeLength: Convert.String.toBigInt(value.max_mime_type_length),
        maxDecryptors: Convert.String.toBigInt(value.max_decryptors),
      };
    }
  };

  static FeeSummary = class {
    static toGenerated(value: FeeSummary): SerializableFeeSummary {
      return {
        execution_cost: Convert.Decimal.toString(value.executionCost),
        finalization_cost: Convert.Decimal.toString(value.finalizationCost),
        storage_expansion_cost: Convert.Decimal.toString(
          value.storageExpansionCost
        ),
        royalty_cost: Convert.Decimal.toString(value.royaltyCost),
      };
    }

    static fromGenerated(value: SerializableFeeSummary): FeeSummary {
      return {
        executionCost: Convert.String.toDecimal(value.execution_cost),
        finalizationCost: Convert.String.toDecimal(value.finalization_cost),
        storageExpansionCost: Convert.String.toDecimal(
          value.storage_expansion_cost
        ),
        royaltyCost: Convert.String.toDecimal(value.royalty_cost),
      };
    }
  };

  static FeeLocks = class {
    static toGenerated(value: FeeLocks): SerializableFeeLocks {
      return {
        lock: Convert.Decimal.toString(value.lock),
        contingent_lock: Convert.Decimal.toString(value.contingentLock),
      };
    }

    static fromGenerated(value: SerializableFeeLocks): FeeLocks {
      return {
        lock: Convert.String.toDecimal(value.lock),
        contingentLock: Convert.String.toDecimal(value.contingent_lock),
      };
    }
  };

  static DecimalSource = class {
    static toGenerated(
      value: DecimalSource
    ): SerializableSource<SerializableDecimal> {
      switch (value.kind) {
        case "Guaranteed":
          return {
            kind: value.kind,
            value: {
              value: Convert.Decimal.toString(value.value),
            },
          };
        case "Predicted":
          return {
            kind: value.kind,
            value: {
              value: Convert.Decimal.toString(value.value),
              instruction_index: Convert.Number.toString(
                value.instructionIndex
              ),
            },
          };
      }
    }

    static fromGenerated(
      value: SerializableSource<SerializableDecimal>
    ): DecimalSource {
      switch (value.kind) {
        case "Guaranteed":
          return {
            kind: value.kind,
            value: Convert.String.toDecimal(value.value.value),
          };
        case "Predicted":
          return {
            kind: value.kind,
            value: Convert.String.toDecimal(value.value.value),
            instructionIndex: Convert.String.toNumber(
              value.value.instruction_index
            ),
          };
      }
    }
  };

  static NonFungibleLocalIdArraySource = class {
    static toGenerated(
      value: NonFungibleLocalIdArraySource
    ): SerializableSource<SerializableNonFungibleLocalId[]> {
      switch (value.kind) {
        case "Guaranteed":
          return {
            kind: value.kind,
            value: {
              value: value.value,
            },
          };
        case "Predicted":
          return {
            kind: value.kind,
            value: {
              value: value.value,
              instruction_index: Convert.Number.toString(
                value.instructionIndex
              ),
            },
          };
      }
    }

    static fromGenerated(
      value: SerializableSource<SerializableNonFungibleLocalId[]>
    ): NonFungibleLocalIdArraySource {
      switch (value.kind) {
        case "Guaranteed":
          return {
            kind: value.kind,
            value: value.value.value,
          };
        case "Predicted":
          return {
            kind: value.kind,
            value: value.value.value,
            instructionIndex: Convert.String.toNumber(
              value.value.instruction_index
            ),
          };
      }
    }
  };

  static ResourceTracker = class {
    static toGenerated(value: ResourceTracker): SerializableResourceTracker {
      switch (value.kind) {
        case "Fungible":
          return {
            kind: value.kind,
            value: {
              resource_address: value.resourceAddress,
              amount: GeneratedConverter.DecimalSource.toGenerated(
                value.amount
              ),
            },
          };
        case "NonFungible":
          return {
            kind: value.kind,
            value: {
              resource_address: value.resourceAddress,
              amount: GeneratedConverter.DecimalSource.toGenerated(
                value.amount
              ),
              ids: GeneratedConverter.NonFungibleLocalIdArraySource.toGenerated(
                value.ids
              ),
            },
          };
      }
    }

    static fromGenerated(value: SerializableResourceTracker): ResourceTracker {
      switch (value.kind) {
        case "Fungible":
          return {
            kind: value.kind,
            resourceAddress: value.value.resource_address,
            amount: GeneratedConverter.DecimalSource.fromGenerated(
              value.value.amount
            ),
          };
        case "NonFungible":
          return {
            kind: value.kind,
            resourceAddress: value.value.resource_address,
            amount: GeneratedConverter.DecimalSource.fromGenerated(
              value.value.amount
            ),
            ids: GeneratedConverter.NonFungibleLocalIdArraySource.fromGenerated(
              value.value.ids
            ),
          };
      }
    }
  };

  static ResourceOrNonFungible = class {
    static toGenerated(
      value: ResourceOrNonFungible
    ): SerializableResourceOrNonFungible {
      switch (value.kind) {
        case "Resource":
          return {
            kind: value.kind,
            value: value.resourceAddress,
          };
        case "NonFungible":
          return {
            kind: value.kind,
            value: value.nonFungibleGlobalId,
          };
      }
    }

    static fromGenerated(
      value: SerializableResourceOrNonFungible
    ): ResourceOrNonFungible {
      switch (value.kind) {
        case "Resource":
          return {
            kind: value.kind,
            resourceAddress: value.value,
          };
        case "NonFungible":
          return {
            kind: value.kind,
            nonFungibleGlobalId: value.value,
          };
      }
    }
  };

  static AuthorizedDepositorsChanges = class {
    static toGenerated(
      value: AuthorizedDepositorsChanges
    ): SerializableAuthorizedDepositorsChanges {
      return {
        added: value.added.map(
          GeneratedConverter.ResourceOrNonFungible.toGenerated
        ),
        removed: value.removed.map(
          GeneratedConverter.ResourceOrNonFungible.toGenerated
        ),
      };
    }

    static fromGenerated(
      value: SerializableAuthorizedDepositorsChanges
    ): AuthorizedDepositorsChanges {
      return {
        added: value.added.map(
          GeneratedConverter.ResourceOrNonFungible.fromGenerated
        ),
        removed: value.removed.map(
          GeneratedConverter.ResourceOrNonFungible.fromGenerated
        ),
      };
    }
  };

  static DefaultDepositRule = class {
    static toGenerated(
      value: DefaultDepositRule
    ): SerializableDefaultDepositRule {
      return SerializableDefaultDepositRule[DefaultDepositRule[value]];
    }

    static fromGenerated(
      value: SerializableDefaultDepositRule
    ): DefaultDepositRule {
      return DefaultDepositRule[SerializableDefaultDepositRule[value]];
    }
  };

  static ResourcePreference = class {
    static toGenerated(
      value: ResourcePreference
    ): SerializableResourcePreference {
      return SerializableResourcePreference[ResourcePreference[value]];
    }

    static fromGenerated(
      value: SerializableResourcePreference
    ): ResourcePreference {
      return ResourcePreference[SerializableResourcePreference[value]];
    }
  };

  static Resources = class {
    static toGenerated(value: Resources): SerializableResources {
      switch (value.kind) {
        case "Amount":
          return {
            kind: value.kind,
            value: Convert.Decimal.toString(value.amount),
          };
        case "Ids":
          return {
            kind: value.kind,
            value: value.nonFungibleLocalId,
          };
      }
    }

    static fromGenerated(value: SerializableResources): Resources {
      switch (value.kind) {
        case "Amount":
          return {
            kind: value.kind,
            amount: Convert.String.toDecimal(value.value),
          };
        case "Ids":
          return {
            kind: value.kind,
            nonFungibleLocalId: value.value,
          };
      }
    }
  };

  static ResourceSpecifier = class {
    static toGenerated(
      value: ResourceSpecifier
    ): SerializableResourceSpecifier {
      switch (value.kind) {
        case "Amount":
          return {
            kind: value.kind,
            value: {
              resource_address: value.resourceAddress,
              amount: Convert.Decimal.toString(value.amount),
            },
          };
        case "Ids":
          return {
            kind: value.kind,
            value: {
              resource_address: value.resourceAddress,
              ids: value.ids,
            },
          };
      }
    }

    static fromGenerated(
      value: SerializableResourceSpecifier
    ): ResourceSpecifier {
      switch (value.kind) {
        case "Amount":
          return {
            kind: value.kind,
            resourceAddress: value.value.resource_address,
            amount: Convert.String.toDecimal(value.value.amount),
          };
        case "Ids":
          return {
            kind: value.kind,
            resourceAddress: value.value.resource_address,
            ids: value.value.ids,
          };
      }
    }
  };

  static ResourcePreferenceAction = class {
    static toGenerated(
      value: ResourcePreferenceAction
    ): SerializableResourcePreferenceAction {
      switch (value.kind) {
        case "Set":
          return {
            kind: value.kind,
            value: GeneratedConverter.ResourcePreference.toGenerated(
              value.value
            ),
          };
        case "Remove":
          return {
            kind: value.kind,
          };
      }
    }

    static fromGenerated(
      value: SerializableResourcePreferenceAction
    ): ResourcePreferenceAction {
      switch (value.kind) {
        case "Set":
          return {
            kind: value.kind,
            value: GeneratedConverter.ResourcePreference.fromGenerated(
              value.value
            ),
          };
        case "Remove":
          return {
            kind: value.kind,
          };
      }
    }
  };

  static TransactionType = class {
    static toGenerated(value: TransactionType): SerializableTransactionType {
      switch (value.kind) {
        case "SimpleTransfer":
          return {
            kind: value.kind,
            value: {
              from: value.from,
              to: value.to,
              transferred: GeneratedConverter.ResourceSpecifier.toGenerated(
                value.transferred
              ),
            },
          };
        case "Transfer":
          return {
            kind: value.kind,
            value: {
              from: value.from,
              transfers: recordMap(value.transfers, (key, value) => [
                key,
                recordMap(value, (key, value) => [
                  key,
                  GeneratedConverter.Resources.toGenerated(value),
                ]),
              ]),
            },
          };
        case "AccountDepositSettings":
          return {
            kind: value.kind,
            value: {
              resource_preference_changes: recordMap(
                value.resourcePreferenceChanges,
                (key, value) => [
                  key,
                  recordMap(value, (key, value) => [
                    key,
                    GeneratedConverter.ResourcePreferenceAction.toGenerated(
                      value
                    ),
                  ]),
                ]
              ),
              default_deposit_rule_changes: recordMap(
                value.defaultDepositRuleChanges,
                (key, value) => [
                  key,
                  GeneratedConverter.DefaultDepositRule.toGenerated(value),
                ]
              ),
              authorized_depositors_changes: recordMap(
                value.authorizedDepositorsChanges,
                (key, value) => [
                  key,
                  GeneratedConverter.AuthorizedDepositorsChanges.toGenerated(
                    value
                  ),
                ]
              ),
            },
          };
        case "GeneralTransaction":
          return {
            kind: value.kind,
            value: {
              account_proofs: value.accountProofs,
              account_withdraws: recordMap(
                value.accountWithdraws,
                (key, value) => [
                  key,
                  value.map(GeneratedConverter.ResourceTracker.toGenerated),
                ]
              ),
              account_deposits: recordMap(
                value.accountDeposits,
                (key, value) => [
                  key,
                  value.map(GeneratedConverter.ResourceTracker.toGenerated),
                ]
              ),
              addresses_in_manifest: {
                addresses: recordMap(
                  value.addressesInManifest,
                  (key, value) => [key, [...value]]
                ),
                named_addresses: [],
              },
              data_of_newly_minted_non_fungibles: recordMap(
                value.dataOfNewlyMintedNonFungibles,
                (key, value) => [
                  key,
                  recordMap(value, (key, value) => [
                    key,
                    Convert.Uint8Array.toHexString(value),
                  ]),
                ]
              ),
              metadata_of_newly_created_entities: {},
            },
          };
      }
    }

    static fromGenerated(value: SerializableTransactionType): TransactionType {
      switch (value.kind) {
        case "SimpleTransfer":
          return {
            kind: value.kind,
            from: value.value.from,
            to: value.value.to,
            transferred: GeneratedConverter.ResourceSpecifier.fromGenerated(
              value.value.transferred
            ),
          };
        case "Transfer":
          return {
            kind: value.kind,
            from: value.value.from,
            transfers: recordMap(value.value.transfers, (key, value) => [
              key,
              recordMap(value, (key, value) => [
                key,
                GeneratedConverter.Resources.fromGenerated(value),
              ]),
            ]),
          };
        case "AccountDepositSettings":
          return {
            kind: value.kind,
            resourcePreferenceChanges: recordMap(
              value.value.resource_preference_changes,
              (key, value) => [
                key,
                recordMap(value, (key, value) => [
                  key,
                  GeneratedConverter.ResourcePreferenceAction.fromGenerated(
                    value
                  ),
                ]),
              ]
            ),
            defaultDepositRuleChanges: recordMap(
              value.value.default_deposit_rule_changes,
              (key, value) => [
                key,
                GeneratedConverter.DefaultDepositRule.fromGenerated(value),
              ]
            ),
            authorizedDepositorsChanges: recordMap(
              value.value.authorized_depositors_changes,
              (key, value) => [
                key,
                GeneratedConverter.AuthorizedDepositorsChanges.fromGenerated(
                  value
                ),
              ]
            ),
          };
        case "GeneralTransaction":
          return {
            kind: value.kind,
            accountProofs: value.value.account_proofs,
            accountWithdraws: recordMap(
              value.value.account_withdraws,
              (key, value) => [
                key,
                value.map(GeneratedConverter.ResourceTracker.fromGenerated),
              ]
            ),
            accountDeposits: recordMap(
              value.value.account_deposits,
              (key, value) => [
                key,
                value.map(GeneratedConverter.ResourceTracker.fromGenerated),
              ]
            ),
            addressesInManifest: recordMap(
              value.value.addresses_in_manifest.addresses,
              (key, value) => [key, new Set(value)]
            ),
            dataOfNewlyMintedNonFungibles: recordMap(
              value.value.data_of_newly_minted_non_fungibles,
              (key, value) => [
                key,
                recordMap(value, (key, value) => [
                  key,
                  Convert.HexString.toUint8Array(value),
                ]),
              ]
            ),
          };
      }
    }
  };

  static ExecutionAnalysis = class {
    static toGenerated(value: ExecutionAnalysis): ExecutionAnalyzeOutput {
      return {
        fee_locks: GeneratedConverter.FeeLocks.toGenerated(value.feeLocks),
        fee_summary: GeneratedConverter.FeeSummary.toGenerated(
          value.feeSummary
        ),
        transaction_types: value.transactionTypes.map(
          GeneratedConverter.TransactionType.toGenerated
        ),
        reserved_instructions: value.reservedInstructions.map(
          (instruction) =>
            SerializableReservedInstruction[ReservedInstruction[instruction]]
        ),
      };
    }

    static fromGenerated(value: ExecutionAnalyzeOutput): ExecutionAnalysis {
      return {
        feeLocks: GeneratedConverter.FeeLocks.fromGenerated(value.fee_locks),
        feeSummary: GeneratedConverter.FeeSummary.fromGenerated(
          value.fee_summary
        ),
        transactionTypes: value.transaction_types.map(
          GeneratedConverter.TransactionType.fromGenerated
        ),
        reservedInstructions: value.reserved_instructions.map(
          (instruction) =>
            ReservedInstruction[SerializableReservedInstruction[instruction]]
        ),
      };
    }
  };

  static ValidationConfig = class {
    static toGenerated(value: ValidationConfig): SerializableValidationConfig {
      return {
        network_id: Convert.Number.toString(value.networkId),
        max_notarized_payload_size: Convert.BigInt.toString(
          value.maxNotarizedPayloadSize
        ),
        min_tip_percentage: Convert.Number.toString(value.minTipPercentage),
        max_tip_percentage: Convert.Number.toString(value.maxTipPercentage),
        max_epoch_range: Convert.BigInt.toString(value.maxEpochRange),
        message_validation:
          GeneratedConverter.MessageValidationConfig.toGenerated(
            value.messageValidation
          ),
      };
    }

    static fromGenerated(
      value: SerializableValidationConfig
    ): ValidationConfig {
      return {
        networkId: Convert.String.toNumber(value.network_id),
        maxNotarizedPayloadSize: Convert.String.toBigInt(
          value.max_notarized_payload_size
        ),
        minTipPercentage: Convert.String.toNumber(value.min_tip_percentage),
        maxTipPercentage: Convert.String.toNumber(value.max_tip_percentage),
        maxEpochRange: Convert.String.toBigInt(value.max_epoch_range),
        messageValidation:
          GeneratedConverter.MessageValidationConfig.fromGenerated(
            value.message_validation
          ),
      };
    }
  };
}

const recordMap = <
  K1 extends string | number | symbol,
  K2 extends string | number | symbol,
  V1,
  V2
>(
  record: Record<K1, V1>,
  callback: (key: K1, value: V1) => [K2, V2]
): Record<K2, V2> => {
  // @ts-ignore
  let newRecord: Record<K2, V2> = {};

  for (const key in record) {
    const value = record[key];
    const [newKey, newValue] = callback(key, value);
    newRecord[newKey] = newValue;
  }

  return newRecord;
};
