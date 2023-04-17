# Long Term Support (LTS) Radix Engine Toolkit

| **Note** | It is recommended (but not required) to read the [README.md](./README.md) for additional context on the Radix Engine Toolkit as a library, it's architecture, advanced uses of the toolkit. |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

This `LTSRadixEngineToolkit` class is meant to provide a smaller interface with a higher degree of backward compatibility that is suitable for third parties hoping to integrate with the Radix Babylon ledger.

The `LTSRadixEngineToolkit` and other classes that fall under the LTS umbrella are not meant to provide the complete functionality of the core Radix Engine Toolkit to clients, quite the opposite, they are meant to provide simple interfaces to functionality that integrators need. There is a chance that a client might outgrow the LTS garden and need utilize some of the classes and concepts outside of the LTS.

The following set of classes currently are currently considered to be in LTS:

- `ActionTransactionBuilder`
- `LTSRadixEngineToolkit`
  - `Transaction` API Group
  - `Derive` API Group
  - `Utils` API Group

## Constructing Transactions through Higher Level Actions

One of the classes that are considered in LTS is the `ActionTransactionBuilder` which is a class that allows for the construction of transactions through higher-level actions to specify intent. Constructing transactions in such a manner means that a client does not need to interact with or build their own transaction manifest. The `ActionTransactionBuilder` class will handle the complete process of constructing the transaction from beginning to end, including the transaction manifest. Additionally, clients that use the `ActionTransactionBuilder` would not need to understand the construction process, when (or on what) hashing is done, or other information.

Despite the simple interface of the `ActionTransactionBuilder`, it is a powerful way for constructing transactions. The following is a list of features supported by the `ActionTransactionBuilder`:

- Allows for many to many transfer of fungible tokens.
- Aggregates withdraws and deposits into and from accounts to optimize for fees.
- Can be used with a single signer or with multiple signers.
- Sets many of the values in the header to overridable defaults.

At the current moment of time, the `ActionTransactionBuilder` supports a single action: the transfer of fungible tokens. Additional actions can be added to this class in the future to allow it to be more useful for other use cases.

In this document, we wish to categorize transactions into two main categories: single notary signature transactions, and multi-signature transactions. By far, the most common type of transactions that we expect most integrators to be using are the single notary signature transactions, however, integrators are free to use whatever fits best fits their needs. 

### Single Notary Signature Transactions

This category of transactions is the simplest to construct, thus, we expect that integrators that do not have complex needs would be constructing this type of transactions. This refers to transactions built with no intent signatures and with the `notaryAsSignatory` flag set to `true`. In this case, the notary signature (all transactions have exactly ONE notary signature) will be considered as a notary signature and an intent signature. In simpler terms, you can think of it as: when `notaryAsSignatory` is set to `true`, the transaction may withdraw funds from the notary's account, otherwise, it can't. 

The following is an example of how to transfer funds from account A to B and from A to C all in a single transaction. This will be a single notary signature transaction. 

```ts
import {
  NetworkId,
  PrivateKey,
  NotarizedTransaction,
  ActionTransactionBuilder,
  Signature,
  PublicKey,
  CompiledSignedTransactionIntent
} from "../../src";

const sign = (hashToSign: Uint8Array): Signature.Signature => {
  /* A function implemented in your internal systems that is able to sign a given hash and produce a sig. */
}

const getNotaryPublicKey = (): PublicKey.PublicKey => {
  /* A function implemented in your internal systems that is able to get the public key of the notary. */
}

let account1 = "account_sim1qjdkmaevmu7ggs3jyruuykx2u5c2z7mp6wjk5f5tpy6swx5788";
let account2 = "account_sim1qj0vpwp3l3y8jhk6nqtdplx4wh6mpu8mhu6mep4pua3q8tn9us";
let account3 = "account_sim1qjj40p52dnww68e594c3jq6h3s8xr75fgcnpvlwmypjqmqamld";

let resourceAddress1 =
  "resource_sim1qyw4pk2ecwecslf55dznrv49xxndzffnmpcwjavn5y7qyr2l73";

let signedIntent: CompiledSignedTransactionIntent = await ActionTransactionBuilder.new(
  10 /* The start epoch (inclusive) of when this transaction becomes valid */,
  20 /* The end epoch (exclusive) of when this transaction is no longer valid */,
  NetworkId.Simulator /* The id of the network that this transactions is destined for */,
  account1 /* The fee payer */,
  getNotaryPublicKey() /* The notary's public key */
).then((builder) => {
  return builder
    .fungibleResourceTransfer(account1, account2, resourceAddress1, 100)
    .fungibleResourceTransfer(account1, account3, resourceAddress1, 100)
    .compileSignedTransactionIntent()
});
let signature = sign(signedIntent.hashToSign);
let transaction = signedIntent.compileNotarizedTransaction(signature);
```

