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

import { IAddress } from "base";
import Decimal from "decimal.js";
import secureRandom from "secure-random";
import {
  Instruction,
  InstructionList,
  ManifestAstValue,
  NotarizedTransaction,
  PublicKey,
  SignedTransactionIntent,
  TransactionHeader,
  TransactionIntent,
  TransactionManifest,
} from "../models";
import { IPrivateKey } from "../models/crypto/private_key";
import { RET } from "../wrapper/raw";
import { RadixEngineToolkitWasmWrapper } from "../wrapper/wasm_wrapper";
import {
  TransactionBuilderIntentSignaturesStep,
  notarizationFn,
  signIntentFn,
} from "./transaction_builder";

export class ActionTransactionBuilder {
  private retWrapper: RadixEngineToolkitWasmWrapper;

  private _startEpoch: number;
  private _endEpoch: number;
  private _networkId: number;

  private _version: number = 1;
  private _nonce: number;
  private _costUnitLimit: number = 100_000_000;
  private _tipPercentage: number = 0;
  private _notaryPublicKey: PublicKey.PublicKey;
  private _notaryAsSignatory: boolean = true;

  private _feePayer: string;
  private _feeAmount: Decimal | undefined;
  private _actions: Array<Action> = [];

  constructor(
    retWrapper: RadixEngineToolkitWasmWrapper,
    startEpoch: number,
    endEpoch: number,
    networkId: number,
    feePayer: string,
    notaryPublicKey: PublicKey.PublicKey
  ) {
    this.retWrapper = retWrapper;
    this._startEpoch = startEpoch;
    this._endEpoch = endEpoch;
    this._networkId = networkId;
    this._feePayer = feePayer;
    this._nonce = new DataView(
      secureRandom.randomBuffer(4).buffer,
      0
    ).getUint32(0, true);
    this._notaryPublicKey = notaryPublicKey;
  }

  static async new(
    startEpoch: number,
    endEpoch: number,
    networkId: number,
    feePayer: string,
    notaryPublicKey: PublicKey.PublicKey
  ): Promise<ActionTransactionBuilder> {
    return RET.then(
      (ret) =>
        new ActionTransactionBuilder(
          ret,
          startEpoch,
          endEpoch,
          networkId,
          feePayer,
          notaryPublicKey
        )
    );
  }

  version(version: number): ActionTransactionBuilder {
    this._version = version;
    return this;
  }

  nonce(nonce: number): ActionTransactionBuilder {
    this._nonce = nonce;
    return this;
  }

  costUnitLimit(costUnitLimit: number): ActionTransactionBuilder {
    this._costUnitLimit = costUnitLimit;
    return this;
  }

  tipPercentage(tipPercentage: number): ActionTransactionBuilder {
    this._tipPercentage = tipPercentage;
    return this;
  }

  feeAmount(amount: Decimal): ActionTransactionBuilder {
    this._feeAmount = amount;
    return this;
  }

  fungibleResourceTransfer(
    from: string | IAddress,
    to: string | IAddress,
    resourceAddress: string | IAddress,
    amount: Decimal | number | string
  ): ActionTransactionBuilder {
    let decimalAmount: Decimal;
    if (typeof amount === "string" || typeof amount === "number") {
      decimalAmount = new Decimal(amount);
    } else if (amount instanceof Decimal) {
      decimalAmount = amount;
    } else {
      throw new TypeError("Invalid type passed in for decimal");
    }
    let resolveAddress = (address: string | IAddress): string =>
      typeof address === "string" ? address : address.address;

    this._actions.push(
      new FungibleResourceTransferAction(
        resolveAddress(from),
        resolveAddress(to),
        resolveAddress(resourceAddress),
        decimalAmount
      )
    );
    return this;
  }

  public sign(
    key: IPrivateKey | signIntentFn
  ): TransactionBuilderIntentSignaturesStep {
    return this.transition().sign(key);
  }

  public notarize(key: IPrivateKey | notarizationFn): NotarizedTransaction {
    return this.transition().notarize(key);
  }

  public buildTransactionIntent(): {
    compiledTransactionIntent: Uint8Array;
    transactionIntent: TransactionIntent;
    hashToSign: Uint8Array;
  } {
    return this.transition().buildTransactionIntent();
  }

  public buildSignedTransactionIntent(): {
    compiledSignedTransactionIntent: Uint8Array;
    signedTransactionIntent: SignedTransactionIntent;
    hashToSign: Uint8Array;
  } {
    return this.transition().buildSignedTransactionIntent();
  }

  //=================
  // Private Methods
  //=================

