import { useAppKit } from '@reown/appkit/react';
import { useAccount, useBalance } from 'wagmi';

export const CustomConnectButton = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address });

  function shortenAddress(addr: string) {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  if (isConnected && address) {
    return (
      <button 
        onClick={() => open()} 
        className="custom-connect-btn connected"
      >
        <div className="wallet-info">
          <span className="address">{shortenAddress(address)}</span>
          {balanceData && (
            <span className="balance">
              {Number(balanceData.formatted).toFixed(4)} {balanceData.symbol}
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <button 
      onClick={() => open()} 
      className="custom-connect-btn"
    >
      Connect Wallet
    </button>
  );
};
