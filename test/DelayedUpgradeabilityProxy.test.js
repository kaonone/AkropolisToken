const { ZERO_ADDRESS, timetravel } = require("./helpers/common");
const DelayedUpgradeabilityProxyMock = artifacts.require("DelayedUpgradeabilityProxyMock");
const DummyContractV0 = artifacts.require("DummyContractV0");
const DummyContractV1 = artifacts.require("DummyContractV1");

contract('DelayedUpgradeabilityProxy', _accounts => {
  const owner = _accounts[0];
  const ONE_HOUR = 60 * 60; // Number of seconds in one hour
  const ONE_DAY = 24 * ONE_HOUR; // Number of seconds in one day
  const ONE_WEEK = 7 * ONE_DAY; // Number of seconds in one week
  const TWO_WEEKS = 2 * ONE_WEEK; // Number of seconds in two weeks
  const FOUR_WEEKS = 4 * ONE_WEEK; // Number of seconds in four weeks

  beforeEach(async function () {
    this.dummyContractV0 = await DummyContractV0.new({ from: owner });
    this.dummyContractV1 = await DummyContractV1.new({ from: owner });
    this.proxy = await DelayedUpgradeabilityProxyMock.new(this.dummyContractV0.address, { from: owner });
  })
  describe('upgradeTo', function () {
    it('sets pending implementation', async function () {
      await this.proxy.upgradeTo(this.dummyContractV1.address, { from: owner });
      assert.equal(await this.proxy.pendingImplementation(), this.dummyContractV1.address);
      assert(await this.proxy.pendingImplementationIsSet());
    });
    it('sets pending implementation application date', async function () {
      const { logs } = await this.proxy.upgradeTo(this.dummyContractV1.address, { from: owner });
      var functionCallTime = (await web3.eth.getBlock(logs[0].blockNumber)).timestamp;
      var deployTime = functionCallTime + FOUR_WEEKS;
      assert.equal(await this.proxy.pendingImplementationApplicationDate(), deployTime);
    });
    it('emits pending implementation changed event', async function () {
      const { logs } = await this.proxy.upgradeTo(this.dummyContractV1.address, { from: owner });
      assert.equal(logs.length, 1);
      assert.equal(logs[0].event, "PendingImplementationChanged");
      assert.equal(logs[0].args.oldPendingImplementation, ZERO_ADDRESS);
      assert.equal(logs[0].args.newPendingImplementation, this.dummyContractV1.address);
    });

  });
  describe('_willFallback', function () {
    describe('if there is a pending implementation', function () {
      beforeEach(async function () {
        await this.proxy.upgradeTo(this.dummyContractV1.address, { from: owner });
      });
      describe('does not switch to pending implementation before the application date', function () {
        it('one hour', async function () {
          await timetravel(ONE_HOUR);
          const dummyContract = await DummyContractV0.at(this.proxy.address);
          assert.equal(await dummyContract.hello(), "Konichiwa!");
        })
        it('one day', async function () {
          await timetravel(ONE_DAY);
          const dummyContract = await DummyContractV0.at(this.proxy.address);
          assert.equal(await dummyContract.hello(), "Konichiwa!");
        })
        it('one week', async function () {
          await timetravel(ONE_WEEK);
          const dummyContract = await DummyContractV0.at(this.proxy.address);
          assert.equal(await dummyContract.hello(), "Konichiwa!");
        })
        it('two weeks', async function () {
          await timetravel(TWO_WEEKS);
          const dummyContract = await DummyContractV0.at(this.proxy.address);
          assert.equal(await dummyContract.hello(), "Konichiwa!");
        })
      });
      it('switches to pending implementation after the application date', async function () {
        await timetravel(FOUR_WEEKS + ONE_HOUR);
        const dummyContract = await DummyContractV0.at(this.proxy.address);
        assert.equal(await dummyContract.hello(), "Hello!");
      });
    });
    describe('if there is not a pending implementation', function () {
      it('does not switch to pending implementation if there is no pending implementation', async function () {
        const dummyContract = await DummyContractV0.at(this.proxy.address);
        assert.equal(await dummyContract.hello(), "Konichiwa!");
      });
    });
  });
})