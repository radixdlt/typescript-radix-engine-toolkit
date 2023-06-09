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
import { Convert } from "../..";
import * as Serializers from "../serializers";

/**
 * The request provides information on the currently in-use radix engine toolkit such as the version
 * of the radix engine toolkit. In most cases, this is the first function written when integrating
 * new clients; so, this function is often times seen as the "Hello World" example of the radix
 * engine toolkit.
 */
export class InformationRequest {}

/**
 * The response from `InformationRequest`s
 */
export class InformationResponse {
  /**
   * A SemVer string of the version of the Radix Engine Toolkit. Ideally, if the toolkit is version
   * X then that means that it is compatible with version X of Scrypto.
   */
  @Expose({ name: "package_version" })
  packageVersion: string;

  /**
   * The hash of the commit that this build of the Radix Engine Toolkit was built against. This is
   * useful when doing any form of debugging and trying to determine the version of the library
   */
  @Expose({ name: "last_commit_hash" })
  @Type(() => Uint8Array)
  @Transform(Serializers.ByteArrayAsHexString.serialize, { toPlainOnly: true })
  @Transform(Serializers.ByteArrayAsHexString.deserialize, {
    toClassOnly: true,
  })
  lastCommitHash: Uint8Array;

  constructor(packageVersion: string, lastCommitHash: string | Uint8Array) {
    this.packageVersion = packageVersion;
    this.lastCommitHash = Convert.Uint8Array.from(lastCommitHash);
  }

  toString(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): Record<string, any> {
    return instanceToPlain(this);
  }
}
