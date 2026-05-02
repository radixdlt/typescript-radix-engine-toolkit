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

import { describe, expect, it } from "vitest";
import {
  Convert,
  IntentCoreV2,
  IntentHeaderV2,
  MessageV2,
  NetworkId,
  NotarizedTransactionV2,
  PartialTransactionV2,
  PrivateKey,
  PublicKey,
  RadixEngineToolkit,
  SignatureWithPublicKey,
  SignedPartialTransactionV2,
  SignedTransactionIntentV2,
  SubintentV2,
  TransactionHeaderV2,
  TransactionIntentV2,
  TransactionV2Builder,
} from "../src";

// ── Test helpers ──────────────────────────────────────────────────────

const notaryPrivateKey = new PrivateKey.Ed25519(
  "d52618de62aa37a9fdac229614ca931d9e509e00cd01ff9f465e5dba5e17be8b"
);
const signerKey1 = new PrivateKey.Secp256k1(
  "78cf6cb9537af4bb130ba08c7df2f10ed8ee0efd4d2319ef6762042feca0f58e"
);
const signerKey2 = new PrivateKey.Ed25519(
  "3d7f447bce7a669581452010226dc6437cf5efbdaee5ceff25894e8299410404"
);
const signerKey3 = new PrivateKey.Secp256k1(
  "78cf6cb9537af4bb130ba08c7df2f10ed8ee0efd4d2319ef6762042feca0f58a"
);

let nextDiscriminator = 1;

function makeIntentHeaderV2(
  overrides?: Partial<IntentHeaderV2>
): IntentHeaderV2 {
  return {
    networkId: NetworkId.Simulator,
    startEpochInclusive: 0,
    endEpochExclusive: 16,
    intentDiscriminator: nextDiscriminator++,
    ...overrides,
  };
}

function makeIntentCoreV2(overrides?: Partial<IntentCoreV2>): IntentCoreV2 {
  return {
    header: makeIntentHeaderV2(overrides?.header),
    instructions: "DROP_ALL_PROOFS;",
    blobs: [],
    message: { kind: "None" },
    children: [],
    ...overrides,
    // Re-apply header after spread so partial header overrides work
    ...(overrides?.header ? { header: makeIntentHeaderV2(overrides.header) } : {}),
  };
}

function makeTransactionHeaderV2(
  notaryKey: PublicKey,
  overrides?: Partial<TransactionHeaderV2>
): TransactionHeaderV2 {
  return {
    notaryPublicKey: notaryKey,
    notaryIsSignatory: true,
    tipBasisPoints: 0,
    ...overrides,
  };
}

function makeSubintentCoreV2(
  overrides?: Partial<IntentCoreV2>
): IntentCoreV2 {
  return makeIntentCoreV2({
    instructions: "YIELD_TO_PARENT;",
    ...overrides,
  });
}

function rootInstructionsWithChildren(
  childIds: string[]
): string {
  const lines: string[] = [];
  for (let i = 0; i < childIds.length; i++) {
    lines.push(
      `USE_CHILD NamedIntent("child${i}") Intent("${childIds[i]}");`
    );
  }
  for (let i = 0; i < childIds.length; i++) {
    lines.push(`YIELD_TO_CHILD NamedIntent("child${i}");`);
  }
  return lines.join("\n");
}

async function buildSimpleNotarizedV2(
  opts?: {
    rootIntentCoreOverrides?: Partial<IntentCoreV2>;
    transactionHeaderOverrides?: Partial<TransactionHeaderV2>;
    signers?: PrivateKey[];
  }
): Promise<NotarizedTransactionV2> {
  const builder = await TransactionV2Builder.new();
  const txHeader = makeTransactionHeaderV2(
    notaryPrivateKey.publicKey(),
    opts?.transactionHeaderOverrides
  );
  const rootIntentCore = makeIntentCoreV2(opts?.rootIntentCoreOverrides);

  let signStep = builder.header(txHeader).rootIntentCore(rootIntentCore);
  for (const key of opts?.signers ?? []) {
    signStep = signStep.sign(key);
  }
  return signStep.notarize(notaryPrivateKey);
}

// ── 1. TransactionV2Builder ───────────────────────────────────────────

