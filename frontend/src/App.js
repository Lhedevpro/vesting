import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { VESTING_ADDRESS, VESTING_ABI } from "./abi";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [status, setStatus] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [amount, setAmount] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const vestingContract = new ethers.Contract(VESTING_ADDRESS, VESTING_ABI, signer);
      setContract(vestingContract);
    } else {
      alert("Veuillez installer Metamask !");
    }
  };

  const claimTokens = async () => {
    if (!contract) return;
    try {
      const tx = await contract.claimTokens();
      setStatus("Transaction envoyée...");
      await tx.wait();
      setStatus("✅ Tokens réclamés avec succès !");
    } catch (err) {
      console.error(err);
      setStatus("❌ Échec : " + err.message);
    }
  };

  const addVesting = async () => {
    if (!contract || !beneficiary || !amount) return;

    const unlockTime = Math.floor(Date.now() / 1000) + 300; // 5 minutes

    try {
      const tx = await contract.addVesting(beneficiary, ethers.parseUnits(amount, 18), unlockTime); // Utilise parseUnits
      setStatus("Vesting ajouté, transaction envoyée...");
      await tx.wait();
      setStatus("✅ Vesting ajouté avec succès !");
    } catch (err) {
      console.error(err);
      setStatus("❌ Échec de l'ajout du vesting : " + err.message);
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h2>Vesting DApp</h2>

      {!account ? (
        <button onClick={connectWallet}>Connecter Metamask</button>
      ) : (
        <>
          <p>Connecté en tant que : <strong>{account}</strong></p>

          <div>
            <h3>Ajouter un vesting</h3>
            <div>
              <label>
                Adresse du bénéficiaire :
                <input
                  type="text"
                  value={beneficiary}
                  onChange={(e) => setBeneficiary(e.target.value)}
                  placeholder="0x..."
                />
              </label>
            </div>
            <div>
              <label>
                Montant (en tokens) :
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000"
                />
              </label>
            </div>
            <button onClick={addVesting}>Ajouter Vesting</button>
          </div>

          <button onClick={claimTokens}>Claim Tokens</button>
          <p>{status}</p>
        </>
      )}
    </div>
  );
}

export default App;
