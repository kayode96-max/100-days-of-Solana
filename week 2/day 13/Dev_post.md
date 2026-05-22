# What Clicked for Me After Building on Solana for a Few Days

Before I started working through day 08 to day 12, I expected blockchain data to feel a lot more opaque than it does. I thought I would be dealing with something closer to a black box, where the main challenge was just figuring out which API call returned which value. What surprised me most was how quickly Solana started to feel like a public database I could inspect directly.

Day 08 was the first real "oh, this is usable" moment. Reading a balance with RPC did not feel like hitting a special blockchain endpoint so much as querying state. Day 09 pushed that further when I fetched recent transaction signatures and started seeing the chain as a history of real events instead of just a number on a screen. That made the data feel alive. It was no longer just "wallet balance" or "transaction count". It was a record of activity I could trace.

The biggest click came when I compared devnet and mainnet on day 12. Same code, same RPC patterns, different networks, different answers. That made the shared-state model feel real to me. I was not talking to one app's private backend. I was asking two different views of the network the same questions and getting different slices of reality back.

Working on day 10 also helped connect the pieces. Once I put balance and transaction lookups into a small browser app, Solana stopped feeling like a set of disconnected scripts. It started to feel like something you could actually build a product around. That was the moment the SDK made sense: it was not abstract blockchain machinery, it was just a way to read and present on-chain state cleanly.

What is still a little confusing is how the deeper account model fits together under the hood. I get the high-level idea now: accounts hold data, programs define behavior, and the chain is public by default. But I still want more practice understanding when to think about wallet addresses, when to think about program-owned accounts, and how PDAs fit into the picture.

So far, the takeaway has been simple. Solana is not just "a blockchain where data lives somewhere else." It changes the whole mental model. The data is public, the state is shared, and the challenge is learning how to read and shape that state without relying on a traditional backend in the middle.

---

*This is day 13 of my #100DaysOfSolana journey. I’m sharing weekly reflections as I build from zero to proficiency with blockchain development.*
