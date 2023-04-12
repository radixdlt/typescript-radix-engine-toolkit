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
import { EntityAddress, TransactionManifest } from "../../models";
import * as Serializers from "../serializers";

export class AnalyzeManifestRequest {
  @Expose({ name: "network_id" })
  @Transform(Serializers.NumberAsString.serialize, { toPlainOnly: true })
  @Transform(Serializers.NumberAsString.deserialize, {
    toClassOnly: true,
  })
  networkId: number;

  @Expose({ name: "transaction_manifest" })
  @Type(() => TransactionManifest)
  transactionManifest: TransactionManifest;

  constructor(networkId: number, transactionManifest: TransactionManifest) {
    this.networkId = networkId;
    this.transactionManifest = transactionManifest;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class AnalyzeManifestResponse {
  packageAddresses: Array<EntityAddress.PackageAddress>;
  componentAddresses: Array<EntityAddress.ComponentAddress>;
  resourceAddresses: Array<EntityAddress.ResourceAddress>;
  accountAddresses: Array<EntityAddress.ComponentAddress>;
  accountsRequiringAuth: Array<EntityAddress.ComponentAddress>;
  accountsWithdrawnFrom: Array<EntityAddress.ComponentAddress>;
  accountsDepositedInto: Array<EntityAddress.ComponentAddress>;

  constructor(
    packageAddresses: Array<EntityAddress.PackageAddress>,
    componentAddresses: Array<EntityAddress.ComponentAddress>,
    resourceAddresses: Array<EntityAddress.ResourceAddress>,
    accountAddresses: Array<EntityAddress.ComponentAddress>,
    accountsRequiringAuth: Array<EntityAddress.ComponentAddress>,
    accountsWithdrawnFrom: Array<EntityAddress.ComponentAddress>,
    accountsDepositedInto: Array<EntityAddress.ComponentAddress>
  ) {
    this.packageAddresses = packageAddresses;
    this.componentAddresses = componentAddresses;
    this.resourceAddresses = resourceAddresses;
    this.accountAddresses = accountAddresses;
    this.accountsRequiringAuth = accountsRequiringAuth;
    this.accountsWithdrawnFrom = accountsWithdrawnFrom;
    this.accountsDepositedInto = accountsDepositedInto;
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}
