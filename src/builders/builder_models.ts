import Decimal from "decimal.js";
import { IAddress } from "../base";
import { Signature, SignatureWithPublicKey } from "../models";
import { IPrivateKey } from "../models/crypto/private_key";

export type Address = string | IAddress;
export type Amount = string | number | Decimal;

export function resolveAddress(address: Address): string {
  return typeof address === "string" ? address : address.value;
}

export function resolveDecimal(amount: Amount): Decimal {
  if (typeof amount === "string" || typeof amount === "number") {
    return new Decimal(amount);
  } else if (amount instanceof Decimal) {
    return amount;
  } else {
    throw new TypeError("Invalid type passed in for decimal");
  }
}

export type SignFn = (
  hashToSign: Uint8Array
) => SignatureWithPublicKey.SignatureWithPublicKey;
export type NotarizeFn = (hashToSign: Uint8Array) => Signature.Signature;

export type SignatureSource =
  | IPrivateKey
  | SignFn
  | SignatureWithPublicKey.SignatureWithPublicKey;
export type NotarySignatureSource =
  | IPrivateKey
  | NotarizeFn
  | Signature.Signature;

export function resolveSignature(
  source: SignatureSource,
  hashToSign: Uint8Array
): SignatureWithPublicKey.SignatureWithPublicKey {
  if (typeof source === "function") {
    return source(hashToSign);
  } else if (source instanceof SignatureWithPublicKey.SignatureWithPublicKey) {
    return source;
  } else if (typeof source.signToSignatureWithPublicKey === "function") {
    return source.signToSignatureWithPublicKey(hashToSign);
  } else {
    throw new TypeError("Invalid type passed in for signature source");
  }
}

export function resolveNotarySignature(
  source: NotarySignatureSource,
  hashToNotarize: Uint8Array
): Signature.Signature {
  if (typeof source === "function") {
    return source(hashToNotarize);
  } else if (source instanceof Signature.Signature) {
    return source;
  } else if (typeof source.signToSignature === "function") {
    return source.signToSignature(hashToNotarize);
  } else {
    throw new TypeError("Invalid type passed in for signature source");
  }
}
