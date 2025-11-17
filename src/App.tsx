import { useState } from "react";
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ActionButtonList } from './components/ActionButtonList'
import RevokeApproval from './RevokeApproval'
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
    '--w3m-accent': '#000000',
  }
}
createAppKit({
  adapters: [wagmiAdapter],
  ...generalConfig,
})

function ManualRevokePage() {
  return (
    <>
      {/* <img src="/revoke_approvals_bg.png" alt="revoke_approvals" style={{ width: '270px', height: '200px' }} /> */}
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
            <ActionButtonList />
            <RevokeApproval />
            <div className="advice">
              <p></p>
            </div>
        </QueryClientProvider>
        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#ff6666' }}>
        This is the first release of our Revoke Approval dApp. Lots of improvements and features will be added in the future.
        </p>
      </WagmiProvider>
    </>
  );
}

function AutomaticPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Auto Approval Scanner</h1>
      <p style={{ fontSize: '1.6rem', color: '#888' }}>Coming soon</p>
      <p style={{ textAlign: 'center', marginTop: '2rem', color: '#ff6666' }}>
        In this you do not have to manually input the token and spender addresses. 
        We will scan your wallet for all the tokens and spender addresses and only adjust the approvals you want to modify.
      </p>
    </div>
  )
}

export function App() {
  const [activePage, setActivePage] = useState<'manual' | 'automatic'>('manual');

  return (
    <div className={"pages"}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        <img src="/revoke_approvals_bg.png" alt="revoke_approvals" style={{ width: '270px', height: '200px', marginBottom: '18px' }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button
            style={{
              padding: '12px 34px',
              borderRadius: 7,
              backgroundColor: activePage === 'manual' ? '#222' : '#fff',
              color: activePage === 'manual' ? '#fff' : '#222',
              fontWeight: 600,
              fontSize: '1rem',
              border: '2px solid #222',
              cursor: 'pointer',
              outline: 'none',
            }}
            onClick={() => setActivePage('manual')}
          >
            Manual Revoke
          </button>
          <button
            style={{
              padding: '12px 34px',
              borderRadius: 7,
              backgroundColor: activePage === 'automatic' ? '#222' : '#fff',
              color: activePage === 'automatic' ? '#fff' : '#222',
              fontWeight: 600,
              fontSize: '1rem',
              border: '2px solid #222',
              cursor: 'pointer',
              outline: 'none',
            }}
            onClick={() => setActivePage('automatic')}
          >
            Auto Approval Scanner
          </button>
        </div>
      </div>
      {activePage === 'manual' ? <ManualRevokePage /> : <AutomaticPage />}
    </div>
  )
}

export default App
