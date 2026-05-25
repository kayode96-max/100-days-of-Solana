# Debugging Transactions: Logs, RPC Errors, and Explorer Links

By day 18 I was focusing on debugging — learning how to read RPC errors, use Explorer links, and make sense of program logs.

Hook

Failed transactions are a goldmine. The error strings and explorer traces point quickly at missing accounts, signature issues, or program assertions.

Context

- Developer flow: submit transaction → RPC error or success with logs → open Solana Explorer or use `getTransaction()` with `commitment: "confirmed"`.

Core content

- Use `getConfirmedTransaction` / `getTransaction` to fetch logs and status.
- Look for `InstructionError` and `Program log:` entries — they usually hint at which instruction failed and why.
- Explorer links: paste the transaction signature into Solana Explorer to see the instruction-by-instruction breakdown.

Example RPC output snippet I captured

```
{"err":{"InstructionError":[0,{"Custom":1}]},"slot":12345678,"meta":{...}}
```

That `InstructionError` told me the first instruction returned a custom error (program-defined). Checking the program's error enum revealed the exact cause.

Practical tip

Always log the full RPC error and the transaction signature. Then use:

```js
const tx = await connection.getTransaction(sig, {commitment: 'confirmed'})
console.log(tx.meta.logMessages)
```

Takeaway

Treat failures as diagnostic data. The RPC will usually give you the instruction index and program logs — use those to map back to your code and correct account or signer mismatches.

---

*This is day 18 of my #100DaysOfSolana journey. Focused on debugging patterns for Web2 developers.*
