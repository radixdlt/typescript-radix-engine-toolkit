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

import { EntityAddress, TransactionManifest } from "../../models";
import { numberToString, serialize, stringToNumber } from "../../utils";

export class AnalyzeManifestRequest {
  private _networkId: string;
  private _transactionManifest: TransactionManifest;

  public get networkId(): number {
    return stringToNumber(this._networkId);
  }
  public set networkId(value: number) {
    this._networkId = numberToString(value);
  }

  public get transactionManifest(): TransactionManifest {
    return this._transactionManifest;
  }
  public set transactionManifest(value: TransactionManifest) {
    this._transactionManifest = value;
  }

  constructor(networkId: number, transactionManifest: TransactionManifest) {
    this._networkId = numberToString(networkId);
    this._transactionManifest = transactionManifest;
  }

  toString(): string {
    return serialize(this);
  }
}

export class AnalyzeManifestResponse {
  private _packageAddresses: Array<EntityAddress.PackageAddress>;
  private _componentAddresses: Array<EntityAddress.ComponentAddress>;
  private _resourceAddresses: Array<EntityAddress.ResourceAddress>;
  private _accountAddresses: Array<EntityAddress.ComponentAddress>;
  private _accountsRequiringAuth: Array<EntityAddress.ComponentAddress>;
  private _accountsWithdrawnFrom: Array<EntityAddress.ComponentAddress>;
  private _accountsDepositedInto: Array<EntityAddress.ComponentAddress>;

  get packageAddresses(): Array<EntityAddress.PackageAddress> {
    return this._packageAddresses;
  }
  set packageAddresses(value: Array<EntityAddress.PackageAddress>) {
    this._packageAddresses = value;
  }

  get componentAddresses(): Array<EntityAddress.ComponentAddress> {
    return this._componentAddresses;
  }
  set componentAddresses(value: Array<EntityAddress.ComponentAddress>) {
    this._componentAddresses = value;
  }

  get resourceAddresses(): Array<EntityAddress.ResourceAddress> {
    return this._resourceAddresses;
  }
  set resourceAddresses(value: Array<EntityAddress.ResourceAddress>) {
    this._resourceAddresses = value;
  }

  get accountAddresses(): Array<EntityAddress.ComponentAddress> {
    return this._accountAddresses;
  }
  set accountAddresses(value: Array<EntityAddress.ComponentAddress>) {
    this._accountAddresses = value;
  }

  get accountsRequiringAuth(): Array<EntityAddress.ComponentAddress> {
    return this._accountsRequiringAuth;
  }
  set accountsRequiringAuth(value: Array<EntityAddress.ComponentAddress>) {
    this._accountsRequiringAuth = value;
  }

  get accountsWithdrawnFrom(): Array<EntityAddress.ComponentAddress> {
    return this._accountsWithdrawnFrom;
  }
  set accountsWithdrawnFrom(value: Array<EntityAddress.ComponentAddress>) {
    this._accountsWithdrawnFrom = value;
  }

  get accountsDepositedInto(): Array<EntityAddress.ComponentAddress> {
    return this._accountsDepositedInto;
  }
  set accountsDepositedInto(value: Array<EntityAddress.ComponentAddress>) {
    this._accountsDepositedInto = value;
  }

  constructor(
    packageAddresses: Array<EntityAddress.PackageAddress>,
    componentAddresses: Array<EntityAddress.ComponentAddress>,
    resourceAddresses: Array<EntityAddress.ResourceAddress>,
    accountAddresses: Array<EntityAddress.ComponentAddress>,
    accountsRequiringAuth: Array<EntityAddress.ComponentAddress>,
    accountsWithdrawnFrom: Array<EntityAddress.ComponentAddress>,
    accountsDepositedInto: Array<EntityAddress.ComponentAddress>
  ) {
    this._packageAddresses = packageAddresses;
    this._componentAddresses = componentAddresses;
    this._resourceAddresses = resourceAddresses;
    this._accountAddresses = accountAddresses;
    this._accountsRequiringAuth = accountsRequiringAuth;
    this._accountsWithdrawnFrom = accountsWithdrawnFrom;
    this._accountsDepositedInto = accountsDepositedInto;
  }

  toString(): string {
    return serialize(this);
  }
}
