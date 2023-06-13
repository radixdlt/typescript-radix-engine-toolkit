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

export enum EntityType {
  GlobalPackage = "GlobalPackage",
  GlobalFungibleResource = "GlobalFungibleResource",
  GlobalNonFungibleResource = "GlobalNonFungibleResource",
  GlobalConsensusManager = "GlobalConsensusManager",
  GlobalValidator = "GlobalValidator",
  GlobalClock = "GlobalClock",
  GlobalAccessController = "GlobalAccessController",
  GlobalAccount = "GlobalAccount",
  GlobalIdentity = "GlobalIdentity",
  GlobalGenericComponent = "GlobalGenericComponent",
  GlobalVirtualSecp256k1Account = "GlobalVirtualSecp256k1Account",
  GlobalVirtualEd25519Account = "GlobalVirtualEd25519Account",
  GlobalVirtualSecp256k1Identity = "GlobalVirtualSecp256k1Identity",
  GlobalVirtualEd25519Identity = "GlobalVirtualEd25519Identity",
  InternalFungibleVault = "InternalFungibleVault",
  InternalNonFungibleVault = "InternalNonFungibleVault",
  InternalAccount = "InternalAccount",
  InternalGenericComponent = "InternalGenericComponent",
  InternalKeyValueStore = "InternalKeyValueStore",
}
