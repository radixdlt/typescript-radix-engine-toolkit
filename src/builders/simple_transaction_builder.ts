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
import { Convert, ManifestBuilder, RadixEngineToolkit } from "../";
import {
  CompileNotarizedTransactionResponse,
  Instruction,
  InstructionList,
  ManifestAstValue,
  NotarizedTransaction,
  PrivateKey,
  PublicKey,
  SignedTransactionIntent,
  TransactionHeader,
  TransactionIntent,
  TransactionManifest,
  ValidationConfig,
} from "../models";
import { hash, randomBytes, randomNonce } from "../utils";
import { TransactionValidity } from "../wrapper/default";
import { LTSRadixEngineToolkit, TransactionSummary } from "../wrapper/lts";
import { RET } from "../wrapper/raw";
import { RadixEngineToolkitWasmWrapper } from "../wrapper/wasm_wrapper";
import {
  Address,
  Amount,
  NotarySignatureSource,
  resolveAddress,
  resolveDecimal,
  resolveNotarySignature,
} from "./builder_models";
import { TransactionBuilderIntentSignaturesStep } from "./transaction_builder";

export interface FungibleTransfer {
  resourceAddress: Address;
  toAccount: Address;
  amount: Amount;
}

export interface ActionTransactionBuilderSettings {
  networkId: number;
  validFromEpoch: number;
  fromAccount: string;
  signerPublicKey: PublicKey.PublicKey;
}

/// For building single-signer, notary-as-signer transactions.
export class SimpleTransactionBuilder {
  private retWrapper: RadixEngineToolkitWasmWrapper;

  private _startEpoch: number;
  private _expiresAfterEpochs: number = 2;
  private _networkId: number;

  private _version: number = 1;
  private _nonce: number;
  private _costUnitLimit: number = 100_000_000;
  private _tipPercentage: number = 0;
  private _notaryPublicKey: PublicKey.PublicKey;

  private _fromAccount: string;
  private _feeAmount: Decimal | undefined;
  private _actions: Array<Action> = [];

  constructor(
    retWrapper: RadixEngineToolkitWasmWrapper,
    startEpoch: number,
    networkId: number,
    fromAccount: string,
    notaryPublicKey: PublicKey.PublicKey
  ) {
    this.retWrapper = retWrapper;
    this._startEpoch = startEpoch;
    this._networkId = networkId;
    this._fromAccount = fromAccount;
    this._nonce = randomNonce();
    this._notaryPublicKey = notaryPublicKey;
  }

  static async new(
    settings: ActionTransactionBuilderSettings
  ): Promise<SimpleTransactionBuilder> {
    const { networkId, validFromEpoch, fromAccount, signerPublicKey } =
      settings;

    return new SimpleTransactionBuilder(
      await RET,
      validFromEpoch,
      networkId,
      fromAccount,
      signerPublicKey
    );
  }

  static async freeXrdFromFaucet(settings: {
    forAccount: string;
    networkId: number;
    startEpoch: number;
  }): Promise<CompiledNotarizedTransaction> {
    const ephemeralPrivateKey = new PrivateKey.EddsaEd25519(randomBytes(32));

    const knownEntityAddresses = await RadixEngineToolkit.knownEntityAddresses(
      settings.networkId
    );
    const faucetComponentAddress = knownEntityAddresses.faucetComponentAddress;
    const xrdResourceAddress = knownEntityAddresses.xrdResourceAddress;

    const manifest = new ManifestBuilder()
      .callMethod(faucetComponentAddress, "lock_fee", [
        new ManifestAstValue.Decimal("10"),
      ])
      .callMethod(faucetComponentAddress, "free", [])
      .takeFromWorktopByAmount(
        xrdResourceAddress,
        10_000,
        (builder, bucket) => {
          return builder.callMethod(settings.forAccount, "deposit", [bucket]);
        }
      )
      .build();
    const header = new TransactionHeader(
      0x01,
      settings.networkId,
      settings.startEpoch,
      settings.startEpoch + 10,
      randomNonce(),
      ephemeralPrivateKey.publicKey(),
      false,
      100_000_000,
      0
    );
    const intent = new TransactionIntent(header, manifest);
    const signedIntent = new SignedTransactionIntent(intent, []);

    return new CompiledSignedTransactionIntent(
      await RET,
      await intent.transactionId(),
      signedIntent,
      await signedIntent.compile(),
      await signedIntent.signedIntentHash()
    ).compileNotarized(ephemeralPrivateKey);
  }

