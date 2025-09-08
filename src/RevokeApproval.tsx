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
  const [txStatus, setTxStatus] = useState('');

  const revokeApproval = async () => {
    setTxStatus('');
    if (!ethers.isAddress(token) || !ethers.isAddress(spender)) {
      setTxStatus('Invalid token or spender address!');
      return;
    }
    if (!isConnected || !walletClient) {
      setTxStatus('Connect wallet first!');
      return;
    }
    try {
      setTxStatus('Sending transaction...');
      // Create ethers.js provider and signer from wagmi walletClient
      const provider = new ethers.BrowserProvider(walletClient); // EIP-1193 provider
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(token, ERC20_ABI, signer);
      const tx = await tokenContract.approve(spender, 0);
      setTxStatus(`Transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      setTxStatus(`✅ Approval revoked! Tx confirmed in block ${receipt.blockNumber}`);
    } catch (err: any) {
      setTxStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h2>Revoke ERC20 Approval</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>Token Address:</label>
        <input value={token} onChange={e => setToken(e.target.value)} style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Spender Address:</label>
        <input value={spender} onChange={e => setSpender(e.target.value)} style={{ width: '100%' }} />
      </div>
      <button onClick={revokeApproval} disabled={!isConnected} style={{ marginTop: '10px' }}>
        Revoke Approval
      </button>
      {txStatus && <p style={{ marginTop: '20px' }}>{txStatus}</p>}
     <div style={{ marginTop: '10px', color: '#888', fontSize: '0.9em' }}>
        {isConnected ? `Connected: ${address}` : 'Connect your wallet to revoke approval.'}
        {/* {chainId && <div>Network Name: {chain}</div>} */}
        {chainId && <div>Network Chain ID: {chainId}</div>}
      </div> 
    </div>
  );
};

export default RevokeApproval;
