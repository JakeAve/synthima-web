// routes/mcp.ts
//
// Remote MCP endpoint over Streamable HTTP. Stateless: each request gets a
// fresh server + transport, so no session state is held between calls — the
// same privacy posture as the rest of the app. JSON response mode is enabled
// since the tools here never stream.
//
// Clients connect with, e.g.:
//   claude mcp add --transport http password-gen https://<host>/mcp

import type { Context } from "fresh";
import { WebStandardStreamableHTTPServerTransport } from "../lib/mcp-sdk.ts";
import { createServer } from "../lib/mcp-server.ts";

export const handler = {
  async POST(ctx: Context<unknown>): Promise<Response> {
    const server = createServer();
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    await server.connect(transport);
    return await transport.handleRequest(ctx.req);
  },
};
