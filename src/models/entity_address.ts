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

import { EntityAddress } from ".";
import { IAddress } from "../base/base_address";
import {
  AddressBook,
  AddressInformation,
  RadixEngineToolkit,
} from "../wrapper/default";
import { PublicKey } from "./crypto";

export type Any = ComponentAddress | ResourceAddress | PackageAddress;

export enum Kind {
  ComponentAddress = "ComponentAddress",
  ResourceAddress = "ResourceAddress",
  PackageAddress = "PackageAddress",
}

export class ComponentAddress implements IAddress {
  readonly type: Kind = Kind.ComponentAddress;
  address: string;

  constructor(address: string) {
    this.address = address;
  }

  static async virtualAccountAddress(
    publicKey: PublicKey.PublicKey,
    networkId: number
  ): Promise<ComponentAddress> {
    return RadixEngineToolkit.deriveVirtualAccountAddress(
      publicKey,
      networkId
    ).then((address) => new ComponentAddress(address));
  }

  static async virtualIdentityAddress(
    publicKey: PublicKey.PublicKey,
    networkId: number
  ): Promise<ComponentAddress> {
    return RadixEngineToolkit.deriveVirtualIdentityAddress(
      publicKey,
      networkId
    ).then((address) => new ComponentAddress(address));
  }

  static async fromOlympiaAccountAddress(
    olympiaAccountAddress: string,
    networkId: number
  ): Promise<ComponentAddress> {
    return RadixEngineToolkit.deriveBabylonAddressFromOlympiaAddress(
      olympiaAccountAddress,
      networkId
    ).then(
      ({ babylonAccountAddress }) => new ComponentAddress(babylonAccountAddress)
    );
  }

  static async decode(
    bytes: Uint8Array | string,
    networkId: number
  ): Promise<ComponentAddress> {
    return RadixEngineToolkit.encodeAddress(bytes, networkId).then(
      (response) => new ComponentAddress(response)
    );
  }

  static async faucetComponentAddress(
    networkId: number
  ): Promise<ComponentAddress> {
    return ComponentAddress.knownEntityAddresses(networkId)
      .then(({ faucetComponentAddress }) => faucetComponentAddress)
      .then((address) => new ComponentAddress(address));
  }
  static async epochManagerComponentAddress(
    networkId: number
  ): Promise<ComponentAddress> {
    return ComponentAddress.knownEntityAddresses(networkId)
      .then(({ epochManagerComponentAddress }) => epochManagerComponentAddress)
      .then((address) => new ComponentAddress(address));
  }
  static async clockComponentAddress(
    networkId: number
  ): Promise<ComponentAddress> {
    return ComponentAddress.knownEntityAddresses(networkId)
      .then(({ clockComponentAddress }) => clockComponentAddress)
      .then((address) => new ComponentAddress(address));
  }

  async networkId(): Promise<number> {
    return (await this.addressInformation()).networkId;
  }

  async networkName(): Promise<string> {
    return (await this.addressInformation()).networkName;
  }

  async entityType(): Promise<EntityAddress.EntityType> {
    return (await this.addressInformation()).entityType;
  }

  async data(): Promise<Uint8Array> {
    return (await this.addressInformation()).data;
  }

  async hrp(): Promise<string> {
    return (await this.addressInformation()).hrp;
  }

  private static async knownEntityAddresses(
    networkId: number
  ): Promise<AddressBook> {
    return RadixEngineToolkit.knownEntityAddresses(networkId);
  }

