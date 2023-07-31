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
  Convert,
  Expression,
  ManifestAddress,
  OlympiaNetwork,
  PublicKey,
  Value,
  ValueKind,
} from "../index";
import {
  SerializableExpression,
  SerializableManifestAddress,
  SerializableManifestValue,
  SerializableManifestValueKind,
  SerializableOlympiaNetwork,
  SerializablePublicKey,
} from "./generated";

/**
 * A class that provides functionality for converting the generated models to their hand-written
 * counterparts.
 */
export class GeneratedConverter {
  static PublicKey = class {
    static toGenerated(value: PublicKey): SerializablePublicKey {
      return {
        kind: value.kind,
        value: Convert.Uint8Array.toHexString(value.value),
      };
    }

    static fromGenerated(value: SerializablePublicKey): PublicKey {
      return {
        kind: value.kind,
        value: Convert.HexString.toUint8Array(value.value),
      };
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
            kind: "Named",
            value: Convert.Number.toString(value.value),
          };
        case "Static":
          return {
            kind: "Static",
            value: value.value,
          };
      }
    }

    static fromGenerated(value: SerializableManifestAddress): ManifestAddress {
      switch (value.kind) {
        case "Named":
          return {
            kind: "Named",
            value: Convert.String.toNumber(value.value),
          };
        case "Static":
          return {
            kind: "Static",
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
            kind: "Bool",
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
            kind: "Enum",
            value: {
              discriminator: Convert.Number.toString(value.discriminator),
              fields: value.fields.map(
                GeneratedConverter.ManifestValue.toGenerated
              ),
            },
          };
        case ValueKind.Array:
          return {
            kind: "Array",
            value: {
              element_value_kind:
                SerializableManifestValueKind[value.element_value_kind],
              elements: value.elements.map(
                GeneratedConverter.ManifestValue.toGenerated
              ),
            },
          };
        case ValueKind.Tuple:
          return {
            kind: "Tuple",
            value: {
              fields: value.fields.map(
                GeneratedConverter.ManifestValue.toGenerated
              ),
            },
          };
        case ValueKind.Map:
          return {
            kind: "Map",
            value: {
              key_value_kind:
                SerializableManifestValueKind[value.key_value_kind],
              value_value_kind:
                SerializableManifestValueKind[value.value_value_kind],
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
            kind: "Address",
            value: {
              value: GeneratedConverter.ManifestAddress.toGenerated(
                value.value
              ),
            },
          };
        case ValueKind.Expression:
          return {
            kind: "Expression",
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
            element_value_kind: ValueKind[value.value.element_value_kind],
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
            key_value_kind: ValueKind[value.value.key_value_kind],
            value_value_kind: ValueKind[value.value.value_value_kind],
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
}
