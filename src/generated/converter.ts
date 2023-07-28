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

import { Convert } from "../convert";
import { OlympiaNetwork, PublicKey } from "../models";
import { SerializableOlympiaNetwork, SerializablePublicKey } from "./generated";

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
}
