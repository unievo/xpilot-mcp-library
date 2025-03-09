#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
    ListResourcesRequestSchema,
    ReadResourceRequestSchema, 
    McpError, 
    ErrorCode,
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
                            options: -h, --help (show help message with all options) \
                            --format FORMAT {raw-mnemonic, keystore-mnemonic, keystore-secret-key, pem} (the required format of the generated wallet file) \
                            --outfile OUTFILE (the required output file name for the generated wallet files) \
                            --shard SHARD (the shard in which the address will be generated (random shard if not specified)) \
                            Important: If options are not provided, show all available wallet formats as a numbered list and recommend using keystore-secret-key format. \
                            The wallet file name should be provided, if not known, ask for it. \
                            Inform to save the menemonic phrase from the command output in a secure location. \
                            If the chosen format is any keystore-mnemonic or keystore-secret-key, before executing the command, inform that a password must be provided in the terminal executing the command. \
                            Keystore files must have a .json extension, pem files must have a .pem extension, append the correct extension to the outfile name if not provided. \
                            Do not display mnemonic phrase and do not generate any files with sensitive wallet information. \
                            ',
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
                            options: -h, --help (show help message with all options) \
                            --keyfile KEYFILE (a .json keyfile, if .pem is not provided) \
                            --passfile PASSFILE (a file containing keyfile`s password, if keyfile provided, optional)] \
                            --pem PEM (the .pem file, if keyfile not provided) \
                            --pem-index PEM_INDEX (the index in the PEM file (default 0)) \
                            --chain CHAIN (the chain identifier, should be known or specified by the user, either "D" for devnet or "T" for testnet). \
                            The request to the faucet will provide 5 xEGLD on devnet and 30 xEGLD on testnet. \
                            ',
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
                            options: -h, --help (show help message with all options) \
                            --address ADDRESS (the address to query, required) \
                            --proxy PROXY (the URL of the proxy, required) \
                            --balance (whether to only fetch the balance) \
                            --nonce (whether to only fetch the last nonce) \
                            --username (whether to only fetch the username) \
                            The ADDRESS of the account has a "erd1" prefix and if not known, it can be found by reading the contents of the wallet file, a .json for keyfiles wallets or .pem for pem wallets). \
                            The proxy is dependent on chain ID, for D:"https://devnet-gateway.multiversx.com", for T:"https://testnet-gateway.multiversx.com", for M:"https://gateway.multiversx.com". If not specified, ask for chain ID. \
                            Egld value is expressed as a big integer with 18 decimals (1EGLD=1000000000000000000), for display purposes show also the denominated value. \
                            ',
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
                            options: -h, --help (show help message with all options) \
                            --pem PEM (the PEM file, if keyfile not provided) \
                            --pem-index PEM_INDEX (the index in the PEM file (default: 0)) \
                            --keyfile KEYFILE (a .json extension keyfile, if PEM not provided) \
                            --passfile PASSFILE (a file containing keyfile`s password) \
                            --sender-username SENDER_USERNAME (the username of the sender) \
                            --nonce NONCE (the nonce for the transaction if known) \
                            --recall-nonce (to recall the last nonce if --nonce is not provided) \
                            --receiver RECEIVER (the address of the receiver) \
                            --gas-price GAS_PRICE (the gas price (default 1000000000)) \
                            --gas-limit GAS_LIMIT (the gas limit, start with 50000) \
                            --value VALUE (the value to transfer (default 0)) \
                            --chain CHAIN (the chain identifier) \
                            --options OPTIONS (the transaction options (default 0)) \
                            --token-transfers TOKEN_TRANSFERS [TOKEN_TRANSFERS ...] (for ESDT token transfers, as [token, amount] E.g. NFT-123456-0a 1, ESDT-987654 100000000) \
                            --send (to broadcast the transaction, not to be used with --simulate) \
                            --simulate (to simulate the transaction and also get an estimation for the real value for the --gas-limit argument (default False)) \
                            --proxy PROXY (the URL of the proxy) \
                            --wait-result (to wait for the transaction result) \
                            The proxy is dependent on chain ID, for D:"https://devnet-gateway.multiversx.com", for T:"https://testnet-gateway.multiversx.com", for M:"https://gateway.multiversx.com". \
                            If the transaction fails with not enough gas error, use --simulate to have an estimation for the gas limit. \
                            To send a transaction, ALWAYS include the following parameters --recall-nonce, --proxy, --send, --wait-result, --gas-limit \
                            The ADDRESS of the account has a "erd1" prefix and if not known, it can be found by reading the contents of the wallet file, a .json for keyfiles wallets or .pem for pem wallets). \
                            Display the transaction details using the explorer "https://devnet-explorer.multiversx.com/transactions/[txhash] on devnet, "https://testnet-explorer.multiversx.com/transactions/[txhash] on testnet, "https://explorer.multiversx.com/transactions/[txhash] on mainnet". \
                            ',
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
                            The command is: "mxpy contract deploy [options]". \
                            options: -h, --help (show help message with all options) \
                            --bytecode BYTECODE (must be the full path of the file {CONTRACT-NAME}.wasm, found in the "output" folder from the contract folder. If the file does not exist, build the contract first.) \
                            --abi ABI (must be the full path of the file {CONTRACT-NAME}.abi.json and it is found in the "output" folder from the contract folder. If the file does not exist, build the contract first.) \
                            --pem PEM (the wallet .pem extension file, if keyfile not provided) \
                            --pem-index PEM_INDEX (the index in the PEM file (default: 0)) \
                            --keyfile KEYFILE (a .json extension keyfile, if PEM not provided). \
                            --passfile PASSFILE (a file containing keyfile`s password, if keyfile provided, optional) \
                            --chain CHAIN (The chain ID if not known, should be specified, "D" for devnet, "T" for testnet, or "M" for mainnet.) \
                            --proxy PROXY (The proxy is dependent on chain ID, for D:"https://devnet-gateway.multiversx.com", for T:"https://testnet-gateway.multiversx.com", for M:"https://gateway.multiversx.com".) \
                            --nonce NONCE (the nonce for the transaction if known) \
                            --recall-nonce (to recall the last nonce if --nonce is not provided) \
                            --gas-price GAS_PRICE (the gas price (default: 1000000000)) \
                            --gas-limit GAS_LIMIT (the gas limit, first use --simulate with --gas-limit=600000000 to obtain the real gas limit, and then use that value) \
                            --options OPTIONS (the transaction options (default: 0)) \
                            --arguments ARGUMENTS [ARGUMENTS ...] (arguments for the contract transaction, as [number, bech32-address, ascii string, boolean] or hex-encoded. E.g. --arguments 42 0x64 1000 0xabba str:TOK-a1c2ef true erd1[..]) \
                            --arguments-file ARGUMENTS_FILE (a json file containing the arguments. ONLY if abi file is provided. E.g. [{ "to": "erd1...", "amount": 10000000000 }]) \
                            --wait-result (to wait for the transaction result) \
                            --timeout TIMEOUT (max num of seconds to wait for result - only valid if --wait-result is set) \
                            --send (to broadcast the transaction, not to be used with --simulate) \
                            --simulate (to simulate the transaction and also get a real estimation for the gas limit argument (default False)) \
                            Successful deployment response should have a "status": "success" transaction and a log entry with an "identifier": "SCDeploy" section. \
                            After initial deployment, the contract can only be upgraded to the same address, deploying again would create a new contract instance at a new address. \
                            If necessary to upgrade the contract after first deployment, use the upgrade command. \
                            If the transaction fails with not enough gas error, use --simulate to have an estimation for the gas limit. \
                            Always include for the deployment the --recall-nonce, --proxy, --send, --wait-result, --gas-limit flags. \
                            Display the transaction details using the explorer "https://devnet-explorer.multiversx.com/transactions/[txhash] on devnet, "https://testnet-explorer.multiversx.com/transactions/[txhash] on testnet, "https://explorer.multiversx.com/transactions/[txhash] on mainnet". \
                            Important: Before deployment, read the contract file thet contains the #[multiversx_sc::contract] annotation to determine if the contract has init arguments in the "init" function. If so, ask the user for their values and specify them in the --arguments flag. \
                            ',
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
                            The command is: "mxpy contract upgrade CONTRACT_ADDRESS [options] \
                            options: -h, --help (show help message with all options) \
                            --bytecode BYTECODE (must be the full path of the file {CONTRACT-NAME}.wasm, found in the "output" folder from the contract folder. If the file does not exist or the build is old, use the mx-sdk-rs://building-contracts resource and build the contract first.) \
                            --abi ABI (must be the full path of the file {CONTRACT-NAME}.abi.json and it is found in the "output" folder from the contract folder.) \
                            --pem PEM (the wallet .pem extension file, if keyfile not provided) \
                            --pem-index PEM_INDEX (the index in the PEM file (default: 0)) \
                            --keyfile KEYFILE (the wallet file name for .json keyfile wallets.) \
                            --passfile PASSFILE (a file containing keyfile`s password, if keyfile provided, optional) \
                            --chain CHAIN (The chain ID if not known, should be specified, "D" for devnet, "T" for testnet, or "M" for mainnet.) \
                            --proxy PROXY (The proxy is dependent on chain ID, for D:"https://devnet-gateway.multiversx.com", for T:"https://testnet-gateway.multiversx.com", for M:"https://gateway.multiversx.com".) \
                            --nonce NONCE (the nonce for the transaction if known) \
                            --recall-nonce (to recall the last nonce if --nonce is not provided) \
                            --gas-price GAS_PRICE (the gas price (default: 1000000000)) \
                            --gas-limit GAS_LIMIT (the gas limit, first use --simulate with --gas-limit=600000000 to obtain the real gas limit, and then use that value) \
                            --options OPTIONS (the transaction options (default: 0)) \
                            --arguments ARGUMENTS [ARGUMENTS ...] (arguments for the contract transaction, as [number, bech32-address, ascii string, boolean] or hex-encoded. E.g. --arguments 42 0x64 1000 0xabba str:TOK-a1c2ef true erd1[..]) \
                            --arguments-file ARGUMENTS_FILE (a json file containing the arguments. ONLY if abi file is provided. E.g. [{ "to": "erd1...", "amount": 10000000000 }]) \
                            --wait-result (to wait for the transaction result) \
                            --timeout TIMEOUT (max num of seconds to wait for result - only valid if --wait-result is set) \
                            --send (to broadcast the transaction, not to be used with --simulate) \
                            --simulate (to simulate the transaction and also get a real estimation for the gas limit argument (default False)) \
                            Before upgrading, read the contract file that contains the #[multiversx_sc::contract] annotation to determine if the contract has init arguments in the "init" function. If so, ask the user for their values and specify them in the --arguments flag. \
                            Successful upgrade response should have a "status": "success" transaction and a log entry with an "identifier": "SCUpgrade" section. \
                            If the transaction fails with not enough gas error, use --simulate to have an estimation for the gas limit. \
                            Always include for the upgrade the --recall-nonce, --proxy, --send, --wait-result, --gas-limit flags. \
                            Display the transaction details using the explorer "https://devnet-explorer.multiversx.com/transactions/[txhash] on devnet, "https://testnet-explorer.multiversx.com/transactions/[txhash] on testnet, "https://explorer.multiversx.com/transactions/[txhash] on mainnet".',
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
                            The command is: "mxpy contract call CONTRACT_ADDRESS [options] \
                            options: -h, --help (show help message with all options) \
                            --abi ABI (must be the full path of the file {CONTRACT-NAME}.abi.json and it is found in the "output" folder from the contract folder.) \
                            --pem PEM (the .pem extension file, if keyfile not provided) \
                            --pem-index PEM_INDEX (the index in the PEM file (default: 0)) \
                            --keyfile KEYFILE (a .json extension keyfile, if PEM not provided) \
                            --passfile PASSFILE (a file containing keyfile`s password, if keyfile provided) (optional) \
                            --proxy PROXY (The proxy is dependent on chain ID, for D:"https://devnet-gateway.multiversx.com", for T:"https://testnet-gateway.multiversx.com", for M:"https://gateway.multiversx.com".) \
                            --nonce NONCE (the nonce for the transaction if known) \
                            --recall-nonce (to recall the last nonce if --nonce is not provided) \
                            --gas-price GAS_PRICE (the gas price (default: 1000000000)) \
                            --gas-limit GAS_LIMIT (the gas limit, start with 2000000) \
                            --value VALUE (the value to transfer (default: 0)) \
                            --options OPTIONS (the transaction options (default: 0)) \
                            --chain CHAIN (The chain ID if not known, should be specified, "D" for devnet, "T" for testnet, or "M" for mainnet.) \
                            --function FUNCTION (the function to call) \
                            --arguments ARGUMENTS [ARGUMENTS ...] (arguments for the contract transaction, as [number, bech32-address, ascii string, boolean] or hex-encoded. E.g. --arguments 42 0x64 1000 0xabba str:TOK-a1c2ef true erd1[..]) \
                            --arguments-file ARGUMENTS_FILE (a json file containing the arguments. ONLY if abi file is provided. E.g. [{ "  to": "erd1...", "amount": 10000000000 }]) \
                            --token-transfers TOKEN_TRANSFERS [TOKEN_TRANSFERS ...] (token transfers for transfer & execute, as [token, amount] E.g. --token-transfers NFT-123456-0a 1 ESDT-987654 100000000) \
                            --wait-result (to wait for the transaction result) \
                            --timeout TIMEOUT (max num of seconds to wait for result - only valid if --wait-result is set) \
                            --send (to broadcast the transaction, not to be used with --simulate) \
                            --simulate (to simulate the transaction (default False)) \
                            The wallet file name and wallet password file name if not known, should be provided. \
                            The arguments flag is optional and should be specified by the user, if none is specified do not include the --arguments flag. \
                            The value flag is optional and specifies any EGLD transfer to the contract call. \
                            Always include for the execution call the --recall-nonce, --proxy, --send, --wait-result, --gas-limit flags.\
                            In case of "not enough gas" error, use --simulate with --gas-limit increase by 2X, until the "simulation" section has a "status": "success" result, not "status": "pending". Then use the success value for the --gas-limit flag. \
                            Display the transaction details using the explorer "https://devnet-explorer.multiversx.com/transactions/[txhash] on devnet, "https://testnet-explorer.multiversx.com/transactions/[txhash] on testnet, "https://explorer.multiversx.com/transactions/[txhash] on mainnet".',
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
                            The command is: "mxpy contract query CONTRACT_ADDRESS \
                            --abi ABI (must be the full path of the file {CONTRACT-NAME}.abi.json and it is found in the "output" folder from the contract folder.) \
                            --function FUNCTION (the function to call) \
                            --proxy PROXY (The proxy is dependent on chain ID, for D:"https://devnet-gateway.multiversx.com", for T:"https://testnet-gateway.multiversx.com", for M:"https://gateway.multiversx.com".)" \
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
        console.error('MCP server running on stdio');
    }
}
const server = new MxServer();
server.run().catch(console.error);
