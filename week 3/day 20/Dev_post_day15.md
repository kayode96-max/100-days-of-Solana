# From Requests to Transactions: The Mental Model Shift

I spent a few days building on Solana this week and one thing clicked: treat a Solana transaction more like a state-changing, signed database transaction than an HTTP request.

Hook

If you're coming from Web2, think of a Solana transaction as a small, signed program that mutates shared on-chain state — and then disappears into the ledger forever.

Context

- Web2 mental model: client sends an HTTP request to a server, the server responds with data or an action result. The server holds authority and retries or compensating logic is possible.
- Solana model: you craft an atomic, signed instruction set, submit it to the network, and validators run it against the current state. If it succeeds, the state changes; if it fails, nothing changes.

Core content

- Signatures: You sign a transaction with private key(s). That signature is proof of intent.
- Instructions: A transaction contains one or more instructions (calls to programs). Each instruction names which accounts it will read or write.
- Accounts: Accounts are the canonical storage units. Programs operate on accounts you provide.
- Recent blockhash: Transactions include a recent blockhash so they expire after a short window (~60–90s). This prevents replay.

Web2 analogy (and where it breaks)

- Similar: Both can be atomic — either the database transaction or the on-chain transaction fully applies or not.
- Different: Solana requires cryptographic signatures and explicit account lists; there's no implicit session or server-side retry logic you can rely on.

Practical tip I learned

When I switched from thinking "send a request and wait" to "build the full state change, sign it, and understand which accounts are affected," it changed how I debugged failures and designed flows (e.g., creating associated accounts before transfers).

Takeaway

Treat transactions as first-class, signed state changes. Design flows by asking: which accounts must exist, who signs, and what happens if the instruction fails?

---

*This is day 15 of my #100DaysOfSolana journey. Notes aimed at Web2 developers transitioning to Solana.*
