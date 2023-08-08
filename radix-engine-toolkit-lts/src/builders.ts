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

import * as Toolkit from "@radixdlt/radix-engine-toolkit";
import Decimal from "decimal.js";
import {
  CompiledNotarizedTransaction,
  CompiledSignedTransactionIntent,
  PrivateKey,
  PublicKey,
  RadixEngineToolkit,
  SignedTransactionIntent,
  TransactionIntent,
  generateRandomNonce,
} from ".";

export interface SimpleTransactionBuilderSettings {
  networkId: number;
  validFromEpoch: number;
  fromAccount: string;
  signerPublicKey: PublicKey;
}

export interface SimpleTransactionBuilderFreeXrdSettings {
  networkId: number;
  validFromEpoch: number;
  toAccount: string;
}

type Action = {
  kind: "FungibleResourceTransfer";
  fromAccount: string;
  toAccount: string;
  resourceAddress: string;
  amount: Decimal;
};

/**
 * A builder class used for building single signature transactions with the notary as a signer.
 */
export class SimpleTransactionBuilder {
  private retWrapper: Toolkit.RawRadixEngineToolkit;

  private _startEpoch: number;
  private _expiresAfterEpochs: number = 2;
  private _networkId: number;

  private _nonce: number;
  private _tipPercentage: number = 0;
  private _notaryPublicKey: PublicKey;

  private _fromAccount: string;
  private _feeAmount: Decimal | undefined;
  private _actions: Action[] = [];

  constructor(
    retWrapper: Toolkit.RawRadixEngineToolkit,
    startEpoch: number,
    networkId: number,
    fromAccount: string,
    notaryPublicKey: PublicKey,
    nonce: number
  ) {
    this.retWrapper = retWrapper;
    this._startEpoch = startEpoch;
    this._networkId = networkId;
    this._fromAccount = fromAccount;
    this._nonce = nonce;
    this._notaryPublicKey = notaryPublicKey;
  }

  static async new(
    settings: SimpleTransactionBuilderSettings
  ): Promise<SimpleTransactionBuilder> {
    const { networkId, validFromEpoch, fromAccount, signerPublicKey } =
      settings;

    return new SimpleTransactionBuilder(
      await Toolkit.rawRadixEngineToolkit,
      validFromEpoch,
      networkId,
      fromAccount,
      signerPublicKey,
      await generateRandomNonce()
    );
  }

