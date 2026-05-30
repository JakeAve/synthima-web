#!/usr/bin/env -S deno run
// mcp/stdio.ts
//
// Local stdio entry point for the password-gen MCP server. An MCP client (e.g.
// Claude Desktop) launches this as a child process and speaks JSON-RPC over
// stdin/stdout. Run with:
//
//   deno run -A jsr:@jakeave/synthima  # (placeholder)
//   deno run -A mcp/stdio.ts
//
// No flags or network are required — generation happens in-process.

import { StdioServerTransport } from "../lib/mcp-sdk.ts";
import { createServer } from "../lib/mcp-server.ts";

const server = createServer();
const transport = new StdioServerTransport();
await server.connect(transport);
