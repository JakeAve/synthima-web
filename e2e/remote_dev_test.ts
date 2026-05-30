// e2e/remote_dev_test.ts
//
// Exercises the remote /mcp endpoint against the vite DEV server
// (`deno task dev`) — the dev SSR pipeline that the built artifact bypasses.
// This is what catches a regression in `ssr.external` (without it, loading the
// MCP SDK under dev SSR throws and the route 500s while prod stays green).

import { runRemoteChecks, startDevServer } from "./_helpers.ts";

Deno.test({
  name: "remote /mcp end-to-end (vite dev)",
  // Skipped under CI: vite's dev server is slow/flaky to start in a headless
  // runner, and CI already validates the deployment artifact via the prod +
  // stdio tests. This test's real job is guarding `ssr.external` during local
  // development, so it runs everywhere except CI.
  ignore: Boolean(Deno.env.get("CI")),
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async (t) => {
    const server = await startDevServer();
    try {
      await runRemoteChecks(server.baseUrl, t);
    } finally {
      await server.close();
    }
  },
});
