#!/usr/bin/env bash

ganache --fork \
  --fork.blockNumber 21815520 \
  --wallet.unlockedAccounts 0xae4Af0301AFE8f352D2b47cbAc54E79528Ad91AE \
  --wallet.unlockedAccounts 0xc89b84a9Bb8F6ac0a8c3a87e7C398039bA0E343e \
  --wallet.unlockedAccounts 0x28C6c06298d514Db089934071355E5743bf21d60 \
  --wallet.unlockedAccounts 0xeb31973e0febf3e3d7058234a5ebbae1ab4b8c23 \
  --wallet.unlockedAccounts 0xeeD86B90448C371Eab47b7f16E294297C27E4F51 \
  --wallet.unlockedAccounts 0x89a75E2A366C055C5c2f8D08DF7a8AC484b22778 \
  --wallet.defaultBalance 1000000 \
  --miner.defaultGasPrice 60000000000 \