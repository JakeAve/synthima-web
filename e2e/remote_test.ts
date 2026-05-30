// e2e/remote_test.ts
//
// Exercises the remote /mcp endpoint against the BUILT production server
// (`deno serve _fresh/server.js`) using a real Streamable HTTP MCP client —
// the path unit tests can't reach. This is what catches the `ctx.req` 405 bug.

import { runRemoteChecks, startProdServer } from "./_helpers.ts";

Deno.test({
  name: "remote /mcp end-to-end (prod build)",
  // This test owns a child process and a network client; let it manage its
  // own lifecycle rather than fighting the per-test resource sanitizer.
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async (t) => {
    const server = await startProdServer();
    try {
      await runRemoteChecks(server.baseUrl, t);
    } finally {
      await server.close();
    }
  },
});
