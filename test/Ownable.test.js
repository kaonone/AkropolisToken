const { ZERO_ADDRESS, expectThrow } = require('./helpers/common');

const Ownable = artifacts.require('./Ownable.sol')

contract('Ownable', function ([owner, newOwner]) {

    let ownable
    beforeEach('Instantiate contract', async function ()
    {
        ownable = await Ownable.new({ from: owner })
    })

    describe('Ownable behavior tests', function () {

        it('should have an owner and no pending owner', async function () {
            assert.equal(await ownable.owner(), owner)
            assert.equal(await ownable.pendingOwner(), ZERO_ADDRESS)
        })

        it('owner can transfer ownership', async function () { 
            await ownable.transferOwnership(newOwner, { from: owner })
            assert.equal(await ownable.pendingOwner(), newOwner)
            assert.equal(await ownable.owner(), owner)
        })

        it('non owner can not transfer ownership', async function () { 
            await expectThrow(ownable.transferOwnership(newOwner, { from: newOwner }))
        })

        it('new owner cannot be zero address', async function () {
            await expectThrow(ownable.transferOwnership(ZERO_ADDRESS, { from: owner }))
        })

        it('new owner can claim ownership', async function () {
            await ownable.transferOwnership(newOwner, { from: owner })
            await ownable.claimOwnership({ from: newOwner })
            assert.equal(await ownable.pendingOwner(), ZERO_ADDRESS)
            assert.equal(await ownable.owner(), newOwner)
        })

        it('emits an OwnershipTransferred event', async function () {
            await ownable.transferOwnership(newOwner, { from: owner })
            const { logs } = await ownable.claimOwnership({ from: newOwner })
            assert.equal(logs.length, 1)
            assert.equal(logs[0].event, "OwnershipTransferred")
            assert.equal(logs[0].args.previousOwner, owner)
            assert.equal(logs[0].args.newOwner, newOwner)
        })

        it('non new owner can not claim ownership', async function () {
            await ownable.transferOwnership(newOwner, { from: owner })
            await expectThrow(ownable.claimOwnership({ from: owner }))
            assert.equal(await ownable.pendingOwner(), newOwner)
            assert.equal(await ownable.owner(), owner)
        })

    })
})
