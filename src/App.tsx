import { useState } from "react";
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RevokeApproval from './RevokeApproval'
import AutoScanner from './AutoScanner'
import NetworkSwitcher from './NetworkSwitcher'
import { projectId, metadata, networks, wagmiAdapter } from './config'
import "./App.css"

const queryClient = new QueryClient()
const generalConfig = {
  projectId,
  metadata,
  networks,
  themeMode: 'dark' as const,
  features: {
    analytics: true,
    socialLogin: false, 
    socials: [],
    email: false,
  },
  themeVariables: {
    '--w3m-accent': '#6366f1',
    '--w3m-font-family': 'Outfit, sans-serif'
  }
}
createAppKit({
  adapters: [wagmiAdapter],
  ...generalConfig,
})

function ManualRevokePage() {
  return (
    <>
      <RevokeApproval />
    </>
  );
}

function AutomaticPage() {
  return (
    <>
      <AutoScanner />
    </>
  )
}

export function App() {
  const [activePage, setActivePage] = useState<'manual' | 'automatic'>('automatic');

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <nav className="navbar">
          <div className="nav-logo">
            <img src="/revoke_approvals_bg.png" alt="Logo" style={{ filter: 'drop-shadow(0px 0px 8px rgba(255,255,255,0.5))' }} />
            <h1>Revoke App</h1>
          </div>
          <div className="header-actions">
            <NetworkSwitcher />
            <appkit-button />
          </div>
        </nav>

        <div className="app-container">
          <div className="tabs-container">
            <button
              className={`tab-btn ${activePage === 'automatic' ? 'active' : ''}`}
              onClick={() => setActivePage('automatic')}
            >
              Auto Scanner
            </button>
            <button
              className={`tab-btn ${activePage === 'manual' ? 'active' : ''}`}
              onClick={() => setActivePage('manual')}
            >
              Manual Revoke
            </button>
          </div>

          {activePage === 'manual' ? <ManualRevokePage /> : <AutomaticPage />}

          <p className="text-center text-muted mt-4" style={{ fontSize: '0.9rem' }}>
            Production Release. Secure your wallet by managing your token approvals.
          </p>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
