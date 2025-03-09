#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  McpError,
  ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

class MxServer {
  constructor() {
    this.server = new Server(
      {
        name: 'mx-api-service',
        version: '0.0.1',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_egld_price',
          description: 'Retrieves the price of EGLD',
          inputSchema: {
            type: 'object',
            properties: {
            },
          },
        },
        {
          name: 'get_egld_total_supply',
          description: 'Retrieves the total supply of EGLD',
          inputSchema: {
            type: 'object',
          },
        },
        {
          name: 'get_egld_circulating_supply',
          description: 'Retrieves the circulating supply of EGLD',
          inputSchema: {
            type: 'object',
            properties: {
            },
          },
        },
        {
          name: 'get_egld_market_cap',
          description: 'Retrieves the market cap of EGLD',
          inputSchema: {
            type: 'object',
            properties: {
            },
          },
        },
        {
          name: 'get_egld_staked',
          description: 'Retrieves the staked amount of EGLD',
          inputSchema: {
            type: 'object',
            properties: {
            },
          },
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'get_egld_price') {
        try {
          const response = await axios.get(
            `https://api.multiversx.com/economics?fields=price`
          );
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ price: response.data.price }, null, 2),
              },
            ],
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            return {
              content: [
                {
                  type: 'text',
                  text: `API error: ${
                    error.response?.data.message ?? error.message
                  }`,
                },
              ],
              isError: true,
            };
          }
          throw error;
        }
      } else if (request.params.name === 'get_egld_total_supply') {
        try {
          const response = await axios.get(
            `https://api.multiversx.com/economics?fields=totalSupply`
          );
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ totalSupply: response.data.totalSupply }, null, 2),
              },
            ],
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            return {
              content: [
                {
                  type: 'text',
                  text: `API error: ${
                    error.response?.data.message ?? error.message
                  }`,
                },
              ],
              isError: true,
            };
          }
          throw error;
        }
      } else if (request.params.name === 'get_egld_circulating_supply') {
        try {
          const response = await axios.get(
            `https://api.multiversx.com/economics?fields=circulatingSupply`
          );
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ circulatingSupply: response.data.circulatingSupply }, null, 2),
              },
            ],
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            return {
              content: [
                {
                  type: 'text',
                  text: `API error: ${
                    error.response?.data.message ?? error.message
                  }`,
                },
              ],
              isError: true,
            };
          }
          throw error;
        }
      } else if (request.params.name === 'get_egld_market_cap') {
        try {
          const response = await axios.get(
            `https://api.multiversx.com/economics?fields=marketCap`
          );
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ marketCap: response.data.marketCap }, null, 2),
              },
            ],
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            return {
              content: [
                {
                  type: 'text',
                  text: `API error: ${
                    error.response?.data.message ?? error.message
                  }`,
                },
              ],
              isError: true,
            };
          }
          throw error;
        }
      } else if (request.params.name === 'get_egld_staked') {
        try {
          const response = await axios.get(
            `https://api.multiversx.com/economics?fields=staked`
          );
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ staked: response.data.staked }, null, 2),
              },
            ],
          };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            return {
              content: [
                {
                  type: 'text',
                  text: `API error: ${
                    error.response?.data.message ?? error.message
                  }`,
                },
              ],
              isError: true,
            };
          }
          throw error;
        }
      } else {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
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
