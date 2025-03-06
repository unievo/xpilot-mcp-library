#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
    ErrorCode, 
    ListResourcesRequestSchema, 
    McpError, 
    ReadResourceRequestSchema, 
} from '@modelcontextprotocol/sdk/types.js';
class MxServer {
    constructor() {
        this.server = new Server({
            name: 'mx-sdk-py-cli',
            version: '0.1.0',
        }, {
            capabilities: {
                resources: {},
            },
        });
        this.setupResourceHandlers();
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    setupResourceHandlers() {
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
            resources: [
                {
                    uri: 'mx-sdk-py-cli://creating-wallets',
                    name: 'How to create a new account wallet',
                    mimeType: 'text/plain',
                    description: 'command for creating a new account wallet.',
                },
                {
                    uri: 'mx-sdk-py-cli://funding-accounts',
                    name: 'How to fund a dev or test account on devnet or testnet',
                    mimeType: 'text/plain',
                    description: 'command to fund an account wallet using the faucet',
                },
                {
                    uri: 'mx-sdk-py-cli://getting-accounts-info',
                    name: 'How to get an account info (balance, nonce, username)',
                    mimeType: 'text/plain',
                    description: 'command to get account info (balance, nonce, username)',
                },
                {
                    uri: 'mx-sdk-py-cli://executing-transactions',
                    name: 'How to transfer (send) egld or esdt tokens between accounts',
                    mimeType: 'text/plain',
                    description: 'command to transfer (send) egld or esdt tokens between accounts',
                },
                {
                    uri: 'mx-sdk-py-cli://deploying-contracts',
                    name: 'How to deploy a contract ',
                    mimeType: 'text/plain',
                    description: 'command to deploy a contract',
                },
                {
                    uri: 'mx-sdk-py-cli://upgrading-contracts',
                    name: 'How to upgrade a contract ',
                    mimeType: 'text/plain',
                    description: 'command to upgrade a contract',
                },
                {
                    uri: 'mx-sdk-py-cli://calling-contract-endpoints',
                    name: 'How to call a contract function (send a transaction)',
                    mimeType: 'text/plain',
                    description: 'command to call a contract function (send a transaction) with or without arguments',
                },
                {
                    uri: 'mx-sdk-py-cli://querying-contract-views',
                    name: 'How to query a contract view',
                    mimeType: 'text/plain',
                    description: 'command to query a contract view function',
                },
            ],
        }));

        this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
            if (request.params.uri === 'mx-sdk-py-cli://creating-wallets') {
                return {
                    contents: [
                        {
                            uri: request.params.uri,
                            mimeType: 'text/plain',
                            text: 'Wallets can be created using the "mxpy" cli tool.\
                            The command is: "mxpy wallet new [options]". \
                            options: --help (show help message) \
                            --format FORMAT {raw-mnemonic, keystore-mnemonic, keystore-secret-key, pem} (the required format of the generated wallet file) \
                            --outfile OUTFILE (the required output file name for the generated wallet files) \
                            [--shard SHARD (the shard in which the address will be generated (random shard if not specified))]. \
                            Important: If options are not provided, show all available wallet formats as a numbered list and recommend using keystore-secret-key format. \
                            Ask for the wallet file name if not available. Inform the user to save the menemonic phrase from the command output in a secure location. \
                            If the chosen format is any keystore-mnemonic or keystore-secret-key, before executing the command, inform the user that they will have to provide a password in the terminal executing the command. \
                            Keystore files must have a .json extension, pem files must have a .pem extension, append the correct extension to the outfile name if not provided. \
                            Do not display mnemonic phrase and do not generate any files with sensitive wallet information.',
                        },
                    ],
                };
            }
            else if (request.params.uri === 'mx-sdk-py-cli://funding-accounts') {
                return {
                    contents: [
                        {
                            uri: request.params.uri,
                            mimeType: 'text/plain',
                            text: 'Accounts can be funded using the faucet request using "mxpy" cli tool. \
                            The command is: "mxpy faucet request [options]. \
                            options: --help (show help message) \
                            --keyfile KEYFILE (a .json keyfile, if .pem is not provided) \
                            [--passfile PASSFILE (a file containing keyfile`s password, if keyfile provided, optional)] \
                            --pem PEM (the .pem file, if keyfile not provided) \
                            --pem-index PEM_INDEX (the index in the PEM file (default 0)) \
                            --chain CHAIN (the chain identifier, should be known or specified by the user, either "D" for devnet or "T" for testnet). \
                            The request to the faucet will provide 5 xEGLD on devnet and 30 xEGLD on testnet.',
                        },
                    ],
                };
            }
            else if (request.params.uri === 'mx-sdk-py-cli://getting-accounts-info') {
                return {
                    contents: [
                        {
                            uri: request.params.uri,
                            mimeType: 'text/plain',
                            text: 'Account information can be queried using "mxpy" cli tool. \
                            The command is: "mxpy account get [options]". \
                            options: --help (show help message) \
                            --address ADDRESS (the address to query, required) \
                            --proxy PROXY (the URL of the proxy, required) \
                            [--balance (whether to only fetch the balance) \
                            --nonce (whether to only fetch the nonce) \
                            --username (whether to only fetch the username)]. \
                            The ADDRESS of the account has a "erd1" prefix and if not known, it can be found by reading the contents of the wallet file, a .json for keyfiles wallets or .pem for pem wallets). \
                            The proxy is dependent on chain ID, for D:"https://devnet-gateway.multiversx.com", for T:"https://testnet-gateway.multiversx.com", for M:"https://gateway.multiversx.com". If not specified, ask for chain ID. \
                            // Egld value is expressed as a big integer with 18 decimals (1EGLD=1000000000000000000), for display purposes show also the denominated value.',
                        },
                    ],
                };
            }
            else if (request.params.uri === 'mx-sdk-py-cli://executing-transactions') {
                return {
                    contents: [
                        {
                            uri: request.params.uri,
                            mimeType: 'text/plain',
                            text: 'Transactions can be executed using the "mxpy" cli tool. \
                            The command is: "mxpy tx new [options]". \
                            options: --help (show help message) \
                            --keyfile KEYFILE a .json extension keyfile \
                            --passfile PASSFILE a file containing keyfile`s password \
                            --recall-nonce to recall the last nonce when creating the transaction \
                            --receiver RECEIVER the address of the receiver \
                            --gas-price GAS_PRICE the gas price (default 1000000000) \
                            --gas-limit GAS_LIMIT the gas limit \
                            --value VALUE the value of egld to transfer (default 0) \
                            --data DATA the payload, or memo of the transaction (default empty) \
                            --chain CHAIN the chain identifier \
                            --options OPTIONS the transaction options (default 0) \
                            --token-transfers TOKEN_TRANSFERS [TOKEN_TRANSFERS ...] for ESDT token transfers, as [token, amount] E.g. NFT-123456-0a 1, ESDT-987654 100000000 \
                            --send to broadcast the transaction \
                            --simulate whether to simulate the transaction and get an estimation for the real value of the --gas-limiit argument (default False) \
                            --proxy PROXY the URL of the proxy \
                            --wait-result signal to wait for the transaction result. \
                            The proxy is dependent on chain ID, for D:"https://devnet-gateway.multiversx.com", for T:"https://testnet-gateway.multiversx.com", for M:"https://gateway.multiversx.com". \
                            To send a transaction, ALWAYS include the following parameters --recall-nonce, --proxy, --send, --wait-result, --gas-limit (use --simulate to have an estimation and increase by 100000 if not enough gas error encountered). \
                            The address of the account starts with "erd1" and it is written in the wallet file (.json for keyfile or .pem for pem). \
                            Transaction details should be displayed using explorer "https://devnet-explorer.multiversx.com/transactions/[tx hash] on devnet, "https://testnet-explorer.multiversx.com/transactions/[tx hash] on testnet, "https://explorer.multiversx.com/transactions/[tx hash] on mainnet".',
                        },
                    ],
                };
            }
            else if (request.params.uri === 'mx-sdk-py-cli://deploying-contracts') {
                return {
                    contents: [
                        {
                            uri: request.params.uri,
                            mimeType: 'text/plain',
                            text: 'Contracts can be deployed the "mxpy" CLI tool. \
                            The command is: "mxpy contract deploy \
                            --bytecode <WASM_FILE_FULL_PATH> \
                            --keyfile <WALLET_FILE_NAME> \
                            --passfile <WALLET_PASSWORD_FILE_NAME> \
                            --chain <CHAIN_ID> \
                            --proxy <PROXY_ADDRESS> \
                            --recall-nonce \
                            --gas-limit 10000000 \
                            --wait-result \
                            --send  \
                            [--arguments <ARGUMENTS>]". \
                            The chain ID if not known, should be specified by the user, "D" for devnet, "T" for testnet, or "M" for mainnet. \
                            The bytecode file is [CONTARCT-NAME].wasm and it is found in the "output" folder from the contract folder if the contract is already built. If not, build the cotract first. \
                            The <WASM_FILE_FULL_PATH> must be the full path of the file. The wallet file name (and the wallet password file name for .json keyfile wallets) if not known, should be specified. \
                            The proxy is dependent on chain ID, for D:"https://devnet-gateway.multiversx.com", for T:"https://testnet-gateway.multiversx.com", for M:"https://gateway.multiversx.com". \
                            Read the contract file thet contains the #[multiversx_sc::contract] annotation to determine if the contract has init arguments in the "init" function. If so, ask the user for their values and specify them in the --arguments flag. \
                            Succesful deployment response should have "status": "success" transaction and a log entry with a "identifier": "SCDeploy" section. \
                            After initial deployment, the contract can only be upgraded to the same address, deploying again would create a new contract at a new address. \
                            If necessary to update the the contract after deployment, use the upgrade command.',
                        },
                    ],
                };
            }
            else if (request.params.uri === 'mx-sdk-py-cli://upgrading-contracts') {
                return {
                    contents: [
                        {
                            uri: request.params.uri,
                            mimeType: 'text/plain',
                            text: 'Contracts can be upgraded using the "mxpy" CLI tool. \
                            The command is: "mxpy contract upgrade \
                            --bytecode <WASM_FILE_FULL_PATH> \
                            --keyfile <WALLET_FILE_NAME> \
                            --passfile <WALLET_PASSWORD_FILE_NAME> \
                            --chain <CHAIN_ID> \
                            --proxy <PROXY_ADDRESS> \
                            --recall-nonce \
                            --gas-limit 10000000 \
                            --wait-result \
                            --send  \
                            [--arguments <ARGUMENTS>]". \
                            The chain ID if not known, should be specified by the user, either "D" for devnet, "T" for testnet, or "M" for mainnet. Default "D". \
                            The bytecode file is [CONTARCT-NAME].wasm and it is found in the "output" folder from the contract folder. \
                            The <WASM_FILE_FULL_PATH> must be the full path of the file. \
                            The wallet file name and wallet password file name if not known, should be provided by the user. \
                            The proxy is dependent on chain ID, for D:"https://devnet-gateway.multiversx.com", for T:"https://testnet-gateway.multiversx.com", for M:"https://gateway.multiversx.com". \
                            Read the contract file thet contains the #[multiversx_sc::contract] annotation to determine if the contract has init arguments in the "init" function or the "upgrade" function. If so, ask the user for their values and specify them in the --arguments flag. \
                            Succesful upgrade response should have "status": "success" transaction and a log entry with a "identifier": "SCUpgrade" section. Always include the --recall-nonce, --proxy, --send, --wait-result, --gas-limit flags.',
                        },
                    ],
                };
            }
            else if (request.params.uri === 'mx-sdk-py-cli://calling-contract-endpoints') {
              return {
                  contents: [
                      {
                            uri: request.params.uri,
                            mimeType: 'text/plain',
                            text: 'Contract endpoint functions can be called using the "mxpy" CLI tool. \
                            The command is: "mxpy contract call <CONTRACT_ADDRESS> \
                            --abi <ABI_FILE_FULL_PATH> \
                            --function <FUNCTION_NAME> \
                            --keyfile <WALLET_FILE_NAME> \
                            --passfile <WALLET_PASSWORD_FILE_NAME> \
                            --chain <CHAIN_ID> \
                            --proxy <PROXY_ADDRESS> \
                            --recall-nonce \
                            --gas-limit 10000000 \
                            --wait-result \
                            --send \
                            [--value <EGLD_VALUE>] \
                            [--arguments <ARGUMENTS>]". \
                            The chain ID if not known, should be specified by the user, either "D" for devnet, "T" for testnet, or "M" for mainnet. \
                            The abi file is [CONTARCT-NAME].abi.json and it is found in the "output" folder from the contract folder. \
                            The <ABI_FILE_FULL_PATH> must be the full path of the file. \
                            The wallet file name and wallet password file name if not known, should be provided by the user. \
                            The proxy is dependent on chain ID, for D:"https://devnet-gateway.multiversx.com", for T:"https://testnet-gateway.multiversx.com", for M:"https://gateway.multiversx.com". \
                            The arguments flag is optional and should be specified by the user, if none is specified do not include the --arguments flag. \
                            The value flag is optional and specifies any EGLD transfer to the contract call. \
                            Always include the --recall-nonce, --proxy, --send, --wait-result, --gas-limit flags.',
                      },
                  ],
              };
            }
            else if (request.params.uri === 'mx-sdk-py-cli://querying-contract-views') {
              return {
                  contents: [
                      {
                            uri: request.params.uri,
                            mimeType: 'text/plain',
                            text: 'Contracts view functions can be queried using the "mxpy" CLI tool. \
                            The command is: "mxpy contract query <CONTRACT_ADDRESS> \
                            --abi <ABI_FILE_FULL_PATH> \
                            --function <FUNCTION_NAME> \
                            --proxy <PROXY_ADDRESS>". \
                            The abi file is [CONTARCT-NAME].abi.json and it is found in the "output" folder from the contract folder. \
                            The <ABI_FILE_FULL_PATH> must be the full path of the file. \
                            The proxy is dependent on chain ID, for D:"https://devnet-gateway.multiversx.com", for T:"https://testnet-gateway.multiversx.com", for M:"https://gateway.multiversx.com". \
                            If the query result values are expressed as hexadecimal, show them also in decimal',
                      },
                  ],
              };
            }
            else {
                throw new McpError(ErrorCode.MethodNotFound, 'Resource not found');
            }
        });
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.log('MCP server running on stdio');
    }
}
const server = new MxServer();
server.run().catch(console.error);
