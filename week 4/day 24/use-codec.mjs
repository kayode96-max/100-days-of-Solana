import { getMintDecoder } from "@solana-program/token";

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

console.log("\n--- Decoded Mint Account ---");

console.log(
  "Mint Authority:",
  mint.mintAuthority.__option === "Some" ? mint.mintAuthority.value : "None"
);

console.log("Supply:", mint.supply.toString());
console.log("Decimals:", mint.decimals);
console.log("Is Initialized:", mint.isInitialized);

console.log(
  "Freeze Authority:",
  mint.freezeAuthority.__option === "Some" ? mint.freezeAuthority.value : "None"
);