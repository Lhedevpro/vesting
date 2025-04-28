# Vesting DApp

A decentralized application for managing token vesting schedules on the Ethereum blockchain. This project allows users to create and manage vesting schedules for any ERC20 token.

![Vesting DApp Screenshot](https://via.placeholder.com/800x400?text=Vesting+DApp+Screenshot)

## Features

- 🎯 Create vesting schedules for any ERC20 token
- 🔒 Secure smart contract implementation
- 👥 Admin and whitelist management
- ⏱️ Customizable unlock times
- 💰 Claim vested tokens
- 🎨 Modern and responsive UI

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Smart Contracts](#smart-contracts)
- [Frontend](#frontend)
- [Deployment](#deployment)
- [Usage](#usage)
- [Testing](#testing)
- [License](#license)

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MetaMask wallet
- Ethereum testnet ETH (for testing)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vesting.git
cd vesting
```

2. Install dependencies for both contract and frontend:
```bash
# Install contract dependencies
cd contract
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Smart Contracts

The project includes three main smart contracts:

1. **Vesting.sol**: Main contract for managing vesting schedules
2. **Token1.sol**: Example ERC20 token
3. **Token2.sol**: Example ERC20 token

### Contract Features

- Admin and whitelist management
- Custom vesting schedules
- Token claiming mechanism
- Security checks and validations

## Frontend

The frontend is built with React and includes:

- Modern UI with Tailwind CSS
- MetaMask integration
- Real-time status updates
- Transaction management

### Running the Frontend

```bash
cd frontend
npm start
```

## Deployment

### Local Development

1. Start local Hardhat network:
```bash
cd contract
npx hardhat node
```

2. Deploy contracts:
```bash
npx hardhat run scripts/deploy.js
```

### Testnet Deployment (Sepolia)

1. Configure your `.env` file:
```
SEPOLIA_RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key
```

2. Deploy to Sepolia:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## Usage

1. **Connect Wallet**
   - Click "Connect Metamask" button
   - Approve the connection request

2. **Create Vesting Schedule**
   - Enter beneficiary address
   - Set amount of tokens
   - Choose unlock time
   - Select token (Token1, Token2, or custom ERC20)
   - Click "Add Vesting"

3. **Claim Tokens**
   - If you have a vesting schedule, click "Claim Tokens"
   - Approve the transaction in MetaMask

## Testing

Run the test suite:
```bash
cd contract
npx hardhat test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For support, email support@example.com or join our Discord community.

## Acknowledgments

- OpenZeppelin for the ERC20 implementation
- Hardhat for the development environment
- React and Tailwind CSS for the frontend 