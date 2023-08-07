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

export namespace NetworkId {
  export const Mainnet: number = 0x01;
  export const Stokenet: number = 0x02;
  export const Alphanet: number = 0x0a;
  export const Betanet: number = 0x0b;
  export const Kisharnet: number = 0x0c;
  export const Ansharnet: number = 0x0d;
  export const RCnetV1: number = Kisharnet;
  export const RCnetV2: number = Ansharnet;
  export const Gilganet: number = 0x20;
  export const Enkinet: number = 0x21;
  export const Hammunet: number = 0x22;
  export const Nergalnet: number = 0x23;
  export const Mardunet: number = 0x24;
  export const LocalNet: number = 0xf0;
  export const InternalTestNet: number = 0xf1;
  export const Simulator: number = 0xf2;
}
