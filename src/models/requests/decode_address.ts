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

import { Expose, Transform, Type, instanceToPlain } from "class-transformer";
import { Convert, EntityType } from "../../";
import * as Serializers from "../serializers";

export class DecodeAddressRequest {
  address: string;

  constructor(address: string) {
    this.address = address;
  }
}

export class DecodeAddressResponse {
  @Expose({ name: "network_id" })
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  networkId: number;

  @Expose({ name: "network_name" })
  networkName: string;

  @Expose({ name: "entity_type" })
  entityType: EntityType;

  @Expose()
  @Type(() => Uint8Array)
  @Transform(Serializers.ByteArrayAsHexString.serialize, { toPlainOnly: true })
  @Transform(Serializers.ByteArrayAsHexString.deserialize, {
    toClassOnly: true,
  })
  data: Uint8Array;

  @Expose()
  hrp: string;

  constructor(
    networkId: number,
    networkName: string,
    entityType: EntityType,
    data: Uint8Array | string,
    hrp: string
  ) {
    this.networkId = networkId;
    this.networkName = networkName;
    this.entityType = entityType;
    this.data = Convert.Uint8Array.from(data);
    this.hrp = hrp;
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}
