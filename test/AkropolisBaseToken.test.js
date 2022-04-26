const { AkropolisBaseToken_Tests } = require('./AkropolisBaseToken.js');
const { AkropolisBaseToken, BalanceSheet, AllowanceSheet } = require('./helpers/common');
const { CommonVariables } = require('./helpers/common');

contract('AkropolisBaseToken', _accounts => {
    const commonVars = new CommonVariables(_accounts);
    const owner = commonVars.owner
    const tokenHolder = commonVars.user
    const otherAccount = commonVars.user2
    
    beforeEach(async function () {
        // Set up TokenStorage
        this.allowances = await AllowanceSheet.new({ from: owner })
        this.balances = await BalanceSheet.new({ from: owner })

        // Set up Token
        this.AkropolisBaseToken = await AkropolisBaseToken.new(
          this.balances.address,
          this.allowances.address,
          '',
          0,
          '',
          { from: owner },
        )

        // If Token does not own storage contracts, then the storage contracts must
        // transfer ownership to the token contract and then the token must claim
        // ownership to complete two stage ownership transfer
        await this.allowances.transferOwnership(this.AkropolisBaseToken.address)
        await this.balances.transferOwnership(this.AkropolisBaseToken.address)
        await this.AkropolisBaseToken.claimBalanceOwnership()        
        await this.AkropolisBaseToken.claimAllowanceOwnership()
    })


    describe("AkropolisBaseToken Token behavior tests", function () {
        AkropolisBaseToken_Tests(owner, tokenHolder, otherAccount);
    });
})
