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

import { RadixEngineToolkitWasmWrapper } from "./wasm_wrapper";

/**
 * A global instance of the Radix Engine Toolkit.
 */
const RET: Promise<RadixEngineToolkitWasmWrapper> =
  RadixEngineToolkitWasmWrapper.new();

/**
 * A facade for the Radix Engine Toolkit which abstracts some of the async and instance logic away
 * from the developers consuming the class. Additionally, this class abstracts the toolkit's invoke
 * process away from the developer.
 */
class RadixEngineToolkit {
  private static async callFunction<I, O>(
    request: I,
    fn: (pointer: number) => number
  ): Promise<O> {
    return (await RET).callFunction(request, fn);
  }
}

export { RadixEngineToolkit };