describe("TransactionV2Builder", () => {
  it("A private key can be used as a signer.", async () => {
    const tx = await buildSimpleNotarizedV2({ signers: [signerKey1] });

    const validity =
      await RadixEngineToolkit.NotarizedTransactionV2.staticallyValidate(
        tx,
        NetworkId.Simulator
      );
    expect(validity.kind).toBe("Valid");
    expect(
      tx.signedTransactionIntent.transactionIntentSignatures.length
    ).toBe(1);
  });

  it("A sync signature function can be used as a signer.", async () => {
    const builder = await TransactionV2Builder.new();
    const txHeader = makeTransactionHeaderV2(notaryPrivateKey.publicKey());
    const rootIntentCore = makeIntentCoreV2();

    const tx = builder
      .header(txHeader)
      .rootIntentCore(rootIntentCore)
      .sign((hash: Uint8Array) =>
        signerKey1.signToSignatureWithPublicKey(hash)
      )
      .notarize(notaryPrivateKey);

    const result = await tx;
    const validity =
      await RadixEngineToolkit.NotarizedTransactionV2.staticallyValidate(
        result,
        NetworkId.Simulator
      );
    expect(validity.kind).toBe("Valid");
    expect(
      result.signedTransactionIntent.transactionIntentSignatures.length
    ).toBe(1);
  });

  it("An async signature function can be used as a signer.", async () => {
    const builder = await TransactionV2Builder.new();
    const txHeader = makeTransactionHeaderV2(notaryPrivateKey.publicKey());
    const rootIntentCore = makeIntentCoreV2();

    const tx = await builder
      .header(txHeader)
      .rootIntentCore(rootIntentCore)
      .signAsync((hash: Uint8Array) =>
        Promise.resolve(signerKey1.signToSignatureWithPublicKey(hash))
      )
      .notarize(notaryPrivateKey);

    const validity =
      await RadixEngineToolkit.NotarizedTransactionV2.staticallyValidate(
        tx,
        NetworkId.Simulator
      );
    expect(validity.kind).toBe("Valid");
    expect(
      tx.signedTransactionIntent.transactionIntentSignatures.length
    ).toBe(1);
  });

  it("An async notarize function can be used.", async () => {
    const builder = await TransactionV2Builder.new();
    const txHeader = makeTransactionHeaderV2(notaryPrivateKey.publicKey());
    const rootIntentCore = makeIntentCoreV2();

    const tx = await builder
      .header(txHeader)
      .rootIntentCore(rootIntentCore)
      .sign(signerKey1)
      .notarizeAsync((hash: Uint8Array) =>
        Promise.resolve(notaryPrivateKey.signToSignature(hash))
      );

    const validity =
      await RadixEngineToolkit.NotarizedTransactionV2.staticallyValidate(
        tx,
        NetworkId.Simulator
      );
    expect(validity.kind).toBe("Valid");
    expect(
      tx.signedTransactionIntent.transactionIntentSignatures.length
    ).toBe(1);
  });

  it("Multiple signers using all signing methods produce correct signature count.", async () => {
    const builder = await TransactionV2Builder.new();
    const txHeader = makeTransactionHeaderV2(notaryPrivateKey.publicKey());
    const rootIntentCore = makeIntentCoreV2();

    const tx = await builder
      .header(txHeader)
      .rootIntentCore(rootIntentCore)
      .sign(signerKey1)
      .sign((hash: Uint8Array) =>
        signerKey2.signToSignatureWithPublicKey(hash)
      )
      .signAsync((hash: Uint8Array) =>
        Promise.resolve(signerKey3.signToSignatureWithPublicKey(hash))
      )
      .notarize(notaryPrivateKey);

    const validity =
      await RadixEngineToolkit.NotarizedTransactionV2.staticallyValidate(
        tx,
        NetworkId.Simulator
      );
    expect(validity.kind).toBe("Valid");
    expect(
      tx.signedTransactionIntent.transactionIntentSignatures.length
    ).toBe(3);
  });

  it("Notary-only transaction with no signers is valid.", async () => {
    const tx = await buildSimpleNotarizedV2();

    const validity =
      await RadixEngineToolkit.NotarizedTransactionV2.staticallyValidate(
        tx,
        NetworkId.Simulator
      );
    expect(validity.kind).toBe("Valid");
    expect(
      tx.signedTransactionIntent.transactionIntentSignatures.length
    ).toBe(0);
  });

  it("A transaction with a PlainText message is valid.", async () => {
    const message: MessageV2 = {
      kind: "PlainText",
      value: {
        mimeType: "text/plain",
        message: { kind: "String", value: "Hello V2!" },
      },
    };
    const tx = await buildSimpleNotarizedV2({
      rootIntentCoreOverrides: { message },
    });

    const validity =
      await RadixEngineToolkit.NotarizedTransactionV2.staticallyValidate(
        tx,
        NetworkId.Simulator
      );
    expect(validity.kind).toBe("Valid");
  });

  it("Optional proposer timestamps can be set.", async () => {
    const tx = await buildSimpleNotarizedV2({
      rootIntentCoreOverrides: {
        header: {
          minProposerTimestampInclusive: 1000,
          maxProposerTimestampExclusive: 2000,
        },
      },
    });

    const validity =
      await RadixEngineToolkit.NotarizedTransactionV2.staticallyValidate(
        tx,
        NetworkId.Simulator
      );
    expect(validity.kind).toBe("Valid");
    expect(
      tx.signedTransactionIntent.transactionIntent.rootIntentCore.header
        .minProposerTimestampInclusive
    ).toBe(1000);
    expect(
      tx.signedTransactionIntent.transactionIntent.rootIntentCore.header
        .maxProposerTimestampExclusive
    ).toBe(2000);
  });

  it("Can build a preview transaction object.", async () => {
    const builder = await TransactionV2Builder.new();
    const txHeader = makeTransactionHeaderV2(notaryPrivateKey.publicKey());
    const rootIntentCore = makeIntentCoreV2();

    const preview = builder
      .header(txHeader)
      .rootIntentCore(rootIntentCore)
      .buildPreviewTransaction({
        rootSignerPublicKeys: [
          signerKey1.publicKey(),
          signerKey2.publicKey(),
        ],
      });

    expect(preview.rootSignerPublicKeys.length).toBe(2);
    expect(preview.nonRootSubintentSignerPublicKeys.length).toBe(0);
    expect(
      preview.transactionIntent.rootIntentCore.header.intentDiscriminator
    ).toBe(rootIntentCore.header.intentDiscriminator);
  });

  it("Can include non-root subintent signer public keys in preview transaction.", async () => {
    const subintent: SubintentV2 = { intentCore: makeSubintentCoreV2() };
    const subintentHash = await RadixEngineToolkit.SubintentV2.hash(subintent);
    const subintentSig = signerKey1.signToSignatureWithPublicKey(
      subintentHash.hash
    );

    const rootIntentCore = makeIntentCoreV2({
      children: [subintentHash.hash],
      instructions: rootInstructionsWithChildren([subintentHash.id]),
    });

    const builder = await TransactionV2Builder.new();
    const preview = builder
      .header(makeTransactionHeaderV2(notaryPrivateKey.publicKey()))
      .rootIntentCore(rootIntentCore)
      .addSignedSubintent(subintent, [subintentSig])
      .buildPreviewTransaction({
        rootSignerPublicKeys: [signerKey2.publicKey()],
        nonRootSubintentSignerPublicKeys: [[signerKey1.publicKey()]],
      });

    expect(preview.nonRootSubintentSignerPublicKeys.length).toBe(1);
    expect(preview.nonRootSubintentSignerPublicKeys[0].length).toBe(1);
    expect(
      preview.transactionIntent.nonRootSubintents.length
    ).toBe(1);
  });

  it("Throws if non-root subintent signer key arrays do not match non-root subintents.", async () => {
    const subintent: SubintentV2 = { intentCore: makeSubintentCoreV2() };
    const subintentHash = await RadixEngineToolkit.SubintentV2.hash(subintent);
    const subintentSig = signerKey1.signToSignatureWithPublicKey(
      subintentHash.hash
    );

    const rootIntentCore = makeIntentCoreV2({
      children: [subintentHash.hash],
      instructions: rootInstructionsWithChildren([subintentHash.id]),
    });

    const builder = await TransactionV2Builder.new();
    const signStep = builder
      .header(makeTransactionHeaderV2(notaryPrivateKey.publicKey()))
      .rootIntentCore(rootIntentCore)
      .addSignedSubintent(subintent, [subintentSig]);

    expect(() =>
      signStep.buildPreviewTransaction({
        rootSignerPublicKeys: [signerKey2.publicKey()],
        nonRootSubintentSignerPublicKeys: [],
      })
    ).toThrowError(
      "nonRootSubintentSignerPublicKeys length must match non-root subintents length"
    );
  });
});

