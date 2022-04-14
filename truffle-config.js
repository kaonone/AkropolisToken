
const HDWalletProvider = require("truffle-hdwallet-provider");
require('dotenv').config()  // Stores environment-specific variable from '.env' to process.env

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
    plugins: ["truffle-plugin-verify"],
  	compilers: {
      solc: {
        version: "0.4.24"  // Change this to whatever you need
      }
  	},
	networks: {
		development: {
			host: 'localhost',
			port: 8545,
			network_id: '*',
			gas: 5000000,
      gasPrice: 55000000000
		},

		mainnet: {
			  provider: function () {
	          return new HDWalletProvider(process.env.METAMASK_MNEMONIC, "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY, 3)
	      },
		  network_id: 1,
		  gasPrice: 90000000000,
	      skipDryRun:true
		},
		
		kovan: {
	          provider: function () {
	          return new HDWalletProvider(process.env.METAMASK_MNEMONIC, "https://kovan.infura.io/v3/" + process.env.INFURA_API_KEY)
	      },
	      network_id: 42,
	      gas: 7000000
		},
		
		rinkeby: {
			provider: function () {
			return new HDWalletProvider(process.env.METAMASK_MNEMONIC, "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY, 1)
		},
		network_id: 4,
		gas: 7000000
	  }
	},
	mocha: {
	   reporter: 'eth-gas-reporter',
	   reporterOptions: {
	     gasPrice: 21
	   }
	},

	api_keys: {
		etherscan: process.env.ETHERSCAN_API_KEY
	}
};