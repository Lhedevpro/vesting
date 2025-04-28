import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { 
  VESTING_ADDRESS, 
  TOKEN1_ADDRESS, 
  TOKEN2_ADDRESS, 
  VESTING_ABI, 
  ERC20_ABI 
} from "./abi";
import { ArrowPathIcon, WalletIcon } from "@heroicons/react/24/outline";

function App() {
  const [account, setAccount] = useState(null);
  const [vestingContract, setVestingContract] = useState(null);
  const [token1Contract, setToken1Contract] = useState(null);
  const [token2Contract, setToken2Contract] = useState(null);
  const [status, setStatus] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState(TOKEN1_ADDRESS);
  const [unlockTime, setUnlockTime] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [userVesting, setUserVesting] = useState(null);
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [tokenOptions, setTokenOptions] = useState([
    { address: TOKEN1_ADDRESS, name: "Token 1 (TT1)" },
    { address: TOKEN2_ADDRESS, name: "Token 2 (TT2)" },
    { address: "custom", name: "Autre token ERC20" }
  ]);

  const checkVestingDetails = async () => {
    if (!vestingContract || !account) return;
    try {
      const vestingInfo = await vestingContract.vestings(account);
      console.log("Détails du vesting:", {
        amount: ethers.formatUnits(vestingInfo.amount, 18),
        unlockTime: new Date(Number(vestingInfo.unlockTime) * 1000).toLocaleString(),
        claimed: vestingInfo.claimed,
        token: vestingInfo.token
      });
      setUserVesting(vestingInfo);
    } catch (err) {
      console.error("Erreur lors de la vérification du vesting:", err);
    }
  };

  const claimTokens = async () => {
    if (!vestingContract) return;
    try {
      setStatus("Vérification du vesting...");
      
      // Vérifier les détails du vesting avant de claim
      const vestingInfo = await vestingContract.vestings(account);
      
      if (vestingInfo.amount.toString() === "0") {
        throw new Error("Vous n'avez pas de tokens à réclamer");
      }
      
      if (vestingInfo.claimed) {
        throw new Error("Vous avez déjà réclamé vos tokens");
      }
      
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime < Number(vestingInfo.unlockTime)) {
        throw new Error(`Les tokens seront débloqués le ${new Date(Number(vestingInfo.unlockTime) * 1000).toLocaleString()}`);
      }

      setStatus("Transaction en cours...");
      const tx = await vestingContract.claimTokens();
      await tx.wait();
      setStatus("✅ Tokens réclamés avec succès !");
      
      // Recharger les informations
      await checkVestingDetails();
    } catch (err) {
      console.error("Erreur lors du claim:", err);
      setStatus("❌ Échec : " + (err.reason || err.message));
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Veuillez installer Metamask !");
        return;
      }

      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      
      if (accounts.length === 0) {
        throw new Error("Aucun compte trouvé");
      }

      setAccount(accounts[0]);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const vesting = new ethers.Contract(VESTING_ADDRESS, VESTING_ABI, signer);
      const token1 = new ethers.Contract(TOKEN1_ADDRESS, ERC20_ABI, signer);
      const token2 = new ethers.Contract(TOKEN2_ADDRESS, ERC20_ABI, signer);

      setVestingContract(vesting);
      setToken1Contract(token1);
      setToken2Contract(token2);

      const isAdminCheck = await vesting._owner() === accounts[0];
      const isWhitelistedCheck = await vesting.whitelist(accounts[0]);
      setIsAdmin(isAdminCheck);
      setIsWhitelisted(isWhitelistedCheck);

      await checkVestingDetails();
      setStatus("✅ Wallet connecté avec succès !");
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setStatus("❌ Erreur de connexion : " + err.message);
    }
  };

  const addVesting = async () => {
    if (!vestingContract || !beneficiary || !amount || !unlockTime) return;

    try {
      setStatus("Transaction en cours...");
      const tx = await vestingContract.addVesting(
        beneficiary,
        ethers.parseUnits(amount, 18),
        Math.floor(new Date(unlockTime).getTime() / 1000),
        selectedToken
      );
      await tx.wait();
      setStatus("✅ Vesting ajouté avec succès !");
    } catch (err) {
      console.error(err);
      setStatus("❌ Échec de l'ajout du vesting : " + err.message);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || timestamp.toString() === "0") return "Non défini";
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-center mb-8">Vesting DApp</h1>

                {!account ? (
                  <button
                    onClick={connectWallet}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <WalletIcon className="h-5 w-5 mr-2" />
                    Connecter Metamask
                  </button>
                ) : (
                  <>
                    <div className="mb-6">
                      <p className="text-sm text-gray-500">Connecté en tant que :</p>
                      <p className="font-mono text-sm break-all">{account}</p>
                    </div>

                    {userVesting && userVesting.amount.toString() !== "0" && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Votre Vesting</h3>
                        <p>Montant : {ethers.formatUnits(userVesting.amount, 18)} tokens</p>
                        <p>Déblocage : {formatDate(userVesting.unlockTime)}</p>
                        <p>Statut : {userVesting.claimed ? "Réclamé" : "En attente"}</p>
                        {!userVesting.claimed && (
                          <button
                            onClick={claimTokens}
                            className="mt-2 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                          >
                            Réclamer les tokens
                          </button>
                        )}
                      </div>
                    )}

                    {(isAdmin || isWhitelisted) && (
                      <div className="space-y-4">
                        <h3 className="font-semibold">Ajouter un vesting</h3>
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={beneficiary}
                            onChange={(e) => setBeneficiary(e.target.value)}
                            placeholder="Adresse du bénéficiaire"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Montant"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                          <input
                            type="datetime-local"
                            value={unlockTime}
                            onChange={(e) => setUnlockTime(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                          <div className="space-y-2">
                            <select
                              value={selectedToken}
                              onChange={(e) => {
                                setSelectedToken(e.target.value);
                                if (e.target.value !== "custom") {
                                  setCustomTokenAddress("");
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                              {tokenOptions.map((option) => (
                                <option key={option.address} value={option.address}>
                                  {option.name}
                                </option>
                              ))}
                            </select>
                            {selectedToken === "custom" && (
                              <input
                                type="text"
                                value={customTokenAddress}
                                onChange={(e) => {
                                  setCustomTokenAddress(e.target.value);
                                  setSelectedToken(e.target.value);
                                }}
                                placeholder="Adresse du token ERC20"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-2"
                              />
                            )}
                          </div>
                          <button
                            onClick={addVesting}
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            Ajouter Vesting
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {status && (
                  <div className={`mt-4 p-3 rounded-md ${status.includes("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {status}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
