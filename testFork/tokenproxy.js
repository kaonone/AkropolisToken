const { AkropolisToken, expectThrow, assertBalance, toBN } = require('../test/helpers/common');

function TokenProxyTests({
  newUser,
  tokenHolders,
  tokenProxy,
  proxyOwner,
  oldImplAddress,
  amount,
}) {
  describe('--Before upgrade--', function () {
    it('owner of the token proxy is the multisig contract', async function () {
      const owner = await this.proxy.owner();
      assert.equal(owner.toLowerCase(), proxyOwner.toLowerCase());
    });

    it("current implementation doesn't support setNameSymbol method", async function () {
      const currImplementation = await this.proxy.implementation();
      assert.equal(currImplementation.toLowerCase(), oldImplAddress.toLowerCase());
      await expectThrow(this.oldTokenProxy.setNameSymbol('Kaonone', 'KAON', { from: proxyOwner }));
    });

    it('current symbol/name is AKRO/Akropolis', async function () {
      const tokenName = await this.oldTokenProxy.name();
      const tokenSymbol = await this.oldTokenProxy.symbol();
      assert.equal(tokenName, 'Akropolis');
      assert.equal(tokenSymbol, 'AKRO');
    });
  });

  describe('--Upgrading--', function () {
    before(async function () {
      this.newImplementation = await AkropolisToken.deployed();
      const { logs } = await this.proxy.upgradeTo(this.newImplementation.address, {
        from: proxyOwner,
      });
      this.logs = logs;
    });

    it('upgrades implementation to the latest AkropolisToken', async function () {
      const newImplAddress = await this.proxy.implementation();
      assert.equal(newImplAddress, this.newImplementation.address);
    });

    it('emits an Upgraded event', async function () {
      const newImplAddress = this.logs.find((l) => l.event === 'Upgraded').args.implementation;

      assert.equal(this.logs.length, 1);
      assert.equal(newImplAddress, this.newImplementation.address);
    });
  });

  describe('--After upgrade--', function () {
    before(async function () {
      this.newTokenProxy = await AkropolisToken.at(tokenProxy);
    });

    describe('values are not affected', function () {
      it('proxy has original balances, allowances after upgrade', async function () {
        assert.equal(await this.newTokenProxy.balances(), this.dataBeforeUpgrade.balances);
        assert.equal(await this.newTokenProxy.allowances(), this.dataBeforeUpgrade.allowances);
      });

      it('totalSupply not changed', async function () {
        const supply = await this.newTokenProxy.totalSupply();
        assert(supply.eq(this.dataBeforeUpgrade.totalSupply));
      });

      it('user allowances and balances not changed', async function () {
        tokenHolders.forEach(async (user, i) => {
          const allowance = await this.newTokenProxy.allowance(user, newUser);
          assert(allowance.eq(this.dataBeforeUpgrade.userAllowances[i]));
          await assertBalance(this.newTokenProxy, user, this.dataBeforeUpgrade.userBalances[i]);
        });
      });
    });

    describe('proxy delegates calls to a new logic contract', function () {
      describe('transferFrom', function () {
        const from = tokenHolders[0];

        beforeEach(async function () {
          await this.newTokenProxy.approve(newUser, toBN(0), { from });
        });

        after(async function () {
          // restore tokenHolder balance
          await this.newTokenProxy.transfer(from, amount, { from: newUser });
        });

        it('successfully transfers approved amount', async function () {
          const newUserBalance = await this.newTokenProxy.balanceOf(newUser);
          const fromUserBalance = await this.newTokenProxy.balanceOf(from);

          await this.newTokenProxy.approve(newUser, amount, { from });
          await this.newTokenProxy.transferFrom(from, newUser, amount, {
            from: newUser,
          });
          await assertBalance(this.newTokenProxy, newUser, newUserBalance.add(amount));
          await assertBalance(this.newTokenProxy, from, fromUserBalance.sub(amount));
        });

        it('reverts when amount is greater than allowance', async function () {
          await expectThrow(
            this.newTokenProxy.transferFrom(from, newUser, amount, { from: newUser })
          );
        });
      });

      describe('transfer', function () {
        const from = tokenHolders[0];

        after(async function () {
          // restore tokenHolder balance
          await this.newTokenProxy.transfer(from, amount, { from: newUser });
        });

        it('successfully transfers', async function () {
          const newUserBalance = await this.newTokenProxy.balanceOf(newUser);
          const fromUserBalance = await this.newTokenProxy.balanceOf(from);

          await this.newTokenProxy.transfer(newUser, amount, { from });
          await assertBalance(this.newTokenProxy, newUser, newUserBalance.add(amount));
          await assertBalance(this.newTokenProxy, from, fromUserBalance.sub(amount));
        });

        it('reverts when amount is greater than balance', async function () {
          const fromUserBalance = await this.newTokenProxy.balanceOf(from);

          await expectThrow(
            this.newTokenProxy.transfer(newUser, fromUserBalance.add(amount), {
              from,
            })
          );
        });
      });
    });

    describe('mintFinished', function () {
      before(async function () {
        const { logs } = await this.newTokenProxy.mintFinished({ from: proxyOwner });
        this.logs = logs;
      });

      it('changes isMintingFinished to true', async function () {
        const isMintingFinished = await this.newTokenProxy.isMintingFinished();
        assert(isMintingFinished);
      });

      it('mint reverts', async function () {
        await expectThrow(this.newTokenProxy.mint(newUser, amount, { from: proxyOwner }));
      });

      it('emits MintFinished event', function () {
        assert.equal(this.logs.length, 1);
        assert.equal(this.logs[0].event, 'MintFinished');
      });
    });

    describe('mintStarted', function () {
      before(async function () {
        const { logs } = await this.newTokenProxy.mintStarted({ from: proxyOwner });
        this.logs = logs;
      });

      it('changes isMintingFinished to false', async function () {
        const isMintingFinished = await this.newTokenProxy.isMintingFinished();
        assert(!isMintingFinished);
      });

      it('enables minting', async function () {
        tokenHolders.forEach(async (user, i) => {
          await this.newTokenProxy.mint(user, amount, { from: proxyOwner });
          await assertBalance(
            this.newTokenProxy,
            user,
            amount.add(this.dataBeforeUpgrade.userBalances[i])
          );
        });
      });

      it('emits MintStarted event', function () {
        assert.equal(this.logs.length, 1);
        assert.equal(this.logs[0].event, 'MintStarted');
      });
    });

    describe('setNameSymbol', function () {
      before(async function () {
        const { logs } = await this.newTokenProxy.setNameSymbol('Kaonone', 'KAON', {
          from: proxyOwner
        });
        this.logs = logs;
      });

      it('setNameSymbol reverts if not owner', async function () {
        await expectThrow(this.newTokenProxy.setNameSymbol('Kaonone2', 'KAON2', {
          from: newUser
        }));
      });

      it('name/symbol changed', async function () {
        const tokenName = await this.newTokenProxy.name();
        const tokenSymbol = await this.newTokenProxy.symbol();
        assert.equal(tokenName, 'Kaonone');
        assert.equal(tokenSymbol, 'KAON');
      });

      it('emits NameSymbolChanged event', function () {
        assert.equal(this.logs.length, 1);
        assert.equal(this.logs[0].event, 'NameSymbolChanged');
      });
    });
  });
}

module.exports = {
  TokenProxyTests,
};
