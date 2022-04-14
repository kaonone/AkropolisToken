const { TokenProxy, AkropolisToken, toBN } = require('../test/helpers/common');
const { TokenProxyTests } = require('./tokenproxy');

contract('TokenProxy', (accounts) => {
  const newUser = accounts[0];
  const tokenHolders = [
    '0xf977814e90da44bfa03b6295a0616a897441acec',
    '0xedc6bacdc1e29d7c5fa6f6eca6fdd447b9c487c9',
    '0xeb31973e0febf3e3d7058234a5ebbae1ab4b8c23',
    '0x5a52e96bacdabb82fd05763e25335261b270efcb',
    '0x13bc4025236f8fe39a011893781e82a4cbdf7051',
  ];
  const tokenProxy = '0x8Ab7404063Ec4DBcfd4598215992DC3F8EC853d7';
  const proxyOwner = '0xC5aF91F7D10dDe118992ecf536Ed227f276EC60D';
  const oldImplAddress = '0xeaa04ea9a674d755b9c2fd988d01f7a1c9d116da';
  const amount = toBN(10 * 10 ** 18);

  before(async function () {
    this.proxy = await TokenProxy.at(tokenProxy);
    this.oldTokenProxy = await AkropolisToken.at(tokenProxy);

    const totalSupply = await this.oldTokenProxy.totalSupply();
    const allowances = await this.oldTokenProxy.allowances();
    const balances = await this.oldTokenProxy.balances();

    await Promise.all(
      tokenHolders.map((user) =>
        web3.eth.sendTransaction({
          from: accounts[1],
          to: user,
          value: toBN(10 * 10 ** 18),
        })
      )
    );

    await Promise.all(
      tokenHolders.map((user, i) => this.oldTokenProxy.approve(newUser, amount, { from: user }))
    );

    const userAllowances = await Promise.all(
      tokenHolders.map((user) => this.oldTokenProxy.allowance(user, newUser))
    );
    const userBalances = await Promise.all(
      tokenHolders.map((user) => this.oldTokenProxy.balanceOf(user))
    );

    this.dataBeforeUpgrade = {
      totalSupply,
      allowances,
      balances,
      userAllowances,
      userBalances,
    };
  });

  describe('Mainnet TokenProxy tests', function () {
    TokenProxyTests({ newUser, tokenHolders, tokenProxy, proxyOwner, oldImplAddress, amount });
  });
});
