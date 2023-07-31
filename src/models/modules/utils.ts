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

export interface KnownAddresses {
  resourceAddresses: ResourceAddresses;
  packageAddresses: PackageAddresses;
  componentAddresses: ComponentAddresses;
}

export interface ResourceAddresses {
  xrd: string;
  secp256k1SignatureVirtualBadge: string;
  ed25519SignatureVirtualBadge: string;
  packageOfDirectCallerVirtualBadge: string;
  globalCallerVirtualBadge: string;
  systemTransactionBadge: string;
  packageOwnerBadge: string;
  validatorOwnerBadge: string;
  accountOwnerBadge: string;
  identityOwnerBadge: string;
}

export interface PackageAddresses {
  packagePackage: string;
  resourcePackage: string;
  accountPackage: string;
  identityPackage: string;
  consensusManagerPackage: string;
  accessControllerPackage: string;
  poolPackage: string;
  transactionProcessorPackage: string;
  metadataModulePackage: string;
  royaltyModulePackage: string;
  roleAssignmentModulePackage: string;
  genesisHelperPackage: string;
  faucetPackage: string;
}

export interface ComponentAddresses {
  consensusManager: string;
  genesisHelper: string;
  faucet: string;
}
