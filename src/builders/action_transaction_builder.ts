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

import Decimal from "decimal.js";
import secureRandom from "secure-random";
import {
  CompileSignedTransactionIntentResponse,
  Instruction,
  InstructionList,
  ManifestAstValue,
  NotarizedTransaction,
  PublicKey,
  Signature,
  SignedTransactionIntent,
  TransactionHeader,
  TransactionIntent,
  TransactionManifest,
} from "../models";
import { IPrivateKey } from "../models/crypto/private_key";
import { hash } from "../utils";
import { RET } from "../wrapper/raw";
import { RadixEngineToolkitWasmWrapper } from "../wrapper/wasm_wrapper";

export class ActionTransactionBuilder {
  private retWrapper: RadixEngineToolkitWasmWrapper;

  private _startEpoch: number;
  private _endEpoch: number;
  private _networkId: number;

  private _version: number = 1;
  private _nonce: number = new DataView(
    secureRandom.randomBuffer(4).buffer,
    0
  ).getUint32(0, true);
  private _costUnitLimit: number = 100_000_000;
  private _tipPercentage: number = 0;

  private _feePayer: string;
  private _feeAmount: Decimal | undefined;
  private _actions: Array<Action> = [];

  constructor(
    retWrapper: RadixEngineToolkitWasmWrapper,
    startEpoch: number,
    endEpoch: number,
    networkId: number,
    feePayer: string
  ) {
    this.retWrapper = retWrapper;
    this._startEpoch = startEpoch;
    this._endEpoch = endEpoch;
    this._networkId = networkId;
    this._feePayer = feePayer;
  }

  static async new(
    startEpoch: number,
    endEpoch: number,
    networkId: number,
    feePayer: string
  ): Promise<ActionTransactionBuilder> {
    return RET.then(
      (ret) =>
        new ActionTransactionBuilder(
          ret,
          startEpoch,
          endEpoch,
          networkId,
          feePayer
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
    from: string,
    to: string,
    resourceAddress: string,
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

    this._actions.push(
      new FungibleResourceTransferAction(
        from,
        to,
        resourceAddress,
        decimalAmount
      )
    );
    return this;
  }

  public build(
    notaryPublicKey: PublicKey.Any,
    sign: IPrivateKey | ((hashToSign: Uint8Array) => Signature.Any)
  ): NotarizedTransaction {
    // Construct a signed transaction intent and compile it
    let signedIntent = this.constructSignedTransactionIntent(notaryPublicKey);
    let response = this.retWrapper.invoke(
      signedIntent,
      this.retWrapper.exports.compile_signed_transaction_intent,
      CompileSignedTransactionIntentResponse
    );
    let compiledIntent = response.compiledIntent;

    // If the key is a function, then invoke that function with the hashed compiled transaction
    // intent, otherwise, call the private key to sign.
    if (typeof sign === "function") {
      let hashedCompiledIntent = hash(compiledIntent);
      let signature = sign(hashedCompiledIntent);
      return new NotarizedTransaction(signedIntent, signature);
    } else {
      let signature = sign.signToSignature(compiledIntent);
      return new NotarizedTransaction(signedIntent, signature);
    }
  }

  public buildSignedIntent(notaryPublicKey: PublicKey.Any): {
    signedIntent: SignedTransactionIntent;
    hashToSign: Uint8Array;
  } {
    // Construct a signed transaction intent and compile it
    let signedIntent = this.constructSignedTransactionIntent(notaryPublicKey);
    let response = this.retWrapper.invoke(
      signedIntent,
      this.retWrapper.exports.compile_signed_transaction_intent,
      CompileSignedTransactionIntentResponse
    );
    let compiledIntent = response.compiledIntent;

    return {
      signedIntent,
      hashToSign: hash(compiledIntent),
    };
  }

  private constructTransactionHeader(
    notaryPublicKey: PublicKey.Any
  ): TransactionHeader {
    return new TransactionHeader(
      this._version,
      this._networkId,
      this._startEpoch,
      this._endEpoch,
      this._nonce,
      notaryPublicKey,
      true,
      this._costUnitLimit,
      this._tipPercentage
    );
  }

  private constructTransactionManifest(): TransactionManifest {
    let feeAmount = this.resolveFeeAmount();
    let instructions: Array<Instruction.Instruction> = [];
    let { withdraws, deposits } = this.resolveActions();

    let withdrawsCounter = 0;
    for (const [from, resourceAmountMapping] of Object.entries(withdraws)) {
      for (const [resourceAddress, amount] of Object.entries(
        resourceAmountMapping
      )) {
        if (withdrawsCounter === 0) {
          instructions.push(
            new Instruction.CallMethod(
              new ManifestAstValue.Address(from),
              new ManifestAstValue.String("lock_fee_and_withdraw"),
              [
                new ManifestAstValue.Decimal(feeAmount),
                new ManifestAstValue.Address(resourceAddress),
                new ManifestAstValue.Decimal(amount),
              ]
            )
          );
        } else {
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
        withdrawsCounter++;
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
    notaryPublicKey: PublicKey.Any
  ): TransactionIntent {
    return new TransactionIntent(
      this.constructTransactionHeader(notaryPublicKey),
      this.constructTransactionManifest()
    );
  }

  private constructSignedTransactionIntent(
    notaryPublicKey: PublicKey.Any
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
