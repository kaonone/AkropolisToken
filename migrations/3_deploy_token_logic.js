var AkropolisToken = artifacts.require("./AkropolisToken.sol");
var AkropolisBaseToken = artifacts.require("./AkropolisBaseToken.sol");

module.exports = function(deployer, network, accounts) {
  const ZERO_ADDRESS = 0x0000000000000000000000000000000000000000;
  let owner = accounts[0];
  console.log('owner of token contracts: ' + owner);
  deployer.deploy(AkropolisBaseToken, ZERO_ADDRESS, ZERO_ADDRESS, {from:owner}); 
  deployer.deploy(AkropolisToken, ZERO_ADDRESS, ZERO_ADDRESS, {from:owner}); 

};
