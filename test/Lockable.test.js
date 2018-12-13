const { expectThrow } = require('./helpers/common');

const Lockable = artifacts.require('./Lockable.sol')

contract('Lockable', function ([owner, user]) {

    let lockable
    beforeEach('Instantiate contract', async function ()
    {
        lockable = await Lockable.new({ from: owner })
    })

    describe('Lockable behavior tests', function () {

        it('default state is locked', async function () {
            assert(!(await lockable.isMethodEnabled()))
        })
        describe('unlock', function () {
            it('sets lock', async function () {
                await lockable.unlock({ from: owner })
                assert(await lockable.isMethodEnabled())
            })
            it('emits an Unlocked event', async function () {
                const { logs } = await lockable.unlock({ from: owner })
                assert(logs.length, 1)
                assert(logs[0].event, "Unlocked")
            })
            it('reverts if non owner calls', async function () {
                await expectThrow(lockable.unlock({ from: user }))
            })
        })
        describe('lock', function () {
            beforeEach(async function () {
                await lockable.unlock({ from: owner })
            })
            it('removes lock', async function () {
                await lockable.lock({ from: owner })
                assert(!(await lockable.isMethodEnabled()))
            })
            it('emits an Locked event', async function () {
                const { logs } = await lockable.lock({ from: owner })
                assert(logs.length, 1)
                assert(logs[0].event, "Locked")
            })
            it('reverts if non owner calls', async function () {
                await expectThrow(lockable.lock({ from: user }))
            })
        })
    })
})
