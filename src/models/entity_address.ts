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

import { BaseAddress } from "../base";

export type Any = ComponentAddress | ResourceAddress | PackageAddress;

export enum Kind {
  ComponentAddress = "ComponentAddress",
  ResourceAddress = "ResourceAddress",
  PackageAddress = "PackageAddress",
}

export class ComponentAddress extends BaseAddress {
  private _type: Kind = Kind.ComponentAddress;

  public get type(): Kind {
    return this._type;
  }

  constructor(address: string) {
    super(address);
  }
}

export class ResourceAddress extends BaseAddress {
  private _type: Kind = Kind.ResourceAddress;

  public get type(): Kind {
    return this._type;
  }

  constructor(address: string) {
    super(address);
  }
}

export class PackageAddress extends BaseAddress {
  private _type: Kind = Kind.PackageAddress;

  public get type(): Kind {
    return this._type;
  }

  constructor(address: string) {
    super(address);
  }
}

export enum EntityType {
  FungibleResource = "FungibleResource",
  NonFungibleResource = "NonFungibleResource",
  Package = "Package",
  NormalComponent = "NormalComponent",
  AccountComponent = "AccountComponent",
  EcdsaSecp256k1VirtualAccountComponent = "EcdsaSecp256k1VirtualAccountComponent",
  EddsaEd25519VirtualAccountComponent = "EddsaEd25519VirtualAccountComponent",
  EpochManager = "EpochManager",
  Clock = "Clock",
  Validator = "Validator",
  IdentityComponent = "IdentityComponent",
  EcdsaSecp256k1VirtualIdentityComponent = "EcdsaSecp256k1VirtualIdentityComponent",
  EddsaEd25519VirtualIdentityComponent = "EddsaEd25519VirtualIdentityComponent",
  AccessControllerComponent = "AccessControllerComponent",
}
