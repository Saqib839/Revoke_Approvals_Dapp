
import React, { useState } from "react";
import { ethers } from "ethers";
import { createWeb3Modal, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/react";
import { EthereumClient, modalConnectors, walletConnectProvider } from "@web3modal/ethereum";

const PEAQ_CHAIN_ID = 3339;
const PEAQ_RPC = "https://quicknode3.peaq.xyz";
const projectId = process.env.REACT_APP_PROJECT_ID;

// Setup WalletConnect v2 modal
const chains = [
  {
    chainId: PEAQ_CHAIN_ID,
    rpcUrl: PEAQ_RPC,
    name: "Peaq",
    currency: "PEAQ",
    explorerUrl: "https://explorer.peaq.network/"
  }
];

createWeb3Modal({
  projectId,
  chains,
  provider: walletConnectProvider({ projectId, chains }),
  connectors: modalConnectors({ projectId, chains }),
});

function App() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { provider } = useWeb3ModalProvider();
  const [token, setToken] = useState("");
  const [spender, setSpender] = useState("");
  const [txStatus, setTxStatus] = useState("");

  const revokeApproval = async () => {
    if (!ethers.isAddress(token) || !ethers.isAddress(spender)) {
      alert("Invalid token or spender address!");
      return;
    }
    if (!provider || !isConnected) {
      alert("Connect wallet first!");
      return;
    }

    const signer = await provider.getSigner();
    const tokenContract = new ethers.Contract(
      token,
      ["function approve(address spender, uint256 amount) public returns (bool)"],
      signer
    );

    try {
      setTxStatus("Sending transaction...");
      const tx = await tokenContract.approve(spender, 0);
      setTxStatus(`Transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      setTxStatus(`✅ Approval revoked! Tx confirmed in block ${receipt.blockNumber}`);
    } catch (err) {
      console.error(err);
      setTxStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "Arial" }}>
      <h1>Peaq Approval Revoke</h1>

      {!isConnected ? (
        <button onClick={open}>Connect Wallet</button>
      ) : (
        <p>Connected: {address}</p>
      )}

      <div style={{ marginTop: "20px" }}>
        <label>Token Address:</label>
        <input value={token} onChange={(e) => setToken(e.target.value)} style={{ width: "100%" }} />

        <label>Spender Address:</label>
        <input value={spender} onChange={(e) => setSpender(e.target.value)} style={{ width: "100%" }} />

        <button onClick={revokeApproval} style={{ marginTop: "10px" }}>
          Revoke Approval
        </button>
      </div>

      {txStatus && <p style={{ marginTop: "20px" }}>{txStatus}</p>}
    </div>
  );
}

export default App;
