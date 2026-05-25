
# From Requests to Transactions: Practical Solana Lessons for Web2 Devs

_A practical, beginner-friendly weekly reflection for Web2 developers learning how Solana transactions work in practice._

Excerpt

This week I focused on the full lifecycle of Solana transactions: the mental model shift from HTTP to signed state-changes, the anatomy of a transaction, a working transfer script, debugging with RPC logs and Explorer, and intentionally forcing failures to harden flows.

Why this post

If you have backend or Web2 experience, this is a compact, practical guide to the concrete steps and gotchas you’ll run into when you move from request/response systems to signed, on-chain transactions.

What I cover (short)


# Solana Transactions Explained for Backend Developers

_Angle: The anatomy of a transaction — why each field matters, where failures hide, and how Web2 habits must change._

Hook

If you’ve built server APIs, you’re used to request/response. On Solana you build a signed, atomic transaction that *becomes* the request and must include everything the validators need to run it.

Context (what you need to know)

- Transactions are atomic, signed, and short-lived. They contain: signatures, instructions, accounts, and a recent blockhash.
- You submit the transaction to an RPC node; validators execute the instructions against on-chain account state. If any instruction fails, the whole transaction is rolled back.

Core content

1) Signatures — who authorized this change

- Signature = proof of intent. Transactions can carry multiple signatures (multiple signers). Signatures are checked before execution.
- Web2 gotcha: there is no server-side session to retroactively authorize. You must sign the final serialized transaction before submission.

2) Instructions — what to run

- An instruction targets a program and lists the accounts it will touch. A transaction can contain many instructions, and they run in order.
- Web2 gotcha: unlike an HTTP call that implicitly has backend context, you must explicitly pass every account a program needs.

3) Accounts — the state you manipulate

- Accounts store lamports and arbitrary data. Programs can only read or write accounts you include in the instruction.
- Web2 gotcha: you can’t implicitly access global server state — every account reference is explicit and ordered.

4) Recent blockhash — a short-lived nonce

- This prevents replay and bounds validity to roughly 60–90 seconds. If the transaction sits too long, regenerate and re-sign with a fresh blockhash.
- Web2 gotcha: you can’t sign once and retry forever; a stale blockhash will make the RPC reject the transaction.

Real example (transfer) — minimal, copyable

```js
import { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'

const connection = new Connection('https://api.devnet.solana.com')
const sender = Keypair.fromSecretKey(JSON.parse(process.env.SENDER_KEY))
const destPubkey = 'DEST_PUBKEY_HERE'

const tx = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: destPubkey,
    lamports: Math.round(0.05 * LAMPORTS_PER_SOL),
  })
)

tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash
tx.feePayer = sender.publicKey
tx.sign(sender)
const sig = await connection.sendRawTransaction(tx.serialize())
console.log('Submitted:', sig)

// After submission, fetch logs for debugging
const confirmed = await connection.getTransaction(sig, { commitment: 'confirmed' })
console.log(confirmed?.meta?.logMessages)
```

Real RPC error I captured (example)

```json
{"err":{"InstructionError":[0,{"Custom":1}]},"slot":12345678,"meta":{...}}
```

That `InstructionError` told me the first instruction returned a program-defined custom error. Mapping that code back to the program’s error enum quickly revealed the root cause (a missing writable account).

Web2 analogies (then let them go)

- Similar: both can be atomic — either commit fully or roll back.
- Different: Solana requires cryptographic signatures, explicit account lists, and transactions expire quickly. The server is replaced by the signed transaction and validators.

Practical checklist before you send a transaction

- Fund the fee payer (enough lamports for fees).
- Fetch a fresh recent blockhash just before signing.
- Ensure you included all required accounts (right order, writable flags).
- Sign after assembling the final transaction.
- Log the returned signature; use `getTransaction(sig)` and Solana Explorer for investigation.

Takeaway

For backend engineers: keep using your engineering discipline (preflight checks, clear errors, idempotent patterns), but add two Solana-specific habits: always include required accounts explicitly and always sign the final, freshly-blockhashed transaction.

Publishing notes (DEV)

- Title suggestion: "Solana Transactions Explained for Backend Developers"
- Tags: `solana`, `blockchain`, `web3`, `100daysofsolana`
- Paste this Markdown into DEV, preview, and publish.

---

*This post is adapted from my Week 3 notes during #100DaysOfSolana — focused for Web2 developers moving to Solana.*