// ── 2. Subintent Composition ──────────────────────────────────────────

describe("Subintent Composition", () => {
  it("A transaction with one subintent is valid.", async () => {
    const subintent: SubintentV2 = {
      intentCore: makeSubintentCoreV2(),
    };
    const subintentHash = await RadixEngineToolkit.SubintentV2.hash(subintent);
    const subintentSig = signerKey1.signToSignatureWithPublicKey(
      subintentHash.hash
    );

    const rootIntentCore = makeIntentCoreV2({
      children: [subintentHash.hash],
      instructions: rootInstructionsWithChildren([subintentHash.id]),
    });

    const builder = await TransactionV2Builder.new();
    const tx = await builder
      .header(makeTransactionHeaderV2(notaryPrivateKey.publicKey()))
      .rootIntentCore(rootIntentCore)
      .addSignedSubintent(subintent, [subintentSig])
      .notarize(notaryPrivateKey);

    const validity =
      await RadixEngineToolkit.NotarizedTransactionV2.staticallyValidate(
        tx,
        NetworkId.Simulator
      );
    expect(validity.kind).toBe("Valid");
    expect(
      tx.signedTransactionIntent.transactionIntent.nonRootSubintents.length
    ).toBe(1);
  });

  it("A transaction with multiple subintents is valid.", async () => {
    const sub1: SubintentV2 = { intentCore: makeSubintentCoreV2() };
    const sub2: SubintentV2 = { intentCore: makeSubintentCoreV2() };

    const hash1 = await RadixEngineToolkit.SubintentV2.hash(sub1);
    const hash2 = await RadixEngineToolkit.SubintentV2.hash(sub2);

    const sig1 = signerKey1.signToSignatureWithPublicKey(hash1.hash);
    const sig2 = signerKey2.signToSignatureWithPublicKey(hash2.hash);

    const rootIntentCore = makeIntentCoreV2({
      children: [hash1.hash, hash2.hash],
      instructions: rootInstructionsWithChildren([hash1.id, hash2.id]),
    });

    const builder = await TransactionV2Builder.new();
    const tx = await builder
      .header(makeTransactionHeaderV2(notaryPrivateKey.publicKey()))
      .rootIntentCore(rootIntentCore)
      .addSignedSubintent(sub1, [sig1])
      .addSignedSubintent(sub2, [sig2])
      .notarize(notaryPrivateKey);

    const validity =
      await RadixEngineToolkit.NotarizedTransactionV2.staticallyValidate(
        tx,
        NetworkId.Simulator
      );
    expect(validity.kind).toBe("Valid");
    expect(
      tx.signedTransactionIntent.transactionIntent.nonRootSubintents.length
    ).toBe(2);
    expect(
      tx.signedTransactionIntent.nonRootSubintentSignatures.length
    ).toBe(2);
  });

  it("A subintent can have multiple signers.", async () => {
    const subintent: SubintentV2 = { intentCore: makeSubintentCoreV2() };
    const subHash = await RadixEngineToolkit.SubintentV2.hash(subintent);

    const sig1 = signerKey1.signToSignatureWithPublicKey(subHash.hash);
    const sig2 = signerKey2.signToSignatureWithPublicKey(subHash.hash);

    const rootIntentCore = makeIntentCoreV2({
      children: [subHash.hash],
      instructions: rootInstructionsWithChildren([subHash.id]),
    });

    const builder = await TransactionV2Builder.new();
    const tx = await builder
      .header(makeTransactionHeaderV2(notaryPrivateKey.publicKey()))
      .rootIntentCore(rootIntentCore)
      .addSignedSubintent(subintent, [sig1, sig2])
      .notarize(notaryPrivateKey);

    const validity =
      await RadixEngineToolkit.NotarizedTransactionV2.staticallyValidate(
        tx,
        NetworkId.Simulator
      );
    expect(validity.kind).toBe("Valid");
    expect(
      tx.signedTransactionIntent.nonRootSubintentSignatures[0].length
    ).toBe(2);
  });

  it("Subintent hash computed standalone matches hash extracted from built transaction.", async () => {
    const subintent: SubintentV2 = { intentCore: makeIntentCoreV2() };
    const standaloneHash = await RadixEngineToolkit.SubintentV2.hash(subintent);
    const subSig = signerKey1.signToSignatureWithPublicKey(
      standaloneHash.hash
    );

    const rootIntentCore = makeIntentCoreV2({
      children: [standaloneHash.hash],
    });

    const builder = await TransactionV2Builder.new();
    const tx = await builder
      .header(makeTransactionHeaderV2(notaryPrivateKey.publicKey()))
      .rootIntentCore(rootIntentCore)
      .addSignedSubintent(subintent, [subSig])
      .notarize(notaryPrivateKey);

    // The child hash stored in the built transaction must match
    const childHash =
      tx.signedTransactionIntent.transactionIntent.rootIntentCore.children[0];
    expect(Convert.Uint8Array.toHexString(childHash)).toBe(
      Convert.Uint8Array.toHexString(standaloneHash.hash)
    );
  });
});

