# Long Term Support (LTS) Radix Engine Toolkit

| **Note** | It is recommended (but not required) to read the [README.md](./README.md) for additional context on the Radix Engine Toolkit as a library, it's architecture, advanced uses of the toolkit. |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

This `LTSRadixEngineToolkit` class is meant to provide a smaller interface with a higher degree of backward compatibility that is suitable for third parties looking to integrate with the Radix Babylon ledger.

The `LTSRadixEngineToolkit` and other classes that fall under the LTS umbrella are not meant to provide the complete functionality of the core Radix Engine Toolkit to clients. They are meant to provide focused, simple interfaces for functionality that integrators need. There is a chance that a client might outgrow the LTS garden and need utilize some of the classes and concepts outside of the LTS.

The following set of classes currently are currently considered to be in LTS:

- `SimpleTransactionBuilder`
- `LTSRadixEngineToolkit`
  - `Transaction` API Group
  - `Derive` API Group
  - `Utils` API Group

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
  /*
    A function implemented in your internal systems that is able to sign a given hash using the
    private key corresponding to the given public key, and produce a signature.

    NOTE:
    - If using Ed25519, the signature is encoded as the standard 64-byte encoding for Ed25519 signatures
    - If using Secp256k1, signatures should be serialized as recoverable signatures of 65 bytes, with the recovery byte first, as: v || r || s
      > There isn’t a de-facto convention for serialization of compact Secp256k1 signatures.
      > On Olympia, ASN.1 was used - the above format for Babylon is different - and more compact.
      > Note that some libraries (such as libsecp256k1) have their own compact serialization and a few serialize it as reverse(r) || reverse(s) || v.
  */
};

// Construction metadata
const currentEpoch = /* Sourced from /lts/transaction/construction in the Core API - or the Gateway */;

// Account information
const fromAccountPublicKey: PublicKey.PublicKey = /* Get public key of account */;
const fromAccountAddress = "account_sim1qjdkmaevmu7ggs3jyruuykx2u5c2z7mp6wjk5f5tpy6swx5788";

// Recipient/s
const toAccountAddress1 = "account_sim1qj0vpwp3l3y8jhk6nqtdplx4wh6mpu8mhu6mep4pua3q8tn9us";
const toAccountAddress2 = "account_sim1qjj40p52dnww68e594c3jq6h3s8xr75fgcnpvlwmypjqmqamld";

// The fungible resource being transfered
const resourceAddress = "resource_sim1qyw4pk2ecwecslf55dznrv49xxndzffnmpcwjavn5y7qyr2l73";

const builder = await SimpleTransactionBuilder.new({
  networkId: NetworkId.RCNet,
  validFromEpoch: currentEpoch,
  fromAccount: fromAccountAddress,
  signerPublicKey: fromAccountPublicKey,
});

const unsignedTransaction = builder
  /* The following defaults are used:
  .permanentlyRejectAfterEpochs(2) // Transaction with expire after approximately 5-10 minutes.
  .tipPercentage(0)                // No tip
  .lockedFee(5)                    // Maximum fee of 5 XRD - but requires at least 5 XRD in the account
  */
  .transferFungible({ toAccount: toAccountAddress1, resourceAddress: resourceAddress, amount: 100 })
  .transferFungible({ toAccount: toAccountAddress2, resourceAddress: resourceAddress, amount: "23.12323312" })
  .compileIntent();

const signature = await sign(fromAccountPublicKey, unsignedTransaction.hashToNotarize);

const transaction = unsignedTransaction.compileNotarized(signature);

// Will throw if eg the signature is incorrect
(await transaction.staticallyValidate(NetworkId.Simulator)).throwIfInvalid();

const notarizedTransactionHex = transaction.toHex();
const transactionIntentHashHex = transaction.intentHashHex();

// You can then use these to interact with the Core API or Gateway API, eg with the Core API:
// * Submit the `notarizedTransactionHex` to `/core/lts/transaction/submit`
// * Check commit status using `transactionIntentHashHex` with `/core/lts/transaction/status`
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

const olympiaAccountAddress: string =
  "rdx1qspx7zxmnrh36q33av24srdfzg7m3cj65968erpjuh7ja3rm3kmn6hq4j9842";
const { babylonAccountAddress, publicKey } =
  await LTSRadixEngineToolkit.Derive.babylonAccountAddressFromOlympiaAccountAddress(
    olympiaAccountAddress,
    NetworkId.Mainnet /* The ID of the network to derive the address for. */
  );
console.log(babylonAccountAddress);
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

### Utils API Group

#### Hashing

The `Utils` API group of the `LTSRadixEngineToolkit` offers a method for hashing data through the hashing algorithm used in Scrypto and the Radix Engine which is Blake2b with 32 byte long digests.

```ts
import {
  LTSRadixEngineToolkit,
} from "@radixdlt/radix-engine-toolkit";

const data: Uint8Array = /* Some array of bytes */;
const blake2bHash: Uint8Array = LTSRadixEngineToolkit.Utils.hash(data);
```
