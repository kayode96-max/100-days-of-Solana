# Building a Simple Transfer Script: What I Actually Wrote

This day I implemented a small transfer script (a stripped-down `transfer.mjs`) to move SOL between wallets and learned practical gotchas while wiring up the code.

Hook

If you can send a signed POST in Web2, you can build a transfer script — but there are extra steps: funding the payer, catching blockhash expiry, and handling insufficient funds.

Context

- I used the `@solana/web3.js` SDK and a local keypair file. The script: load keypair, create a transfer instruction, sign, and submit.

Core content

- Funding the payer: your transaction needs a funded fee-payer account.
- Recent blockhash: fetch before signing so the transaction doesn't expire mid-flight.
- Error handling: check for `InsufficientFunds` and the `TransactionExpired` style failures.

Minimal example (Node)

```js
import { Connection, Keypair, Transaction, SystemProgram } from '@solana/web3.js'
const connection = new Connection('https://api.devnet.solana.com')
const sender = Keypair.fromSecretKey(JSON.parse(process.env.SENDER_KEY))

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
```

What surprised me

- Small mistakes like using an unfunded account for `feePayer` or an expired blockhash caused failures that looked opaque at first. Logging the exact RPC error helped a lot.

Takeaway

Treat the transfer script as an integration between wallet (keypair) and network: fund the fee payer, fetch a fresh blockhash, sign last, then submit.

---

*This is day 17 of my #100DaysOfSolana journey. Includes a small transfer example for Web2 devs.*
