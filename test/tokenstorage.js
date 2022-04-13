const { expectThrow, toBN } = require('./helpers/common');

function TokenStorageTests(owner, tokenHolder, spender) {

    describe('TokenStorage behavior tests', function () {
        const from = owner
        beforeEach(async function () {
            await this.allowances.addAllowance(tokenHolder, spender, toBN(100 * 10 ** 18), { from })
            await this.balances.addBalance(tokenHolder, toBN(100 * 10 ** 18), { from })
            await this.balances.addTotalSupply(toBN(100 * 10 ** 18), { from })
        })

        describe('Allowances CRUD tests', function () {
            describe('owner calls', function () {
                const from = owner
                it('addAllowance', async function () {
                    await this.allowances.addAllowance(tokenHolder, spender, toBN(70 * 10 ** 18), { from })
                    const balance = await this.allowances.allowanceOf(tokenHolder, spender)
                    assert(balance.eq(toBN(170 * 10 ** 18)))
                })

                it('subAllowance', async function () {
                    await this.allowances.subAllowance(tokenHolder, spender, toBN(70 * 10 ** 18), { from })
                    const balance = await this.allowances.allowanceOf(tokenHolder, spender)
                    assert(balance.eq(toBN(30 * 10 ** 18)))
                })

                it('setAllowance', async function () {
                    await this.allowances.setAllowance(tokenHolder, spender, toBN(70 * 10 ** 18), { from })
                    const balance = await this.allowances.allowanceOf(tokenHolder, spender)
                    assert(balance.eq(toBN(70 * 10 ** 18)))
                })

                it('reverts subAllowance if insufficient funds', async function () {
                    await expectThrow(this.allowances.subAllowance(tokenHolder, spender, toBN(170 * 10 ** 18), { from }))
                })
            })

            describe('non-owner calls', function () {
                const from = tokenHolder
                it('reverts all calls', async function () {
                    await expectThrow(this.allowances.addAllowance(tokenHolder, spender, toBN(70 * 10 ** 18), { from }))
                    await expectThrow(this.allowances.subAllowance(tokenHolder, spender, toBN(70 * 10 ** 18), { from }))
                    await expectThrow(this.allowances.setAllowance(tokenHolder, spender, toBN(70 * 10 ** 18), { from }))
                })
            })
        })

        describe('Balances CRUD tests', function () {
            describe('owner calls', function () {
                const from = owner
                it('addBalance', async function () {
                    await this.balances.addBalance(tokenHolder, toBN(70 * 10 ** 18), { from })
                    const balance = await this.balances.balanceOf(tokenHolder)
                    assert(balance.eq(toBN(170 * 10 ** 18)))
                })
                it('subBalance', async function () {
                    await this.balances.subBalance(tokenHolder, toBN(70 * 10 ** 18), { from })
                    const balance = await this.balances.balanceOf(tokenHolder)
                    assert(balance.eq(toBN(30 * 10 ** 18)))
                })
                it('setBalance', async function () {
                    await this.balances.setBalance(tokenHolder, toBN(70 * 10 ** 18), { from })
                    const balance = await this.balances.balanceOf(tokenHolder)
                    assert(balance.eq(toBN(70 * 10 ** 18)))
                })
                it('reverts subBalance if insufficient funds', async function () {
                    await expectThrow(this.balances.subBalance(tokenHolder, toBN(170 * 10 ** 18), { from }))
                })
            })
            describe('non-owner calls', function () {
                const from = tokenHolder
                it('reverts all calls', async function () {
                    await expectThrow(this.balances.addBalance(tokenHolder, toBN(70 * 10 ** 18), { from }))
                    await expectThrow(this.balances.subBalance(tokenHolder, toBN(70 * 10 ** 18), { from }))
                    await expectThrow(this.balances.setBalance(tokenHolder, toBN(70 * 10 ** 18), { from }))
                })
            })
        })
        describe('totalSupply CRUD tests', function () {
            describe('owner calls', function () {
                const from = owner
                it('addTotalSupply', async function () {
                    await this.balances.addTotalSupply(toBN(70 * 10 ** 18), { from })
                    const supply = await this.balances.totalSupply()
                    assert(supply.eq(toBN(170 * 10 ** 18)))
                })
                it('subTotalSupply', async function () {
                    await this.balances.subTotalSupply(toBN(70 * 10 ** 18), { from })
                    const supply = await this.balances.totalSupply()
                    assert(supply.eq(toBN(30 * 10 ** 18)))
                })
                it('setTotalSupply', async function () {
                    await this.balances.setTotalSupply(toBN(70 * 10 ** 18), { from })
                    const supply = await this.balances.totalSupply()
                    assert(supply.eq(toBN(70 * 10 ** 18)))
                })
                it('reverts subTotalSupply if going below zero', async function () {
                    await expectThrow(this.balances.subTotalSupply(toBN(170 * 10 ** 18), { from }))
                })
            })
            describe('non-owner calls', function () {
                const from = tokenHolder
                it('reverts all calls', async function () {
                    await expectThrow(this.balances.addTotalSupply(toBN(70 * 10 ** 18), { from }))
                    await expectThrow(this.balances.subTotalSupply(toBN(70 * 10 ** 18), { from }))
                    await expectThrow(this.balances.setTotalSupply(toBN(70 * 10 ** 18), { from }))
                })
            })
        })
    })
}

module.exports = {
    TokenStorageTests
}