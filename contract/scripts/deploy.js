const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Déploiement depuis :", deployer.address);

  const tokenAddress = "0xB8c135a9bAe5D29F27324A305f21493BB33479F6";

  const Vesting = await hre.ethers.getContractFactory("Vesting");
  const vesting = await Vesting.deploy(tokenAddress);

  await vesting.waitForDeployment(); // ✅ nouvelle méthode

  console.log("✅ Contrat Vesting déployé à :", vesting.target);
}

main().catch((error) => {
  console.error("❌ Erreur :", error);
  process.exitCode = 1;
});
