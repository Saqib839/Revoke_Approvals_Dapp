import { useDisconnect, useAppKit, useAppKitNetwork } from '@reown/appkit/react';
import { useAccount, useBalance } from 'wagmi';
import { networks } from '../config'

function shortenAddress(address: string) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
}

export const ActionButtonList = () => {
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { switchNetwork } = useAppKitNetwork(); // Only one network for now
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    chainId: 3338, // Peaq chain id
    enabled: !!address,
    watch: true,
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, width: '100%' }}>
      {isConnected && (
        <>
          <span style={{ background: '#23272f', color: '#fff', borderRadius: 8, padding: '6px 12px', fontWeight: 500, fontSize: '1rem' }}>{shortenAddress(address!)}</span>
          <span style={{ background: '#23272f', color: '#fff', borderRadius: 8, padding: '6px 12px', fontWeight: 500, fontSize: '1rem' }}>{balanceData ? `${Number(balanceData.formatted).toFixed(3)} PEAQ` : '0.000 PEAQ'}</span>
        </>
      )}
      {!isConnected && (
        <button onClick={() => open({ view: 'Connect', namespace: 'eip155' })}>Connect</button>
      )}
      {isConnected && (
        <button onClick={() => switchNetwork(networks[1]) }>Switch</button>
      )}
      {isConnected && (
        <button onClick={disconnect}>Disconnect</button>
      )}
    </div>
  );
};