// ── 3. Compile/Decompile Round-Trips ──────────────────────────────────

describe("Compile/Decompile Round-Trips", () => {
  it("SubintentV2 survives compile/decompile.", async () => {
    const subintent: SubintentV2 = {
      intentCore: makeIntentCoreV2({
        message: {
          kind: "PlainText",
          value: {
            mimeType: "text/plain",
            message: { kind: "String", value: "sub-msg" },
          },
        },
      }),
    };

    const compiled = await RadixEngineToolkit.SubintentV2.compile(subintent);
    const decompiled = await RadixEngineToolkit.SubintentV2.decompile(
      compiled,
      NetworkId.Simulator
    );

    expect(decompiled.intentCore.header.networkId).toBe(
      subintent.intentCore.header.networkId
    );
    expect(decompiled.intentCore.header.startEpochInclusive).toBe(
      subintent.intentCore.header.startEpochInclusive
    );
    expect(decompiled.intentCore.header.endEpochExclusive).toBe(
      subintent.intentCore.header.endEpochExclusive
    );
    expect(decompiled.intentCore.message.kind).toBe("PlainText");
  });

  it("TransactionIntentV2 survives compile/decompile.", async () => {
    const sub: SubintentV2 = { intentCore: makeIntentCoreV2() };
    const subHash = await RadixEngineToolkit.SubintentV2.hash(sub);

    const intent: TransactionIntentV2 = {
      transactionHeader: makeTransactionHeaderV2(
        notaryPrivateKey.publicKey()
      ),
      rootIntentCore: makeIntentCoreV2({ children: [subHash.hash] }),
      nonRootSubintents: [sub],
    };

    const compiled =
      await RadixEngineToolkit.TransactionIntentV2.compile(intent);
    const decompiled =
      await RadixEngineToolkit.TransactionIntentV2.decompile(
        compiled,
        NetworkId.Simulator
      );

    expect(decompiled.transactionHeader.notaryIsSignatory).toBe(
      intent.transactionHeader.notaryIsSignatory
    );
    expect(decompiled.transactionHeader.tipBasisPoints).toBe(
      intent.transactionHeader.tipBasisPoints
    );
    expect(decompiled.nonRootSubintents.length).toBe(1);
    expect(decompiled.rootIntentCore.header.networkId).toBe(
      NetworkId.Simulator
    );
  });

  it("SignedTransactionIntentV2 survives compile/decompile.", async () => {
    const tx = await buildSimpleNotarizedV2({ signers: [signerKey1] });
    const signed = tx.signedTransactionIntent;

    const compiled =
      await RadixEngineToolkit.SignedTransactionIntentV2.compile(signed);
    const decompiled =
      await RadixEngineToolkit.SignedTransactionIntentV2.decompile(
        compiled,
        NetworkId.Simulator
      );

    expect(decompiled.transactionIntentSignatures.length).toBe(
      signed.transactionIntentSignatures.length
    );
    expect(decompiled.nonRootSubintentSignatures.length).toBe(
      signed.nonRootSubintentSignatures.length
    );
  });

  it("NotarizedTransactionV2 survives compile/decompile.", async () => {
    const sub: SubintentV2 = { intentCore: makeIntentCoreV2() };
    const subHash = await RadixEngineToolkit.SubintentV2.hash(sub);
    const subSig = signerKey1.signToSignatureWithPublicKey(subHash.hash);

    const rootIntentCore = makeIntentCoreV2({
      children: [subHash.hash],
    });

    const builder = await TransactionV2Builder.new();
    const tx = await builder
      .header(makeTransactionHeaderV2(notaryPrivateKey.publicKey()))
      .rootIntentCore(rootIntentCore)
      .addSignedSubintent(sub, [subSig])
      .sign(signerKey2)
      .notarize(notaryPrivateKey);

    const compiled =
      await RadixEngineToolkit.NotarizedTransactionV2.compile(tx);
    const decompiled =
      await RadixEngineToolkit.NotarizedTransactionV2.decompile(
        compiled,
        NetworkId.Simulator
      );

    expect(
      decompiled.signedTransactionIntent.transactionIntentSignatures.length
    ).toBe(1);
    expect(
      decompiled.signedTransactionIntent.transactionIntent.nonRootSubintents
        .length
    ).toBe(1);
    expect(
      decompiled.signedTransactionIntent.transactionIntent.rootIntentCore.header
        .networkId
    ).toBe(NetworkId.Simulator);
  });

  it("PartialTransactionV2 survives compile/decompile.", async () => {
    const rootSub: SubintentV2 = { intentCore: makeIntentCoreV2() };
    const childSub: SubintentV2 = { intentCore: makeIntentCoreV2() };
    const childHash = await RadixEngineToolkit.SubintentV2.hash(childSub);

    // Link child into root's children
    rootSub.intentCore.children = [childHash.hash];

    const partial: PartialTransactionV2 = {
      rootSubintent: rootSub,
      nonRootSubintents: [childSub],
    };

    const compiled =
      await RadixEngineToolkit.PartialTransactionV2.compile(partial);
    const decompiled =
      await RadixEngineToolkit.PartialTransactionV2.decompile(
        compiled,
        NetworkId.Simulator
      );

    expect(decompiled.nonRootSubintents.length).toBe(1);
    expect(decompiled.rootSubintent.intentCore.header.networkId).toBe(
      NetworkId.Simulator
    );
  });

  it("SignedPartialTransactionV2 survives compile/decompile.", async () => {
    const rootSub: SubintentV2 = { intentCore: makeIntentCoreV2() };
    const childSub: SubintentV2 = { intentCore: makeIntentCoreV2() };
    const childHash = await RadixEngineToolkit.SubintentV2.hash(childSub);
    rootSub.intentCore.children = [childHash.hash];

    const rootHash = await RadixEngineToolkit.SubintentV2.hash(rootSub);
    const rootSig = signerKey1.signToSignatureWithPublicKey(rootHash.hash);
    const childSig = signerKey2.signToSignatureWithPublicKey(childHash.hash);

    const signedPartial: SignedPartialTransactionV2 = {
      partialTransaction: {
        rootSubintent: rootSub,
        nonRootSubintents: [childSub],
      },
      rootSubintentSignatures: [rootSig],
      nonRootSubintentSignatures: [[childSig]],
    };

    const compiled =
      await RadixEngineToolkit.SignedPartialTransactionV2.compile(
        signedPartial
      );
    const decompiled =
      await RadixEngineToolkit.SignedPartialTransactionV2.decompile(
        compiled,
        NetworkId.Simulator
      );

    expect(decompiled.rootSubintentSignatures.length).toBe(1);
    expect(decompiled.nonRootSubintentSignatures.length).toBe(1);
    expect(decompiled.nonRootSubintentSignatures[0].length).toBe(1);
    expect(decompiled.partialTransaction.nonRootSubintents.length).toBe(1);
  });
});

