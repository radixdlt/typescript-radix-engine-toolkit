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
import {
  CompiledNotarizedTransaction,
  CompiledSignedTransactionIntent,
  Convert,
  Instruction,
  Intent,
  LTSRadixEngineToolkit,
  LTSSignedTransactionIntent,
  LTSTransactionIntent,
  ManifestBuilder,
  PrivateKey,
  PublicKey,
  RawRadixEngineToolkit,
  SignatureFunction,
  SignatureSource,
  SignatureWithPublicKey,
  SignedIntent,
  SignerResponse,
  TransactionHeader,
  TransactionManifest,
  ValueKind,
  bucket,
  decimal,
  enumeration,
  generateRandomNonce,
  rawRadixEngineToolkit,
  resolveSignatureSource,
} from "..";
import { GeneratedConverter } from "../generated";

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
  private retWrapper: RawRadixEngineToolkit;

  private _startEpoch: number;
  private _expiresAfterEpochs: number = 2;
  private _networkId: number;

  private _nonce: number;
  private _tipPercentage: number = 0;
  private _notaryPublicKey: PublicKey;

  private _fromAccount: string;
  private _feePayer: string;
  private _feeAmount: Decimal | undefined;
  private _actions: Action[] = [];

  constructor(
    retWrapper: RawRadixEngineToolkit,
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
    this._feePayer = fromAccount;
    this._nonce = nonce;
    this._notaryPublicKey = notaryPublicKey;
  }

  static async new(
    settings: SimpleTransactionBuilderSettings
  ): Promise<SimpleTransactionBuilder> {
    const { networkId, validFromEpoch, fromAccount, signerPublicKey } =
      settings;

    return new SimpleTransactionBuilder(
      await rawRadixEngineToolkit,
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
    // * The key used here is only used to notarize the transaction. It's not being used to create a
    //   key to an account that would store actual funds.
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

    const {
      components: { faucet: faucetComponentAddress },
      resources: { xrdResource: xrdResourceAddress },
    } = await LTSRadixEngineToolkit.Derive.knownAddresses(networkId);

    const manifest = new ManifestBuilder()
      .callMethod(faucetComponentAddress, "lock_fee", [decimal("10")])
      .callMethod(faucetComponentAddress, "free", [])
      .takeFromWorktop(
        xrdResourceAddress,
        new Decimal("10000"),
        (builder, bucketId) => {
          return builder.callMethod(toAccount, "try_deposit_or_abort", [
            bucket(bucketId),
            enumeration(0),
          ]);
        }
      )
      .build();
    const header: TransactionHeader = {
      networkId: networkId,
      startEpochInclusive: validFromEpoch,
      endEpochExclusive: validFromEpoch + 2,
      nonce: generateRandomNonce(),
      notaryPublicKey: ephemeralPrivateKey.publicKey(),
      notaryIsSignatory: false,
      tipPercentage: 0,
    };
    const intent = new LTSTransactionIntent({ header, manifest });
    const signedIntent = new LTSSignedTransactionIntent({
      intent: { header, manifest },
      intentSignatures: [],
    });

    return new CompiledSignedTransactionIntent(
      await rawRadixEngineToolkit,
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

  feePayer(address: string): this {
    this._feePayer = address;
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

  transferFungible(transfer: {
    toAccount: string;
    resourceAddress: string;
    amount: Amount;
  }): this {
    this._actions.push({
      kind: "FungibleResourceTransfer",
      toAccount: transfer.toAccount,
      fromAccount: this._fromAccount,
      resourceAddress: transfer.resourceAddress,
      amount: resolveDecimal(transfer.amount),
    });
    return this;
  }

  /**
   * This compiles the "signed intent" without any additional signatures (other than the notary
   * which will count as a signatory).
   * @returns the compiled intent, along with the `hashToNotarize` which needs to be signed.
   */
  public compileIntent(): CompiledSignedTransactionIntent {
    const header = this.constructTransactionHeader();
    const manifest = this.constructTransactionManifest();
    const intent: Intent = { header, manifest };

    const intentHash = GeneratedConverter.TransactionHash.fromGenerated(
      this.retWrapper.intentHash(GeneratedConverter.Intent.toGenerated(intent))
    );
    const signedIntent: SignedIntent = {
      intent,
      intentSignatures: [],
    };
    const compiledSignedIntent = Convert.HexString.toUint8Array(
      this.retWrapper.signedIntentCompile(
        GeneratedConverter.SignedIntent.toGenerated(signedIntent)
      )
    );
    const signedIntentHash = GeneratedConverter.TransactionHash.fromGenerated(
      this.retWrapper.signedIntentHash(
        GeneratedConverter.SignedIntent.toGenerated(signedIntent)
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

  public compileIntentWithSignatures(
    signatureSources: Array<SignatureSource<SignatureWithPublicKey>>
  ): CompiledSignedTransactionIntent {
    const header = this.constructTransactionHeader();
    const manifest = this.constructTransactionManifest();
    const intent: Intent = { header, manifest };

    const intentHash = GeneratedConverter.TransactionHash.fromGenerated(
      this.retWrapper.intentHash(GeneratedConverter.Intent.toGenerated(intent))
    );

    const signatures = signatureSources.map((source) =>
      resolveSignatureSource(
        source,
        intentHash.hash,
        (signerResponse: SignerResponse): SignatureWithPublicKey => {
          switch (signerResponse.curve) {
            case "Secp256k1":
              return new SignatureWithPublicKey.Secp256k1(
                signerResponse.signature
              );
            case "Ed25519":
              return new SignatureWithPublicKey.Ed25519(
                signerResponse.signature,
                signerResponse.publicKey
              );
          }
        }
      )
    );

    const signedIntent: SignedIntent = { intent, intentSignatures: signatures };

    const compiledSignedIntent = Convert.HexString.toUint8Array(
      this.retWrapper.signedIntentCompile(
        GeneratedConverter.SignedIntent.toGenerated(signedIntent)
      )
    );
    const signedIntentHash = GeneratedConverter.TransactionHash.fromGenerated(
      this.retWrapper.signedIntentHash(
        GeneratedConverter.SignedIntent.toGenerated(signedIntent)
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

  public async compileIntentWithSignaturesAsync(
    signatureSources: Array<SignatureFunction<Promise<SignatureWithPublicKey>>>
  ): Promise<CompiledSignedTransactionIntent> {
    const header = this.constructTransactionHeader();
    const manifest = this.constructTransactionManifest();
    const intent: Intent = { header, manifest };

    const intentHash = GeneratedConverter.TransactionHash.fromGenerated(
      this.retWrapper.intentHash(GeneratedConverter.Intent.toGenerated(intent))
    );

    const signatures = await Promise.all(
      signatureSources.map((func) => func(intentHash.hash))
    );

    const signedIntent: SignedIntent = { intent, intentSignatures: signatures };

    const compiledSignedIntent = Convert.HexString.toUint8Array(
      this.retWrapper.signedIntentCompile(
        GeneratedConverter.SignedIntent.toGenerated(signedIntent)
      )
    );
    const signedIntentHash = GeneratedConverter.TransactionHash.fromGenerated(
      this.retWrapper.signedIntentHash(
        GeneratedConverter.SignedIntent.toGenerated(signedIntent)
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

  private constructTransactionHeader(): TransactionHeader {
    const notaryIsSignatory = true;
    const endEpoch = this._startEpoch + this._expiresAfterEpochs;
    return {
      networkId: this._networkId,
      startEpochInclusive: this._startEpoch,
      endEpochExclusive: endEpoch,
      nonce: this._nonce,
      notaryPublicKey: this._notaryPublicKey,
      notaryIsSignatory: notaryIsSignatory,
      tipPercentage: this._tipPercentage,
    };
  }

  private constructTransactionManifest(): TransactionManifest {
    const feeAmount = this.resolveFeeAmount();
    const instructions: Instruction[] = [];
    const { withdraws, deposits } = this.resolveActions();

    instructions.push({
      kind: "CallMethod",
      address: { kind: "Static", value: this._feePayer },
      methodName: "lock_fee",
      args: {
        kind: ValueKind.Tuple,
        fields: [
          {
            kind: ValueKind.Decimal,
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
          address: { kind: "Static", value: from },
          methodName: "withdraw",
          args: {
            kind: ValueKind.Tuple,
            fields: [
              {
                kind: ValueKind.Address,
                value: { kind: "Static", value: resourceAddress },
              },
              {
                kind: ValueKind.Decimal,
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
            kind: ValueKind.Tuple,
            fields: [
              {
                kind: ValueKind.Bucket,
                value: depositCounter++,
              },
              {
                kind: ValueKind.Enum,
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
          // Resolve withdraws
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
