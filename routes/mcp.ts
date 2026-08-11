// routes/mcp.ts
//
// Remote MCP endpoint over Streamable HTTP, serving the 2026-07-28 revision
// only. That revision is stateless by design — no `initialize`, no
// `Mcp-Session-Id` — so the handler builds a fresh server per request and holds
// nothing between calls, the same privacy posture as the rest of the app.
//
// `legacy: "reject"` turns away pre-2026 clients rather than quietly serving
// them the old protocol: one wire to reason about, and an old client fails
// loudly at connect instead of subtly.
//
// `maxSubscriptions: 0` is what keeps "holds nothing between calls" true: the
// SDK otherwise accepts
// `subscriptions/listen` and holds an open SSE stream per subscriber (up to
// 1024) on this module-scope handler — an unauthenticated hold-open surface. Nothing here is subscribable — the tool
// list never changes — so refusing them outright keeps every POST a
// request/response round trip that returns and closes.
//
// Clients connect with, e.g.:
//   claude mcp add --transport http password-gen https://<host>/mcp

import type { Context } from "fresh";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { createServer } from "../lib/mcp-server.ts";

// Exported so the tests exercise this exact handler, options and all, rather
// than a lookalike built with the SDK defaults.
export const mcp = createMcpHandler(createServer, {
  legacy: "reject",
  maxSubscriptions: 0,
});

export const handler = {
  POST(ctx: Context<unknown>): Promise<Response> {
    return mcp.fetch(ctx.req);
  },
};
