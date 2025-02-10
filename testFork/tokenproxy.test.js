const { TokenProxy, AkropolisToken, toBN } = require('../test/helpers/common');
const { TokenProxyTests } = require('./tokenproxy');

contract('TokenProxy', (accounts) => {
  const newUser = accounts[0];
  const tokenHolders = [
    '0xc89b84a9Bb8F6ac0a8c3a87e7C398039bA0E343e',
    '0x28C6c06298d514Db089934071355E5743bf21d60',
    '0xeb31973e0febf3e3d7058234a5ebbae1ab4b8c23',
    '0xeeD86B90448C371Eab47b7f16E294297C27E4F51',
    '0x89a75E2A366C055C5c2f8D08DF7a8AC484b22778',
  ];
  const tokenProxy = '0x8Ab7404063Ec4DBcfd4598215992DC3F8EC853d7';
  const proxyOwner = '0xae4af0301afe8f352d2b47cbac54e79528ad91ae';
  const oldImplAddress = '0x108388a5b0eb47629138250b6361924813a2acd6';
  const amount = toBN(10 * 10 ** 18);

  before(async function () {
    this.proxy = await TokenProxy.at(tokenProxy);
    this.oldTokenProxy = await AkropolisToken.at(tokenProxy);

    const totalSupply = await this.oldTokenProxy.totalSupply();
    const allowances = await this.oldTokenProxy.allowances();
    const balances = await this.oldTokenProxy.balances();

    await Promise.all(
      [...tokenHolders, proxyOwner].map((user) =>
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
    TokenProxyTests({
      newUser,
      tokenHolders,
      tokenProxy,
      proxyOwner,
      oldImplAddress,
      amount,
    });
  });
});
