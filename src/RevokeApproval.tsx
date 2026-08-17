import React, { useState } from 'react';
import { useAccount, useChainId, useWalletClient } from 'wagmi';
import { ethers, Eip1193Provider } from 'ethers';

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) public returns (bool)'
];

export const RevokeApproval: React.FC = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();

  const [token, setToken] = useState('');
  const [spender, setSpender] = useState('');
  const [amount, setAmount] = useState('0');
  const [txStatus, setTxStatus] = useState('');
  const [isTxPending, setIsTxPending] = useState(false);

  const revokeApproval = async () => {
    setTxStatus('');
    setIsTxPending(true);
    // Trim the inputs before using
    const trimmedToken = token.trim();
    const trimmedSpender = spender.trim();
    const trimmedAmount = amount.trim();
    
    if (!ethers.isAddress(trimmedToken) || !ethers.isAddress(trimmedSpender)) {
      setTxStatus('error: Invalid token or spender address!');
      setIsTxPending(false);
      return;
    }
    if (!isConnected || !walletClient) {
      setTxStatus('error: Connect wallet first!');
      setIsTxPending(false);
      return;
    }
    
    let parsedAmount;
    try {
      parsedAmount = ethers.parseUnits(trimmedAmount || '0', 18);
    } catch {
      setTxStatus('error: Invalid amount');
      setIsTxPending(false);
      return;
    }
    
    try {
      setTxStatus('Sending transaction...');
      // Create ethers.js provider and signer from wagmi walletClient
      const provider = new ethers.BrowserProvider(walletClient as Eip1193Provider); // EIP-1193 provider
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(trimmedToken, ERC20_ABI, signer);
      const tx = await tokenContract.approve(trimmedSpender, parsedAmount);
      setTxStatus(`Transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      setTxStatus(`success: ✅ Approval updated! Tx confirmed in block ${receipt.blockNumber}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setTxStatus(`error: ${err.message}`);
      } else {
        setTxStatus('error: Unknown error');
      }
    } finally {
      setIsTxPending(false);
    }
  };

  return (
    <div className="glass-card">
      <div className="text-center mb-4">
        <h2>Manual Revoke</h2>
        <p className="text-muted">Manually enter token and spender addresses to adjust or revoke allowances.</p>
      </div>

      <div className="form-group">
        <label className="form-label">Token Address:</label>
        <input 
          className="form-input"
          value={token} 
          onChange={e => setToken(e.target.value)} 
          placeholder="0x..."
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Spender Address:</label>
        <input 
          className="form-input"
          value={spender} 
          onChange={e => setSpender(e.target.value)} 
          placeholder="0x..."
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">New Approval Amount (0 = revoke):</label>
        <input
          className="form-input"
          type="number"
          min="0"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0"
        />
      </div>
      
      <div className="text-center mt-4">
        <button 
          className="btn-primary w-full"
          onClick={revokeApproval} 
          disabled={!isConnected || isTxPending} 
        >
          {isTxPending ? 'Processing...' : 'Set New Approval'}
        </button>
      </div>
      
      {txStatus && (
        <div className={`status-message ${txStatus.startsWith('error:') ? 'error' : txStatus.startsWith('success:') ? 'success' : ''}`}>
          {txStatus.replace('error:', '').replace('success:', '')}
        </div>
      )}
      
      <div className="text-center mt-4 text-muted" style={{ fontSize: '0.9rem' }}>
        {isConnected ? (
          <div>
            Connected: <span className="address-tag">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            {chainId && <div className="mt-4">Network Chain ID: {chainId}</div>}
          </div>
        ) : (
          'Connect your wallet to revoke approval.'
        )}
      </div>
    </div>
  );
};

export default RevokeApproval;
