// e2e/_helpers.ts
//
// Lifecycle + shared assertions for the e2e suite: start a server (built prod
// artifact or the vite dev server) on a random free port, wait until it
// answers, run the MCP round-trip checks against /mcp, and tear it down.

import { assertEquals } from "jsr:@std/assert@1";
import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";

const BUILT_SERVER = "_fresh/server.js";

export interface RunningServer {
  baseUrl: string;
  close: () => Promise<void>;
}

/**
 * Read `stream` forever, decoding to text and reporting the first port it sees
 * via `onPort`. Reading to EOF doubles as draining so the child never blocks.
 */
function watchForPort(
  stream: ReadableStream<Uint8Array>,
  pattern: RegExp,
  onPort: (port: number) => void,
  onChunk?: (text: string) => void,
): void {
  (async () => {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const piece = decoder.decode(value, { stream: true });
        onChunk?.(piece);
        buf += piece;
        const match = buf.match(pattern);
        if (match) {
          onPort(Number(match[1]));
          buf = "";
        }
      }
    } catch {
      // stream closed on teardown — expected
    } finally {
      reader.releaseLock();
    }
  })();
}

async function waitUntilReady(baseUrl: string, label: string): Promise<void> {
  for (let i = 0; i < 100; i++) {
    try {
      const res = await fetch(baseUrl, { method: "GET" });
      await res.body?.cancel();
      if (res.status > 0) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error(`${label} at ${baseUrl} never became ready`);
}

/** Spawn `deno <args>`, discover the port from its output (stdout or stderr). */
async function startServer(
  args: string[],
  portPattern: RegExp,
  label: string,
): Promise<RunningServer> {
  const child = new Deno.Command("deno", {
    args,
    stdout: "piped",
    stderr: "piped",
  }).spawn();

  let captured = "";
  const onChunk = (text: string) => {
    captured += text;
  };
  const port = await new Promise<number>((resolve, reject) => {
    watchForPort(child.stdout, portPattern, resolve, onChunk);
    watchForPort(child.stderr, portPattern, resolve, onChunk);
    const id = setTimeout(
      () =>
        reject(
          new Error(
            `${label} did not report a port within 60s. Output:\n${
              captured.slice(-2000)
            }`,
          ),
        ),
      60_000,
    );
    Deno.unrefTimer(id);
  });

  const baseUrl = `http://127.0.0.1:${port}`;
  await waitUntilReady(baseUrl, label);

  return {
    baseUrl,
    close: async () => {
      try {
        child.kill("SIGTERM");
      } catch {
        // already gone
      }
      await child.status;
    },
  };
}

/**
 * Start the BUILT production server (`deno serve _fresh/server.js`). Requires
 * `deno task build` to have run first.
 */
export async function startProdServer(): Promise<RunningServer> {
  try {
    await Deno.stat(BUILT_SERVER);
  } catch {
    throw new Error(
      `${BUILT_SERVER} not found — run \`deno task build\` first ` +
        `(or use \`deno task test:e2e\`, which builds for you).`,
    );
  }
  return await startServer(
    ["serve", "-A", "--port", "0", BUILT_SERVER],
    /Listening on https?:\/\/[\d.]+:(\d+)/,
    "prod server",
  );
}

/**
 * Start the vite DEV server (`deno task dev`). Exercises the dev SSR pipeline,
 * so it catches regressions (like a missing `ssr.external`) that the built
 * artifact would hide.
 */
export function startDevServer(): Promise<RunningServer> {
  return startServer(
    ["task", "dev"],
    /https?:\/\/(?:127\.0\.0\.1|localhost):(\d+)/,
    "dev server",
  );
}

// deno-lint-ignore no-explicit-any
function text(result: any): string {
  return result.content[0].text as string;
}

/**
 * The shared MCP round-trip checks, run against a /mcp endpoint over a real
 * Streamable HTTP client. Used by both the prod-build and dev-mode tests.
 */
export async function runRemoteChecks(
  baseUrl: string,
  t: Deno.TestContext,
): Promise<void> {
  // Pinned to the modern revision: if the endpoint ever stops serving
  // 2026-07-28, connect() rejects instead of silently falling back to 2025.
  const client = new Client({ name: "e2e-remote", version: "0.0.0" }, {
    versionNegotiation: { mode: { pin: "2026-07-28" } },
  });
  await client.connect(
    new StreamableHTTPClientTransport(new URL(`${baseUrl}/mcp`)),
  );

  try {
    await t.step("tools/list exposes both tools", async () => {
      const { tools } = await client.listTools();
      assertEquals(
        tools.map((x: { name: string }) => x.name).sort(),
        ["generate_password", "list_charset_presets"],
      );
    });

    await t.step("generate_password honors length, count, preset", async () => {
      const result = await client.callTool({
        name: "generate_password",
        arguments: {
          length: 16,
          count: 2,
          requirements: [{ preset: "greek" }],
        },
      });
      const lines = text(result).split("\n");
      assertEquals(lines.length, 2);
      for (const line of lines) assertEquals([...line].length, 16);
    });

    await t.step(
      "contradictory requirements come back as a tool error",
      async () => {
        const result = await client.callTool({
          name: "generate_password",
          arguments: { length: 2, requirements: [{ charSet: "ab", min: 9 }] },
        });
        // deno-lint-ignore no-explicit-any
        assertEquals((result as any).isError, true);
        assertEquals(
          text(result),
          "Requirements are contradictory for the given length",
        );
      },
    );

    await t.step("list_charset_presets returns the catalog", async () => {
      const result = await client.callTool({
        name: "list_charset_presets",
        arguments: {},
      });
      assertEquals(JSON.parse(text(result)).length > 40, true);
    });
  } finally {
    await client.close();
  }
}
