// import { useDisconnect, useAppKit, useAppKitNetwork } from '@reown/appkit/react';
import { useDisconnect, useAppKit } from '@reown/appkit/react';
import { useAccount, useBalance, useSwitchChain } from 'wagmi';
// import { networks } from '../config'

function shortenAddress(address: string) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
}

export const ActionButtonList = () => {
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  // const { switchNetwork } = useAppKitNetwork(); 
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address });
  // const { chains, switchChain } = useSwitchChain();
  const { chains, switchChain } = useSwitchChain();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const chainId = Number(event.target.value);
    switchChain?.({ chainId });
  };
  

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, width: '100%' }}>
      {isConnected && (
        <>
          <span style={{ background: '#23272f', color: '#fff', borderRadius: 8, padding: '6px 12px', fontWeight: 500, fontSize: '1rem' }}>{shortenAddress(address!)}</span>
          <span style={{ background: '#23272f', color: '#fff', borderRadius: 8, padding: '6px 12px', fontWeight: 500, fontSize: '1rem' }}>{balanceData ? `${Number(balanceData.formatted).toFixed(4)} ${balanceData.symbol}` : '0.0000'}</span>
        </>
      )}
      {!isConnected && (
        <button onClick={() => open({ view: 'Connect', namespace: 'eip155' })}>Connect</button>
      )}
      {isConnected && (
        <button onClick={() => disconnect()} style={{ background: '#fff', color: '#000', borderRadius: 8, padding: '6px 15px', fontWeight: 500, fontSize: '1rem', border: '2px solid black', cursor: 'pointer' }}>Disconnect</button>
      )}
      {isConnected && (
        // <button onClick={() => switchNetwork(networks[1]) }>Switch</button>
        // <div><select onChange={handleChange} defaultValue=""><option value="" disabled>Select Network</option>{chains.map(chain => <option key={chain.id} value={chain.id}>{chain.name}</option>)}</select></div>
        <select onChange={handleChange} defaultValue="" style={{ background: '#fff', color: '#000', borderRadius: 8, padding: '6px 12px', fontWeight: 500, fontSize: '1rem', border: '2px solid black', outline: 'none', cursor: 'pointer' }}><option value="" disabled>Select Network</option>{chains.map(chain => <option key={chain.id} value={chain.id}>{chain.name}</option>)}</select>
      )}
    </div>
  );
};
