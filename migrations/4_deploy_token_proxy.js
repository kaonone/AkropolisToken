var TokenProxy = artifacts.require("./TokenProxy.sol");
var AkropolisToken = artifacts.require("./AkropolisToken.sol");
var AkropolisBaseToken = artifacts.require("./AkropolisToken.sol");
var BalanceSheet = artifacts.require("./BalanceSheet.sol");
var AllowanceSheet = artifacts.require("./AllowanceSheet.sol");

module.exports = function(deployer, network, accounts) {
  let owner = accounts[0];
  console.log('AkropolisToken: '+AkropolisToken.address);
  
  console.log('owner of proxy contract: ' + owner)
  

  deployer.deploy(TokenProxy, AkropolisBaseToken.address, BalanceSheet.address, AllowanceSheet.address, {from:owner});

};
