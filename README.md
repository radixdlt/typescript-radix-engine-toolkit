<div align="center">
  <h1><code>TypeScript Radix Engine Toolkit</code></h1>
  <p>
    <strong>A TypeScript wrapper for the Radix Engine Toolkit that provides many necessary tools to interact with the Radix ledger</strong>
  </p>
</div>

# About

This library brings the same support offered to Rust for transaction construction, validation, and decompilation, manifest parsing, **S**crypto **B**inary **O**bject **R**epresentation (SBOR) encoding and decoding, address derivations, and more to TypeScript and JavaScript through a [Rust backend](https://www.github.com/radixdlt/radix-engine-toolkit) that powers it all. The following is a list of the features offered by this library:

- Offline transaction construction and transaction manifest construction.
- Cryptographic primitives for signing and notarizing transactions.
- Static (offline) transaction validation.
- The ability to convert manifests into their Abstract Syntax Tree (AST) representation and back to their string representation.
- Full support for all flavors of SBOR allowing clients to perform SBOR encoding and decoding.
- The ability to perform deterministic mapping of public keys to virtual account addresses, virtual component addresses, and Olympia account addresses. In addition to the ability to perform the deterministic mapping from Olympia account addresses to Babylon account addresses
- All of the needed features to build a complete programmatic wallet as evident by the iOS and Android wallet which utilize Radix Engine Toolkit wrappers in their respective languages.

# High Level Functionality

This library comes with a number of high-level functionalities that can be useful to a number of clients. Among those functionalities is the ability to build manifests and contract transactions.

## Building Manifests

The Radix Engine Toolkit comes with a manifest builder which is heavily inspired by the builder present in the Scrypto repository and commonly seen in unit test. This manifest builder has an ID allocator which allows users of the builder to not specify the ids for various buckets and proofs created in the manifest. Additionally, the manifest builder is able to handle blobs in a more developer friendly way for instructions such as `PublishPackage`. 

```ts
import { ManifestBuilder } from '@radixdlt/radix-engine-toolkit';

let manifest = new ManifestBuilder()
  .callMethod(
    "account_sim1q3cztnp4h232hsfmu0j63f7f7mz5wxhd0n0hqax6smjqznhzrp",
    "withdraw",
    [
      new ManifestAstValue.Address(
        "resource_sim1qf7mtmy9a6eczv9km4j4ul38cfvap0zy6juuj8m8xnxqlla6pd"
      ),
      new ManifestAstValue.Decimal(10),
    ]
  )
  .takeFromWorktop(
    "resource_sim1qf7mtmy9a6eczv9km4j4ul38cfvap0zy6juuj8m8xnxqlla6pd",
    (builder, bucket) =>
      builder.callMethod(
        "account_sim1qs5mg6tcehg95mugc9d3lpl90clnl787zmhc92cf04wqvqvztr",
        "deposit",
        [bucket]
      )
  )
  .build();

console.log(manifest.toString());
```

# Functionality

This section discusses the raw functionality offered by the TypeScript Radix Engine Toolkit and provides examples for how they can be achieved in code.

## Convert Manifest

The most common format for transaction manifests is the string format seen in Radix Transaction Manifest `.rtm` files and in other places as well. However, there does exist another format for representing manifests: the `Parsed` format.

While the `String` format of manifests focuses heavily on being easily human-readable with some focus on ease of parsing and lexing, the `Parsed` format focuses more heavily on being very machine-readable where it should be relatively easy for machines to understand, process, and work with the `Parsed` format. The `Parsed` format is a JSON format for the instructions of transaction manifests that represents instructions as an Abstract Syntax Tree (AST).

Both of the manifest format compile down to identical byte code; thus, using either of the formats purely comes down to a choice by the client to either favour human-readability or machine-readability, some clients could choose to make use of both formats in different places which is what the Babylon wallet does.

The following is the same manifest represented in both formats:

<details>
    <summary><code>String</code> Format</summary>
    
```ruby
CALL_METHOD
    Address("account_sim1qjy5fakwygc45fkyhyxxulsf5zfae0ycez0x05et9hqs7d0gtn")
    "withdraw"
    Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k")
    Decimal("5");
TAKE_FROM_WORKTOP_BY_AMOUNT
    Decimal("2")
    Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k")
    Bucket("bucket1");
CALL_METHOD
    Address("component_sim1qd8djmepmq7hxqaakt9rl3hkce532px42s8eh4qmqlks9f87dn")
    "buy_gumball"
    Bucket("bucket1");
ASSERT_WORKTOP_CONTAINS_BY_AMOUNT
    Decimal("3")
    Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k");
ASSERT_WORKTOP_CONTAINS
    Address("resource_sim1q2ym536cwvvf3cy9p777t4qjczqwf79hagp3wn93srvsgvqtwe");
TAKE_FROM_WORKTOP
    Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k")
    Bucket("bucket2");
RETURN_TO_WORKTOP
    Bucket("bucket2");
TAKE_FROM_WORKTOP_BY_IDS
    Array<NonFungibleLocalId>(NonFungibleLocalId("#1#"))
    Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k")
    Bucket("bucket3");
CALL_METHOD
    Address("account_sim1qjy5fakwygc45fkyhyxxulsf5zfae0ycez0x05et9hqs7d0gtn")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP");
```
</details>

<details>
    <summary><code>Parsed</code> Format</summary>
    
```json
[
  {
    "instruction": "CALL_METHOD",
    "component_address": {
      "type": "Address",
      "address": "account_sim1qjy5fakwygc45fkyhyxxulsf5zfae0ycez0x05et9hqs7d0gtn"
    },
    "method_name": {
      "type": "String",
      "value": "withdraw"
    },
    "arguments": [
      {
        "type": "Address",
        "address": "resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k"
      },
      {
        "type": "Decimal",
        "value": "5"
      }
    ]
  },
  {
    "instruction": "TAKE_FROM_WORKTOP_BY_AMOUNT",
    "resource_address": {
      "type": "Address",
      "address": "resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k"
    },
    "amount": {
      "type": "Decimal",
      "value": "2"
    },
    "into_bucket": {
      "type": "Bucket",
      "identifier": {
        "type": "String",
        "value": "bucket1"
      }
    }
  },
  {
    "instruction": "CALL_METHOD",
    "component_address": {
      "type": "Address",
      "address": "component_sim1qd8djmepmq7hxqaakt9rl3hkce532px42s8eh4qmqlks9f87dn"
    },
    "method_name": {
      "type": "String",
      "value": "buy_gumball"
    },
    "arguments": [
      {
        "type": "Bucket",
        "identifier": {
          "type": "String",
          "value": "bucket1"
        }
      }
    ]
  },
  {
    "instruction": "ASSERT_WORKTOP_CONTAINS_BY_AMOUNT",
    "resource_address": {
      "type": "Address",
      "address": "resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k"
    },
    "amount": {
      "type": "Decimal",
      "value": "3"
    }
  },
  {
    "instruction": "ASSERT_WORKTOP_CONTAINS",
    "resource_address": {
      "type": "Address",
      "address": "resource_sim1q2ym536cwvvf3cy9p777t4qjczqwf79hagp3wn93srvsgvqtwe"
    }
  },
  {
    "instruction": "TAKE_FROM_WORKTOP",
    "resource_address": {
      "type": "Address",
      "address": "resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k"
    },
    "into_bucket": {
      "type": "Bucket",
      "identifier": {
        "type": "String",
        "value": "bucket2"
      }
    }
  },
  {
    "instruction": "RETURN_TO_WORKTOP",
    "bucket": {
      "type": "Bucket",
      "identifier": {
        "type": "String",
        "value": "bucket2"
      }
    }
  },
  {
    "instruction": "TAKE_FROM_WORKTOP_BY_IDS",
    "resource_address": {
      "type": "Address",
      "address": "resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k"
    },
    "ids": [
      {
        "type": "NonFungibleLocalId",
        "value": {
          "type": "Integer",
          "value": "1"
        }
      }
    ],
    "into_bucket": {
      "type": "Bucket",
      "identifier": {
        "type": "String",
        "value": "bucket3"
      }
    }
  },
  {
    "instruction": "CALL_METHOD",
    "component_address": {
      "type": "Address",
      "address": "account_sim1qjy5fakwygc45fkyhyxxulsf5zfae0ycez0x05et9hqs7d0gtn"
    },
    "method_name": {
      "type": "String",
      "value": "deposit_batch"
    },
    "arguments": [
      {
        "type": "Expression",
        "value": "ENTIRE_WORKTOP"
      }
    ]
  }
]
```
</details>

When converting the instructions of a `TransactionManifest` from one format to another, there are typically two main arguments required:

1. The format of the instructions to receive back, this is provided as an `InstructionList.Kind` which can either be `String` or `Parsed`.
2. The id of the network that the manifest is meant for. This is used in two main ways:
   - Validating that the addresses present in the manifest belong to the specified network.
   - Bech32m encoding the addresses during the conversion process.

### Example A

`TransactionManifest` objects have a `convert` method which converts the instructions in the transaction manifest from one instruction format to another.

```ts
import {
    TransactionManifest,
    InstructionList,
    NetworkId
} from '@radixdlt/radix-engine-toolkit';

let transactionManifest: TransactionManifest = /* Some Transaction Manifest */;
let convertedManifest: TransactionManifest = await transactionManifest.convert(
    InstructionList.Kind.Parsed, /* The instruction format to convert to */
    NetworkId.Mainnet /* The id of the network of the manifest */
);
```

### Example B

The `convertManifest` static function on the `RadixEngineToolkit` could also be used here to perform the same conversion

```ts
import {
  RadixEngineToolkit,
  TransactionManifest,
  NetworkId
} from '@radixdlt/radix-engine-toolkit';

let transactionManifest: TransactionManifest = /* Some Transaction Manifest */;
let convertedManifest = await RadixEngineToolkit.convertManifest(
  transactionManifest, /* The transaction manifest to convert */
  InstructionList.Kind.Parsed, /* The instruction format to convert to */
  NetworkId.Mainnet /* The id of the network of the manifest */
);
```

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
  InstructionList.Kind.String /* Optional argument, defaults to `String` if not provided */
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
  InstructionList.Kind.String /* Optional argument, defaults to `String` if not provided */
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
  InstructionList.Kind.String /* Optional argument, defaults to `String` if not provided */
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
  InstructionList.Kind.String /* Optional argument, defaults to `String` if not provided */
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
  InstructionList.Kind.String /* Optional argument, defaults to `String` if not provided */
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
  InstructionList.Kind.String /* Optional argument, defaults to `String` if not provided */
);
console.log('Notarized Transaction Intent:', notarizedTransactionIntent.toString())
```

## Static Transaction Validation

The Radix Engine Toolkit offers the means for clients to perform static validation on their transactions to determine their (static) validity prior to submission to the network. To be more exact, the following are the checks performed by the Radix Engine Toolkit:

1. Validates that the compiled notarized intent passed is of a valid SBOR encoding.
2. Validates that the signature of the notary matches matches that expected given the public key provided in the header and a message of the signed transaction intent.
3. Validates all of the provided intent signatures are correct.
4. Performs ID Validation on the transaction manifest. This step ensures that none of the manifest buckets are used twice, used after dropped and other errors pertaining to manifest semantics.
5. Validates that the tip percentage specified in the transaction header is within the allowed limits.
6. Validates that the cost unit limit specified in the header is within the allowed limits.
7. Validates that the epoch window (the difference between the start and end epoch from the header) is within the allowed limits.
8. Validates that the id of the network specified in the header matches that which is expected.
9. Validates that the version id in the header is valid.

When performing static validation, configuration for the validator should be passed in as an argument to the validator.

### Example A

The `NotarizedTransaction` class has a method for running static analysis on the notarized transaction given some validation configuration.

```ts
import {
  NotarizedTransaction,
  ValidationConfig,
  NetworkId
} from '@radixdlt/radix-engine-toolkit';