  version(version: number): this {
    this._version = version;
    return this;
  }

  nonce(nonce: number): this {
    this._nonce = nonce;
    return this;
  }

  /**
   * Set the number of epochs this transaction is valid for (including the current epoch - which might nearly be over!)
   * Each epoch is approximately 5 minutes long.
   *
   * If `validFromEpoch` is set to the current epoch, then there are 0-5 minutes left of this first epoch.
   * So `expiresAfterEpochs(10)` would result in the transaction permanently rejecting after approximately 45-50 minutes.
   *
   * @param epochCount The number of epochs after with the transaction permanently rejects.
   * @returns the builder
   */
  permanentlyRejectAfterEpochs(epochCount: number): this {
    if (epochCount < 1 || epochCount > 100) {
      throw new Error("Epochs valid must be between 1 and 100");
    }
    this._expiresAfterEpochs = epochCount;
    return this;
  }

  costUnitLimit(costUnitLimit: number): this {
    this._costUnitLimit = costUnitLimit;
    return this;
  }

  tipPercentage(tipPercentage: number): this {
    this._tipPercentage = tipPercentage;
    return this;
  }

  /**
   * @param amount The amount of fee to lock. If not set, it will be 5 XRD.
   * @returns the builder
   */
  lockedFee(amount: Amount): this {
    this._feeAmount = resolveDecimal(amount);
    return this;
  }

  transferFungible(transfer: FungibleTransfer): this {
    this._actions.push(
      new FungibleResourceTransferAction(
        resolveAddress(this._fromAccount),
        resolveAddress(transfer.toAccount),
        resolveAddress(transfer.resourceAddress),
        resolveDecimal(transfer.amount)
      )
    );
    return this;
  }

