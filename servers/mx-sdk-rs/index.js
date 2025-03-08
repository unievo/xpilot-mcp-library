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
            name: 'mx-sdk-rs',
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
                    uri: 'mx-sdk-rs://creating-contracts',
                    name: 'How to create a new smart contract',
                    mimeType: 'text/plain',
                    description: 'Command for creating a new smart contract.',
                },
                {
                    uri: 'mx-sdk-rs://building-contracts',
                    name: 'How to build a smart contract',
                    mimeType: 'text/plain',
                    description: 'Command for building smart contracts.',
                },
                {
                    uri: 'mx-sdk-rs://cleaning-contracts',
                    name: 'How to clean a smart contract build',
                    mimeType: 'text/plain',
                    description: 'Command for cleaning smart contract builds.',
                },
            ],
        }));
        this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
            if (request.params.uri === 'mx-sdk-rs://creating-contracts') {
                return {
                    contents: [
                        {
                            uri: request.params.uri,
                            mimeType: 'text/plain',
                            text: 'Contracts are created using the "sc-meta" cli tool. \
                            The command is: "sc-meta new \
                            --name CONTRACT_NAME \
                            --template TEMPLATE_NAME". \
                            If a contract name is not known, ask the user for the name. \
                            Available templates can be listed by executing "sc-meta templates" \
                            If the template name is still not provided, use the default template name "empty". \
                            ',
                        },
                    ],
                };
            }
            else if (request.params.uri === 'mx-sdk-rs://building-contracts') {
                return {
                    contents: [
                        {
                            uri: request.params.uri,
                            mimeType: 'text/plain',
                            text: 'To build a contract, use the sc-meta cli tool by running the following command in the contract folder: "sc-meta all build". \
                            If there are more contracts to be built, the command can also be executed in the containing folder to build all existing contracts in all subfolders at the same time. \
                            At the end provide a short summary of the build.',
                        },
                    ],
                };
            }
            else if (request.params.uri === 'mx-sdk-rs://cleaning-contracts') {
                return {
                    contents: [
                        {
                            uri: request.params.uri,
                            mimeType: 'text/plain',
                            text: 'To clean a contract build, use the cargo cli tool by executing the following command in the contract folder:"cargo clean".',
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
