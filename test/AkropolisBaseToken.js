const { assertBalance, expectThrow, ZERO_ADDRESS } = require('./helpers/common');

function AkropolisBaseToken_Tests(owner, tokenHolder, otherAccount) {
    describe("Behaves properly like a Burnable, Mintable, Standard ERC20 token", function () {
        beforeEach(async function () {
            this.initialSeed = 10 * 10 ** 18
            await this.AkropolisBaseToken.mint(tokenHolder, this.initialSeed, {from:owner})
        });
        describe('--BasicToken Tests--', function () {
            describe('total supply', function () {
                it('returns the total amount of tokens', async function () {
                    const totalSupply = await this.AkropolisBaseToken.totalSupply()
                    assert(totalSupply.eq(this.initialSeed))
                })
            })
            
            describe('balanceOf', function () {
                describe('when the requested account has no tokens', function () {
                    it('returns zero', async function () {
                        await assertBalance(this.AkropolisBaseToken, owner, 0)
                    })
                })
                
                describe('when the requested account has some tokens', function () {
                    it('returns the total amount of tokens', async function () {
                        await assertBalance(this.AkropolisBaseToken, tokenHolder, this.initialSeed)
                    })
                })
            })
            
            describe('transfer', function () {
                describe('when the anotherAccount is not the zero address', function () {
                    const to = otherAccount
                    
                    describe('when the sender does not have enough balance', function () {
                        const amount = 11 * 10 ** 18
                        
                        it('reverts', async function () {
                            await expectThrow(this.AkropolisBaseToken.transfer(to, amount, { from: tokenHolder }))
                        })
                    })
                    
                    describe('when the sender has enough balance', function () {
                        const amount = 10 * 10 ** 18
                        
                        it('transfers the requested amount', async function () {
                            await this.AkropolisBaseToken.transfer(to, amount, { from: tokenHolder })
                            await assertBalance(this.AkropolisBaseToken, tokenHolder, 0)
                            await assertBalance(this.AkropolisBaseToken, to, amount)
                        })
                        
                        it('emits a transfer event', async function () {
                            const { logs } = await this.AkropolisBaseToken.transfer(to, amount, { from: tokenHolder })
                            
                            assert.equal(logs.length, 1)
                            assert.equal(logs[0].event, 'Transfer')
                            assert.equal(logs[0].args.from, tokenHolder)
                            assert.equal(logs[0].args.to, to)
                            assert(logs[0].args.value.eq(amount))
                        })
                    })
                })
            })
        })      
        describe('--StandardToken Tests--', function () {
            
            describe('approve', function () {
                describe('when the spender is not the zero address', function () {
                    const spender = otherAccount
                    
                    describe('when the sender has enough balance', function () {
                        const amount = 10 * 10 ** 18
                        
                        it('emits an approval event', async function () {
                            const { logs } = await this.AkropolisBaseToken.approve(spender, amount, { from: tokenHolder })
                            
                            assert.equal(logs.length, 1)
                            assert.equal(logs[0].event, 'Approval')
                            assert.equal(logs[0].args.owner, tokenHolder)
                            assert.equal(logs[0].args.spender, spender)
                            assert(logs[0].args.value.eq(amount))
                        })
                        
                        describe('when there was no approved amount before', function () {
                            it('approves the requested amount', async function () {
                                await this.AkropolisBaseToken.approve(spender, amount, { from: tokenHolder })
                                
                                const allowance = await this.AkropolisBaseToken.allowance(tokenHolder, spender)
                                assert(allowance.eq(amount))
                            })
                        })
                        
                        describe('when the spender had an approved amount', function () {
                            beforeEach(async function () {
                                await this.AkropolisBaseToken.approve(spender, amount, { from: tokenHolder })
                            })
                            
                            it('approves the requested amount and replaces the previous one', async function () {
                                await this.AkropolisBaseToken.approve(spender, amount, { from: tokenHolder })
                                
                                const allowance = await this.AkropolisBaseToken.allowance(tokenHolder, spender)
                                assert(allowance.eq(amount))
                            })
                        })
                    })
                    
                    describe('when the sender does not have enough balance', function () {
                        const amount = 11 * 10 ** 18
                        
                        it('emits an approval event', async function () {
                            const { logs } = await this.AkropolisBaseToken.approve(spender, amount, { from: tokenHolder })
                            
                            assert.equal(logs.length, 1)
                            assert.equal(logs[0].event, 'Approval')
                            assert.equal(logs[0].args.owner, tokenHolder)
                            assert.equal(logs[0].args.spender, spender)
                            assert(logs[0].args.value.eq(amount))
                        })
                        
                        describe('when there was no approved amount before', function () {
                            it('approves the requested amount', async function () {
                                await this.AkropolisBaseToken.approve(spender, amount, { from: tokenHolder })
                                
                                const allowance = await this.AkropolisBaseToken.allowance(tokenHolder, spender)
                                assert(allowance.eq(amount))
                            })
                        })
                        
                        describe('when the spender had an approved amount', function () {
                            beforeEach(async function () {
                                await this.AkropolisBaseToken.approve(spender, amount, { from: tokenHolder })
                            })
                            
                            it('approves the requested amount and replaces the previous one', async function () {
                                await this.AkropolisBaseToken.approve(spender, amount, { from: tokenHolder })
                                
                                const allowance = await this.AkropolisBaseToken.allowance(tokenHolder, spender)
                                assert(allowance.eq(amount))
                            })
                        })
                    })
                })
                
                describe('when the spender is the zero address', function () {
                    const amount = 10 * 10 ** 18
                    const spender = ZERO_ADDRESS
                    
                    it('approves the requested amount', async function () {
                        await this.AkropolisBaseToken.approve(spender, amount, { from: tokenHolder })
                        
                        const allowance = await this.AkropolisBaseToken.allowance(tokenHolder, spender)
                        assert(allowance.eq(amount))
                    })
                    
                    it('emits an approval event', async function () {
                        const { logs } = await this.AkropolisBaseToken.approve(spender, amount, { from: tokenHolder })
                        
                        assert.equal(logs.length, 1)
                        assert.equal(logs[0].event, 'Approval')
                        assert.equal(logs[0].args.owner, tokenHolder)
                        assert.equal(logs[0].args.spender, spender)
                        assert(logs[0].args.value.eq(amount))
                    })
                })
            })
            
            describe('transfer from', function () {
                const spender = otherAccount
                

                describe('when the recipient is not the zero address', function () {
                    const to = owner
                    
                    describe('when the spender has enough approved balance', function () {
                        beforeEach(async function () {
                            await this.AkropolisBaseToken.approve(spender, 10 * 10 ** 18, { from: tokenHolder })
                        })
                        
                        describe('when the token holder has enough balance', function () {
                            const amount = 10 * 10 ** 18
                            
                            it('transfers the requested amount', async function () {
                                await this.AkropolisBaseToken.transferFrom(tokenHolder, to, amount, { from: spender })
                                await assertBalance(this.AkropolisBaseToken, tokenHolder, 0)
                                await assertBalance(this.AkropolisBaseToken, to, amount)
                            })
                            
                            it('decreases the spender allowance', async function () {
                                await this.AkropolisBaseToken.transferFrom(tokenHolder, to, amount, { from: spender })
                                
                                const allowance = await this.AkropolisBaseToken.allowance(tokenHolder, spender)
                                assert(allowance.eq(0))
                            })
                            
                            it('emits a transfer event', async function () {
                                const { logs } = await this.AkropolisBaseToken.transferFrom(tokenHolder, to, amount, { from: spender })
                                
                                assert.equal(logs.length, 1)
                                assert.equal(logs[0].event, 'Transfer')
                                assert.equal(logs[0].args.from, tokenHolder)
                                assert.equal(logs[0].args.to, to)
                                assert(logs[0].args.value.eq(amount))
                            })
                            

                        })
                        
                        describe('when the token holder does not have enough balance', function () {
                            const amount = 11 * 10 ** 18
                            
                            it('reverts', async function () {
                                await expectThrow(this.AkropolisBaseToken.transferFrom(tokenHolder, to, amount, { from: spender }))
                            })
                        })
                    })
                    
                    describe('when the spender does not have enough approved balance', function () {
                        beforeEach(async function () {
                            await this.AkropolisBaseToken.approve(spender, 9 * 10 ** 18, { from: tokenHolder })
                        })
                        
                        describe('when the token holder has enough balance', function () {
                            const amount = 10 * 10 ** 18
                            
                            it('reverts', async function () {
                                await expectThrow(this.AkropolisBaseToken.transferFrom(tokenHolder, to, amount, { from: spender }))
                            })
                        })
                        
                        describe('when the token holder does not have enough balance', function () {
                            const amount = 11 * 10 ** 18
                            
                            it('reverts', async function () {
                                await expectThrow(this.AkropolisBaseToken.transferFrom(tokenHolder, to, amount, { from: spender }))
                            })
                        })
                    })
                })
                
                describe('when the recipient is the zero address', function () {
                    const amount = 10 * 10 ** 18
                    const to = ZERO_ADDRESS
                    
                    beforeEach(async function () {
                        await this.AkropolisBaseToken.approve(spender, amount, { from: tokenHolder })
                    })
                    
                    it('reverts', async function () {
                        await expectThrow(this.AkropolisBaseToken.transferFrom(tokenHolder, to, amount, { from: spender }))
                    })
                })

            })
        })
        describe('--BurnableToken Tests--', function () {
            const from = tokenHolder
            
            describe('when the given amount is not greater than balance of the sender', function () {
                const amount = 1 * 10 ** 18
                const amountAfterBurn = 9 * 10 ** 18
                
                it('burns the requested amount', async function () {
                    await this.AkropolisBaseToken.burn(amount, { from })
                    const balance = await this.AkropolisBaseToken.balanceOf(from)
                    assertBalance(this.AkropolisBaseToken, tokenHolder, amountAfterBurn)
                    assert((await this.AkropolisBaseToken.totalSupply()).eq(amountAfterBurn))
                })
                
                it('emits a burn event', async function () {
                    const { logs } = await this.AkropolisBaseToken.burn(amount, { from })
                    assert.equal(logs.length, 2)
                    assert.equal(logs[0].event, 'Burn')
                    assert.equal(logs[0].args.burner, tokenHolder)
                    assert(logs[0].args.value.eq(amount))
                    
                    assert.equal(logs[1].event, 'Transfer')
                    assert.equal(logs[1].args.from, tokenHolder)
                    assert.equal(logs[1].args.to, ZERO_ADDRESS)
                    assert(logs[1].args.value.eq(amount))
                })
            })
            describe('when the given amount is greater than balance of the sender', function () {
                const amount = 11 * 10 ** 18
                it('reverts', async function () {
                    await expectThrow(this.AkropolisBaseToken.burn(amount, { from }))
                })
            }) 
        })
        describe('-MintableToken Tests-', function () {
            const amount = 10 * 10 ** 18
            const amountAfterMint = 20 * 10 ** 18
            const minter = owner
            
            describe('when the sender is the token owner', function () {
                const from = owner

                it('mints the requested amount', async function () {
                    await this.AkropolisBaseToken.mint(tokenHolder, amount, { from:minter })
                    assertBalance(this.AkropolisBaseToken, tokenHolder, amountAfterMint)
                    assert((await this.AkropolisBaseToken.totalSupply()).eq(amountAfterMint))
                })
                
                it('emits a mint and transfer event', async function () {
                    const { logs } = await this.AkropolisBaseToken.mint(tokenHolder, amount, { from:minter })
                    
                    assert.equal(logs.length, 2)
                    assert.equal(logs[0].event, 'Mint')
                    assert.equal(logs[0].args.to, tokenHolder)
                    assert(logs[0].args.value.eq(amount))
                    assert.equal(logs[1].event, 'Transfer')
                    assert.equal(logs[1].args.from, ZERO_ADDRESS)
                    assert.equal(logs[1].args.to, tokenHolder)
                    assert(logs[1].args.value.eq(amount))
                })
            })
            
            describe('when the sender is not the token owner', function () {
                const minter = otherAccount
                
                it('reverts', async function () {
                    await expectThrow(this.AkropolisBaseToken.mint(tokenHolder, amount, { from:minter }))
                })
            })
        })
        
    })
}

module.exports = {
    AkropolisBaseToken_Tests
}
