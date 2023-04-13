<div align="center">
  <h1><code>TypeScript Radix Engine Toolkit</code></h1>
  <p>
    <strong>A TypeScript wrapper for the Radix Engine Toolkit that provides many necessary tools to interact with the Radix ledger</strong>
  </p>
</div>

# About

This library brings the same support offered to Rust for transaction construction and validation, transaction decompilation, manifest parsing, **S**crypto **B**inary **O**bject **R**epresentation (SBOR) encoding and decoding, address derivations, and more to TypeScript and JavaScript through a [Rust backend](https://www.github.com/radixdlt/radix-engine-toolkit) that powers it all. The following is a list of the features offered by this library:

* Offline transaction construction and transaction manifest construction.
* Cryptographic primitives for signing and notarizing transactions.
* Static (offline) transaction validation
* The ability to convert manifests into their Abstract Syntax Tree (AST) representation which allows for them to be inspected and analyzed.
* Full support for all flavors of SBOR allowing clients to perform SBOR encoding and decoding.
* The ability to perform deterministic mapping of public keys to virtual account addresses, virtual component addresses, and Olympia account addresses. 

# Functionality

This section discusses the raw functionality offered by the TypeScript Radix Engine Toolkit and provides examples for how they can be achieved in code. 

## Transaction Compilation

The TypeScript Radix Engine Toolkit allows for transaction intents of various kinds to be compiled. The compilation of transaction intents is an essential part of transaction construction since what is signed is the hash of the compiled intents and not the human readable intents. The need to compile intents is abstracted away by the `TransactionBuilder` and the `ActionTransactionBuilder` classes (discussed elsewhere in this document) which allows clients to construct transactions without the need to understand or worry about the internals of how it is done. 

There are three main transaction intent types and the Radix Engine Toolkit allows for the compilation (and decompilation as well) of all three of the transaction intent types, the intent types are:

1. **(Unsigned) Transaction Intent:** contains the `TransactionManifest` and the `TransactionHeader` of the transaction which describe all of the asset movements as well as the transaction bounds, constraints, and notary.
2. **Signed Transaction Intent:** consists of the (Unsigned) `TransactionIntent` and zero or more intent signatures (`SignatureWithPublicKey`).
3. **Notarized Transaction Intent:** consists of the `SignedTransactionIntent` and exactly one notary signature (`Signature`) where the public key of the notary must match that present in the transaction intent.

### Compiling `TransactionIntent`s

Given a `TransactionIntent` object, the `RadixEngineToolkit` class can be used to compile the transaction intent down to a byte array of SBOR bytes. 

#### Example A

`TransactionIntent` objects have a `compile` method which performs the required invocations to the `RadixEngineToolkit` class to compile the object to a `Uint8Array` of the compiled intent.

```ts
import { TransactionIntent } from '@radixdlt/radix-engine-toolkit'

let transactionIntent: TransactionIntent = /* A transaction intent */;
let compiledTransactionIntent: Uint8Array = await transactionIntent.compile();
```

#### Example B

The `RadixEngineToolkit` class exposes functions for compiling `TransactionIntent` objects. In fact, under the hood of the syntax seen in the above example (Example A), this exactly call to `compileTransactionIntent` is what takes place.

```ts
import { TransactionIntent, RadixEngineToolkit } from '@radixdlt/radix-engine-toolkit'

let transactionIntent: TransactionIntent = /* A transaction intent */;
let compiledTransactionIntent: Uint8Array = await RadixEngineToolkit.compileTransactionIntent(transactionIntent);
```