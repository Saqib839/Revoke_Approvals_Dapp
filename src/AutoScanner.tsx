import React, { useState } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { parseAbiItem, formatUnits } from 'viem';
import { ethers, Eip1193Provider } from 'ethers';

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function symbol() public view returns (string)',
  'function decimals() public view returns (uint8)'
];

interface Approval {
  token: string;
  spender: string;
  amount: bigint;
  symbol: string;
  decimals: number;
}

export const AutoScanner: React.FC = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  
  const [isScanning, setIsScanning] = useState(false);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [status, setStatus] = useState('');
  const [revokeStatus, setRevokeStatus] = useState<Record<string, string>>({});

  const scanWallet = async () => {
    if (!isConnected || !address || !publicClient) {
      setStatus('Please connect your wallet first.');
      return;
    }

    setIsScanning(true);
    setStatus('Scanning last 50,000 blocks for approvals...');
    setApprovals([]);

    try {
      const currentBlock = await publicClient.getBlockNumber();
      // Scan last 50000 blocks in chunks of 10000 to avoid RPC limits
      const fromBlock = currentBlock - 50000n > 0n ? currentBlock - 50000n : 0n;
      const chunkSize = 10000n;
      
      const approvalLogs = [];
      for (let start = fromBlock; start <= currentBlock; start += chunkSize) {
        const end = start + chunkSize - 1n > currentBlock ? currentBlock : start + chunkSize - 1n;
        setStatus(`Scanning blocks ${start} to ${end}...`);
        
        try {
          const logs = await publicClient.getLogs({
            event: parseAbiItem('event Approval(address indexed owner, address indexed spender, uint256 value)'),
            args: { owner: address },
            fromBlock: start,
            toBlock: end
          });
          approvalLogs.push(...logs);
        } catch (e) {
          console.warn(`Error scanning chunk ${start}-${end}:`, e);
          // RPC might have stricter limits, try smaller chunk if needed, but for simplicity we continue
        }
      }

      setStatus(`Found ${approvalLogs.length} approval events. Processing...`);

      // Group by token and spender, keep the latest approval
      const approvalMap = new Map<string, bigint>();
      for (const log of approvalLogs) {
        if (!log.args.spender || log.args.value === undefined) continue;
        const key = `${log.address}-${log.args.spender}`;
        approvalMap.set(key, log.args.value);
      }

      // Fetch token details for active approvals (> 0)
      const activeApprovals: Approval[] = [];
      const provider = new ethers.BrowserProvider(window.ethereum as unknown as Eip1193Provider);
      
      for (const [key, amount] of approvalMap.entries()) {
        if (amount > 0n) {
          const [tokenAddr, spenderAddr] = key.split('-');
          try {
            const tokenContract = new ethers.Contract(tokenAddr, ERC20_ABI, provider);
            const [symbol, decimals] = await Promise.all([
              tokenContract.symbol().catch(() => 'Unknown'),
              tokenContract.decimals().catch(() => 18)
            ]);
            activeApprovals.push({
              token: tokenAddr,
              spender: spenderAddr,
              amount: amount,
              symbol,
              decimals
            });
          } catch {
            console.warn('Could not fetch token details for', tokenAddr);
          }
        }
      }

      setApprovals(activeApprovals);
      if (activeApprovals.length === 0) {
        setStatus('No active approvals found in the recent blocks.');
      } else {
        setStatus(`Scan complete. Found ${activeApprovals.length} active approvals.`);
      }

    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setStatus(`Error during scan: ${err.message}`);
      } else {
        setStatus('Error during scan: Unknown error');
      }
    } finally {
      setIsScanning(false);
    }
  };

  const revokeApproval = async (token: string, spender: string) => {
    if (!walletClient) return;
    const key = `${token}-${spender}`;
    setRevokeStatus(prev => ({ ...prev, [key]: 'Revoking...' }));
    
    try {
      const provider = new ethers.BrowserProvider(walletClient as Eip1193Provider);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(token, ERC20_ABI, signer);
      const tx = await tokenContract.approve(spender, 0);
      setRevokeStatus(prev => ({ ...prev, [key]: 'Confirming...' }));
      await tx.wait();
      setRevokeStatus(prev => ({ ...prev, [key]: 'Revoked' }));
      
      // Update local state
      setApprovals(prev => prev.filter(app => !(app.token === token && app.spender === spender)));
    } catch {
      setRevokeStatus(prev => ({ ...prev, [key]: 'Failed' }));
    }
  };

  return (
    <div className="glass-card">
      <div className="text-center mb-4">
        <h2>Auto Approval Scanner</h2>
        <p className="text-muted">Scan your wallet for recent active ERC20 approvals and revoke them in one click.</p>
      </div>

      <div className="text-center mb-4">
        <button 
          className="btn-primary" 
          onClick={scanWallet} 
          disabled={!isConnected || isScanning}
        >
          {isScanning ? (
            <span className="flex items-center justify-center gap-4">
              <div className="loader"></div> Scanning...
            </span>
          ) : 'Scan Wallet'}
        </button>
      </div>

      {status && (
        <div className="text-center mb-4 text-muted">
          <p>{status}</p>
        </div>
      )}

      <div className="mt-4">
        {approvals.map((app, idx) => {
          const key = `${app.token}-${app.spender}`;
          const rStatus = revokeStatus[key];
          const isRevoked = rStatus === 'Revoked';
          
          return (
            <div key={idx} className="approval-item">
              <div className="approval-info">
                <h4>{app.symbol}</h4>
                <p>Spender: <span className="address-tag">{app.spender.slice(0, 8)}...{app.spender.slice(-6)}</span></p>
                <p>Amount: {formatUnits(app.amount, app.decimals)}</p>
              </div>
              <div>
                <button 
                  className={isRevoked ? "btn-outline" : "btn-danger"}
                  onClick={() => revokeApproval(app.token, app.spender)}
                  disabled={rStatus === 'Revoking...' || rStatus === 'Confirming...' || isRevoked}
                >
                  {rStatus || 'Revoke'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AutoScanner;
