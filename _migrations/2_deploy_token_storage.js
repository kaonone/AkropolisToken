var BalanceSheet = artifacts.require("./BalanceSheet.sol");
var AllowanceSheet = artifacts.require("./AllowanceSheet")

module.exports = function(deployer, network, accounts) {
  let owner = accounts[0];
  console.log('owner of storage contracts: ' + owner)
  deployer.deploy(BalanceSheet, {from: owner});
  deployer.deploy(AllowanceSheet, {from: owner});
};
