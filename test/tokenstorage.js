const { ZERO_ADDRESS, expectThrow } = require('./helpers/common');
const { TokenStorage } = require('./helpers/common');

function TokenStorageTests(owner, tokenHolder, spender) {

    describe('TokenStorage behavior tests', function () {
        const from = owner
        beforeEach(async function () {
            await this.allowances.addAllowance(tokenHolder, spender, 100 * 10 ** 18, { from })
            await this.balances.addBalance(tokenHolder, 100 * 10 ** 18, { from })
            await this.balances.addTotalSupply(100 * 10 ** 18, { from })
        })

        describe('Allowances CRUD tests', function () {
            describe('owner calls', function () {
                const from = owner
                it('addAllowance', async function () {
                    await this.allowances.addAllowance(tokenHolder, spender, 70 * 10 ** 18, { from })
                    const balance = await this.allowances.allowanceOf(tokenHolder, spender)
                    assert.equal(balance, (100 + 70) * 10 ** 18)
                })

                it('subAllowance', async function () {
                    await this.allowances.subAllowance(tokenHolder, spender, 70 * 10 ** 18, { from })
                    const balance = await this.allowances.allowanceOf(tokenHolder, spender)
                    assert.equal(balance, (100 - 70) * 10 ** 18)
                })

                it('setAllowance', async function () {
                    await this.allowances.setAllowance(tokenHolder, spender, 70 * 10 ** 18, { from })
                    const balance = await this.allowances.allowanceOf(tokenHolder, spender)
                    assert.equal(balance, 70 * 10 ** 18)
                })

                it('reverts subAllowance if insufficient funds', async function () {
                    await expectThrow(this.allowances.subAllowance(tokenHolder, spender, 170 * 10 ** 18, { from }))
                })
            })

            describe('non-owner calls', function () {
                const from = tokenHolder
                it('reverts all calls', async function () {
                    await expectThrow(this.allowances.addAllowance(tokenHolder, spender, 70 * 10 ** 18, { from }))
                    await expectThrow(this.allowances.subAllowance(tokenHolder, spender, 70 * 10 ** 18, { from }))
                    await expectThrow(this.allowances.setAllowance(tokenHolder, spender, 70 * 10 ** 18, { from }))
                })
            })
        })

        describe('Balances CRUD tests', function () {
            describe('owner calls', function () {
                const from = owner
                it('addBalance', async function () {
                    await this.balances.addBalance(tokenHolder, 70 * 10 ** 18, { from })
                    const balance = await this.balances.balanceOf(tokenHolder)
                    assert.equal(balance, (100 + 70) * 10 ** 18)
                })
                it('subBalance', async function () {
                    await this.balances.subBalance(tokenHolder, 70 * 10 ** 18, { from })
                    const balance = await this.balances.balanceOf(tokenHolder)
                    assert.equal(balance, (100 - 70) * 10 ** 18)
                })
                it('setBalance', async function () {
                    await this.balances.setBalance(tokenHolder, 70 * 10 ** 18, { from })
                    const balance = await this.balances.balanceOf(tokenHolder)
                    assert.equal(balance, 70 * 10 ** 18)
                })
                it('reverts subBalance if insufficient funds', async function () {
                    await expectThrow(this.balances.subBalance(tokenHolder, 170 * 10 ** 18, { from }))
                })
            })
            describe('non-owner calls', function () {
                const from = tokenHolder
                it('reverts all calls', async function () {
                    await expectThrow(this.balances.addBalance(tokenHolder, 70 * 10 ** 18, { from }))
                    await expectThrow(this.balances.subBalance(tokenHolder, 70 * 10 ** 18, { from }))
                    await expectThrow(this.balances.setBalance(tokenHolder, 70 * 10 ** 18, { from }))
                })
            })
        })
        describe('totalSupply CRUD tests', function () {
            describe('owner calls', function () {
                const from = owner
                it('addTotalSupply', async function () {
                    await this.balances.addTotalSupply(70 * 10 ** 18, { from })
                    const supply = await this.balances.totalSupply()
                    assert(supply.eq((100 + 70) * 10 ** 18))
                })
                it('subTotalSupply', async function () {
                    await this.balances.subTotalSupply(70 * 10 ** 18, { from })
                    const supply = await this.balances.totalSupply()
                    assert(supply.eq((100 - 70) * 10 ** 18))
                })
                it('setTotalSupply', async function () {
                    await this.balances.setTotalSupply(70 * 10 ** 18, { from })
                    const supply = await this.balances.totalSupply()
                    assert(supply.eq(70 * 10 ** 18))
                })
                it('reverts subTotalSupply if going below zero', async function () {
                    await expectThrow(this.balances.subTotalSupply(170 * 10 ** 18, { from }))
                })
            })
            describe('non-owner calls', function () {
                const from = tokenHolder
                it('reverts all calls', async function () {
                    await expectThrow(this.balances.addTotalSupply(70 * 10 ** 18, { from }))
                    await expectThrow(this.balances.subTotalSupply(70 * 10 ** 18, { from }))
                    await expectThrow(this.balances.setTotalSupply(70 * 10 ** 18, { from }))
                })
            })
        })
    })
}

module.exports = {
    TokenStorageTests
}