## `LTSRadixEngineToolkit` Functionality

This section discusses the functionality provided by the `LTSRadixEngineToolkit` class and provides a number of examples.

### Derive API Group

This is a group of functions exposed by the `LTSRadixEngineToolkit` that are used to perform various kinds of derivations. Typically, these are address derivations.

#### Deriving The (Virtual) Account Address from a Public Key

The `Derive` API group of the `LTSRadixEngineToolkit` class exposes methods for deriving the (virtual) account component address associated with a public key.

```ts
import {
  LTSRadixEngineToolkit,
  PublicKey,
  NetworkId,
} from "@radixdlt/radix-engine-toolkit";

let publicKey = new PublicKey.EcdsaSecp256k1(
  "03ce65a44a837dd5cd0e274c3280ab3d602e7ce1e1e3eaff769f2d2fc54cac733e"
);
let address: string = await LTSRadixEngineToolkit.Derive.virtualAccountAddress(
  publicKey,
  NetworkId.Mainnet /* The ID of the network to derive the address for. */
);
console.log(address);
```

#### Deriving The Babylon (Virtual) Account Address from an Olympia Account Address

The `Derive` API group of the `LTSRadixEngineToolkit` class exposes methods for deriving the Babylon (virtual) account component address associated with an Olympia account address.

```ts
import {
  LTSRadixEngineToolkit,
  PublicKey,
  NetworkId,
} from "@radixdlt/radix-engine-toolkit";

let olympiaAccountAddress: string =
  "rdx1qspx7zxmnrh36q33av24srdfzg7m3cj65968erpjuh7ja3rm3kmn6hq4j9842";
let { babylonAccountAddress, publicKey } =
  await LTSRadixEngineToolkit.Derive.babylonAccountAddressFromOlympiaAccountAddress(
    olympiaAccountAddress,
    NetworkId.Mainnet /* The ID of the network to derive the address for. */
  );
console.log(virtualIdentityAddress);
```

#### Deriving Known Addresses

There are various entities created at the Babylon genesis which have a known set of addresses. The following entities (and their addresses) are all created at genesis:

- Resources
  - XRD Resource
  - Ecdsa Secp256k1 Resource
  - EdDSA Ed25519 Resource
  - System Resource
  - Package Badge Resource
- Components
  - Faucet Component (if exists)
  - Epoch Manager Component
  - Clock Component
- Packages
  - Faucet Package (if exists)
  - Account Package

The Radix Engine Toolkit can be used to provide the above mentioned addresses on any network that the client chooses.

```ts
import {
  LTSRadixEngineToolkit,
  NetworkId,
} from "@radixdlt/radix-engine-toolkit";

let knownAddresses = await LTSRadixEngineToolkit.Derive.knownAddresses(
  NetworkId.Mainnet /* The ID of the network to derive the addresses for. */
);
console.log(knownAddresses);
```

### Utils API Group

#### Hashing

The `Utils` API group of the `LTSRadixEngineToolkit` offers a method for hashing data through the hashing algorithm used in Scrypto and the Radix Engine which is Blake2b with 32 byte long digests

```ts
import {
  LTSRadixEngineToolkit,
} from "@radixdlt/radix-engine-toolkit";

let data: Uint8Array = /* Some array of bytes */;
let hashedData: Uint8Array = LTSRadixEngineToolkit.Utils.hash(data);
```
