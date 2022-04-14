# AkropolisToken

    Mintable, Burnable, Standard ERC20 with ability to upgrade to a more secure Pausable and Lockable ERC20

## Development

### Clone repository

clone using HTTPS:

```bash
git clone https://github.com/akropolisio/AkropolisToken.git
```

change directory:

```bash
cd AkropolisToken
```

### Setup environment

#### VSCode + Docker (recommended)

- install [Docker](https://docs.docker.com/get-docker/)
- install [VSCode](https://code.visualstudio.com/)
- install [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) VSCode extension
- open cloned repository in VSCode
- click F1 and run `>Remote-Containers: Reopen in Container`
- wait until all dependencies are installed (you will see the message "Done. Press any key to close the terminal." in the terminal `Configuring`)
- install local dependencies:
  ```bash
  npm install
  ```

#### Manual

- you will need Python 3.8 and Node.js v10
- install Ganache:
  ```bash
  npm install -g ganache
  ```
- install local dependencies:
  ```bash
  npm install
  ```

### Run tests

#### Default development network

- start Ganache in a separate terminal `ganache`
- run all tests with `npm run test-all`

#### Mainnet Fork

- start Ganache in a separate terminal `scripts/rpc_fork.sh`
- run all tests with `npm run test-fork`
- Ganache will fork from Mainnet starting from a specific block number configured in `scripts/rpc_fork.sh`
- make sure to restart Ganache before launching tests

### Deployment

- setup .env:
  - run `cp .example.env .env`
  - insert keys into `.env`
- run truffle migrations:
  - deploy to development `npm run deploy` (make sure Ganache is running)
  - deploy to live networks `npm run deploy -- --network rinkeby`
  - to run all migrations from the beginning use `npm run deploy -- --network rinkeby --reset`

MIT License

Copyright (c) 2019 A Labs Ltd.
