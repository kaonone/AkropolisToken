const { assertBalance, expectThrow, ZERO_ADDRESS } = require('./helpers/common');
// var BigNumber = require("bignumber.js");

function AkropolisToken_Tests(owner, tokenHolder, otherAccount) {
    describe("Behaves properly like a Pausable and Lockable ERC20 token", function () {
        beforeEach(async function () {
            this.initialSeed = 10 * 10 ** 18
            await this.AkropolisToken.mint(tokenHolder, this.initialSeed, {from:owner})
        });
        describe('--BasicToken Tests--', function () {
            describe('transfer', function () {
                describe('when the anotherAccount is not the zero address', function () {
                    const to = otherAccount
                    
                    describe('when the sender has enough balance', function () {
                        const amount = 10 * 10 ** 18

                        describe('when token is not paused', function () {
                            it('transfers the requested amount', async function () {
                                await this.AkropolisToken.transfer(to, amount, { from: tokenHolder })
                                await assertBalance(this.AkropolisToken, tokenHolder, 0)
                                await assertBalance(this.AkropolisToken, to, amount)
                            })
                            
                            it('emits a transfer event', async function () {
                                const { logs } = await this.AkropolisToken.transfer(to, amount, { from: tokenHolder })
                                
                                assert.equal(logs.length, 1)
                                assert.equal(logs[0].event, 'Transfer')
                                assert.equal(logs[0].args.from, tokenHolder)
                                assert.equal(logs[0].args.to, to)
                                assert(logs[0].args.value.eq(amount))
                            })
                        })

                        describe('when token is paused', function () {
                            beforeEach(async function () {
                                await this.AkropolisToken.pause({ from: owner })
                            })
                            it('reverts', async function () {
                                await expectThrow(this.AkropolisToken.transfer(to, amount, { from: tokenHolder }))
                            })
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

                        describe('when locked by default', function () {
                            it('reverts', async function () {
                                await expectThrow(this.AkropolisToken.approve(spender, amount, { from: tokenHolder }))
                            })
                        })
                        describe('when unlocked', function () {
                            beforeEach(async function () {
                                await this.AkropolisToken.unlock({ from: owner })
                            })
                            describe('when not paused', function () {

                                it('emits an approval event', async function () {
                                    const { logs } = await this.AkropolisToken.approve(spender, amount, { from: tokenHolder })
                                    
                                    assert.equal(logs.length, 1)
                                    assert.equal(logs[0].event, 'Approval')
                                    assert.equal(logs[0].args.owner, tokenHolder)
                                    assert.equal(logs[0].args.spender, spender)
                                    assert(logs[0].args.value.eq(amount))
                                })

                                describe('when there was no approved amount before', function () {
                                    it('approves the requested amount', async function () {
                                        await this.AkropolisToken.approve(spender, amount, { from: tokenHolder })
                                        
                                        const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                                        assert(allowance.eq(amount))
                                    })
                                })

                                describe('when the spender had an approved amount', function () {
                                    beforeEach(async function () {
                                        await this.AkropolisToken.approve(spender, amount, { from: tokenHolder })
                                    })
                                    
                                    it('approves the requested amount and replaces the previous one', async function () {
                                        await this.AkropolisToken.approve(spender, amount, { from: tokenHolder })
                                        
                                        const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                                        assert(allowance.eq(amount))
                                    })
                                })

                                describe('when the sender does not have enough balance', function () {
                                    const amount = 11 * 10 ** 18
                                    
                                    it('emits an approval event', async function () {
                                        const { logs } = await this.AkropolisToken.approve(spender, amount, { from: tokenHolder })
                                        
                                        assert.equal(logs.length, 1)
                                        assert.equal(logs[0].event, 'Approval')
                                        assert.equal(logs[0].args.owner, tokenHolder)
                                        assert.equal(logs[0].args.spender, spender)
                                        assert(logs[0].args.value.eq(amount))
                                    })
                                    
                                    describe('when there was no approved amount before', function () {
                                        it('approves the requested amount', async function () {
                                            await this.AkropolisToken.approve(spender, amount, { from: tokenHolder })
                                            
                                            const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                                            assert(allowance.eq(amount))
                                        })
                                    })
                                    
                                    describe('when the spender had an approved amount', function () {
                                        beforeEach(async function () {
                                            await this.AkropolisToken.approve(spender, amount, { from: tokenHolder })
                                        })
                                        
                                        it('approves the requested amount and replaces the previous one', async function () {
                                            await this.AkropolisToken.approve(spender, amount, { from: tokenHolder })
                                            
                                            const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                                            assert(allowance.eq(amount))
                                        })
                                    })
                                })

                                describe('when the spender is the zero address', function () {
                                    const amount = 10 * 10 ** 18
                                    const spender = ZERO_ADDRESS
                                    
                                    it('approves the requested amount', async function () {
                                        await this.AkropolisToken.approve(spender, amount, { from: tokenHolder })
                                        
                                        const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                                        assert(allowance.eq(amount))
                                    })
                                    
                                    it('emits an approval event', async function () {
                                        const { logs } = await this.AkropolisToken.approve(spender, amount, { from: tokenHolder })
                                        
                                        assert.equal(logs.length, 1)
                                        assert.equal(logs[0].event, 'Approval')
                                        assert.equal(logs[0].args.owner, tokenHolder)
                                        assert.equal(logs[0].args.spender, spender)
                                        assert(logs[0].args.value.eq(amount))
                                    })
                                })
                            })  
                            describe('when paused', function () {
                                beforeEach(async function () {
                                    await this.AkropolisToken.pause({ from:owner })
                                })
                                it('reverts', async function () {
                                    await expectThrow(this.AkropolisToken.approve(spender, amount, { from: tokenHolder }))
                                })
                            })
                        })
      
                    })
                })
            })
            
            describe('transfer from', function () {
                const spender = otherAccount
                

                describe('when the recipient is not the zero address', function () {
                    const to = owner
                    
                    describe('when the spender has enough approved balance', function () {
                        beforeEach(async function () {
                            await this.AkropolisToken.increaseApproval(spender, 10 * 10 ** 18, { from: tokenHolder })
                        })
                        
                        describe('when the token holder has enough balance', function () {
                            const amount = 10 * 10 ** 18

                            describe('when not paused', function () {
                                it('transfers the requested amount', async function () {
                                    await this.AkropolisToken.transferFrom(tokenHolder, to, amount, { from: spender })
                                    await assertBalance(this.AkropolisToken, tokenHolder, 0)
                                    await assertBalance(this.AkropolisToken, to, amount)
                                })
                                
                                it('decreases the spender allowance', async function () {
                                    await this.AkropolisToken.transferFrom(tokenHolder, to, amount, { from: spender })
                                    
                                    const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                                    assert(allowance.eq(0))
                                })
                                
                                it('emits a transfer event', async function () {
                                    const { logs } = await this.AkropolisToken.transferFrom(tokenHolder, to, amount, { from: spender })
                                    
                                    assert.equal(logs.length, 1)
                                    assert.equal(logs[0].event, 'Transfer')
                                    assert.equal(logs[0].args.from, tokenHolder)
                                    assert.equal(logs[0].args.to, to)
                                    assert(logs[0].args.value.eq(amount))
                                })
                            })
                            describe('when paused', function () {
                                beforeEach(async function () {
                                    await this.AkropolisToken.pause({ from: owner })
                                })
                                it('reverts', async function () {
                                    await expectThrow(this.AkropolisToken.transferFrom(tokenHolder, to, amount, { from: spender }))
                                })
                            })
                        })
                        
                    })
                    

                })
            })
            describe('decrease approval', function () {
                const amount = 10 * 10 ** 18
                describe('when not paused', function () {
                    describe('when the spender is not the zero address', function () {
                        const spender = otherAccount
                        
                        describe('when the sender has enough balance', function () {
                            
                            it('emits an approval event', async function () {
                                const { logs } = await this.AkropolisToken.decreaseApproval(spender, amount, { from: tokenHolder })
                                
                                assert.equal(logs.length, 1)
                                assert.equal(logs[0].event, 'Approval')
                                assert.equal(logs[0].args.owner, tokenHolder)
                                assert.equal(logs[0].args.spender, spender)
                                assert(logs[0].args.value.eq(0))
                            })

                            describe('when there was no approved amount before', function () {
                                it('keeps the allowance to zero', async function () {
                                    assert(await this.AkropolisToken.decreaseApproval(spender, amount, { from: tokenHolder }))
                                    
                                    const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                                    assert(allowance.eq(0))
                                })
                            })
                            
                            describe('when the spender had an approved amount', function () {
                                beforeEach(async function () {
                                    await this.AkropolisToken.increaseApproval(spender, amount*2, { from: tokenHolder })
                                })
                                
                                it('decreases the spender allowance subtracting the requested amount', async function () {
                                    await this.AkropolisToken.decreaseApproval(spender, amount, { from: tokenHolder })
                                    
                                    const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                                    assert(allowance.eq(amount))
                                })
                            })
                        })
                        
                        describe('when the sender does not have enough balance', function () {
                            const amount = 11 * 10 ** 18
                            
                            it('emits an approval event', async function () {
                                const { logs } = await this.AkropolisToken.decreaseApproval(spender, amount, { from: tokenHolder })
                                
                                assert.equal(logs.length, 1)
                                assert.equal(logs[0].event, 'Approval')
                                assert.equal(logs[0].args.owner, tokenHolder)
                                assert.equal(logs[0].args.spender, spender)
                                assert(logs[0].args.value.eq(0))
                            })
                            
                            describe('when there was no approved amount before', function () {
                                it('keeps the allowance to zero', async function () {
                                    await this.AkropolisToken.decreaseApproval(spender, amount, { from: tokenHolder })
                                    
                                    const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                                    assert(allowance.eq(0))
                                })
                            })
                            
                            describe('when the spender had an approved amount', function () {
                                beforeEach(async function () {
                                    await this.AkropolisToken.increaseApproval(spender, amount*2, { from: tokenHolder })
                                })
                                
                                it('decreases the spender allowance subtracting the requested amount', async function () {
                                    await this.AkropolisToken.decreaseApproval(spender, amount, { from: tokenHolder })
                                    
                                    const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                                    assert(allowance.eq(amount))
                                })
                            })
                        })
                    })
                    
                    describe('when the spender is the zero address', function () {
                        const spender = ZERO_ADDRESS
                        
                        it('decreases the requested amount', async function () {
                            await this.AkropolisToken.decreaseApproval(spender, amount, { from: tokenHolder })
                            
                            const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                            assert(allowance.eq(0))
                        })
                        
                        it('emits an approval event', async function () {
                            const { logs } = await this.AkropolisToken.decreaseApproval(spender, amount, { from: tokenHolder })
                            
                            assert.equal(logs.length, 1)
                            assert.equal(logs[0].event, 'Approval')
                            assert.equal(logs[0].args.owner, tokenHolder)
                            assert.equal(logs[0].args.spender, spender)
                            assert(logs[0].args.value.eq(0))
                        })
                    })
                })
                describe('when paused', function () {
                    const spender = otherAccount
                    beforeEach(async function () {
                        await this.AkropolisToken.pause({ from: owner })
                    })
                    it('reverts', async function () {
                        await expectThrow(this.AkropolisToken.decreaseApproval(spender, amount, { from: tokenHolder }))
                    })
                })
            })
            
            describe('increase approval', function () {
                const amount = 10 * 10 ** 18
                const spender = otherAccount
                describe('when not paused', function () {
                    describe('when the spender is not the zero address', function () {
                        const spender = otherAccount
                        
                        describe('when the sender has enough balance', function () {
                            it('emits an approval event', async function () {
                                const { logs } = await this.AkropolisToken.increaseApproval(spender, amount, { from: tokenHolder })
                                
                                assert.equal(logs.length, 1)
                                assert.equal(logs[0].event, 'Approval')
                                assert.equal(logs[0].args.owner, tokenHolder)
                                assert.equal(logs[0].args.spender, spender)
                                assert(logs[0].args.value.eq(amount))
                            })
                            
                            describe('when there was no approved amount before', function () {
                                it('approves the requested amount', async function () {
                                    assert(await this.AkropolisToken.increaseApproval(spender, amount, { from: tokenHolder }))
                                    
                                    const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                                    assert(allowance.eq(amount))
                                })
                            })
                            
                            describe('when the spender had an approved amount', function () {
                                beforeEach(async function () {
                                    await this.AkropolisToken.increaseApproval(spender, amount, { from: tokenHolder })
                                })
                                
                                it('increases the spender allowance adding the requested amount', async function () {
                                    await this.AkropolisToken.increaseApproval(spender, amount, { from: tokenHolder })
                                    
                                    const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                                    assert(allowance.eq(amount*2))
                                })
                            })
                        })
                        
                        describe('when the sender does not have enough balance', function () {
                            const amount = 11 * 10 ** 18
                            
                            it('emits an approval event', async function () {
                                const { logs } = await this.AkropolisToken.increaseApproval(spender, amount, { from: tokenHolder })
                                
                                assert.equal(logs.length, 1)
                                assert.equal(logs[0].event, 'Approval')
                                assert.equal(logs[0].args.owner, tokenHolder)
                                assert.equal(logs[0].args.spender, spender)
                                assert(logs[0].args.value.eq(amount))
                            })
                            
                            describe('when there was no approved amount before', function () {
                                it('approves the requested amount', async function () {
                                    await this.AkropolisToken.increaseApproval(spender, amount, { from: tokenHolder })
                                    
                                    const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                                    assert(allowance.eq(amount))
                                })
                            })
                            
                            describe('when the spender had an approved amount', function () {
                                beforeEach(async function () {
                                    await this.AkropolisToken.increaseApproval(spender, amount, { from: tokenHolder })
                                })
                                
                                it('increases the spender allowance adding the requested amount', async function () {
                                    await this.AkropolisToken.increaseApproval(spender, amount, { from: tokenHolder })
                                    
                                    const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                                    assert(allowance.eq(amount*2))
                                })
                            })
                        })
                    })
                    
                    describe('when the spender is the zero address', function () {
                        const spender = ZERO_ADDRESS
                        
                        it('approves the requested amount', async function () {
                            await this.AkropolisToken.increaseApproval(spender, amount, { from: tokenHolder })
                            
                            const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                            assert(allowance.eq(amount))
                        })
                        
                        it('emits an approval event', async function () {
                            const { logs } = await this.AkropolisToken.increaseApproval(spender, amount, { from: tokenHolder })
                            
                            assert.equal(logs.length, 1)
                            assert.equal(logs[0].event, 'Approval')
                            assert.equal(logs[0].args.owner, tokenHolder)
                            assert.equal(logs[0].args.spender, spender)
                            assert(logs[0].args.value.eq(amount))
                        })
                    })
                })
                describe('when paused', function () {
                    beforeEach(async function () {
                        await this.AkropolisToken.pause({ from: owner })
                    })
                    it('reverts', async function () {
                        await expectThrow(this.AkropolisToken.increaseApproval(spender, amount, { from: tokenHolder }))
                    })
                })
            })
        })

        describe('--BurnableToken Tests--', function () {
            const from = tokenHolder
            
            describe('when the given amount is not greater than balance of the sender', function () {
                const amount = 1 * 10 ** 18
                const amountAfterBurn = 9 * 10 ** 18

                describe('when not paused', function () {
                    it('burns the requested amount', async function () {
                        await this.AkropolisToken.burn(amount, { from })
                        const balance = await this.AkropolisToken.balanceOf(from)
                        assertBalance(this.AkropolisToken, tokenHolder, amountAfterBurn)
                        assert((await this.AkropolisToken.totalSupply()).eq(amountAfterBurn))
                    })
                    
                    it('emits a burn event', async function () {
                        const { logs } = await this.AkropolisToken.burn(amount, { from })
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

                describe('when paused', function () {
                    beforeEach(async function () {
                        await this.AkropolisToken.pause({ from: owner })
                    })
                    it('reverts', async function () {
                        await expectThrow(this.AkropolisToken.burn(amount, { from }))
                    })
                })
            })
        })
        
        describe('-MintableToken Tests-', function () {
            const amount = 10 * 10 ** 18
            const amountAfterMint = 20 * 10 ** 18
            const minter = owner
            
            describe('when the sender is the token owner', function () {
                const from = owner
                describe('when not paused', function () {   
                    it('mints the requested amount', async function () {
                        await this.AkropolisToken.mint(tokenHolder, amount, { from:minter })
                        assertBalance(this.AkropolisToken, tokenHolder, amountAfterMint)
                        assert((await this.AkropolisToken.totalSupply()).eq(amountAfterMint))
                    })
                    
                    it('emits a mint and transfer event', async function () {
                        const { logs } = await this.AkropolisToken.mint(tokenHolder, amount, { from:minter })
                        
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
                describe('when paused', function () {
                    beforeEach(async function () {
                        await this.AkropolisToken.pause({ from: owner })
                    })
                    it('reverts', async function () {
                        await expectThrow(this.AkropolisToken.mint(tokenHolder, amount, { from: minter }))
                    })
                })

            })
        })

        describe('--PausableToken Tests--', function () {
            
            describe('pause', function () {
                describe('when the sender is the token owner', function () {
                    const from = owner
                    
                    describe('when the token is unpaused', function () {
                        it('pauses the token', async function () {
                            await this.AkropolisToken.pause({ from })
                            
                            const paused = await this.AkropolisToken.paused()
                            assert.equal(paused, true)
                        })
                        
                        it('emits a paused event', async function () {
                            const { logs } = await this.AkropolisToken.pause({ from })
                            
                            assert.equal(logs.length, 1)
                            assert.equal(logs[0].event, 'Pause')
                        })
                    })
                    
                    describe('when the token is paused', function () {
                        beforeEach(async function () {
                            await this.AkropolisToken.pause({ from })
                        })
                        
                        it('reverts', async function () {
                            await expectThrow(this.AkropolisToken.pause({ from }))
                        })
                    })
                })
                
                describe('when the sender is not the token owner', function () {
                    const from = otherAccount
                    
                    it('reverts', async function () {
                        await expectThrow(this.AkropolisToken.pause({ from }))
                    })
                })
            })
            
            describe('unpause', function () {
                describe('when the sender is the token owner', function () {
                    const from = owner
                    
                    describe('when the token is paused', function () {
                        beforeEach(async function () {
                            await this.AkropolisToken.pause({ from })
                        })
                        
                        it('unpauses the token', async function () {
                            await this.AkropolisToken.unpause({ from })
                            const paused = await this.AkropolisToken.paused()
                            assert.equal(paused, false)
                        })
                        
                        it('emits an unpaused event', async function () {
                            const { logs } = await this.AkropolisToken.unpause({ from })
                            
                            assert.equal(logs.length, 1)
                            assert.equal(logs[0].event, 'Unpause')
                        })
                    })
                    
                    describe('when the token is unpaused', function () {
                        it('reverts', async function () {
                            await expectThrow(this.AkropolisToken.unpause({ from }))
                        })
                    })
                })
                
                describe('when the sender is not the token owner', function () {
                    const from = otherAccount
                    it('reverts', async function () {
                        await expectThrow(this.AkropolisToken.unpause({ from }))
                    })
                })
            })
        })

        describe('--LockableToken Tests--', function () {
            
            describe('default beheavior', function () {
                it('locked methods are locked by default', async function () {
                    const unlocked = await this.AkropolisToken.isMethodEnabled()
                    assert.equal(unlocked, false)
                })
            })
            describe('unlock', function () {
                describe('when the sender is the token owner', function () {
                    const from = owner
                    
                    describe('when the token is locked initially', function () {
                        it('unlocks the token', async function () {
                            await this.AkropolisToken.unlock({ from })
                            
                            const unlocked = await this.AkropolisToken.isMethodEnabled()
                            assert.equal(unlocked, true)
                        })
                        
                        it('emits an Unlocked event', async function () {
                            const { logs } = await this.AkropolisToken.unlock({ from })
                            
                            assert.equal(logs.length, 1)
                            assert.equal(logs[0].event, 'Unlocked')
                        })
                    })
                })
                
                describe('when the sender is not the token owner', function () {
                    const from = otherAccount
                    
                    it('reverts', async function () {
                        await expectThrow(this.AkropolisToken.unlock({ from }))
                    })
                })
            })
            
            describe('lock', function () {
                describe('when the sender is the token owner', function () {
                    const from = owner
                    
                    describe('when the token is unlocked initially', function () {
                        beforeEach(async function () {
                            await this.AkropolisToken.lock({ from })
                        })
                        
                        it('locks the token', async function () {
                            await this.AkropolisToken.lock({ from })
                            const unlocked = await this.AkropolisToken.isMethodEnabled()
                            assert.equal(unlocked, false)
                        })
                        
                        it('emits a Locked event', async function () {
                            const { logs } = await this.AkropolisToken.lock({ from })
                            
                            assert.equal(logs.length, 1)
                            assert.equal(logs[0].event, 'Locked')
                        })
                    })
                    
                })
                
                describe('when the sender is not the token owner', function () {
                    const from = otherAccount
                    it('reverts', async function () {
                        await expectThrow(this.AkropolisToken.lock({ from }))
                    })
                })
            })
        })
    })
}

module.exports = {
    AkropolisToken_Tests
}