  static async freeXrdFromFaucet(
    settings: SimpleTransactionBuilderFreeXrdSettings
  ): Promise<CompiledNotarizedTransaction> {
    const { networkId, toAccount, validFromEpoch } = settings;
    // NOTE: The following ephemeral key is intentionally NOT generated through a secure random
    // number generator since in this case there are no risks associated with with this.
    // The following are the reasons we do not see this as a security risk:
    //
    // * The transaction constructed here is a transaction to get funds from the faucet, an
    //   operation that only works on testnets and NOT on mainnet.
    // * The key used here is only used to notarize the transaction. It's not being used to create
    //   a key to an account that would store actual funds.
    // * The worst that can happen is that an attacker who could guess the private key can cancel
    //   the faucet transaction (a feature which is not even implemented in Scrypto yet).
    //
    // Generating the following key through a secure random number generator requires the use of
    // CryptoJS which is a library that's tough to get working with different versions of NodeJS,
    // in different environments, and with different module systems. Thus, the choice was made not
    // to make use of it.
    //
    // WARNING: DO NOT USE THE FOLLOWING CODE TO GENERATE YOUR OWN PRIVATE KEYS.
    const ephemeralPrivateKey = new PrivateKey.Ed25519(
      new Uint8Array(Array(32).map((_) => Math.floor(Math.random() * 0xff)))
    );
    const ephemeralPublicKey = ephemeralPrivateKey.publicKey();

    const {
      components: { faucet: faucetComponentAddress },
      resources: { xrdResource: xrdResourceAddress },
    } = await RadixEngineToolkit.Derive.knownAddresses(networkId);

    const manifest = new Toolkit.ManifestBuilder()
      .callMethod(
        { kind: "Static", value: faucetComponentAddress },
        "lock_fee",
        {
          kind: Toolkit.ValueKind.Tuple,
          fields: [
            {
              kind: Toolkit.ValueKind.Decimal,
              value: new Decimal("10"),
            },
          ],
        }
      )
      .callMethod({ kind: "Static", value: faucetComponentAddress }, "free", {
        kind: Toolkit.ValueKind.Tuple,
        fields: [],
      })
      .takeFromWorktop(
        xrdResourceAddress,
        new Decimal("10000"),
        (builder, bucket) => {
          return builder.callMethod(
            { kind: "Static", value: toAccount },
            "try_deposit_or_abort",
            {
              kind: Toolkit.ValueKind.Tuple,
              fields: [
                {
                  kind: Toolkit.ValueKind.Bucket,
                  value: bucket,
                },
                {
                  kind: Toolkit.ValueKind.Enum,
                  discriminator: 0,
                  fields: [],
                },
              ],
            }
          );
        }
      )
      .build();
    const header: Toolkit.TransactionHeader = {
      networkId: networkId,
      startEpochInclusive: validFromEpoch,
      endEpochExclusive: validFromEpoch + 2,
      nonce: await generateRandomNonce(),
      notaryPublicKey: {
        kind: ephemeralPublicKey.curve,
        publicKey: ephemeralPublicKey.bytes,
      },
      notaryIsSignatory: false,
      tipPercentage: 0,
    };
    const intent = new TransactionIntent({ header, manifest });
    const signedIntent = new SignedTransactionIntent({
      intent: { header, manifest },
      intentSignatures: [],
    });

    return new CompiledSignedTransactionIntent(
      await Toolkit.rawRadixEngineToolkit,
      await intent.transactionId(),
      {
        intent: { header, manifest },
        intentSignatures: [],
      },
      await signedIntent.compile(),
      await signedIntent.signedIntentHash()
    ).compileNotarized(ephemeralPrivateKey);
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

  transferFungible(
    transfer: Omit<
      Extract<Action, { kind: "FungibleResourceTransfer" }>,
      "kind" | "from"
    >
  ): this {
    this._actions.push({
      kind: "FungibleResourceTransfer",
      toAccount: transfer.toAccount,
      fromAccount: this._fromAccount,
      resourceAddress: transfer.resourceAddress,
      amount: transfer.amount,
    });
    return this;
  }

  /**
   * This compiles the "signed intent" without any additional signatures (other than the notary
   * which will count as a signatory).
   * @returns the compiled intent, along with the `hashToNotarize` which needs to be signed.
   */
  public compileIntent(): CompiledSignedTransactionIntent {
    const transitioned = this.transition();

    const intent = transitioned.intent;
    const intentSignatures = transitioned.intentSignatures;

    const intentHash = Toolkit.Convert.HexString.toUint8Array(
      this.retWrapper.intentHash(
        Toolkit.GeneratedConverter.Intent.toGenerated(intent)
      )
    );
    const signedIntent: Toolkit.SignedIntent = {
      intent,
      intentSignatures,
    };
    const compiledSignedIntent = Toolkit.Convert.HexString.toUint8Array(
      this.retWrapper.signedIntentCompile(
        Toolkit.GeneratedConverter.SignedIntent.toGenerated(signedIntent)
      )
    );
    const signedIntentHash = Toolkit.Convert.HexString.toUint8Array(
      this.retWrapper.signedIntentHash(
        Toolkit.GeneratedConverter.SignedIntent.toGenerated(signedIntent)
      )
    );

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

  private transition(): Toolkit.TransactionBuilderIntentSignaturesStep {
    return new Toolkit.TransactionBuilderIntentSignaturesStep(
      this.retWrapper,
      this.constructTransactionHeader(),
      this.constructTransactionManifest()
    );
  }

  private constructTransactionHeader(): Toolkit.TransactionHeader {
    const notaryIsSignatory = true;
    const endEpoch = this._startEpoch + this._expiresAfterEpochs;
    return {
      networkId: this._networkId,
      startEpochInclusive: this._startEpoch,
      endEpochExclusive: endEpoch,
      nonce: this._nonce,
      notaryPublicKey: {
        kind: this._notaryPublicKey.curve,
        publicKey: this._notaryPublicKey.bytes,
      },
      notaryIsSignatory: notaryIsSignatory,
      tipPercentage: this._tipPercentage,
    };
  }

  private constructTransactionManifest(): Toolkit.TransactionManifest {
    const feeAmount = this.resolveFeeAmount();
    const instructions: Toolkit.Instruction[] = [];
    const { withdraws, deposits } = this.resolveActions();

    instructions.push({
      kind: "CallMethod",
      address: { kind: "Static", value: this._fromAccount },
      methodName: "lock_fee",
      args: {
        kind: Toolkit.ValueKind.Tuple,
        fields: [
          {
            kind: Toolkit.ValueKind.Decimal,
            value: feeAmount,
          },
        ],
      },
    });

    for (const [from, resourceAmountMapping] of Object.entries(withdraws)) {
      for (const [resourceAddress, amount] of Object.entries(
        resourceAmountMapping
      )) {
        instructions.push({
          kind: "CallMethod",
          address: { kind: "Static", value: this._fromAccount },
          methodName: "withdraw",
          args: {
            kind: Toolkit.ValueKind.Tuple,
            fields: [
              {
                kind: Toolkit.ValueKind.Address,
                value: { kind: "Static", value: resourceAddress },
              },
              {
                kind: Toolkit.ValueKind.Decimal,
                value: amount,
              },
            ],
          },
        });
      }
    }

    let depositCounter = 0;
    for (const [to, resourceAmountMapping] of Object.entries(deposits)) {
      for (const [resourceAddress, amount] of Object.entries(
        resourceAmountMapping
      )) {
        instructions.push({
          kind: "TakeFromWorktop",
          resourceAddress,
          amount,
        });
        instructions.push({
          kind: "CallMethod",
          address: { kind: "Static", value: to },
          methodName: "try_deposit_or_abort",
          args: {
            kind: Toolkit.ValueKind.Tuple,
            fields: [
              {
                kind: Toolkit.ValueKind.Bucket,
                value: depositCounter++,
              },
              {
                kind: Toolkit.ValueKind.Enum,
                discriminator: 0,
                fields: [],
              },
            ],
          },
        });
      }
    }

    return {
      instructions: {
        kind: "Parsed",
        value: instructions,
      },
      blobs: [],
    };
  }

  private resolveActions(): {
    withdraws: Record<string, Record<string, Decimal>>;
    deposits: Record<string, Record<string, Decimal>>;
  } {
    const withdraws: Record<string, Record<string, Decimal>> = {}; // Account Address => (Resource Address => amount)
    const deposits: Record<string, Record<string, Decimal>> = {}; // Account Address => (Resource Address => amount)

    for (const action of this._actions) {
      switch (action.kind) {
        case "FungibleResourceTransfer":
          const { fromAccount, toAccount, resourceAddress, amount } = action;
          // Resolve the withdraws
          if (withdraws?.[fromAccount] === undefined) {
            withdraws[fromAccount] = {};
          }
          if (withdraws[fromAccount]?.[resourceAddress] === undefined) {
            withdraws[fromAccount][resourceAddress] = new Decimal(0);
          }

          withdraws[fromAccount][resourceAddress] =
            withdraws[fromAccount][resourceAddress].add(amount);

          // Resolve deposits
          if (deposits?.[toAccount] === undefined) {
            deposits[toAccount] = {};
          }
          if (deposits[toAccount]?.[resourceAddress] === undefined) {
            deposits[toAccount][resourceAddress] = new Decimal(0);
          }

          deposits[toAccount][resourceAddress] =
            deposits[toAccount][resourceAddress].add(amount);
      }
    }

    return { withdraws, deposits };
  }

  private resolveFeeAmount(): Decimal {
    // TODO: Estimate fees based on actions
    return this._feeAmount === undefined ? new Decimal(5) : this._feeAmount;
  }
}

export type Amount = string | number | Decimal;
export function resolveDecimal(amount: Amount): Decimal {
  if (typeof amount === "string" || typeof amount === "number") {
    return new Decimal(amount);
  } else if (amount instanceof Decimal) {
    return amount;
  } else {
    throw new TypeError("Invalid type passed in for decimal");
  }
}