// ── 4. Hash Determinism ───────────────────────────────────────────────

describe("Hash Determinism", () => {
  it("SubintentV2 hash is deterministic.", async () => {
    const sub: SubintentV2 = { intentCore: makeIntentCoreV2() };
    // Use the same object — header was already created with a fixed discriminator
    const hash1 = await RadixEngineToolkit.SubintentV2.hash(sub);
    const hash2 = await RadixEngineToolkit.SubintentV2.hash(sub);
    expect(Convert.Uint8Array.toHexString(hash1.hash)).toBe(
      Convert.Uint8Array.toHexString(hash2.hash)
    );
  });

  it("TransactionIntentV2 hash is deterministic.", async () => {
    const intent: TransactionIntentV2 = {
      transactionHeader: makeTransactionHeaderV2(
        notaryPrivateKey.publicKey()
      ),
      rootIntentCore: makeIntentCoreV2(),
      nonRootSubintents: [],
    };
    const hash1 = await RadixEngineToolkit.TransactionIntentV2.hash(intent);
    const hash2 = await RadixEngineToolkit.TransactionIntentV2.hash(intent);
    expect(Convert.Uint8Array.toHexString(hash1.hash)).toBe(
      Convert.Uint8Array.toHexString(hash2.hash)
    );
  });

  it("SignedTransactionIntentV2 hash is deterministic.", async () => {
    const tx = await buildSimpleNotarizedV2({ signers: [signerKey1] });
    const signed = tx.signedTransactionIntent;
    const hash1 =
      await RadixEngineToolkit.SignedTransactionIntentV2.hash(signed);
    const hash2 =
      await RadixEngineToolkit.SignedTransactionIntentV2.hash(signed);
    expect(Convert.Uint8Array.toHexString(hash1.hash)).toBe(
      Convert.Uint8Array.toHexString(hash2.hash)
    );
  });

  it("NotarizedTransactionV2 hash is deterministic.", async () => {
    const tx = await buildSimpleNotarizedV2();
    const hash1 = await RadixEngineToolkit.NotarizedTransactionV2.hash(tx);
    const hash2 = await RadixEngineToolkit.NotarizedTransactionV2.hash(tx);
    expect(Convert.Uint8Array.toHexString(hash1.hash)).toBe(
      Convert.Uint8Array.toHexString(hash2.hash)
    );
  });
});

