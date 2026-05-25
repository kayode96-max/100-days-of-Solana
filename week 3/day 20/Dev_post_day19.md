# What Forcing Failures Taught Me About Robust Flows

I intentionally wrote a `force-fail.mjs` to see how different failure modes surface. It was one of the most educational exercises this week.

Hook

Fail fast and inspect: deliberately triggering errors teaches you which invariants your code must protect and where to add checks or retries.

Context

- I tried common failure modes: insufficient lamports, missing writable accounts, and wrong account ordering. Each produced different RPC signals and explorer traces.

Core content

- Insufficient funds: RPC returns `InsufficientFundsForFee` or `InsufficientFunds` depending on the context.
- Missing writable account: program will raise an instruction error when it attempts to write to a read-only account.
- Wrong account ordering: programs often assume accounts are in a specific order; a mismatch triggers program logic errors.

What I learned

- Defensive checks: validate balances and existence of accounts locally before sending the transaction.
- Clear errors: surface helpful messages to users (e.g., "Please fund your fee payer with at least 0.001 SOL") instead of blind stack traces.
- Idempotency and retries: because transactions can fail for temporary reasons (blockhash expiry), implement simple retries with a fresh blockhash and reasonable backoff.

Takeaway

Testing failure modes proactively made my scripts markedly more reliable. For Web2 devs: build the same kind of unit and integration checks you already use, but include on-chain preflight checks.

---

*This is day 19 of my #100DaysOfSolana journey. A practical reflection for Web2 developers building resilient flows.*
