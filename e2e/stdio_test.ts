// e2e/stdio_test.ts
//
// Exercises the local stdio entry point by spawning `mcp/stdio.ts` as a child
// process and talking JSON-RPC over stdio with a real MCP client — the actual
// path a desktop client uses.

import { assertEquals } from "jsr:@std/assert@1";
import { Client, StdioClientTransport } from "./mcp-client.ts";

// deno-lint-ignore no-explicit-any
function text(result: any): string {
  return result.content[0].text as string;
}

Deno.test({
  name: "stdio server end-to-end",
  // Owns a child process spawned by the transport.
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async (t) => {
    const client = new Client({ name: "e2e-stdio", version: "0.0.0" });
    await client.connect(
      new StdioClientTransport({
        command: "deno",
        args: ["run", "-A", "mcp/stdio.ts"],
      }),
    );

    try {
      await t.step("tools/list exposes both tools", async () => {
        const { tools } = await client.listTools();
        assertEquals(
          tools.map((x) => x.name).sort(),
          ["generate_password", "list_charset_presets"],
        );
      });

      await t.step(
        "generate_password returns the requested count",
        async () => {
          const result = await client.callTool({
            name: "generate_password",
            arguments: {
              length: 10,
              count: 3,
              requirements: [{ preset: "numbers" }],
            },
          });
          const lines = text(result).split("\n");
          assertEquals(lines.length, 3);
          for (const line of lines) {
            assertEquals(line.length, 10);
            for (const ch of line) {
              assertEquals("0123456789".includes(ch), true);
            }
          }
        },
      );

      await t.step("unknown preset comes back as a tool error", async () => {
        const result = await client.callTool({
          name: "generate_password",
          arguments: { requirements: [{ preset: "klingon" }] },
        });
        // deno-lint-ignore no-explicit-any
        assertEquals((result as any).isError, true);
        assertEquals(text(result).includes("Unknown preset"), true);
      });
    } finally {
      await client.close();
    }
  },
});
