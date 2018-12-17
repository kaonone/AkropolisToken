const { CommonVariables, ZERO_ADDRESS } = require('./helpers/common');

const { TokenStorage, BalanceSheet, AllowanceSheet } = require('./helpers/common');

const { TokenStorageTests } = require('./tokenstorage.js');


contract('PermissionedTokenStorage', _accounts => {
    const commonVars = new CommonVariables(_accounts);
    const owner = commonVars.owner;
    const tokenHolder = commonVars.user2;
    const spender = commonVars.user3;

    beforeEach(async function () {
        this.balances = await BalanceSheet.new({ from:owner })
        this.allowances = await AllowanceSheet.new({ from:owner })
    })

    describe("PermissionedTokenStorage tests", function () {
        TokenStorageTests(owner, tokenHolder, spender);
    })
})