let notarizedTransaction: NotarizedTransaction = /* Some notarized transaction */;
let transactionValidity = await notarizedTransaction(ValidationConfig.default(NetworkId.Mainnet));
if (transactionValidity.isValid) {
  console.log("The transaction is valid")
} else {
  console.log("The transaction is invalid:", transactionValidity.errorMessage)
}
```

### Example B

The same operation can be performed through the `RadixEngineToolkit` class and the `staticallyValidateTransaction` static function.

```ts
import {
  NotarizedTransaction,
  ValidationConfig,
  RadixEngineToolkit,
  NetworkId
} from '@radixdlt/radix-engine-toolkit';

let notarizedTransaction: NotarizedTransaction = /* Some notarized transaction */;
let transactionValidity = await RadixEngineToolkit.staticallyValidateTransaction(
  notarizedTransaction,
  ValidationConfig.default(NetworkId.Mainnet)
);
if (transactionValidity.isValid) {
  console.log("The transaction is valid")
} else {
  console.log("The transaction is invalid:", transactionValidity.errorMessage)
}
```

## SBOR Encoding and Decoding

The Radix Engine Toolkit comes with full support of the two flavours of SBOR that are currently in use in the Radix Engine: Scrypto SBOR and Manifest SBOR. The toolkit has two polymorphic value models uses to describe all of the possible types that the two SBOR flavours can have: `ScryptoSborValue.Value` and `ManifestSborValue.Value`. When performing SBOR Encoding or Decoding, the two above-mentioned classes are used.

### SBOR Encoding

To SBOR encode an instance of `ScryptoSborValue.Value` or `ManifestSborValue.Value`, the `sborEncode` method on the `RadixEngineToolkit` class can be used.

```ts
import {
  ScryptoSborValue,
  ManifestSborValue,
  RadixEngineToolkit
} from '@radixdlt/radix-engine-toolkit';

