// lib/mcp-sdk.ts
//
// Single point of entry for the MCP SDK. The SDK's package.json `exports`
// uses a `./*` wildcard whose types pattern (`./dist/esm/*.d.ts`) doesn't line
// up with the `.js`-suffixed subpath imports the SDK requires: the runtime
// resolves the `.js` file, but `deno check` looks for `<name>.js.d.ts` and
// fails. The `@deno-types` hints below point at the real declaration files so
// both runtime resolution and type-checking succeed. Centralizing here keeps
// every other module importing plain, typed symbols.

// @deno-types="../node_modules/@modelcontextprotocol/sdk/dist/esm/server/mcp.d.ts"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// @deno-types="../node_modules/@modelcontextprotocol/sdk/dist/esm/server/stdio.d.ts"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// @deno-types="../node_modules/@modelcontextprotocol/sdk/dist/esm/server/webStandardStreamableHttp.d.ts"
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
// @deno-types="../node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.d.ts"
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
// @deno-types="../node_modules/@modelcontextprotocol/sdk/dist/esm/inMemory.d.ts"
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

export {
  Client,
  InMemoryTransport,
  McpServer,
  StdioServerTransport,
  WebStandardStreamableHTTPServerTransport,
};
