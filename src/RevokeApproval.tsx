import React, { useState } from 'react';
import { useAccount, useChainId, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';

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

  const revokeApproval = async () => {
    setTxStatus('');
    // Trim the inputs before using
    const trimmedToken = token.trim();
    const trimmedSpender = spender.trim();
    const trimmedAmount = amount.trim();
    if (!ethers.isAddress(trimmedToken) || !ethers.isAddress(trimmedSpender)) {
      setTxStatus('Invalid token or spender address!');
      return;
    }
    if (!isConnected || !walletClient) {
      setTxStatus('Connect wallet first!');
      return;
    }
    let parsedAmount;
    try {
      parsedAmount = ethers.parseUnits(trimmedAmount || '0', 18);
    } catch (error) {
      setTxStatus('Invalid amount');
      return;
    }
    try {
      setTxStatus('Sending transaction...');
      // Create ethers.js provider and signer from wagmi walletClient
      const provider = new ethers.BrowserProvider(walletClient); // EIP-1193 provider
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(trimmedToken, ERC20_ABI, signer);
      const tx = await tokenContract.approve(trimmedSpender, parsedAmount);
      setTxStatus(`Transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      setTxStatus(`✅ Approval updated! Tx confirmed in block ${receipt.blockNumber}`);
    } catch (err: any) {
      setTxStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', padding: '32px', border: '1px solid #eee', borderRadius: '12px', background: '#fff' }}>
      <h2 style={{ marginBottom: '28px' }}>Revoke ERC20 Approval</h2>
      <div style={{ marginBottom: '22px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Token Address:</label>
        <input value={token} onChange={e => setToken(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #ccc', fontSize: '1rem' }} />
      </div>
      <div style={{ marginBottom: '22px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Spender Address:</label>
        <input value={spender} onChange={e => setSpender(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #ccc', fontSize: '1rem' }} />
      </div>
      <div style={{ marginBottom: '22px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>New Approval Amount (0 = revoke):</label>
        <input
          type="number"
          min="0"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #ccc', fontSize: '1rem' }}
        />
      </div>
      <button onClick={revokeApproval} disabled={!isConnected} style={{ marginTop: '10px', marginBottom: '28px', width: '40%', padding: '12px', fontSize: '1.1rem', borderRadius: 8 }}>
      Set New Approval
      </button>
      {txStatus && <p style={{ marginTop: '28px', marginBottom: '28px', fontSize: '1.05rem' }}>{txStatus}</p>}
      <div style={{ marginTop: '18px', color: '#888', fontSize: '1rem', lineHeight: 2 }}>
        {isConnected ? (
          <div>
            Connected: {address}
            {chainId && <div>Network Chain ID: {chainId}</div>}
          </div>
        ) : (
          'Connect your wallet to revoke approval.'
        )}
      </div>
    </div>
  );
};

export default RevokeApproval;
