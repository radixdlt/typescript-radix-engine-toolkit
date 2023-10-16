import {Curve} from "../cryptographic";

export type Message =
  | { kind: "None" }
  | { kind: "PlainText"; value: PlainTextMessage }
  | {
  kind: "Encrypted";
  value: EncryptedMessage;
};

export interface PlainTextMessage {
  mimeType: string;
  message: MessageContent;
}

export type MessageContent =
  | { kind: "String"; value: string }
  | { kind: "Bytes"; value: Uint8Array };

export interface EncryptedMessage {
  encrypted: Uint8Array;
  decryptorsByCurve: Record<Curve, DecryptorsByCurve>;
}

export type DecryptorsByCurve =
  | {
  kind: "Ed25519";
  value: {
    dhEphemeralPublicKey: Uint8Array;
    decryptors: [Uint8Array, Uint8Array][];
  };
}
  | {
  kind: "Secp256k1";
  value: {
    dhEphemeralPublicKey: Uint8Array;
    decryptors: [Uint8Array, Uint8Array][];
  };
};