  private async addressInformation(): Promise<AddressInformation> {
    return RadixEngineToolkit.decodeAddress(this.address);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class ResourceAddress implements IAddress {
  readonly type: Kind = Kind.ResourceAddress;
  address: string;

  constructor(address: string) {
    this.address = address;
  }

  static async decode(
    bytes: Uint8Array | string,
    networkId: number
  ): Promise<ResourceAddress> {
    return RadixEngineToolkit.encodeAddress(bytes, networkId).then(
      (response) => new ResourceAddress(response)
    );
  }

  static async xrdResourceAddress(networkId: number): Promise<ResourceAddress> {
    return ResourceAddress.knownEntityAddresses(networkId)
      .then(({ xrdResourceAddress }) => xrdResourceAddress)
      .then((address) => new ResourceAddress(address));
  }
  static async systemTokenResourceAddress(
    networkId: number
  ): Promise<ResourceAddress> {
    return ResourceAddress.knownEntityAddresses(networkId)
      .then(({ systemTokenResourceAddress }) => systemTokenResourceAddress)
      .then((address) => new ResourceAddress(address));
  }
  static async ecdsaSecp256k1TokenResourceAddress(
    networkId: number
  ): Promise<ResourceAddress> {
    return ResourceAddress.knownEntityAddresses(networkId)
      .then(
        ({ ecdsaSecp256k1TokenResourceAddress }) =>
          ecdsaSecp256k1TokenResourceAddress
      )
      .then((address) => new ResourceAddress(address));
  }
  static async eddsaEd25519TokenResourceAddress(
    networkId: number
  ): Promise<ResourceAddress> {
    return ResourceAddress.knownEntityAddresses(networkId)
      .then(
        ({ eddsaEd25519TokenResourceAddress }) =>
          eddsaEd25519TokenResourceAddress
      )
      .then((address) => new ResourceAddress(address));
  }
  static async packageTokenResourceAddress(
    networkId: number
  ): Promise<ResourceAddress> {
    return ResourceAddress.knownEntityAddresses(networkId)
      .then(({ packageTokenResourceAddress }) => packageTokenResourceAddress)
      .then((address) => new ResourceAddress(address));
  }

  async networkId(): Promise<number> {
    return (await this.addressInformation()).networkId;
  }

  async networkName(): Promise<string> {
    return (await this.addressInformation()).networkName;
  }

  async entityType(): Promise<EntityAddress.EntityType> {
    return (await this.addressInformation()).entityType;
  }

  async data(): Promise<Uint8Array> {
    return (await this.addressInformation()).data;
  }

  async hrp(): Promise<string> {
    return (await this.addressInformation()).hrp;
  }

  private static async knownEntityAddresses(
    networkId: number
  ): Promise<AddressBook> {
    return RadixEngineToolkit.knownEntityAddresses(networkId);
  }

  private async addressInformation(): Promise<AddressInformation> {
    return RadixEngineToolkit.decodeAddress(this.address);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
  }
}

export class PackageAddress implements IAddress {
  readonly type: Kind = Kind.PackageAddress;
  address: string;

  constructor(address: string) {
    this.address = address;
  }

  static async decode(
    bytes: Uint8Array | string,
    networkId: number
  ): Promise<PackageAddress> {
    return RadixEngineToolkit.encodeAddress(bytes, networkId).then(
      (response) => new PackageAddress(response)
    );
  }

  static async faucetPackageAddress(
    networkId: number
  ): Promise<PackageAddress> {
    return PackageAddress.knownEntityAddresses(networkId)
      .then(({ faucetPackageAddress }) => faucetPackageAddress)
      .then((address) => new PackageAddress(address));
  }
  static async accountPackageAddress(
    networkId: number
  ): Promise<PackageAddress> {
    return PackageAddress.knownEntityAddresses(networkId)
      .then(({ accountPackageAddress }) => accountPackageAddress)
      .then((address) => new PackageAddress(address));
  }

  async networkId(): Promise<number> {
    return (await this.addressInformation()).networkId;
  }

  async networkName(): Promise<string> {
    return (await this.addressInformation()).networkName;
  }

  async entityType(): Promise<EntityAddress.EntityType> {
    return (await this.addressInformation()).entityType;
  }

  async data(): Promise<Uint8Array> {
    return (await this.addressInformation()).data;
  }

  async hrp(): Promise<string> {
    return (await this.addressInformation()).hrp;
  }

  private static async knownEntityAddresses(
    networkId: number
  ): Promise<AddressBook> {
    return RadixEngineToolkit.knownEntityAddresses(networkId);
  }

  private async addressInformation(): Promise<AddressInformation> {
    return RadixEngineToolkit.decodeAddress(this.address);
  }

  toString(): string {
    return JSON.stringify(instanceToPlain(this));
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
