#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
    ListToolsRequestSchema,
    CallToolRequestSchema,
    McpError,
    ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';

// MCP Server implementing only tools
class MxServer {
    constructor() {
        this.server = new Server({
            name: 'mx-template',
            version: '0.1.0',
        }, {
            // Capabilities
            capabilities: {
                tools: {},
            },
        });
        this.setupToolHandlers();
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }

    // Tool list
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
          tools: [{
                name: 'tool_1',
                description: 'Tool description 1',
                inputSchema: {
                  type: 'object',
                  properties: {
                    parameter1: { type: 'string', description: 'Parameter 1 description' },
                    parameter2: { type: 'string', description: 'Parameter 2 description' },
                  },
                },
            },
            {
                name: 'tool_2',
                description: 'Tool description 2',
                inputSchema: {
                  type: 'object',
                  properties: {
                    parameter1: { type: 'string', description: 'Parameter 1 description' },
                    parameter2: { type: 'string', description: 'Parameter 2 description' },
                  },
                },
            },
        ]
        }));

        // Tool call
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            if (request.params.name === 'tool_1') {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'Tool 1 response',
                        },
                    ],
                };
            } else if (request.params.name === 'tool_2') {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'Tool 2 response',
                        },
                    ],
                };
            } else {
                throw new McpError(ErrorCode.MethodNotFound, 'Tool not found');
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
