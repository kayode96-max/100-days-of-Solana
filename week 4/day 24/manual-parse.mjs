import { getMintDecoder } from "@solana-program/token";
import { getBase58Decoder } from "@solana/kit";
// The Mint decoder knows exactly how the Token Program structures mint accounts.
// This is the ergonomic path: one decoder call turns raw bytes into a structured object.
import {
  createSolanaRpc,
  address,
  getBase64Encoder,
  getBase16Decoder,
} from "@solana/kit";

const rpc = createSolanaRpc("https://api.mainnet-beta.solana.com");

// Wrapped SOL mint address
const mintAddress = address("So11111111111111111111111111111111111111112");

const { value: accountInfo } = await rpc
  .getAccountInfo(mintAddress, { encoding: "base64" })
  .send();

// `data` arrives as a [base64String, "base64"] tuple. Convert the string back into the raw 82 bytes.
const dataBytes = getBase64Encoder().encode(accountInfo.data[0]);


const mintDecoder = getMintDecoder();
const mint = mintDecoder.decode(dataBytes);

console.log("\n--- Manual Byte-Level Decode ---");

// DataView lets you read multi-byte values from a Uint8Array.
// The Token Mint account stores u32 and u64 values, so reading one byte at a time
// is not enough.
const view = new DataView(
  dataBytes.buffer,
  dataBytes.byteOffset,
  dataBytes.byteLength
);

const base58Decoder = getBase58Decoder();

const hasMintAuthority = view.getUint32(0, true) === 1;
console.log("Has Mint Authority:", hasMintAuthority);

if (hasMintAuthority) {
  const authorityBytes = dataBytes.slice(4, 36);
  console.log("Mint Authority:", base58Decoder.decode(authorityBytes));
}

const supply = view.getBigUint64(36, true);
console.log("Supply (raw):", supply.toString());

const decimals = view.getUint8(44);
console.log("Decimals:", decimals);

console.log(
  "Human-readable supply:",
  Number(supply) / Math.pow(10, decimals)
);

const isInitialized = view.getUint8(45) === 1;
console.log("Is Initialized:", isInitialized);