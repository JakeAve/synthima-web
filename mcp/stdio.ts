#!/usr/bin/env -S deno run
// mcp/stdio.ts
//
// Local stdio entry point for the password-gen MCP server. An MCP client (e.g.
// Claude Desktop) launches this as a child process and speaks JSON-RPC over
// stdin/stdout. Run with:
//
//   deno run -A mcp/stdio.ts
//
// Serves the 2026-07-28 revision only; pre-2026 clients are turned away at the
// opening exchange. No flags or network are required — generation happens
// in-process.

import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createServer } from "../lib/mcp-server.ts";

// Same options as the HTTP route: modern-only, and no subscription streams —
// nothing here is subscribable, so there is no reason to hold one open.
serveStdio(createServer, { legacy: "reject", maxSubscriptions: 0 });