// ── 5. Static Validation ──────────────────────────────────────────────

describe("Static Validation", () => {
  it("A valid NotarizedTransactionV2 passes static validation.", async () => {
    const tx = await buildSimpleNotarizedV2();
    const validity =
      await RadixEngineToolkit.NotarizedTransactionV2.staticallyValidate(
        tx,
        NetworkId.Simulator
      );
    expect(validity.kind).toBe("Valid");
  });

  it("Wrong networkId makes validation fail.", async () => {
    const tx = await buildSimpleNotarizedV2();
    const validity =
      await RadixEngineToolkit.NotarizedTransactionV2.staticallyValidate(
        tx,
        NetworkId.Mainnet
      );
    expect(validity.kind).toBe("Invalid");
  });

  it("Invalid epoch range makes validation fail.", async () => {
    const tx = await buildSimpleNotarizedV2({
      rootIntentCoreOverrides: {
        header: {
          startEpochInclusive: 100,
          endEpochExclusive: 50,
        },
      },
    });
    const validity =
      await RadixEngineToolkit.NotarizedTransactionV2.staticallyValidate(
        tx,
        NetworkId.Simulator
      );
    expect(validity.kind).toBe("Invalid");
  });

  it("A valid SignedPartialTransactionV2 passes static validation.", async () => {
    const rootSub: SubintentV2 = { intentCore: makeSubintentCoreV2() };
    const rootHash = await RadixEngineToolkit.SubintentV2.hash(rootSub);
    const rootSig = signerKey1.signToSignatureWithPublicKey(rootHash.hash);

    const signedPartial: SignedPartialTransactionV2 = {
      partialTransaction: {
        rootSubintent: rootSub,
        nonRootSubintents: [],
      },
      rootSubintentSignatures: [rootSig],
      nonRootSubintentSignatures: [],
    };

    const validity =
      await RadixEngineToolkit.SignedPartialTransactionV2.staticallyValidate(
        signedPartial,
        NetworkId.Simulator
      );
    expect(validity.kind).toBe("Valid");
  });
});