let value = ScryptoSborValue.Value | ManifestSborValue.Value = /* Some SBOR Value */;
let encodedValue: Uint8Array = await RadixEngineToolkit.sborEncode(value);
```

### SBOR Decoding

Given an array of SBOR bytes, clients can decode these bytes and make sense of them by calling the `sborDecode` function on the `RadixEngineToolkit` class. This will return an `SborValue.Value` object which can either be `ScryptoSborValue.Value` or `ManifestSborValue.Value`. 

When performing SBOR decoding, one of the required arguments is a network id. This network id will be used to perform Bech32m encoding on the encountered addresses while decoding the value. Thus, this could be the id of the network that the value is thought to have originated from, the id of the network that the value is thought to be meant for, or any id if the value is known not to contain any addresses.

```ts
import {
  SborValue,
  RadixEngineToolkit, 
  NetworkId
} from '@radixdlt/radix-engine-toolkit';

let encodedValue: Uint8Array = /* Some SBOR Encoded Value */;
let value: SborValue.Value = await RadixEngineToolkit.sborDecode(
  encodedValue, /* The SBOR Encoded value */
  NetworkId.Mainnet /* The network id */
);
console.log(value.toString());
```

## Address Derivations

The Radix Engine Toolkit exposes a number of address derivation functions that can be useful to a wide variety of clients. This section discussed these address derivation functions and provides examples as to how they can be done.

In general, all of the address derivations can be done in two main ways:
1. By calling the appropriate function on the `RadixEngineToolkit` class which performs the derivation and returns a string.
2. By calling the appropriate function on one of the address types to perform the derivation and create a new instance of that address type. This is the case for the following address types: `ManifestAstValue.Address`, `ManifestSborValue.Address`, `ScryptoSborValue.Address`, and `EntityAddress`.

### Deriving Virtual Account Addresses from Public Keys

The Radix Engine Toolkit allows for virtual account component addresses to be derived from Ecdsa Secp256k1 and EdDSA Ed25519 public keys. This derivation process follows a deterministic process where each public key maps to exactly one virtual account address.

#### Example A

The various address types implemented in the Radix Engine Toolkit have a `virtualAccountAddress` method which performs this derivation and creates a new object of that class. 

```ts
import {
  ManifestAstValue,
  PublicKey,
  NetworkId
} from '@radixdlt/radix-engine-toolkit';

