import React from 'react';
import { useAccount, useChainId, useChains, useSwitchChain } from 'wagmi';

export const NetworkSwitcher: React.FC = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const chains = useChains();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected) return null;

  return (
    <div className="network-switcher">
      <select
        value={chainId}
        onChange={(e) => switchChain({ chainId: Number(e.target.value) })}
        disabled={isPending}
        className="network-select"
      >
        <option value="" disabled>Select Network</option>
        {chains.map((chain) => (
          <option key={chain.id} value={chain.id}>
            {chain.name}
          </option>
        ))}
      </select>
      {isPending && <span className="network-loading">Switching...</span>}
    </div>
  );
};

export default NetworkSwitcher;
