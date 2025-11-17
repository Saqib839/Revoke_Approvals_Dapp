import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
// import { mainnet, arbitrum, peaq} from '@reown/appkit/networks'
// import {peaq} from '@reown/appkit/networks'
import {
  // L1s
  mainnet,
  polygon,
  bsc,
  avalanche,
  fantom,
  cronos,
  gnosis,
  klaytn,
  celo,
  harmonyOne,
  fuse,
  hedera,

  // L2s
  arbitrum,
  arbitrumNova,
  optimism,
  base,
  scroll,
  zksync,
  linea,
  mantle,
  mode,
  polygonZkEvm,
  blast,
  zkFair,

  // Sidechains / Appchains
  metis,
  moonbeam,
  moonriver,
  peaq
} from '@reown/appkit/networks'


import type { AppKitNetwork } from '@reown/appkit/networks'
// import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'


// Get projectId from https://cloud.reown.com
export const projectId = import.meta.env.VITE_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694" // this is a public projectId only to use on localhost

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const metadata = {
    name: 'Revoke.approvals',
    description: 'Revoke Token approvals',
    url: 'https://reown.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/179229932']
  }

// for custom networks visit -> https://docs.reown.com/appkit/react/core/custom-networks
// export const networks = [mainnet, arbitrum, peaq] as [AppKitNetwork, ...AppKitNetwork[]];
// export const networks = [peaq] as [AppKitNetwork, ...AppKitNetwork[]];
export const networks = [
  // L1 Networks
  mainnet,
  polygon,
  bsc,
  avalanche,
  fantom,
  cronos,
  gnosis,
  klaytn,
  celo,
  harmonyOne,
  fuse,
  hedera,

  // L2 Networks
  arbitrum,
  arbitrumNova,
  optimism,
  base,
  scroll,
  zksync,
  linea,
  mantle,
  mode,
  polygonZkEvm,
  blast,
  zkFair,

  // Sidechains / Appchains
  metis,
  moonbeam,
  moonriver,
  peaq
] as [AppKitNetwork, ...AppKitNetwork[]];


//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

// Set up Solana Adapter
// export const solanaWeb3JsAdapter = new SolanaAdapter()

export const config = wagmiAdapter.wagmiConfig