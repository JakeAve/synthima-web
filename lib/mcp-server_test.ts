// lib/mcp-server_test.ts
import { assertEquals, assertExists, assertRejects } from "jsr:@std/assert@1";
import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
import { mcp } from "../routes/mcp.ts";

// There is no in-memory transport for the 2026-07-28 revision — InMemoryTransport
// only speaks the 2025 era. Driving the route's own handler keeps the tests
// in-process while exercising the real wire; the URL is never dialed. It has to
// be *that* handler and not a lookalike built here, or its options (legacy
// serving, subscription limits) go untested.
async function connect(): Promise<
  { client: Client; close: () => Promise<void> }
> {
  const client = new Client({ name: "test-client", version: "0.0.0" }, {
    versionNegotiation: { mode: { pin: "2026-07-28" } },
  });
  const transport = new StreamableHTTPClientTransport(
    new URL("http://test.local/mcp"),
    { fetch: (url, init) => mcp.fetch(new Request(url, init)) },
  );
  await client.connect(transport);
  return {
    client,
    close: async () => {
      await client.close();
    },
  };
}

// deno-lint-ignore no-explicit-any
function firstText(result: any): string {
  return result.content[0].text as string;
}

Deno.test("tools/list exposes both tools", async () => {
  const { client, close } = await connect();
  try {
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name).sort();
    assertEquals(names, ["generate_password", "list_charset_presets"]);
  } finally {
    await close();
  }
});

Deno.test("generate_password returns one password by default", async () => {
  const { client, close } = await connect();
  try {
    const result = await client.callTool({
      name: "generate_password",
      arguments: {},
    });
    const lines = firstText(result).split("\n");
    assertEquals(lines.length, 1);
    assertEquals(lines[0].length, 12);
    // deno-lint-ignore no-explicit-any
    assertEquals((result as any).structuredContent.passwords.length, 1);
  } finally {
    await close();
  }
});

Deno.test("generate_password honors length, count, and a preset", async () => {
  const { client, close } = await connect();
  try {
    const result = await client.callTool({
      name: "generate_password",
      arguments: {
        length: 6,
        count: 3,
        requirements: [{ preset: "numbers" }],
      },
    });
    const lines = firstText(result).split("\n");
    assertEquals(lines.length, 3);
    for (const line of lines) {
      assertEquals(line.length, 6);
      for (const ch of line) assertEquals("0123456789".includes(ch), true);
    }
  } finally {
    await close();
  }
});

Deno.test("generate_password reports contradictory requirements as a tool error", async () => {
  const { client, close } = await connect();
  try {
    const result = await client.callTool({
      name: "generate_password",
      arguments: {
        length: 2,
        requirements: [{ charSet: "abc", min: 5 }],
      },
    });
    // deno-lint-ignore no-explicit-any
    assertEquals((result as any).isError, true);
    assertEquals(
      firstText(result),
      "Requirements are contradictory for the given length",
    );
  } finally {
    await close();
  }
});

Deno.test("generate_password reports an unknown preset as a tool error", async () => {
  const { client, close } = await connect();
  try {
    const result = await client.callTool({
      name: "generate_password",
      arguments: { requirements: [{ preset: "klingon" }] },
    });
    // deno-lint-ignore no-explicit-any
    assertEquals((result as any).isError, true);
    assertEquals(firstText(result).includes("Unknown preset"), true);
  } finally {
    await close();
  }
});

Deno.test("list_charset_presets returns the full catalog", async () => {
  const { client, close } = await connect();
  try {
    const result = await client.callTool({
      name: "list_charset_presets",
      arguments: {},
    });
    const presets = JSON.parse(firstText(result));
    assertEquals(presets.length > 40, true);
    const upper = presets.find((p: { key: string }) => p.key === "uppercase");
    assertExists(upper);
    assertEquals(upper.size, 26);
  } finally {
    await close();
  }
});

Deno.test("a 2025-era client is rejected, not silently served", async () => {
  // legacy: "reject" is deliberate. A default-options client speaks the old
  // `initialize` handshake; it must fail at connect rather than get served.
  const client = new Client({ name: "old-client", version: "0.0.0" });
  const transport = new StreamableHTTPClientTransport(
    new URL("http://test.local/mcp"),
    { fetch: (url, init) => mcp.fetch(new Request(url, init)) },
  );
  await assertRejects(() => client.connect(transport));
});

Deno.test("subscriptions/listen is refused instead of holding a stream open", async () => {
  // Guards the maxSubscriptions: 0 in routes/mcp.ts. Without it the SDK
  // answers with an open text/event-stream that never closes.
  const res = await mcp.fetch(
    new Request("http://test.local/mcp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "accept": "application/json, text/event-stream",
        "mcp-method": "subscriptions/listen",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "subscriptions/listen",
        params: {
          notifications: { toolsListChanged: true },
          _meta: {
            "io.modelcontextprotocol/protocolVersion": "2026-07-28",
            "io.modelcontextprotocol/clientCapabilities": {},
          },
        },
      }),
    }),
  );
  assertEquals(res.headers.get("content-type"), "application/json");
  const body = await res.json();
  assertEquals(body.error.message, "Subscription limit reached");
});
