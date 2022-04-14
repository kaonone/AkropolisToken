#!/usr/bin/env bash

ganache --fork \
  --fork.blockNumber 14578543 \
  --wallet.unlockedAccounts 0xC5aF91F7D10dDe118992ecf536Ed227f276EC60D \
  --wallet.unlockedAccounts 0xf977814e90da44bfa03b6295a0616a897441acec \
  --wallet.unlockedAccounts 0xedc6bacdc1e29d7c5fa6f6eca6fdd447b9c487c9 \
  --wallet.unlockedAccounts 0xeb31973e0febf3e3d7058234a5ebbae1ab4b8c23 \
  --wallet.unlockedAccounts 0x5a52e96bacdabb82fd05763e25335261b270efcb \
  --wallet.unlockedAccounts 0x13bc4025236f8fe39a011893781e82a4cbdf7051 \
  --wallet.defaultBalance 1000000 \
  --miner.defaultGasPrice 60000000000 \