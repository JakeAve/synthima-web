// e2e/mcp-client.ts
//
// Client-side MCP SDK entry point for the e2e suite. Same `@deno-types` dance
// as lib/mcp-sdk.ts (see the note there): the SDK's `exports` wildcard derives
// a broken `<name>.js.d.ts` types path for `.js` subpath imports, so we point
// at the real declaration files for the type-checker while the runtime loads
// the `.js`.

export { Client } from "../lib/mcp-sdk.ts";

// @deno-types="../node_modules/@modelcontextprotocol/sdk/dist/esm/client/streamableHttp.d.ts"
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
// @deno-types="../node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.d.ts"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export { StdioClientTransport, StreamableHTTPClientTransport };
