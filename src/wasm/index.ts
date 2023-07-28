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

/**
 * This module exports a set of classes and objects for hosting the Radix Engine Toolkit WASM and
 * invoking functions on it. The following are the layers of abstraction maintained by this module:
 *
 * ┌───────────────────────┐
 * │ RadixEngineToolkit    │
 * ├───────────────────────┤
 * │ RawRadixEngineToolkit │
 * ├───────────────────────┤
 * │ Host                  │
 * └───────────────────────┘
 *
 * Each of the above classes builds on top of one another. {@link Host} is the lowest level of the
 * stack and just provides a WASM host (runtime) and some serialization with no knowledge of the
 * function that the toolkit has. Other classes such as {@link RadixEngineToolkit} build upon this
 * exposing a high-level API for consumers.
 */

export { wasmBindgenImports } from "./constants";
export * from "./default";
export { Host } from "./host";
export { RawRadixEngineToolkit, rawRadixEngineToolkit } from "./raw";
