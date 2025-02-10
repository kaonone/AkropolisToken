const HDWalletProvider = require('truffle-hdwallet-provider');
require('dotenv').config(); // Stores environment-specific variable from '.env' to process.env

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  plugins: ['truffle-plugin-verify'],
  compilers: {
    solc: {
      version: '0.4.24', // Change this to whatever you need
    },
  },
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 10000000,
      gasPrice: 55000000000,
    },

    mainnet: {
      provider: function () {
        return new HDWalletProvider(
          process.env.DEPLOYER_PRIVATE_KEY,
          process.env.MAINNET_RPC_URL,
          0
        );
      },
      network_id: 1,
      gasPrice: 1318000000,
      gas: 6000000,
      skipDryRun: true,
    },

    tenderly: {
      provider: function () {
        return new HDWalletProvider(
          process.env.DEPLOYER_PRIVATE_KEY,
          process.env.MAINNET_RPC_URL,
          0
        );
      },
      network_id: 1,
      gasPrice: 1318000000,
      gas: 6000000,
      skipDryRun: true,
    },

    sepolia: {
      provider: function () {
        return new HDWalletProvider(
          process.env.DEPLOYER_PRIVATE_KEY,
          process.env.SEPOLIA_RPC_URL
        );
      },
      network_id: 11155111,
      gasPrice: 3000000000,
      gas: 7000000,
    },
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      gasPrice: 21,
    },
  },

  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY,
  },
};