let publicKey = new PublicKey.EcdsaSecp256k1("03ce65a44a837dd5cd0e274c3280ab3d602e7ce1e1e3eaff769f2d2fc54cac733e");
let virtualAccountAddress = await ManifestAstValue.Address.virtualAccountAddress(
  publicKey,
  NetworkId.Mainnet, /* The ID of the network to derive the address for. */
);
console.log(virtualAccountAddress.toString())
```

#### Example B

Address derivations can be performed through the `RadixEngineToolkit` class which performs the derivation and returns the addresses as strings. 

```ts
import {
  RadixEngineToolkit,
  PublicKey,
  NetworkId
} from '@radixdlt/radix-engine-toolkit';

let publicKey = new PublicKey.EcdsaSecp256k1("03ce65a44a837dd5cd0e274c3280ab3d602e7ce1e1e3eaff769f2d2fc54cac733e");
let address: string = await RadixEngineToolkit.deriveVirtualAccountAddress(
  publicKey,
  NetworkId.Mainnet, /* The ID of the network to derive the address for. */
);
console.log(address);
```

### Deriving Virtual Identity Addresses from Public Keys

The Radix Engine Toolkit allows for virtual identity component addresses to be derived from Ecdsa Secp256k1 and EdDSA Ed25519 public keys. This derivation process follows a deterministic process where each public key maps to exactly one virtual identity address.

#### Example A

The various address types implemented in the Radix Engine Toolkit have a `virtualIdentityAddress` method which performs this derivation and creates a new object of that class. 

```ts
import {
  ManifestAstValue,
  PublicKey,
  NetworkId
} from '@radixdlt/radix-engine-toolkit';

