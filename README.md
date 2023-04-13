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

Given a `TransactionIntent` object, the `RadixEngineToolkit` class can be used to compile the it down to a byte array of SBOR bytes. 

#### Example A

`TransactionIntent` objects have a `compile` method which performs the required invocations to the `RadixEngineToolkit` class to compile the object to a `Uint8Array` of the compiled intent.

```ts
import { TransactionIntent } from '@radixdlt/radix-engine-toolkit';

let transactionIntent: TransactionIntent = /* A transaction intent */;
let compiledTransactionIntent: Uint8Array = await transactionIntent.compile();
```

#### Example B

The `RadixEngineToolkit` class exposes functions for compiling `TransactionIntent` objects. In fact, under the hood of the syntax seen in the above example (Example A), this exactly call to `compileTransactionIntent` is what takes place.

```ts
import { TransactionIntent, RadixEngineToolkit } from '@radixdlt/radix-engine-toolkit';

let transactionIntent: TransactionIntent = /* A transaction intent */;
let compiledTransactionIntent: Uint8Array = await RadixEngineToolkit.compileTransactionIntent(
    transactionIntent
);
```

### Compiling `SignedTransactionIntent`s

Given a `SignedTransactionIntent` object, the `RadixEngineToolkit` class can be used to compile the it down to a byte array of SBOR bytes. 

#### Example A

`SignedTransactionIntent` objects have a `compile` method which performs the required invocations to the `RadixEngineToolkit` class to compile the object to a `Uint8Array` of the compiled signed intent.

```ts
import { SignedTransactionIntent } from '@radixdlt/radix-engine-toolkit';

let signedTransactionIntent: SignedTransactionIntent = /* A transaction intent */;
let compiledSignedTransactionIntent: Uint8Array = await signedTransactionIntent.compile();
```

#### Example B

The `RadixEngineToolkit` class exposes functions for compiling `TransactionIntent` objects. In fact, under the hood of the syntax seen in the above example (Example A), this exactly call to `compileTransactionIntent` is what takes place.

```ts
import { SignedTransactionIntent, RadixEngineToolkit } from '@radixdlt/radix-engine-toolkit';

let signedTransactionIntent: SignedTransactionIntent = /* A signed transaction intent */;
let compiledSignedTransactionIntent: Uint8Array = await RadixEngineToolkit.compileSignedTransactionIntent(
    signedTransactionIntent
);
```

### Compiling `NotarizedTransaction`s

Given a `NotarizedTransaction` object, the `RadixEngineToolkit` class can be used to compile the it down to a byte array of SBOR bytes. 

#### Example A

`NotarizedTransaction` objects have a `compile` method which performs the required invocations to the `RadixEngineToolkit` class to compile the object to a `Uint8Array` of the compiled signed intent.

```ts
import { NotarizedTransaction } from '@radixdlt/radix-engine-toolkit';

let notarizedTransaction: NotarizedTransaction = /* A transaction intent */;
let compiledNotarizedTransaction: Uint8Array = await notarizedTransaction.compile();
```

#### Example B

The `RadixEngineToolkit` class exposes functions for compiling `TransactionIntent` objects. In fact, under the hood of the syntax seen in the above example (Example A), this exactly call to `compileTransactionIntent` is what takes place.

```ts
import { NotarizedTransaction, RadixEngineToolkit } from '@radixdlt/radix-engine-toolkit';

let notarizedTransaction: NotarizedTransaction = /* A signed transaction intent */;
let compiledNotarizedTransaction: Uint8Array = await RadixEngineToolkit.compileNotarizedTransactionIntent(
    notarizedTransaction
);
```

## Transaction Decompilation

The TypeScript Radix Engine Toolkit is capable of decompiling transaction intents from their SBOR byte array format to a human-readable/machine-readable format that's easy to understand, read, and parse. This is useful when verifying transactions before signing them to ensure that they contain the intent that was communicated. 

Similar to compilation, the Radix Engine Toolkit is able to decompile all three transaction intent types: (Unsigned) Transaction intents, signed transaction intents, and notarized transaction intents.

During decompilation, the client is free to choose the format of the output manifest instructions which can either be `String` or `Parsed`. The `String` format is the most common format and is the one seen in the `.rtm` files, in the radixdlt-scrypto repository, and almost everywhere. The `Parsed` format is a less common format but one which a number of programmatic clients rely on heavily which represents manifests as an AST of the various tokens in the tree. 

### Decompiling Unknown Intents

There might be cases when the client is presented with an intent of an unknown kind and wishes to decompile said intent; as in, it is unknown whether this is an unsigned transaction intent, signed transaction intent, or a notarized transaction intent. While it's certainly possible for the client to try all of the different possibilities to figure it out, the core toolkit offers a function that determines the type of the intent and decompiles it accordingly.  

```ts
import { 
    RadixEngineToolkit, 
    TransactionIntent,
    SignedTransactionIntent,
    NotarizedTransaction
} from '@radixdlt/radix-engine-toolkit';

let compiledUnknownIntent: Uint8Array = /* Some compiled intent */;
let decompiledUnknownIntent = await RadixEngineToolkit.decompileUnknownTransactionIntent(
    compiledUnknownIntent
);
if (decompiledUnknownIntent instanceof TransactionIntent) {
    console.log('Transaction Intent', decompiledUnknownIntent.toString());
} else if (decompiledUnknownIntent instanceof SignedTransactionIntent) {
    console.log('Signed Transaction Intent', decompiledUnknownIntent.toString());
} else if (decompiledUnknownIntent instanceof NotarizedTransaction) {
    console.log('Notarized Transaction Intent', decompiledUnknownIntent.toString());
}
```