// ── 6. Static Analysis ────────────────────────────────────────────────

describe("Static Analysis", () => {
  it("V2 root intent and child subintent can be statically analyzed.", async () => {
    const childSubintent: SubintentV2 = {
      intentCore: makeSubintentCoreV2(),
    };
    const childHash = await RadixEngineToolkit.SubintentV2.hash(childSubintent);
    const rootIntent: TransactionIntentV2 = {
      transactionHeader: makeTransactionHeaderV2(notaryPrivateKey.publicKey()),
      rootIntentCore: makeIntentCoreV2({
        instructions: rootInstructionsWithChildren([childHash.id]),
        children: [childHash.hash],
      }),
      nonRootSubintents: [childSubintent],
    };

    const rootAndChildrenAnalysis =
      await RadixEngineToolkit.TransactionIntentV2.staticallyAnalyze(rootIntent);
    const childOnlyAnalysis =
      await RadixEngineToolkit.SubintentV2.staticallyAnalyze(childSubintent);

    expect(rootAndChildrenAnalysis.root_intent).toBeDefined();
    expect(rootAndChildrenAnalysis.non_root_subintents).toHaveLength(1);
    expect(rootAndChildrenAnalysis.non_root_subintents[0]).toEqual(
      childOnlyAnalysis
    );
  });
});