  /**
   * This compiles the "signed intent" without any additional signatures (other than the notary which will count as a signatory).
   * @returns the compiled intent, along with the `hashToNotarize` which needs to be signed.
   */
  public compileIntent(): CompiledSignedTransactionIntent {
    const transitioned = this.transition();
    const { intentHash } = transitioned.compileIntent();

    const { compiledSignedIntent, signedIntent, signedIntentHash } =
      transitioned.compileSignedIntent();

    return new CompiledSignedTransactionIntent(
      this.retWrapper,
      intentHash,
      signedIntent,
      compiledSignedIntent,
      signedIntentHash
    );
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
    const notaryAsSignatory = true;
    const endEpoch = this._startEpoch + this._expiresAfterEpochs;
    return new TransactionHeader(
      this._version,
      this._networkId,
      this._startEpoch,
      endEpoch,
      this._nonce,
      this._notaryPublicKey,
      notaryAsSignatory,
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
        new ManifestAstValue.Address(this._fromAccount),
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

export class CompiledSignedTransactionIntent {
  private readonly retWrapper: RadixEngineToolkitWasmWrapper;
  private readonly signedIntent: SignedTransactionIntent;
  readonly intentHash: Uint8Array;
  readonly compiledSignedIntent: Uint8Array;
  readonly signedIntentHash: Uint8Array;

  constructor(
    retWrapper: RadixEngineToolkitWasmWrapper,
    intentHash: Uint8Array,
    signedIntent: SignedTransactionIntent,
    compiledSignedIntent: Uint8Array,
    signedIntentHash: Uint8Array
  ) {
    this.retWrapper = retWrapper;
    this.intentHash = intentHash;
    this.signedIntent = signedIntent;
    this.compiledSignedIntent = compiledSignedIntent;
    this.signedIntentHash = signedIntentHash;
  }

  /**
   * @returns The hash to notarize (the signed intent hash)
   */
  get hashToNotarize(): Uint8Array {
    return this.signedIntentHash;
  }

  /**
   * @returns The transaction identifier (also known as the intent hash) of the transaction.
   */
  get transactionId(): Uint8Array {
    return this.intentHash;
  }

  toByteArray(): Uint8Array {
    return this.compiledSignedIntent;
  }

  compileNotarized(
    source: NotarySignatureSource
  ): CompiledNotarizedTransaction {
    let notarizedTransaction = new NotarizedTransaction(
      this.signedIntent,
      resolveNotarySignature(source, this.hashToNotarize)
    );

    let request = notarizedTransaction;
    let response = this.retWrapper.invoke(
      request,
      this.retWrapper.exports.compile_notarized_transaction,
      CompileNotarizedTransactionResponse
    );
    let compiledNotarizedTransaction = response.compiledIntent;
    let notarizedPayloadHash = hash(compiledNotarizedTransaction);

    return new CompiledNotarizedTransaction(
      this.retWrapper,
      this.intentHash,
      compiledNotarizedTransaction,
      notarizedPayloadHash
    );
  }

  /**
   * @returns The transaction identifier (also known as the intent hash) of the transaction, encoded into hex.
   */
  intentHashHex(): string {
    return Convert.Uint8Array.toHexString(this.intentHash);
  }

  /**
   * Decompiles and summarizes a compiled intent extracting information such as locked fees,
   * deposits, and withdrawals.
   */
  summarizeTransaction(): Promise<TransactionSummary> {
    return LTSRadixEngineToolkit.Transaction.summarizeTransaction(this);
  }
}

export class CompiledNotarizedTransaction {
  private readonly retWrapper: RadixEngineToolkitWasmWrapper;
  readonly compiled: Uint8Array;
  readonly intentHash: Uint8Array;
  readonly notarizedPayloadHash: Uint8Array;

  constructor(
    retWrapper: RadixEngineToolkitWasmWrapper,
    intentHash: Uint8Array,
    compiled: Uint8Array,
    notarizedPayloadHash: Uint8Array
  ) {
    this.retWrapper = retWrapper;
    this.intentHash = intentHash;
    this.compiled = compiled;
    this.notarizedPayloadHash = notarizedPayloadHash;
  }

  /**
   * @returns The transaction identifier (also known as the intent hash) of the transaction.
   */
  get transactionId(): Uint8Array {
    return this.intentHash;
  }

  toByteArray(): Uint8Array {
    return this.compiled;
  }

  toHex(): string {
    return Convert.Uint8Array.toHexString(this.compiled);
  }

  /**
   * @returns The transaction identifier (also known as the intent hash) of the transaction, encoded into hex.
   */
  intentHashHex(): string {
    return Convert.Uint8Array.toHexString(this.intentHash);
  }

  /**
   * @returns The transaction identifier (also known as the intent hash) of the transaction, encoded into hex.
   */
  transactionIdHex(): string {
    return this.intentHashHex();
  }

  /**
   * @returns The (notarized) payload hash, encoded into hex.
   */
  notarizedPayloadHashHex(): string {
    return Convert.Uint8Array.toHexString(this.notarizedPayloadHash);
  }

  staticallyValidate(networkId: number): Promise<TransactionValidity> {
    return RadixEngineToolkit.staticallyValidateTransaction(
      this.compiled,
      ValidationConfig.default(networkId)
    );
  }

  /**
   * Decompiles and summarizes a compiled intent extracting information such as locked fees,
   * deposits, and withdrawals.
   */
  summarizeTransaction(): Promise<TransactionSummary> {
    return LTSRadixEngineToolkit.Transaction.summarizeTransaction(this);
  }
}
