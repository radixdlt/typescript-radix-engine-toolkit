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

import { numberToString, stringToNumber } from "../../utils";
import { PublicKey } from "../crypto";

/**
 * A transaction header containing metadata and other transaction information.
 */
export class TransactionHeader {
  _version: string;
  _networkId: string;
  _startEpochInclusive: string;
  _endEpochExclusive: string;
  _nonce: string;
  _notaryPublicKey: PublicKey.Any;
  _notaryAsSignatory: boolean;
  _costUnitLimit: string;
  _tipPercentage: string;

  /**
   * An 8 bit unsigned integer serialized as a string which represents the transaction version.
   * Currently, this value is always 1.
   */
  get version() {
    return stringToNumber(this._version);
  }
  /**
   * An 8 bit unsigned integer serialized as a string which represents the transaction version.
   * Currently, this value is always 1.
   */
  set version(version: number) {
    this._version = numberToString(version);
  }

  /**
   * An 8 bit unsigned integer serialized as a string which represents the id of the network that
   * this transaction is meant for.
   */
  get networkId() {
    return stringToNumber(this._networkId);
  }
  /**
   * An 8 bit unsigned integer serialized as a string which represents the id of the network that
   * this transaction is meant for.
   */
  set networkId(networkId: number) {
    this._networkId = numberToString(networkId);
  }

  /**
   * A 64 bit unsigned integer serialized as a string which represents the start of the epoch window
   * in which this transaction executes. This value is inclusive.
   */
  get startEpochInclusive() {
    return stringToNumber(this._startEpochInclusive);
  }
  /**
   * A 64 bit unsigned integer serialized as a string which represents the start of the epoch window
   * in which this transaction executes. This value is inclusive.
   */
  set startEpochInclusive(startEpochInclusive: number) {
    this._startEpochInclusive = numberToString(startEpochInclusive);
  }

  /**
   * A 64 bit unsigned integer serialized as a string which represents the end of the epoch window
   * in which this transaction executes. This value is exclusive.
   */
  get endEpochExclusive() {
    return stringToNumber(this._endEpochExclusive);
  }
  /**
   * A 64 bit unsigned integer serialized as a string which represents the end of the epoch window
   * in which this transaction executes. This value is exclusive.
   */
  set endEpochExclusive(endEpochExclusive: number) {
    this._endEpochExclusive = numberToString(endEpochExclusive);
  }

  /**
   * A 64 bit unsigned integer serialized as a string which represents a random nonce used for this
   * transaction.
   */
  get nonce() {
    return stringToNumber(this._nonce);
  }
  /**
   * A 64 bit unsigned integer serialized as a string which represents a random nonce used for this
   * transaction.
   */
  set nonce(nonce: number) {
    this._nonce = numberToString(nonce);
  }

  /**
   * The public key of the entity that will be notarizing this transaction.
   */
  get notaryPublicKey() {
    return this._notaryPublicKey;
  }
  /**
   * The public key of the entity that will be notarizing this transaction.
   */
  set notaryPublicKey(notaryPublicKey: PublicKey.Any) {
    this._notaryPublicKey = notaryPublicKey;
  }

  /**
   * When `true` the notary's signature is also treated as an intent signature and therefore a
   * virtual badge of the signature is added to the auth zone when the transaction auth zone at the
   * beginning of the transaction.
   */
  get notaryAsSignatory() {
    return this._notaryAsSignatory;
  }
  /**
   * When `true` the notary's signature is also treated as an intent signature and therefore a
   * virtual badge of the signature is added to the auth zone when the transaction auth zone at the
   * beginning of the transaction.
   */
  set notaryAsSignatory(notaryAsSignatory: boolean) {
    this._notaryAsSignatory = notaryAsSignatory;
  }

  /**
   * A 32 bit unsigned integer serialized as a string which represents the limit or maximum amount
   * of cost units that the transaction is allowed to use.
   */
  get costUnitLimit() {
    return stringToNumber(this._costUnitLimit);
  }
  /**
   * A 32 bit unsigned integer serialized as a string which represents the limit or maximum amount
   * of cost units that the transaction is allowed to use.
   */
  set costUnitLimit(costUnitLimit: number) {
    this._costUnitLimit = numberToString(costUnitLimit);
  }

  /**
   * A 16 bit unsigned integer serialized as a string which represents the percentage of tips given
   * to validators for this transaction.
   */
  get tipPercentage() {
    return stringToNumber(this._tipPercentage);
  }
  set tipPercentage(tipPercentage: number) {
    this._tipPercentage = numberToString(tipPercentage);
  }

  constructor(
    version: number,
    networkId: number,
    startEpochInclusive: number,
    endEpochExclusive: number,
    nonce: number,
    notaryPublicKey: PublicKey.Any,
    notaryAsSignatory: boolean,
    costUnitLimit: number,
    tipPercentage: number
  ) {
    this._version = numberToString(version);
    this._networkId = numberToString(networkId);
    this._startEpochInclusive = numberToString(startEpochInclusive);
    this._endEpochExclusive = numberToString(endEpochExclusive);
    this._nonce = numberToString(nonce);
    this._notaryPublicKey = notaryPublicKey;
    this._notaryAsSignatory = notaryAsSignatory;
    this._costUnitLimit = numberToString(costUnitLimit);
    this._tipPercentage = numberToString(tipPercentage);
  }
}
