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

const parsed = await rpc
  .getAccountInfo(mintAddress, { encoding: "jsonParsed" })
  .send();

console.log("\n--- RPC jsonParsed Result ---");

// The RPC parses known account types server-side.
// For an SPL Token mint account, the decoded fields live at:
// parsed.value.data.parsed
console.log(JSON.stringify(parsed.value.data.parsed, null, 2));