  private transition(): TransactionBuilderIntentSignaturesStep {
    return new TransactionBuilderIntentSignaturesStep(
      this.retWrapper,
      this.constructTransactionHeader(),
      this.constructTransactionManifest()
    );
  }

  private constructTransactionHeader(): TransactionHeader {
    return new TransactionHeader(
      this._version,
      this._networkId,
      this._startEpoch,
      this._endEpoch,
      this._nonce,
      this._notaryPublicKey,
      this._notaryAsSignatory,
      this._costUnitLimit,
      this._tipPercentage
    );
  }

  private constructTransactionManifest(): TransactionManifest {
    let feeAmount = this.resolveFeeAmount();
    let instructions: Array<Instruction.Instruction> = [];
    let { withdraws, deposits } = this.resolveActions();

    instructions.push(
      new Instruction.CallMethod(
        new ManifestAstValue.Address(this._feePayer),
        new ManifestAstValue.String("lock_fee"),
        [new ManifestAstValue.Decimal(feeAmount)]
      )
    );

    for (const [from, resourceAmountMapping] of Object.entries(withdraws)) {
      for (const [resourceAddress, amount] of Object.entries(
        resourceAmountMapping
      )) {
        instructions.push(
          new Instruction.CallMethod(
            new ManifestAstValue.Address(from),
            new ManifestAstValue.String("withdraw"),
            [
              new ManifestAstValue.Address(resourceAddress),
              new ManifestAstValue.Decimal(amount),
            ]
          )
        );
      }
    }

    let depositCounter = 0;
    for (const [to, resourceAmountMapping] of Object.entries(deposits)) {
      for (const [resourceAddress, amount] of Object.entries(
        resourceAmountMapping
      )) {
        instructions.push(
          new Instruction.TakeFromWorktopByAmount(
            new ManifestAstValue.Address(resourceAddress),
            new ManifestAstValue.Decimal(amount),
            new ManifestAstValue.Bucket(
              new ManifestAstValue.String(`bucket${depositCounter}`)
            )
          )
        );
        instructions.push(
          new Instruction.CallMethod(
            new ManifestAstValue.Address(to),
            new ManifestAstValue.String("deposit"),
            [
              new ManifestAstValue.Bucket(
                new ManifestAstValue.String(`bucket${depositCounter}`)
              ),
            ]
          )
        );
        depositCounter++;
      }
    }

    return new TransactionManifest(
      new InstructionList.ParsedInstructions(instructions),
      []
    );
  }

  private constructTransactionIntent(
    notaryPublicKey: PublicKey.PublicKey
  ): TransactionIntent {
    return new TransactionIntent(
      this.constructTransactionHeader(),
      this.constructTransactionManifest()
    );
  }

  private constructSignedTransactionIntent(
    notaryPublicKey: PublicKey.PublicKey
  ): SignedTransactionIntent {
    return new SignedTransactionIntent(
      this.constructTransactionIntent(notaryPublicKey),
      []
    );
  }

  private resolveActions(): {
    withdraws: Record<string, Record<string, Decimal>>;
    deposits: Record<string, Record<string, Decimal>>;
  } {
    let withdraws: Record<string, Record<string, Decimal>> = {}; // Account Address => (Resource Address => amount)
    let deposits: Record<string, Record<string, Decimal>> = {}; // Account Address => (Resource Address => amount)

    for (let action of this._actions) {
      if (action instanceof FungibleResourceTransferAction) {
        let { from, to, resourceAddress, amount } = action;

        // Resolve the withdraws
        if (withdraws?.[from] === undefined) {
          withdraws[from] = {};
        }
        if (withdraws[from]?.[resourceAddress] === undefined) {
          withdraws[from][resourceAddress] = new Decimal(0);
        }

        withdraws[from][resourceAddress] =
          withdraws[from][resourceAddress].add(amount);

        // Resolve deposits
        if (deposits?.[to] === undefined) {
          deposits[to] = {};
        }
        if (deposits[to]?.[resourceAddress] === undefined) {
          deposits[to][resourceAddress] = new Decimal(0);
        }

        deposits[to][resourceAddress] =
          deposits[to][resourceAddress].add(amount);
      }
    }

    return { withdraws, deposits };
  }

  private resolveFeeAmount(): Decimal {
    // TODO: Estimate fees based on actions
    return this._feeAmount === undefined ? new Decimal(5) : this._feeAmount;
  }
}

type Action = FungibleResourceTransferAction;

export class FungibleResourceTransferAction {
  from: string;
  to: string;
  resourceAddress: string;
  amount: Decimal;

  constructor(
    from: string,
    to: string,
    resourceAddress: string,
    amount: Decimal
  ) {
    this.from = from;
    this.to = to;
    this.resourceAddress = resourceAddress;
    this.amount = amount;
  }
}
