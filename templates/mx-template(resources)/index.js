#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
    ListResourcesRequestSchema, 
    ReadResourceRequestSchema, 
    McpError,
    ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';

// MCP Server implementing only resources
class MxServer {
    constructor() {
        this.server = new Server({
            name: 'mx-template',
            version: '0.1.0',
        }, {
            // Capabilities
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

    // Resource list
    setupResourceHandlers() {
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
            resources: [
                {
                    uri: 'mx-template://name_1',
                    name: 'Resource Name 1',
                    mimeType: 'text/plain',
                    description: 'Resource description 1',
                },
                {
                    uri: 'mx-template://name_2',
                    name: 'Resource Name 2',
                    mimeType: 'text/plain',
                    description: 'Resource description 2',
                },
            ],
        }));

        // Resource read
        this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
            if (request.params.uri === 'mx-template://name_1') {
                return {
                    contents: [
                        {
                            uri: request.params.uri,
                            mimeType: 'text/plain',
                            text: 'Resource content 1',
                        },
                    ],
                };
            }
            else if (request.params.uri === 'mx-template://name_2') {
                return {
                    contents: [
                        {
                            uri: request.params.uri,
                            mimeType: 'text/plain',
                            text: 'Resource content 2',
                        },
                    ],
                };
            }
            else {
                throw new McpError(ErrorCode.MethodNotFound, 'Resource not found');
            }
        });
    }

    // Run
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('MCP server running on stdio');
    }
}
const server = new MxServer();
server.run().catch(console.error);
