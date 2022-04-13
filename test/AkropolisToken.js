const { assert } = require('chai');
const { assertBalance, expectThrow, ZERO_ADDRESS, toBN } = require('./helpers/common');

function AkropolisToken_Tests(owner, tokenHolder, otherAccount) {
    describe("Behaves properly like a Pausable and Lockable ERC20 token", function () {
        beforeEach(async function () {
            this.initialSeed = toBN(10 * 10 ** 18)
            await this.AkropolisToken.mint(tokenHolder, this.initialSeed, { from: owner })
        });
        describe('--BasicToken Tests--', function () {
            describe('transfer', function () {
                describe('when the anotherAccount is not the zero address', function () {
                    const to = otherAccount
                    
                    describe('when the sender has enough balance', function () {
                        const amount = toBN(10 * 10 ** 18)

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
                        const amount = toBN(10 * 10 ** 18)

                        describe('when locked', function () {
                            beforeEach(async function () {
                              await this.AkropolisToken.lock({ from: owner })
                            })
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
                                    const amount = toBN(11 * 10 ** 18)
                                    
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
                                    const amount = toBN(10 * 10 ** 18)
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
                            await this.AkropolisToken.increaseApproval(spender, toBN(10 * 10 ** 18), { from: tokenHolder })
                        })
                        
                        describe('when the token holder has enough balance', function () {
                            const amount = toBN(10 * 10 ** 18)

                            describe('when not paused', function () {
                                it('transfers the requested amount', async function () {
                                    await this.AkropolisToken.transferFrom(tokenHolder, to, amount, { from: spender })
                                    await assertBalance(this.AkropolisToken, tokenHolder, 0)
                                    await assertBalance(this.AkropolisToken, to, amount)
                                })
                                
                                it('decreases the spender allowance', async function () {
                                    await this.AkropolisToken.transferFrom(tokenHolder, to, amount, { from: spender })
                                    
                                    const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                                    assert(allowance.isZero())
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
                const amount = toBN(10 * 10 ** 18)
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
                                assert(logs[0].args.value.isZero())
                            })

                            describe('when there was no approved amount before', function () {
                                it('keeps the allowance to zero', async function () {
                                    assert(await this.AkropolisToken.decreaseApproval(spender, amount, { from: tokenHolder }))
                                    
                                    const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                                    assert(allowance.isZero())
                                })
                            })
                            
                            describe('when the spender had an approved amount', function () {
                                beforeEach(async function () {
                                    await this.AkropolisToken.increaseApproval(spender, amount.add(amount), { from: tokenHolder })
                                })
                                
                                it('decreases the spender allowance subtracting the requested amount', async function () {
                                    await this.AkropolisToken.decreaseApproval(spender, amount, { from: tokenHolder })
                                    
                                    const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                                    assert(allowance.eq(amount))
                                })
                            })
                        })
                        
                        describe('when the sender does not have enough balance', function () {
                            const amount = toBN(11 * 10 ** 18)
                            
                            it('emits an approval event', async function () {
                                const { logs } = await this.AkropolisToken.decreaseApproval(spender, amount, { from: tokenHolder })
                                
                                assert.equal(logs.length, 1)
                                assert.equal(logs[0].event, 'Approval')
                                assert.equal(logs[0].args.owner, tokenHolder)
                                assert.equal(logs[0].args.spender, spender)
                                assert(logs[0].args.value.isZero())
                            })
                            
                            describe('when there was no approved amount before', function () {
                                it('keeps the allowance to zero', async function () {
                                    await this.AkropolisToken.decreaseApproval(spender, amount, { from: tokenHolder })
                                    
                                    const allowance = await this.AkropolisToken.allowance(tokenHolder, spender)
                                    assert(allowance.isZero())
                                })
                            })
                            
                            describe('when the spender had an approved amount', function () {
                                beforeEach(async function () {
                                    await this.AkropolisToken.increaseApproval(spender, amount.add(amount), { from: tokenHolder })
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
                            assert(allowance.isZero())
                        })
                        
                        it('emits an approval event', async function () {
                            const { logs } = await this.AkropolisToken.decreaseApproval(spender, amount, { from: tokenHolder })
                            
                            assert.equal(logs.length, 1)
                            assert.equal(logs[0].event, 'Approval')
                            assert.equal(logs[0].args.owner, tokenHolder)
                            assert.equal(logs[0].args.spender, spender)
                            assert(logs[0].args.value.isZero())
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
                const amount = toBN(10 * 10 ** 18)
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
                                    assert(allowance.eq(amount.add(amount)))
                                })
                            })
                        })
                        
                        describe('when the sender does not have enough balance', function () {
                            const amount = toBN(11 * 10 ** 18)
                            
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
                                    assert(allowance.eq(amount.add(amount)))
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
            
            describe('when the given amount is not greater than balance of the owner', function () {
                const amountToBurn = toBN(1 * 10 ** 18)
                const amountAfterBurn = toBN(9 * 10 ** 18)

                beforeEach(async function () {
                  await this.AkropolisToken.mint(owner, amountToBurn.add(amountAfterBurn), { from: owner })
                });

                describe('when not paused', function () {
                    it('burns the requested amount', async function () {
                      const totalSupplyBeforeBurn = await this.AkropolisToken.totalSupply();
                      await this.AkropolisToken.burn(amountToBurn, { from: owner })
                      assertBalance(this.AkropolisToken, owner, amountAfterBurn)
                      assert((await this.AkropolisToken.totalSupply()).eq(totalSupplyBeforeBurn.sub(amountToBurn)))
                    })
                    
                    it('emits a burn event', async function () {
                        const { logs } = await this.AkropolisToken.burn(amountToBurn, { from: owner })
                        assert.equal(logs.length, 2)
                        assert.equal(logs[0].event, 'Burn')
                        assert.equal(logs[0].args.burner, owner)
                        assert(logs[0].args.value.eq(amountToBurn))
                        
                        assert.equal(logs[1].event, 'Transfer')
                        assert.equal(logs[1].args.from, owner)
                        assert.equal(logs[1].args.to, ZERO_ADDRESS)
                        assert(logs[1].args.value.eq(amountToBurn))
                    })
                })

                describe('reverts', function () {
                    const amount = toBN(11 * 10 ** 18)
                    it('when the given amount is greater than balance of the owner', async function () {
                        await expectThrow(this.AkropolisToken.burn(amount, { from: owner }))
                    })
                    it('when sender is not a contract owner', async function () {
                      await expectThrow(this.AkropolisToken.burn(amount, { from: tokenHolder }))
                    })
                    it('when paused', async function () {
                        await this.AkropolisToken.pause({ from: owner })
                        await expectThrow(this.AkropolisToken.burn(amount, { from: owner }))
                    })
                })
            })
        })
        
        describe('-MintableToken Tests-', function () {
            const amount = toBN(10 * 10 ** 18)
            const amountAfterMint = toBN(20 * 10 ** 18)
            const minter = owner
            
            describe('when the sender is the token owner', function () {
                describe('when not paused', function () {   
                    it('mints the requested amount', async function () {
                        await this.AkropolisToken.mint(tokenHolder, amount, { from: minter })
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
            })
        })

        describe('--PausableToken Tests--', function () {
            
            describe('pause', function () {
                describe('when the sender is the token owner', function () {
                    const from = owner
                    
                    describe('when the token is unpaused', function () {
                        it('pauses the token', async function () {
                            await this.AkropolisToken.pause({ from })
                            
                            const paused = await this.AkropolisToken.isPaused()
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
                            const paused = await this.AkropolisToken.isPaused()
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
                it('locked methods are unlocked by default', async function () {
                    const locked = await this.AkropolisToken.isLocked()
                    assert.equal(locked, false)
                })
            })
            describe('unlock', function () {
                describe('when the sender is the token owner', function () {
                    const from = owner
                    
                    describe('when the token is locked initially', function () {
                        beforeEach(async function () {
                          await this.AkropolisToken.lock({ from })
                        })
                    
                        it('unlocks the token', async function () {
                            await this.AkropolisToken.unlock({ from })
                            
                            const locked = await this.AkropolisToken.isLocked()
                            assert.equal(locked, false)
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
                            await this.AkropolisToken.unlock({ from })
                        })
                        
                        it('locks the token', async function () {
                            await this.AkropolisToken.lock({ from })
                            const locked = await this.AkropolisToken.isLocked()
                            assert.equal(locked, true)
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
