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
* All of the needed features to build a complete programmatic wallet as evident by the iOS and Android wallet which utilize Radix Engine Toolkit wrappers in their respective languages.

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

The `RadixEngineToolkit` class exposes functions for compiling `TransactionIntent` objects. In fact, under the hood of the syntax seen in the above example (Example A), this exact call to `compileTransactionIntent` is what takes place.

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

The `RadixEngineToolkit` class exposes functions for compiling `TransactionIntent` objects. In fact, under the hood of the syntax seen in the above example (Example A), this exact call to `compileSignedTransactionIntent` is what takes place.

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

The `RadixEngineToolkit` class exposes functions for compiling `TransactionIntent` objects. In fact, under the hood of the syntax seen in the above example (Example A), this exact call to `compileNotarizedTransactionIntent` is what takes place.

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

During decompilation, the client is free to choose the format of the output manifest instructions which can either be `String` or `Parsed`. The `String` format is the most common format and is the one seen in the `.rtm` files, in the radixdlt-scrypto repository, and almost everywhere. The `Parsed` format is a less common format but one which a number of programmatic clients heavily rely on which represents manifests as an AST of the various tokens in the tree. 

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

### Decompiling a `TransactionIntent`

Given a byte array (`Uint8Array`) which is known to be a compiled `TransactionIntent`, the Radix Engine Toolkit can be used to decompile it to a `TransactionIntent` object. As previously stated, the client can specify whether they wish for the instructions in the decompiled intent to be `String` or `Parsed` instructions. If no format is specified, then it defaults to `String` instructions.

#### Example A

The `TransactionIntent` class has a static `decompile` function which can be thought of as a constructor for the class that's capable of creating objects of the class given a compiled transaction intent and an optional format of the instructions.

```ts
import { 
    TransactionIntent, 
    InstructionList 
} from '@radixdlt/radix-engine-toolkit';

let compiledTransactionIntent: Uint8Array = /* Some compiled intent */;
let transactionIntent: TransactionIntent = await TransactionIntent.decompile(
    compiledTransactionIntent,
    InstructionList.String /* Optional argument, defaults to `String` if not provided */
);
console.log('Transaction Intent:', transactionIntent.toString())
```

#### Example B

An alternative to the above is calling the `decompileTransactionIntent` function on the `RadixEngineToolkit` class. In fact, under the hood of the syntax seen in the above example (Example A), this exact call to `decompileTransactionIntent` is what takes place.

```ts
import { 
    RadixEngineToolkit,
    TransactionIntent, 
    InstructionList 
} from '@radixdlt/radix-engine-toolkit';

let compiledTransactionIntent: Uint8Array = /* Some compiled intent */;
let transactionIntent: TransactionIntent = await RadixEngineToolkit.decompileTransactionIntent(
    compiledTransactionIntent,
    InstructionList.String /* Optional argument, defaults to `String` if not provided */
);
console.log('Transaction Intent:', transactionIntent.toString())
```

### Decompiling a `SignedTransactionIntent`

Given a byte array (`Uint8Array`) which is known to be a compiled `SignedTransactionIntent`, the Radix Engine Toolkit can be used to decompile it to a `SignedTransactionIntent` object. As previously stated, the client can specify whether they wish for the instructions in the decompiled intent to be `String` or `Parsed` instructions. If no format is specified, then it defaults to `String` instructions.

#### Example A

The `SignedTransactionIntent` class has a static `decompile` function which can be thought of as a constructor for the class that's capable of creating objects of the class given a compiled transaction intent and an optional format of the instructions.

```ts
import { 
    SignedTransactionIntent, 
    InstructionList 
} from '@radixdlt/radix-engine-toolkit';

let compiledSignedTransactionIntent: Uint8Array = /* Some compiled intent */;
let signedTransactionIntent: SignedTransactionIntent = await SignedTransactionIntent.decompile(
    compiledSignedTransactionIntent,
    InstructionList.String /* Optional argument, defaults to `String` if not provided */
);
console.log('Signed Transaction Intent:', signedTransactionIntent.toString())
```

#### Example B

An alternative to the above is calling the `decompileSignedTransactionIntent` function on the `RadixEngineToolkit` class. In fact, under the hood of the syntax seen in the above example (Example A), this exact call to `decompileSignedTransactionIntent` is what takes place.

```ts
import { 
    RadixEngineToolkit,
    SignedTransactionIntent, 
    InstructionList 
} from '@radixdlt/radix-engine-toolkit';

let compiledSignedTransactionIntent: Uint8Array = /* Some compiled intent */;
let signedTransactionIntent: SignedTransactionIntent = await RadixEngineToolkit.decompileSignedTransactionIntent(
    compiledSignedTransactionIntent,
    InstructionList.String /* Optional argument, defaults to `String` if not provided */
);
console.log('Signed Transaction Intent:', signedTransactionIntent.toString())
```

### Decompiling a `NotarizedTransaction`

Given a byte array (`Uint8Array`) which is known to be a compiled `NotarizedTransaction`, the Radix Engine Toolkit can be used to decompile it to a `NotarizedTransaction` object. As previously stated, the client can specify whether they wish for the instructions in the decompiled intent to be `String` or `Parsed` instructions. If no format is specified, then it defaults to `String` instructions.

#### Example A

The `NotarizedTransaction` class has a static `decompile` function which can be thought of as a constructor for the class that's capable of creating objects of the class given a compiled transaction intent and an optional format of the instructions.

```ts
import { 
    NotarizedTransaction, 
    InstructionList 
} from '@radixdlt/radix-engine-toolkit';

let compiledNotarizedTransaction: Uint8Array = /* Some compiled intent */;
let notarizedTransactionIntent: NotarizedTransaction = await NotarizedTransaction.decompile(
    compiledNotarizedTransaction,
    InstructionList.String /* Optional argument, defaults to `String` if not provided */
);
console.log('Signed Transaction Intent:', notarizedTransactionIntent.toString())
```

#### Example B

An alternative to the above is calling the `decompileNotarizedTransactionIntent` function on the `RadixEngineToolkit` class. In fact, under the hood of the syntax seen in the above example (Example A), this exact call to `decompileNotarizedTransactionIntent` is what takes place.

```ts
import { 
    RadixEngineToolkit,
    NotarizedTransaction, 
    InstructionList 
} from '@radixdlt/radix-engine-toolkit';

let compiledNotarizedTransaction: Uint8Array = /* Some compiled intent */;
let notarizedTransactionIntent: NotarizedTransaction = await RadixEngineToolkit.decompileNotarizedTransactionIntent(
    compiledNotarizedTransaction,
    InstructionList.String /* Optional argument, defaults to `String` if not provided */
);
console.log('Signed Transaction Intent:', notarizedTransactionIntent.toString())
```