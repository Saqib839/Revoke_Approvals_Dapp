# Revoke App

A Web3 dApp that lets you inspect and revoke ERC-20 token approvals you've granted to smart contracts, giving you full visibility and control over what's allowed to spend from your wallet.

**Live app:** [revoke-approvals.vercel.app](https://revoke-approvals.vercel.app/)

## Why

Every time you interact with a DeFi protocol, DEX, or NFT marketplace, you often grant it an on-chain "approval" to spend a token on your behalf. Those approvals don't expire on their own. Over time, wallets accumulate old, forgotten, or overly broad approvals, some of which sit unused and become a real attack surface if the approved contract is ever compromised or turns out to be malicious. Revoke App gives you a simple way to see what you've approved and shut off anything you don't want active anymore.

## Features

- **Auto Scanner** — connect your wallet and automatically scan for active ERC-20 token approvals across your account.
- **Manual Revoke** — manually enter a token address and a spender address to check or update a specific approval, with a one-click path to set the allowance to zero.
- **Live allowance view** — see token, spender contract, and approved amount before deciding what to change.
- **One-click revoke** — set any approval back to zero directly from the UI, no manual contract calls needed.
- **Multi-network support** — switch networks from the app (defaults to Ethereum mainnet).
- **Fully client-side** — no backend, no data collection. Everything happens directly between your wallet and the blockchain.

## How it works

1. Connect your wallet (MetaMask or another injected Web3 provider).
2. Choose **Auto Scanner** to pull your active approvals automatically, or **Manual Revoke** to check a specific token/spender pair.
3. Review the allowance shown for each approval.
4. Set the new approval amount to `0` and confirm the transaction to revoke it, or set a custom amount to adjust it instead of revoking entirely.

## Tech stack

- **Frontend:** JavaScript
- **Web3 integration:** Web3.js / Ethers.js
- **Wallet connection:** MetaMask Provider API (supports other injected wallets)
- **Contracts:** Standard ERC-20 `approve` / `allowance` interface, called directly, no custom contracts required
- **Hosting:** Vercel (static frontend, fully client-side, no backend)

## Getting started (local development)

```bash
git clone <repo-url>
cd revoke-app
npm install
npm run dev
```

Open `http://localhost:3000` (or the port shown in your terminal) and connect a wallet to start testing locally.

## Security notes

- Revoke App never asks for or has access to your private key or seed phrase. All actions are signed by your wallet.
- Revoking an approval is an on-chain transaction and requires gas.
- Always double-check the token and spender addresses before confirming a transaction.

## Disclaimer

This tool is provided as-is for wallet hygiene and security purposes. Always verify contract addresses and transaction details in your wallet before signing.
