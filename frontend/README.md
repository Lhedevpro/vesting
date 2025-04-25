Vesting DApp - Documentation
Introduction

Bienvenue dans la DApp de vesting ! Ce projet permet de gérer des tokens vesting (tokens verrouillés) pour des bénéficiaires spécifiques, avec un délai de déblocage automatique. L’interface front-end est développée avec React et interagit avec un contrat intelligent Solidity via Metamask et Ethers.js.
Prérequis

Avant de commencer, voici ce qu’il te faut :

    Metamask installé dans ton navigateur

    Un compte Metamask avec de l'ETH sur Sepolia Testnet

    Un token ERC-20 déployé (pour les tests, utilise n'importe quel token ERC-20 sur Sepolia)

    Node.js et npm installés sur ton environnement de développement

Installation
1. Cloner le repository

Cloner le repository du projet sur ta machine locale.

git clone https://github.com/ton_repo/vesting-dapp.git
cd vesting-dapp

2. Installer les dépendances

Dans le dossier racine du projet, lance cette commande pour installer les dépendances :

npm install

Configurer le Contrat
1. Déployer le Contrat (Backend)

Le contrat Vesting.sol est écrit en Solidity. Tu peux le déployer facilement avec Hardhat.

    Configurer Infura (Sepolia Testnet) dans .env

    Déployer le contrat avec la commande :

npx hardhat run scripts/deploy.js --network sepolia

Cela déploie ton contrat et t'affiche l'adresse du contrat sur Sepolia.
2. Connecter le Contrat au Front

Dans le fichier src/abi.js :

    Met l’adresse du contrat déployé dans VESTING_ADDRESS

    Assure-toi que l’ABI (interface du contrat) est bien définie.

Front-end (React)
1. Connexion avec Metamask

Dans le front-end, le bouton "Connecter Metamask" permet à l'utilisateur de connecter son compte Metamask à la DApp.

Une fois connecté, l'adresse du wallet apparaît, et l'utilisateur peut interagir avec le contrat.
2. Ajouter un Vesting

L'interface permet d'ajouter un vested token pour un bénéficiaire en fournissant :

    Adresse du bénéficiaire

    Montant des tokens

    Temps de déblocage (5 minutes par défaut)

L’utilisateur peut ensuite cliquer sur "Ajouter Vesting" pour créer un nouveau vesting sur le contrat.
3. Réclamer les Tokens (Claim)

Lorsque le unlockTime est atteint, l'utilisateur peut réclamer ses tokens en cliquant sur "Claim Tokens".
Scripts utiles
Déployer un nouveau contrat

    Déploie le contrat sur Sepolia en utilisant deploy.js.

npx hardhat run scripts/deploy.js --network sepolia

Ajouter un vesting manuellement

    Utilise addVesting() dans le contrat pour ajouter un vesting avec l'adresse, le montant, et le unlockTime :

npx hardhat run scripts/addVesting.js --network sepolia

Configurer l'Environnement
1. Variables d'environnement (.env)

Crée un fichier .env à la racine du projet avec les variables suivantes :

SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/votre_project_id
PRIVATE_KEY=votre_cle_privée

Conclusion

Cette DApp de vesting permet de gérer et de distribuer des tokens de manière sécurisée avec un délai de déblocage. L'interface front-end en React, connectée à Metamask, rend l’utilisation de la plateforme intuitive et facile pour l'utilisateur.

Si tu as des questions, n’hésite pas à me contacter !
