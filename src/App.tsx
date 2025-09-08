import { createAppKit } from '@reown/appkit/react'

import { WagmiProvider } from 'wagmi'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ActionButtonList } from './components/ActionButtonList'
// import { InfoList } from './components/InfoList'
import RevokeApproval from './RevokeApproval'
import { projectId, metadata, networks, wagmiAdapter , solanaWeb3JsAdapter} from './config'

import "./App.css"

const queryClient = new QueryClient()

const generalConfig = {
  projectId,
  metadata,
  networks,
  themeMode: 'dark' as const,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  },
  themeVariables: {
    '--w3m-accent': '#000000',
  }
}

// Create modal
// createAppKit({
//   adapters: [wagmiAdapter, solanaWeb3JsAdapter],
//   ...generalConfig,
// })

createAppKit({
  adapters: [wagmiAdapter],
  ...generalConfig,
})

export function App() {

  return (
    <div className={"pages"}>
      <img src="/revoke_approvals_bg.png" alt="Reown" style={{ width: '270px', height: '200px' }} />
      {/* <h1>PEAQ Network Revoke Approvals</h1> */}
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
            {/* <appkit-button /> */}
            <ActionButtonList />
            <RevokeApproval />
            <div className="advice">
              <p>
              </p>
            </div>
            {/* <InfoList /> */}
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  )
}

export default App
