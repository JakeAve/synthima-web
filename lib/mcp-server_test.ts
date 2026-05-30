// lib/mcp-server_test.ts
import { assertEquals, assertExists } from "jsr:@std/assert@1";
import { Client, InMemoryTransport } from "./mcp-sdk.ts";
import { createServer } from "./mcp-server.ts";

async function connect(): Promise<
  { client: Client; close: () => Promise<void> }
> {
  const server = createServer();
  const [clientTransport, serverTransport] = InMemoryTransport
    .createLinkedPair();
  const client = new Client({ name: "test-client", version: "0.0.0" });
  await Promise.all([
    server.connect(serverTransport),
    client.connect(clientTransport),
  ]);
  return {
    client,
    close: async () => {
      await client.close();
      await server.close();
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
