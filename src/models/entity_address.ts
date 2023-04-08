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

export type Any = ComponentAddress | ResourceAddress | PackageAddress;

export enum Kind {
  ComponentAddress = "ComponentAddress",
  ResourceAddress = "ResourceAddress",
  PackageAddress = "PackageAddress",
}

export class ComponentAddress {
  private _type: Kind = Kind.ComponentAddress;
  private _address: string;

  public get type(): Kind {
    return this._type;
  }

  public get address(): string {
    return this._address;
  }
  public set address(value: string) {
    this._address = value;
  }

  constructor(address: string) {
    this._address = address;
  }
}

export class ResourceAddress {
  private _type: Kind = Kind.ResourceAddress;
  private _address: string;

  public get type(): Kind {
    return this._type;
  }

  public get address(): string {
    return this._address;
  }
  public set address(value: string) {
    this._address = value;
  }

  constructor(address: string) {
    this._address = address;
  }
}

export class PackageAddress {
  private _type: Kind = Kind.PackageAddress;
  private _address: string;

  public get type(): Kind {
    return this._type;
  }

  public get address(): string {
    return this._address;
  }
  public set address(value: string) {
    this._address = value;
  }

  constructor(address: string) {
    this._address = address;
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