let publicKey = new PublicKey.EcdsaSecp256k1("03ce65a44a837dd5cd0e274c3280ab3d602e7ce1e1e3eaff769f2d2fc54cac733e");
let virtualIdentityAddress = await ManifestAstValue.Address.virtualIdentityAddress(
  publicKey,
  NetworkId.Mainnet, /* The ID of the network to derive the address for. */
);
console.log(virtualIdentityAddress.toString())
```

#### Example B

Address derivations can be performed through the `RadixEngineToolkit` class which performs the derivation and returns the addresses as strings. 

```ts
import {
  RadixEngineToolkit,
  PublicKey,
  NetworkId
} from '@radixdlt/radix-engine-toolkit';

let publicKey = new PublicKey.EcdsaSecp256k1("03ce65a44a837dd5cd0e274c3280ab3d602e7ce1e1e3eaff769f2d2fc54cac733e");
let address: string = await RadixEngineToolkit.deriveVirtualIdentityAddress(
  publicKey,
  NetworkId.Mainnet, /* The ID of the network to derive the address for. */
);
console.log(address);
```

### Deriving Babylon Account Addresses from Olympia Account Addresses

The Radix Engine Toolkit is able to perform the deterministic mapping to convert Olympia account addresses to their respective Babylon Account addresses. 

#### Example A

The various address types implemented in the Radix Engine Toolkit have a `fromOlympiaAccountAddress` method which performs this derivation and creates a new object of that class. 

```ts
import {
  ManifestAstValue,
  PublicKey,
  NetworkId
} from '@radixdlt/radix-engine-toolkit';

let olympiaAccountAddress: string = "rdx1qspx7zxmnrh36q33av24srdfzg7m3cj65968erpjuh7ja3rm3kmn6hq4j9842";
let virtualIdentityAddress = await ManifestAstValue.Address.fromOlympiaAccountAddress(
  olympiaAccountAddress,
  NetworkId.Mainnet, /* The ID of the network to derive the address for. */
);
console.log(virtualIdentityAddress.toString())
```

#### Example B

Address derivations can be performed through the `RadixEngineToolkit` class which performs the derivation and returns the addresses as strings. 

```ts
import {
  RadixEngineToolkit,
  PublicKey,
  NetworkId
} from '@radixdlt/radix-engine-toolkit';

let olympiaAccountAddress: string = "rdx1qspx7zxmnrh36q33av24srdfzg7m3cj65968erpjuh7ja3rm3kmn6hq4j9842";
let { babylonAccountAddress, publicKey } = await RadixEngineToolkit.deriveBabylonAddressFromOlympiaAddress.fromOlympiaAccountAddress(
  olympiaAccountAddress,
  NetworkId.Mainnet, /* The ID of the network to derive the address for. */
);
console.log(virtualIdentityAddress)
```

### Derive Known Entity Addresses

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

#### Example A

The various address types exposed by the Radix Engine Toolkit expose methods to derive these well known addresses on any network. For the purposes of this example, we will be deriving the resource address of the XRD resource on mainnet. 

```ts
import { ManifestAstValue, NetworkId } from '@radixdlt/radix-engine-toolkit';

let xrdResourceAddress = await ManifestAstValue.Address.xrdResourceAddress(
  NetworkId.Mainnet, /* The ID of the network to derive the address for. */
);
console.log(xrdResourceAddress.toString())
```

#### Example B

The `RadixEngineToolkit` class exposes a method to get all of the well known addresses for a given network.

```ts
import { RadixEngineToolkit, NetworkId } from '@radixdlt/radix-engine-toolkit';

let knownAddresses = await RadixEngineToolkit.knownEntityAddresses(
  NetworkId.Mainnet /* The ID of the network to derive the addresses for. */
);
console.log(knownAddresses);
```

# Frequently Asked Questions

<details>
    <summary>How to obtain the transaction id (transaction hash) of a transaction?</summary>
    
Objects of the `TransactionIntent`, `SignedTransactionIntent`, and `NotarizedTransaction` classes offer methods for calculating the transaction id (transaction hash). Given that you have any of the above mentioned objects, the transaction id can be obtained as follows:

```ts
import { 
    TransactionIntent,
    SignedTransactionIntent,
    NotarizedTransaction 
} from '@radixdlt/radix-engine-toolkit';

let intent: TransactionIntent | SignedTransactionIntent | NotarizedTransaction = /* Some kind of intent */;
let transactionId: Uint8Array = intent.transactionId();
```

In addition to the `transactionId` method, some of these classes also offer methods for calculating the notarized transaction hash (often times referred to as payload hash in the Gateway API) and the signed transaction intent hash. However, these hashes are rarely needed in day-to-day interactions with the network.

</details>