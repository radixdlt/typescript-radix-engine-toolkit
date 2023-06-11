# Long Term Support (LTS) Radix Engine Toolkit

| **Note** | It is recommended (but not required) to read the [README.md](./README.md) for additional context on the Radix Engine Toolkit as a library, it's architecture, advanced uses of the toolkit. |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

This `LTSRadixEngineToolkit` class is meant to provide a smaller interface with a higher degree of backward compatibility that is suitable for third parties looking to integrate with the Radix Babylon ledger.

An end-to-end example of using the `LTSRadixEngineToolkit` alongside the `LTS` part of the `CoreApiClient` ([@radixdlt/babylon-core-api-sdk](https://www.npmjs.com/package/@radixdlt/babylon-core-api-sdk)) with TypeScript and Node.js is [presented here](./examples/core-e2e-example).

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

`SimpleTransactionBuilder` currently supports creation of two transaction types:
* Transferring fungible resources - by using the `transferFungible` action. Multiple such actions are allowed in one transaction, from a single sender.
* Topping up an account with XRD from a faucet on a test network.

By default, `SimpleTransactionBuilder` uses a single signer for the transaction. This signer doubles as the notary by setting `notaryIsSigner` set to `true`.
It is also possible to pay fees from a separate account to the sender. Example code for this is also given below.

### Simple Transfer Construction (single signer)

The following demonstrates how to create a fungible resource transaction to transfer from `fromAccountAddress`.

In this example, the `fromAccountAddress` is used to pay fees. If the account is a standard virtual account protected by its corresponding public key, then the
`fromAccountPublicKey` will be the public key which was used to derive the `fromAccountAddress`, via `LTSRadixEngineToolkit.Derive.virtualAccountAddress` (see the later `Derive Class` section).

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

// CONSTRUCTION METADATA
// - The NetworkId (see https://github.com/radixdlt/typescript-radix-engine-toolkit/blob/main/src/network.ts)
// - The current epoch is sourced from /lts/transaction/construction in the Core API - or the Gateway
const networkId = NetworkId.RCNetV1;
const currentEpoch = /* Sourced from the API */;

// SENDER ACCOUNT INFORMATION
// - Radix supports both Ed25519 and Secp256k1 key-pairs for signing
// - Keys are associated with a "virtual" account
//
// IMPORTANT: You are responsible for safely generating, storing and signing with your keys:
// - See the "External Signing" section for using externally provided keys or HSMs (recommended)
// - The below example uses an example in-memory key.
//   In-memory keys might not be suitable for your requirements.
//   Such keys can be created from hex or with `new PrivateKey.EddsaEd25519` / `new PrivateKey.EcdsaSecp256k1`
// - See the "Derive Class" section for more information on how to derive addresses
const fromAccountPrivateKey = new PrivateKey.EddsaEd25519("d1d59441b3cc702aa9f314853c7111825a679c240b09402723c8825be356021a");
const fromAccountPublicKey = fromAccountPrivateKey.publicKey();
const fromAccountAddress = await LTSRadixEngineToolkit.Derive.virtualAccountAddress(fromAccountPublicKey);

// RESOURCE INFORMATION
// - Provide the resource address of the fungible resource you wish to transfer.
// - If transferring XRD, the address can be read from:
//   `(await LTSRadixEngineToolkit.Derive.knownAddresses(networkId)).xrdResource`
const resourceAddress = "resource_sim1qyw4pk2ecwecslf55dznrv49xxndzffnmpcwjavn5y7qyr2l73";

const builder = await SimpleTransactionBuilder.new({
  networkId,
  validFromEpoch: currentEpoch,
  fromAccount: fromAccountAddress,
  signerPublicKey: fromAccountPublicKey,
});

const transaction = await builder
  .transferFungible({
    toAccount: "account_sim1qj0vpwp3l3y8jhk6nqtdplx4wh6mpu8mhu6mep4pua3q8tn9us",
    resourceAddress: resourceAddress,
    amount: "23.12323312"
  })
  .compileIntent()
  .compileNotarizedAsync(
    // TRANSACTION SIGNING
    // - Sign the hash with the private key for the "from account"
    // - See the "External Signing" section if using an external key
    // - Notary signatures must return a `Signature` object (not a `SignatureWithPublicKey`)
    async (hash) => fromAccountPrivateKey.signToSignature(hash)
  );
```

The transaction can then be validated / summarized as follows:
```ts
// [OPTIONAL] VALIDATION & PARSING
// - To validate that the transaction has been correctly signed, you can use `staticallyValidate` as follows
// - If you wish to see the contents of the transaction before submission, this can be performed with `summarizeTransaction`
(await transaction.staticallyValidate(networkId)).throwIfInvalid();
const summary = await transaction.summarizeTransaction();
```

And the hex payload for submission, and transaction hashes for monitoring can be read from it as follows:
```ts
// TRANSACTION DATA
// The following are important pieces of data which can be read from the transaction object:
// - `notarizedTransactionHex`
//   > This is the transaction payload - for submitting to the network.
//   > Submit the `notarizedTransactionHex` to `/core/lts/transaction/submit` to submit the transaction to the network
// - `intentHashHex`
//   > Also known as the transaction id
//   > Used to query APIs or the dashboard for transaction status.
//   > Check commit status using `intentHashHex` with `/core/lts/transaction/status`
// - `notarizedTransactionHashHex`
//   > In the unlikely situation where a notary submits multiple distinct payloads for the same intent
//     this can be used to disambiguate those submitted intents
//   > Used to inspect further information in the `/core/lts/transaction/status` response
//
// Example code for submission and polling for commit is given at:
// https://github.com/radixdlt/typescript-radix-engine-toolkit/blob/main/examples/core-e2e-example/main.ts
const notarizedTransactionHex = transaction.toHex();
const intentHashHex = transaction.intentHashHex();
const notarizedTransactionHashHex = transaction.notarizedPayloadHashHex();
```

### Simple Transfer Construction (separate fee payer)

By default, the `SimpleTransactionBuilder` also uses the `fromAccount` to pay the XRD network fees for the transaction. However, it is also possible to pay for fees from a separate account (for example, to avoid temporary accounts being left with unused resources).

This can be achieved by setting the `feePayer` to be a different account address. Such transactions will need to provide two signatures to be able to access funds from both accounts. The `SimpleTransactionBuilder` allows for that through the `compileIntentWithSignaturesAsync` method adding additional signatures to the transaction.

Note that these additional intent signatures need to be a `SignatureWithPublicKey.SignatureWithPublicKey` rather then a `Signature.Signature` - see the "External Signing" section for more information on how to construct these objects from externally provided signatures.

As an example, take the `Simple Transfer Construction (single signer)` code and adapt it as follows:

```ts
import {
  NetworkId,
  PrivateKey,
  SimpleTransactionBuilder,
  PublicKey,
  LTSRadixEngineToolkit,
} from "@radixdlt/radix-engine-toolkit";

// Account information for the "fee payer"
const feePayerPrivateKey = /* See previous section */;
const feePayerPublicKey = /* See previous section */;
const feePayerAccountAddress = /* See previous section */;

// Account information for the "from account"
const fromAccountPrivateKey = /* See previous section */;
const fromAccountPublicKey = /* See previous section */;
const fromAccountAddress = /* See previous section */;

const builder = await SimpleTransactionBuilder.new({
  networkId,
  validFromEpoch: currentEpoch,
  fromAccount: fromAccountAddress,
  signerPublicKey: fromAccountPublicKey,
});

const signedIntent = await builder
  .feePayer(feePayerAccountAddress)
  .transferFungible({
    toAccount: "account_sim1qj0vpwp3l3y8jhk6nqtdplx4wh6mpu8mhu6mep4pua3q8tn9us",
    resourceAddress: "resource_sim1qyw4pk2ecwecslf55dznrv49xxndzffnmpcwjavn5y7qyr2l73",
    amount: "23.12323312"
  })
  .compileIntentWithSignaturesAsync([
    // TRANSACTION SIGNING (Additional signature/s)
    // - Sign the hash with the private key for the "fee payer", and provide it along with the public key.
    // - See the "External Signing" section for more information or if using an external key
    // - Intent signature/s must return a `SignatureWithPublicKey` object (not a `Signature`)
    // - NOTE: This is inside an array. It is possible to sign with multiple keys by providing multiple signing functions.
    async (hash) => feePayerPrivateKey.signToSignatureWithPublicKey(hash)
  ]);

const transaction = await signedIntent
  .compileNotarizedAsync(
    // TRANSACTION SIGNING (Main signature)
    // - Sign the hash with the private key for the "from account"
    // - See the "External Signing" section if using an external key
    // - Notary signatures must return a `Signature` object (not a `SignatureWithPublicKey`)
    async (hash) => fromAccountPrivateKey.signToSignature(hash)
  );
```

### Getting XRD from a Testnet Faucet

The `SimpleTransactionBuilder` has built-in support for creating transactions to get funds from testnet faucets and into an account.

You can adapt the `Simple Transfer Construction (single signer)` example, by creating the transaction as follows.
Note that `freeXrdFromFaucet` automatically signs the transaction for you - you just need to provide the `networkId`, `validFromEpoch` and `toAccount`.

```ts
const transaction =
  await SimpleTransactionBuilder.freeXrdFromFaucet({
    networkId,
    validFromEpoch: currentEpoch,
    toAccount: "account_sim1q3cztnp4h232hsfmu0j63f7f7mz5wxhd0n0hqax6smjqznhzrp",
  });
```

### Advanced builder options

The simple transaction builder has support for the following options:

* `.permanentlyRejectAfterEpochs(X)` - `X` defaults to `2` (epochs), which means uncommitted transactions will permanently reject after approximately 5-10 minutes.
* `.tipPercentage(X)` - `X` defaults to `0` (percent), which specifies no tip. A tip percentage can be added if the network is congested, to have the transaction
  priotized, at the expense of paying a larger fee.
* `.lockedFee(X)` - with `X` defaulting to `5` (XRD). This much fee needs to be present in the account for the transaction to execute. The amount of fee locked must cover all the work in the transaction. For simple transactions, this number can be decreased.
* `.feePayer(X)` - with `X` defaulting to the `fromAccountAddress`. This is the account from which the fee is locked.

The simple transaction builder can also support sending multiple transfers from the sender account.

## Keys and Signatures

Radix supports using either EdDSA Ed25519 or ECDSA Secp256k1 for signing.

This library will always provide you with the hash to sign, which will be 32 bytes:
* If you will be signing with Ed25519, you should sign this hash as the message. The Ed25519 signature scheme will internally hash it again through SHA-512 before signing with EdDSA.
* If you will be signing with Secp256k1, you should sign this hash. If you will be signing it through Ed25519, there is also no need to hash it again, the Ed25519 signature scheme will internally hash it again through SHA-512, which is acceptable.

Users of the TypeScript Radix Engine Toolkit are responsible for deciding how they wish to safely generate, store, and work with/use their keys.

### In-memory signing

Whilst the toolkit provides an option of signing with in-memory private keys (via the `PrivateKey` class), this may not be suitable for your use case / security model, and it is up to the user to decide the correct pattern.

For testing purposes, an example of generating a random Ed25519 public key is [presented here](./examples/core-e2e-example) - although this is only an example, and it is up to users to generate keys securely for their use cases.

```ts
// In memory private keys can be created by passing the hex-encoded (or Uint8Array) private key in the constructor.
const exampleEd25519PrivateKey = new PrivateKey.EddsaEd25519("853fb22a561daf33c15b740032d4c0a29b250ce9dd6ead6de87233f8e0673951");
const exampleSecp256k1PrivateKey = new PrivateKey.EcdsaSecp256k1("5e6274f50230ef9f9fe51f958ca7d3fe5a69750928c12840b2282a22e15947f0");
```

### External Signing

Where possible, clients of the toolkit are encouraged to consider using external keys or HSMs.

To use with the toolkit, the public keys and signatures will need to be wrapped in their corresponding wrapper object 
(`PublicKey`, `Signature` and `SignatureWithPublicKey`). All of these constructors take either a `Uint8Array` or the hex-encoded bytes as a string.

Public keys should be encoded as bytes as follows:

* If using Ed25519, the public key is encoded as the standard 32-byte encoding for Ed25519 public keys.
* If using Secp256k1, the public key is encoded as the standard 33-byte encoding for compressed Secp256k1 public keys (X coordinate and the sign byte).

```ts
const exampleEd25519PublicKey = new PublicKey.EddsaEd25519("ea691c49cf2cbf26ada3677069e6196dc85b9357af7a732f46b3e9d6ff28a44c");
const exampleSecp256k1PublicKey = new PublicKey.EcdsaSecp256k1("02668a20dc7916eaa1eb1965538f4964ad2061844aa559e2063b4e6040700a8fdf");
```

Signatures should be encoded as bytes as follows:

* If using Ed25519, the signature is encoded as the standard 64-byte encoding for Ed25519 signatures.
* If using Secp256k1, signatures should be serialized as recoverable signatures of 65 bytes, with the recovery byte first, as: `v || r || s`.
  * Note that there isn’t a de-facto convention for serialization of compact Secp256k1 signatures. On Olympia, ASN.1 was used - the above format for Babylon is different - and more compact.
  * Note that some libraries (such as libsecp256k1) have their own compact serialization and a few serialize it as `reverse(r) || reverse(s) || v`.

Signatures are used in one of two variants, "normal" or "with public key". Normal signatures are used for the notary signature, and signatures "with public key" are used for additional intent signatures. These `Signature` / `SignatureWithPublicKey` objects are created as follows:

```ts
// Signature (without explicit public key)
const exampleEd25519Signature = new Signature.EddsaEd2551(
  "0cc77c60db5c294f157a7898443034a71a220be6029283fad619dfbde29f3b877552a5b215748e7c76d3961ae48e6ec3fc100e0af9f55bd0a79835fdc32a5904"
);
const exampleSecp256k1Signature = new Signature.EcdsaSecp256k1(
  "00e357e470c78e557a6f62517633c628765616213eb1dc34f6fb01f8a7d6b4b4034795a2231d3b1c694dd5b8a65ac5ee342f7d552017d15cd279f996742b3da436"
);

// SignatureWithPublicKey
const exampleEd25519SignatureWithPublicKey = new SignatureWithPublicKey.EddsaEd25519(
  exampleEd25519Signature.bytes(), // The signature hex or Uint8Array
  exampleEd25519PublicKey.bytes(), // The public key hex or Uint8Array
)
// Note that because the Secp256k1 signature is recoverable, a separate public key does not need to be provided
const exampleSecp256k1SignatureWithPublicKey = new SignatureWithPublicKey.EcdsaSecp256k1(
  exampleSecp256k1Signature.bytes(), // The public key hex or Uint8Array
);
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
