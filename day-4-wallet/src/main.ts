import { createSolanaRpc, devnet } from "@solana/kit";
import { address as solanaAddress } from "@solana/addresses";
import { getWallets } from "@wallet-standard/app";
import type { Wallet, WalletAccount } from "@wallet-standard/base";

const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));
const walletListDiv = requireElement("wallet-list");
const connectedDiv = requireElement("connected");
const statusDiv = requireElement("status");
const errorDiv = requireElement("error");

type StandardConnectFeature = {
  connect: () => Promise<{ accounts: readonly WalletAccount[] }>;
};

type StandardDisconnectFeature = {
  disconnect: () => Promise<void>;
};

let connectedWallet: Wallet | null = null;

function requireElement(id: string) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing required element: ${id}`);
  }

  return element;
}

function isSolanaWallet(wallet: Wallet) {
  return wallet.chains.some((chain) => chain.startsWith("solana:"));
}

function renderWalletList(wallets: readonly Wallet[]) {
  const solanaWallets = wallets.filter(isSolanaWallet);

  if (solanaWallets.length === 0) {
    walletListDiv.innerHTML = `
      <div class="no-wallets">
        No Solana wallets found.<br>
        Install <a href="https://phantom.app" target="_blank">Phantom</a>
        or another Solana wallet to continue.
      </div>`;
    statusDiv.textContent = "";
    return;
  }

  statusDiv.textContent = `Found ${solanaWallets.length} wallet(s):`;
  walletListDiv.innerHTML = "";

  for (const wallet of solanaWallets) {
    const btn = document.createElement("button");
    btn.className = "wallet-btn";
    const icon = wallet.icon;
    btn.innerHTML = icon
      ? `<img src="${icon}" alt="" /> ${wallet.name}`
      : wallet.name;
    btn.addEventListener("click", () => connectWallet(wallet));
    walletListDiv.appendChild(btn);
  }
}

async function connectWallet(wallet: Wallet) {
  errorDiv.textContent = "";
  const connectFeature = wallet.features["standard:connect"] as
    | StandardConnectFeature
    | undefined;
  if (!connectFeature) {
    errorDiv.textContent = "This wallet doesn't support connecting.";
    return;
  }

  try {
    statusDiv.textContent = "Requesting connection...";
    const { accounts } = await connectFeature.connect();

    if (accounts.length === 0) {
      errorDiv.textContent = "No accounts returned. Did you reject the request?";
      statusDiv.textContent = "";
      return;
    }

    connectedWallet = wallet;
    const account = accounts[0];
    const accountAddress = solanaAddress(account.address);

    const { value: balanceInLamports } = await rpc.getBalance(accountAddress).send();
    const balanceInSol = (Number(balanceInLamports) / 1_000_000_000).toFixed(9);

    walletListDiv.style.display = "none";
    statusDiv.textContent = "";
    connectedDiv.style.display = "block";
    connectedDiv.innerHTML = `
      <h3>Connected to ${wallet.name}</h3>
      <div class="address">${accountAddress}</div>
      <div class="balance">${balanceInSol} SOL</div>
      <button class="disconnect-btn" id="disconnectBtn">Disconnect</button>`;

    const disconnectButton = document.getElementById("disconnectBtn");
    if (disconnectButton) {
      disconnectButton.addEventListener("click", () => disconnectWallet(wallet));
    }
  } catch (err) {
    errorDiv.textContent = `Connection failed: ${err instanceof Error ? err.message : String(err)}`;
    statusDiv.textContent = "";
  }
}

async function disconnectWallet(wallet: Wallet) {
  const disconnectFeature = wallet.features["standard:disconnect"] as
    | StandardDisconnectFeature
    | undefined;
  if (disconnectFeature) {
    await disconnectFeature.disconnect();
  }
  connectedWallet = null;
  connectedDiv.style.display = "none";
  walletListDiv.style.display = "block";
  statusDiv.textContent = "Disconnected. Choose a wallet to reconnect:";
}

const { get, on } = getWallets();
renderWalletList(get());
on("register", () => {
  if (!connectedWallet) {
    renderWalletList(get());
  }
});