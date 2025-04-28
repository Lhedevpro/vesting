const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Déploiement depuis :", deployer.address);

  // Déploiement du premier token ERC20
  const Token1 = await hre.ethers.getContractFactory("Token1");
  const token1 = await Token1.deploy();
  await token1.waitForDeployment();
  console.log("✅ Token 1 déployé à :", token1.target);

  // Déploiement du deuxième token ERC20
  const Token2 = await hre.ethers.getContractFactory("Token2");
  const token2 = await Token2.deploy();
  await token2.waitForDeployment();
  console.log("✅ Token 2 déployé à :", token2.target);

  // Déploiement du contrat Vesting
  const Vesting = await hre.ethers.getContractFactory("Vesting");
  const vesting = await Vesting.deploy();
  await vesting.waitForDeployment();
  console.log("✅ Contrat Vesting déployé à :", vesting.target);

  // Affichage des adresses pour référence
  console.log("\n📝 Résumé des adresses :");
  console.log("Token 1:", token1.target);
  console.log("Token 2:", token2.target);
  console.log("Vesting:", vesting.target);
}

main().catch((error) => {
  console.error("❌ Erreur :", error);
  process.exitCode = 1;
});
