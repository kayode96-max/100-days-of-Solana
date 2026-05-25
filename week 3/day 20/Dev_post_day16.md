# The Anatomy of a Solana Transaction (Signatures, Instructions, Accounts)

After building small scripts, the details of what actually goes into a transaction started to make sense. Here’s a compact breakdown for Web2 engineers.

Hook

Think in terms of four moving parts: signatures, instructions, accounts, and a recent blockhash. Together they make a verifiable, atomic change to shared state.

Context

- Signatures = who authorized the change. They’re cryptographic, not session-based.
- Instructions = the operations to run (e.g., transfer tokens, call a program).
- Accounts = the data/storage units the programs will read/write.
- Recent blockhash = short-lived nonce to prevent replay and bound the transaction's validity window.

Core content

1. Signatures

- You can have multiple signers. Each signature proves the signer authorized the transaction.

2. Instructions

- Each instruction targets a program and lists accounts it will touch. Programs expect accounts in a particular order and with specific read/write permissions.

3. Accounts

- Accounts are not just wallets; they hold arbitrary data and lamports (SOL balance). When you pass an account to an instruction you are explicitly granting the program access to read or mutate it.

4. Recent blockhash

- This makes transactions short-lived (usually ~60–90 seconds). If your transaction sits in your local queue too long, regenerate and re-sign with a fresh blockhash.

Example (Node, simplified)

```js
import { Keypair, Transaction, SystemProgram } from '@solana/web3.js'

const tx = new Transaction()
  .add(SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: destPubkey,
    lamports: 10000000,
  }))

tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash
tx.sign(sender)
const sig = await connection.sendRawTransaction(tx.serialize())
```

Takeaway

Understanding the anatomy makes it easier to reason about failures (missing signer, wrong account ordering) and design flows that pre-create and fund any accounts your transaction needs.

---

*This is day 16 of my #100DaysOfSolana journey. Aimed at Web2 developers curious about on-chain transaction internals.*
