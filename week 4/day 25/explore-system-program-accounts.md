**Explore System Program Accounts — Summary**

This note summarizes the hands-on steps for inspecting System Program, native programs, and sysvar accounts on Solana (devnet). It lists the CLI commands used and what each one does.

**Commands & What They Do**

- `solana config set --url devnet` : Point the Solana CLI to the devnet cluster.
- `solana address` : Print the public key (address) of the current CLI wallet/keypair.
- `solana balance` : Show the wallet balance in SOL.
- `solana airdrop 2` : Request 2 SOL from the devnet faucet into the current CLI wallet (may fail due to rate limits; use web faucet if needed).
- `solana account $(solana address)` : Inspect your wallet account; shows lamports, data length, owner, executable flag, and rent epoch.
- `solana account 11111111111111111111111111111111` : Inspect the System Program account; shows it's executable and owned by the Native Loader.
- `solana account Stake11111111111111111111111111111111111111` : Inspect the Stake Program (native program) account; executable and loader-owned.
- `solana account Vote111111111111111111111111111111111111111` : Inspect the Vote Program (native program) account; executable and loader-owned.
- `solana account SysvarC1ock11111111111111111111111111111111` : Inspect the Clock sysvar account (holds slot, epoch, Unix timestamp); non-executable and owned by the Sysvar program.
- `solana account SysvarRent111111111111111111111111111111111` : Inspect the Rent sysvar account (holds lamports-per-byte-year rate); non-executable and owned by the Sysvar program.
- `solana account $(solana address) --output json` : Output your wallet account details as JSON for structured programmatic inspection.
- `solana account 11111111111111111111111111111111 --output json` : Output the System Program account as JSON for comparison.

**Key Observations**

- Every Solana account has five fields: `lamports`, `data` (length), `owner`, `executable`, and `rent_epoch`.
- System accounts (wallets): owned by `11111111111111111111111111111111` (System Program), `data` length is usually 0, `executable` is `false`.
- Native programs (System, Stake, Vote): `executable` is `true` and they are owned by the Native Loader account (e.g., `NativeLoader1111111...`).
- Sysvars (Clock, Rent): read-only data accounts, `executable` is `false`, owned by the `Sysvar1111111...` program.

**Explorer**

Open Solana Explorer (devnet) in a browser and paste any inspected address (wallet, `11111111111111111111111111111111`, a sysvar). The Explorer shows the same fields plus transaction history and a user-friendly account type label.

**Why this matters**

Understanding the System Program and sysvars clarifies how accounts are created, funded, and classified on Solana. Programs are just accounts with the `executable` flag set; ownership and the executable flag determine behavior.

---

If you want, I can also add example JSON outputs, or a small script that fetches and formats these accounts programmatically.
