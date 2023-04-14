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

import { Expose, instanceToPlain, Transform, Type } from "class-transformer";
import { Convert } from "../..";
import * as Serializers from "../serializers";
import { Curve } from "./curve";

export class SignatureWithPublicKey {
  readonly curve: Curve;

  constructor(curve: Curve) {
    this.curve = curve;
  }
}

export class EcdsaSecp256k1 extends SignatureWithPublicKey {
  @Expose()
  @Type(() => Uint8Array)
  @Transform(Serializers.ByteArrayAsHexString.serialize, { toPlainOnly: true })
  @Transform(Serializers.ByteArrayAsHexString.deserialize, {
    toClassOnly: true,
  })
  signature: Uint8Array;

  constructor(signature: Uint8Array | string) {
    super(Curve.EcdsaSecp256k1);
    this.signature = Convert.Uint8Array.from(signature);
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}

export class EddsaEd25519 extends SignatureWithPublicKey {
  @Expose()
  @Type(() => Uint8Array)
  @Transform(Serializers.ByteArrayAsHexString.serialize, { toPlainOnly: true })
  @Transform(Serializers.ByteArrayAsHexString.deserialize, {
    toClassOnly: true,
  })
  signature: Uint8Array;

  @Expose({ name: "public_key" })
  @Type(() => Uint8Array)
  @Transform(Serializers.ByteArrayAsHexString.serialize, { toPlainOnly: true })
  @Transform(Serializers.ByteArrayAsHexString.deserialize, {
    toClassOnly: true,
  })
  publicKey: Uint8Array;

  constructor(signature: Uint8Array | string, publicKey: Uint8Array | string) {
    super(Curve.EddsaEd25519);
    this.signature = Convert.Uint8Array.from(signature);
    this.publicKey = Convert.Uint8Array.from(publicKey);
  }

  toString(): string {
    return JSON.stringify(this.serialize());
  }

  serialize(): Record<string, any> {
    return instanceToPlain(this);
  }
}
