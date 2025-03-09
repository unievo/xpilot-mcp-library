# xPilot MCP Server Library

The [Model Context Protocol](https://modelcontextprotocol.io) is an open protocol that standardizes how applications provide context to LLMs. xPilot can use MCP servers to provide context to the underlying model and add new tools and resources the model can use to complete tasks and requests.

## Repo Structure

```bash
/
├── servers/                     # Server implementations
├── templates/                   # Server templates
└── mcp_settings.json.example    # Example configuration file for xPilot
```

This repository contains MCP Server implementations for xPilot in the [servers](/servers) directory.

**NOTE:** *The initial release contains limited functionality. Feel free to contribute in extending them or creating new implementations for other use cases by starting from one of the available [templates](/templates).*

## Getting Started

### Prerequisites for server use

- [Node.js](https://nodejs.org/en/download/) for running the servers
- [Python](https://www.python.org/downloads/) for the SDK CLI tools
- [Rust](https://docs.multiversx.com/sdk-and-tools/troubleshooting/rust-setup) for the Rust SDK CLI
- MultiversX [mxpy](https://docs.multiversx.com/sdk-and-tools/sdk-py/installing-mxpy/) Python SDK CLI
- MultiversX [sc-meta](https://docs.multiversx.com/developers/meta/sc-meta/) Rust SDK CLI

### Installation

1. Clone the repository (xPilot uses this default path: `[HOME]/Documents/xPilot/mcp`):

   ```bash
   cd [HOME]/Documents/xPilot/mcp
   git clone https://github.com/unievo/xpilot-mcp-library.git
   ```

2. Install dependencies using the following command in each server's directory:

   ```bash
   cd [HOME]/Documents/xPilot/mcp/servers/{server_name}
   npm install
   ```

3. Configure xPilot's MCP Server library:

   ![mcp_settings](/docs/img/configure_mcp_servers.png)

   The **Configure MCP Servers** button will open xPilot's `mcp_settings.json` configuration file. You can copy and paste the contents of the [mcp_settings.json.example](mcp_settings.json.example) file into xPilot's configuration file.

   [**Important**]: Make sure to update the paths to the server files in the configuration file so node can run them.
   Replace `[HOME]` with the actual path to your home directory.

   For example: `[HOME]/Documents/xPilot/mcp/servers/mx-api-service/index.js`

   ```bash
   On Mac/Linux:
   
   /Users/{username}/Documents/xPilot/mcp/servers/mx-api-service/index.js

   On Windows:
   
   C:\Users\{username}\Documents\xPilot\mcp\servers\mx-api-service\index.js
   ```

   xPilot monitors the configuration file for changes and will automatically update the servers when the configuration is updated.

## Available MCP Servers

The implementation includes the following servers:

1. **[MultiversX API Service](/servers/mx-api-service)**: Implementation handling MultiversX API service requests and responses
2. **[MultiversX Python SDK CLI](/servers/mx-sdk-py-cli)**: Resources explaining CLI tools implemented in Python (mxpy)
3. **[MultiversX Rust SDK CLI](/servers/mx-sdk-rs)**: Resources explaining the Rust SDK CLI tools (sc-meta)

## Configuration

The `mcp_settings.json` file contains server configurations for each server. The configuration structure is as follows:

```js
{
  "mcpServers": {
    "mx-api-service": {
      "command": "node",
      "args": ["path/to/index.js"],
      "env": {},
      "disabled": false,
      "autoApprove": []
    }
    // Similar configuration for other servers in the configuration file
  }
}
```

### Configuration Options

- `command`: The command to run the server (e.g., `node`)
- `args`: Arguments to pass to the command
- `env`: Environment variables for the server (API keys, etc.)
- `disabled`: Boolean flag to enable/disable the server
- `autoApprove`: List of auto-approved actions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
