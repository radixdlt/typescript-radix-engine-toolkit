# Long Term Support (LTS) Radix Engine Toolkit

| **Note** | It is recommended (but not required) to read the [README.md](./README.md) for additional context on the Radix Engine Toolkit as a library, it's architecture, advanced uses of the toolkit. |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

This `LTSRadixEngineToolkit` class is meant to provide a smaller interface with a higher degree of backward compatibility that is suitable for third parties looking to integrate with the Radix Babylon ledger.

An end-to-end example of using the `LTSRadixEngineToolkit` alongside the `LTS` part of the `CoreApiClient` ([@radixdlt/babylon-core-api-sdk](https://www.npmjs.com/package/@radixdlt/babylon-core-api-sdk)) with Node.js is [presented here](./examples/core-e2e-example).

## Summary

The `LTSRadixEngineToolkit` and other classes that fall under the LTS umbrella are not meant to provide the complete functionality of the core Radix Engine Toolkit to clients. They are meant to provide focused, simple interfaces for functionality that integrators need. There is a chance that a client might outgrow the LTS garden and need utilize some of the classes and concepts outside the LTS.

The following set of classes are currently considered to be in LTS:

- `SimpleTransactionBuilder`
- `LTSRadixEngineToolkit`
  - `Transaction` Class
  - `Derive` Class
  - `Utils` Class

## `SimpleTransactionBuilder` - constructing transactions through high-level actions

The `SimpleTransactionBuilder` is a class which allows for the construction of transactions through higher-level actions to specify intent.

Constructing transactions in such a manner means that a client does not need to interact with or build their own transaction manifest or header, or worry about hashing or other construction tools.

To simplify things as much as possible, `SimpleTransactionBuilder` only supports a single signer for the transaction, and it makes this signer also the tranasction's notary, with `notaryAsSigner` set to `true`. At the current moment of time, the `SimpleTransactionBuilder` supports a single action: the transfer of fungible tokens. Additional actions can be added to this class in the future to allow it to be more useful for other use cases.

### Simple Transfer Construction

The following demonstrates how to create a fungible resource transaction to transfer from `fromAccountAddress` to one or more other accounts.

The `fromAccountAddress` is used to pay fees. If the account is a standard virtual account protected by its corresponding public key, then the
`fromAccountPublicKey` will be the public key which was used to derive the `fromAccountAddress`, via `LTSRadixEngineToolkit.Derive.virtualAccountAddress` (see the next section).

Note that virtual account addresses only contain the hash of the public key - so you will need to store the mapping of account
address to public / private key for your accounts yourself.

```ts
import {
  NetworkId,
  PrivateKey,
  NotarizedTransaction,
  SimpleTransactionBuilder,
  Signature,
  PublicKey,
  CompiledSignedTransactionIntent,
} from "@radixdlt/radix-engine-toolkit";

const sign = async (publicKey: PublicKey.PublicKey, hashToSign: Uint8Array): Promise<Signature.Signature> => {
  /* See "External Signing" section of this document */
};

// Construction metadata
const currentEpoch = /* Sourced from /lts/transaction/construction in the Core API - or the Gateway */;

// Example of public key creation (you can also provide a Uint8Array instead of hex in the constructors)
const exampleEd25519PublicKey = new PublicKey.EddsaEd25519(
  "026f08db98ef1d0231eb15580da9123db8e25aa1747c8c32e5fd2ec47b8db73d5c"
);
const exampleSecp256k1PublicKey = new PublicKey.EcdsaSecp256k1(
  "03ce65a44a837dd5cd0e274c3280ab3d602e7ce1e1e3eaff769f2d2fc54cac733e"
);

// Account information
// Note - the address can either be derived from a public key with `LTSRadixEngineToolkit.Derive.virtualAccountAddress`
// or from an Olympia address with `LTSRadixEngineToolkit.Derive.babylonAccountAddressFromOlympiaAccountAddress`-
// discussed in more detail in the section below.
const fromAccountPublicKey = exampleEd25519PublicKey;
const fromAccountAddress = "account_sim1qjdkmaevmu7ggs3jyruuykx2u5c2z7mp6wjk5f5tpy6swx5788";

// Recipient/s
const toAccountAddress1 = "account_sim1qj0vpwp3l3y8jhk6nqtdplx4wh6mpu8mhu6mep4pua3q8tn9us";
const toAccountAddress2 = "account_sim1qjj40p52dnww68e594c3jq6h3s8xr75fgcnpvlwmypjqmqamld";

// The fungible resource being transferred
const resourceAddress = "resource_sim1qyw4pk2ecwecslf55dznrv49xxndzffnmpcwjavn5y7qyr2l73";

const builder = await SimpleTransactionBuilder.new({
  networkId: NetworkId.RCNetV1,
  validFromEpoch: currentEpoch,
  fromAccount: fromAccountAddress,
  signerPublicKey: fromAccountPublicKey,
});

const unsignedTransaction = builder
  /* The following defaults are used:
  .permanentlyRejectAfterEpochs(2) // Transaction with expire after approximately 5-10 minutes.
  .tipPercentage(0)                // No tip
  .lockedFee(5)                    // Maximum fee of 5 XRD - but requires at least 5 XRD in the account
  .feePayer(fromAccountAddress)    // The origin of the funds also pays the fees
  */
  .transferFungible({ toAccount: toAccountAddress1, resourceAddress: resourceAddress, amount: 100 })
  .transferFungible({ toAccount: toAccountAddress2, resourceAddress: resourceAddress, amount: "23.12323312" })
  .compileIntent();

const signature = await sign(fromAccountPublicKey, unsignedTransaction.hashToNotarize);

const transaction = unsignedTransaction.compileNotarized(signature);

// Will throw if eg the signature is incorrect
(await transaction.staticallyValidate(NetworkId.RCNetV1)).throwIfInvalid();

// The notarized payload bytes in hex - for submitting to the network.
const notarizedTransactionHex = transaction.toHex();

// The transaction intent hash is also known as the transaction id - and is used to
// query APIs or the dashboard for transaction status.
const transactionIntentHashHex = transaction.intentHashHex();
// The payload hash - used to disambiguate multiple payloads for the same intent - in the unlikely
// situation where a notary submits multiple distinct payloads for the same intent.
const notarizedPayloadHashHex = transaction.notarizedPayloadHashHex();

// You can then use these to interact with the Core API or Gateway API, eg with the Core API:
// * Submit the `notarizedTransactionHex` to `/core/lts/transaction/submit`
// * Check commit status using `transactionIntentHashHex` with `/core/lts/transaction/status`
```

The `SimpleTransactionBuilder` defaults to the `fromAccount` specified at the object's instantiation-time being the payer of the fees. However, this can be configured such that the `fromAccount` (the account that the resources are being withdrawn from) is different from the `feePayer` (the account that will be paying the network fees). Thus, transactions built with the `fromAccount` and `feePayer` being different will often times need to provide two signatures to be able to access funds from both accounts. The `SimpleTransactionBuilder` allows for that through the `compileIntentWithSignatures` and `compileIntentWithSignaturesAsync` methods which allows the caller to add additional signatures to the transaction. The most convenient way of using this feature is by providing a `sign` function (similar to the one seen in the previous example) to these methods.

The following example expands on the previous example where we now wish to pay fees through one account but transfer funds from another account. This example shows how the `SimpleTransactionBuilder` may be configured to do that and also shows an example `signIntent` method which we will be using here to allow the transaction to spend funds from the `feePayer`'s account.

```ts
import {
  NetworkId,
  PrivateKey,
  NotarizedTransaction,
  SimpleTransactionBuilder,
  Signature,
  SignatureWithPublicKey,
  PublicKey,
  CompiledSignedTransactionIntent,
} from "@radixdlt/radix-engine-toolkit";

const sign = async (publicKey: PublicKey.PublicKey, hashToSign: Uint8Array): Promise<Signature.Signature> => {
  /* See "External Signing" section of this document */
};

const signIntent = async (hashToSign: Uint8Array): Promise<SignatureWithPublicKey.SignatureWithPublicKey> => {
  /* See "External Signing" section of this document */
}

// Construction metadata
const currentEpoch = /* Sourced from /lts/transaction/construction in the Core API - or the Gateway */;

// Example of public key creation (you can also provide a Uint8Array instead of hex in the constructors)
const exampleEd25519PublicKey = new PublicKey.EddsaEd25519(
  "026f08db98ef1d0231eb15580da9123db8e25aa1747c8c32e5fd2ec47b8db73d5c"
);
const exampleSecp256k1PublicKey = new PublicKey.EcdsaSecp256k1(
  "03ce65a44a837dd5cd0e274c3280ab3d602e7ce1e1e3eaff769f2d2fc54cac733e"
);

// Account information
// Note - the address can either be derived from a public key with `LTSRadixEngineToolkit.Derive.virtualAccountAddress`
// or from an Olympia address with `LTSRadixEngineToolkit.Derive.babylonAccountAddressFromOlympiaAccountAddress`-
// discussed in more detail in the section below.
const fromAccountPublicKey = exampleEd25519PublicKey;
const fromAccountAddress = "account_sim1qjdkmaevmu7ggs3jyruuykx2u5c2z7mp6wjk5f5tpy6swx5788";
const feePayerAccountAddress = "account_sim1q3cztnp4h232hsfmu0j63f7f7mz5wxhd0n0hqax6smjqznhzrp";

// Recipient/s
const toAccountAddress1 = "account_sim1qj0vpwp3l3y8jhk6nqtdplx4wh6mpu8mhu6mep4pua3q8tn9us";
const toAccountAddress2 = "account_sim1qjj40p52dnww68e594c3jq6h3s8xr75fgcnpvlwmypjqmqamld";

// The fungible resource being transferred
const resourceAddress = "resource_sim1qyw4pk2ecwecslf55dznrv49xxndzffnmpcwjavn5y7qyr2l73";

const builder = await SimpleTransactionBuilder.new({
  networkId: NetworkId.RCNetV1,
  validFromEpoch: currentEpoch,
  fromAccount: fromAccountAddress,
  signerPublicKey: fromAccountPublicKey,
});

const unsignedTransaction = await builder
  /* The following defaults are used:
  .permanentlyRejectAfterEpochs(2) // Transaction with expire after approximately 5-10 minutes.
  .tipPercentage(0)                // No tip
  .lockedFee(5)                    // Maximum fee of 5 XRD - but requires at least 5 XRD in the account
  */
  .feePayer(feePayerAccountAddress)
  .transferFungible({ toAccount: toAccountAddress1, resourceAddress: resourceAddress, amount: 100 })
  .transferFungible({ toAccount: toAccountAddress2, resourceAddress: resourceAddress, amount: "23.12323312" })
  .compileIntentWithSignaturesAsync([signIntent]);

const signature = await sign(fromAccountPublicKey, unsignedTransaction.hashToNotarize);

const transaction = unsignedTransaction.compileNotarized(signature);

// Will throw if eg the signature is incorrect
(await transaction.staticallyValidate(NetworkId.RCNetV1)).throwIfInvalid();

// The notarized payload bytes in hex - for submitting to the network.
const notarizedTransactionHex = transaction.toHex();

// The transaction intent hash is also known as the transaction id - and is used to
// query APIs or the dashboard for transaction status.
const transactionIntentHashHex = transaction.intentHashHex();
// The payload hash - used to disambiguate multiple payloads for the same intent - in the unlikely
// situation where a notary submits multiple distinct payloads for the same intent.
const notarizedPayloadHashHex = transaction.notarizedPayloadHashHex();

// You can then use these to interact with the Core API or Gateway API, eg with the Core API:
// * Submit the `notarizedTransactionHex` to `/core/lts/transaction/submit`
// * Check commit status using `transactionIntentHashHex` with `/core/lts/transaction/status`
```

### Getting XRD from a Testnet Faucet

The `SimpleTransactionBuilder` has built-in support for creating transactions to get funds from testnet faucets and into an account.

```ts
import {
  PrivateKey,
  SimpleTransactionBuilder,
} from "@radixdlt/radix-engine-toolkit";

const compiledNotarizedTransaction =
  await SimpleTransactionBuilder.freeXrdFromFaucet({
    toAccount: "account_sim1q3cztnp4h232hsfmu0j63f7f7mz5wxhd0n0hqax6smjqznhzrp",
    networkId: NetworkId.RCNetV1,
    validFromEpoch: 10,
  });
```

### External Signing

The TypeScript Radix Engine Toolkit offers clients of the library two main ways to sign or notarize their transactions:

1. If the private keys are already loaded in memory then the easiest and most convenient way to provide signatures is through the `PrivateKey` class which all methods in the Radix Engine Toolkit that add signatures take as an argument.
2. If the private keys can not be loaded into memory such as cases where a custodian or HSM is used, then the library allows for clients to provide it with "signature functions" in place of the private key. These signature functions typically have a function signature of: `(hashToSign: Uint8Array) -> SignatureWithPublicKey.SignatureWithPublicKey` in case of intent signatures and `(hashToSign: Uint8Array) -> Signature.Signature` in case of notary signatures.

The second item is what we refer to as "external signing" where a signature function is provided as a signature source.

The two curves supported by this library and by the Radix stack are the Ecdsa Secp256k1 and EdDSA Ed25519 curves and signature schemes. If you will be using an external service or external library to produce signatures for hashes provided by this library then keep the following items in mind:

* This library will always provide you with the hash to sign, which is the data after it has been hashed with the Blake2b-256 algorithm. Thus, if you will be signing this data through Secp256k1, there is no need to hash the data again. If you will be signing it through Ed25519, there is also no need to hash it again, the Ed25519 signature scheme will internally hash it again through SHA-512, which is acceptable.
* If using Ed25519, the signature is encoded as the standard 64-byte encoding for Ed25519 signatures.
* If using Secp256k1, signatures should be serialized as recoverable signatures of 65 bytes, with the recovery byte first, as: `v || r || s`.
  * Note that there isn’t a de-facto convention for serialization of compact Secp256k1 signatures. On Olympia, ASN.1 was used - the above format for Babylon is different - and more compact.
  * Note that some libraries (such as libsecp256k1) have their own compact serialization and a few serialize it as `reverse(r) || reverse(s) || v`.

All the signature sources that this library uses requires functions which return either a `Signature.Signature` or a `SignatureWithPublicKey.SignatureWithPublicKey`. The following examples will showcase how these can be constructed. For the purpose of these examples we will be using the `PrivateKey` class from this library. However, you do not have to do that, in fact, the external signing features of this library are designed such that you do not have to use the `PrivateKey` class or load your keys in memory at all!.

First, say we would like to write a function that produces intent signatures using the `PrivateKey` class. 

```ts
const sign = (hashToSign: Uint8Array): Signature.Signature => {
  // We will be using only the most primitive methods of a private key here.
  const privateKey: PrivateKey.EcdsaSecp256k1 = /* Initialization */;

  const signature = privateKey.sign(hashToSign);
  const signatureObject = new Signature.EcdsaSecp256k1(signature);

  return signatureObject
}
```

Similarly, if w would like to write a signature function that returns a `SignatureWithPublicKey` then we we can do the following:

```ts
const sign = (hashToSign: Uint8Array): SignatureWithPublicKey.SignatureWithPublicKey => {
  // We will be using only the most primitive methods of a private key here.
  const privateKey: PrivateKey.EddsaEd25519 = /* Initialization */;

  const signature = privateKey.sign(hashToSign);
  const publicKey = privateKey.publicKeyBytes();
  const signatureObject = new SignatureWithPublicKey.EddsaEd25519(signature, publicKey);

  return signatureObject
}
```

## `LTSRadixEngineToolkit` Functionality

This section discusses the functionality provided by the `LTSRadixEngineToolkit` class and provides a number of examples.

### Transaction Class

A majority of the functionality exposed by this Class is abstracted away by the `SimpleTransactionBuilder` which is responsible for handling the entire transaction construction process and making all of the necessary Radix Engine Toolkit invocations to construct transactions. However, not all of the functions in this group are available through the `SimpleTransactionBuilder` class. Namely, the `summarizeTransaction` function is not.

#### Summarize Transaction

The LTS Radix Engine Toolkit exposes a `summarizeTransaction` function that summarizes the withdraws, deposits, and fees locked in transactions based on the transaction manifest. This function is only able to produce a summary for transactions constructed by the `SimpleTransactionBuilder` and fails to produce a summary for any other more complex transactions.

```ts
import {
  CompiledNotarizedTransaction,
  CompiledSignedTransactionIntent,
  LTSRadixEngineToolkit
} from "@radixdlt/radix-engine-toolkit";

let compiledIntent: Uint8Array = /* Some compiled intent */;
let transactionSummary = await LTSRadixEngineToolkit.Transaction.summarizeTransaction(compiledIntent);
console.log(transactionSummary)
```

### Derive Class

This is a group of functions exposed by the `LTSRadixEngineToolkit` that are used to perform various kinds of derivations. Typically, these are address derivations.

#### Deriving The (Virtual) Account Address from a Public Key

The `Derive` Class of the `LTSRadixEngineToolkit` class exposes methods for deriving the (virtual) account component address associated with a public key.

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

The `Derive` Class of the `LTSRadixEngineToolkit` class exposes methods for deriving the Babylon (virtual) account component address associated with an Olympia account address.

```ts
import {
  LTSRadixEngineToolkit,
  PublicKey,
  NetworkId,
} from "@radixdlt/radix-engine-toolkit";

const olympiaAccountAddress: string =
  "rdx1qspx7zxmnrh36q33av24srdfzg7m3cj65968erpjuh7ja3rm3kmn6hq4j9842";
const { babylonAccountAddress, publicKey } =
  await LTSRadixEngineToolkit.Derive.babylonAccountAddressFromOlympiaAccountAddress(
    olympiaAccountAddress,
    NetworkId.Mainnet /* The ID of the network to derive the address for. */
  );
console.log(babylonAccountAddress);
```

#### Deriving The Babylon Resource Address from an Olympia Account Address

The `Derive` Class of the `LTSRadixEngineToolkit` class exposes methods for deriving the Babylon resource address from an Olympia resource address.

```ts
import {
  LTSRadixEngineToolkit,
  NetworkId,
} from "@radixdlt/radix-engine-toolkit";

const olympiaResourceAddress = /* Some Olympia resource address */ 
const babylonResourceAddress =
  await LTSRadixEngineToolkit.Derive.babylonResourceAddressFromOlympiaResourceAddress(
    olympiaResourceAddress,
    NetworkId.Mainnet
  );
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

const knownAddresses = await LTSRadixEngineToolkit.Derive.knownAddresses(
  NetworkId.Mainnet /* The ID of the network to derive the addresses for. */
);
console.log(knownAddresses);
```

### Address Class

The LTS Radix Engine Toolkit exposes an `Address` class which (as of the time of writing) implements a number of static methods that are useful for determining what type the address is. The following are the methods implemented on this class:

- `isGlobalAccount`: Takes in an address and returns `true` if the address is of a global account component. Otherwise, it returns false.
- `isFungibleResource`: Takes in an address and returns `true` if the address is of a fungible resource. Otherwise, it returns false.
- `isNonFungibleResource`: Takes in an address and returns `true` if the address is of a non-fungible resource. Otherwise, it returns false.

The following is an example of how the `isGlobalAccount` method can be used to verify that a string we've been given is of an account address:

```ts
import { LTSRadixEngineToolkit } from "@radixdlt/radix-engine-toolkit";

const isAccountAddress = await LTSRadixEngineToolkit.Address.isGlobalAccount(
  "account_sim1q3cztnp4h232hsfmu0j63f7f7mz5wxhd0n0hqax6smjqznhzrp"
);
console.log(isAccountAddress);
```

### Utils Class

#### Hashing

The `Utils` Class of the `LTSRadixEngineToolkit` offers a method for hashing data through the hashing algorithm used in Scrypto and the Radix Engine which is Blake2b with 32 byte long digests.

```ts
import {
  LTSRadixEngineToolkit,
} from "@radixdlt/radix-engine-toolkit";

const data: Uint8Array = /* Some array of bytes */;
const blake2bHash: Uint8Array = LTSRadixEngineToolkit.Utils.hash(data);
```
