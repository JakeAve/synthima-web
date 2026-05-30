// routes/api/generate_test.ts
import { assertEquals } from "jsr:@std/assert@1";
import type { Context } from "fresh";
import { handler } from "./generate.ts";

function makeCtx(search = ""): Context<unknown> {
  return {
    req: new Request(`http://localhost/api/generate${search}`),
  } as Context<unknown>;
}

// ── format ────────────────────────────────────────────────────────────────────

Deno.test("default format is JSON array with one password", async () => {
  const res = await handler.GET(makeCtx());
  assertEquals(res.status, 200);
  assertEquals(res.headers.get("Content-Type"), "application/json");
  const body = await res.json();
  assertEquals(Array.isArray(body), true);
  assertEquals(body.length, 1);
  assertEquals(typeof body[0], "string");
});

Deno.test("format=json returns Content-Type application/json", async () => {
  const res = await handler.GET(makeCtx("?format=json"));
  assertEquals(res.headers.get("Content-Type"), "application/json");
  const body = await res.json();
  assertEquals(Array.isArray(body), true);
});

Deno.test("format=csv returns Content-Type text/plain", async () => {
  const res = await handler.GET(makeCtx("?format=csv"));
  assertEquals(res.headers.get("Content-Type"), "text/plain");
  const body = await res.text();
  assertEquals(typeof body, "string");
  assertEquals(body.trim().length > 0, true);
});

Deno.test("format=csv with count=3 returns 3 newline-separated passwords", async () => {
  const res = await handler.GET(makeCtx("?format=csv&count=3"));
  const body = await res.text();
  const lines = body.trim().split("\n");
  assertEquals(lines.length, 3);
  for (const line of lines) {
    assertEquals(typeof line, "string");
    assertEquals(line.length > 0, true);
  }
});

Deno.test("format=xml returns 400", async () => {
  const res = await handler.GET(makeCtx("?format=xml"));
  assertEquals(res.status, 400);
  const body = await res.json();
  assertEquals(body.error, "format must be json or csv");
});

// ── count ─────────────────────────────────────────────────────────────────────

Deno.test("count=5 returns 5 passwords", async () => {
  const res = await handler.GET(makeCtx("?count=5"));
  const body = await res.json();
  assertEquals(body.length, 5);
});

Deno.test("count=100 returns 100 passwords", async () => {
  const res = await handler.GET(makeCtx("?count=100"));
  const body = await res.json();
  assertEquals(body.length, 100);
});

Deno.test("count=0 returns 400", async () => {
  const res = await handler.GET(makeCtx("?count=0"));
  assertEquals(res.status, 400);
  const body = await res.json();
  assertEquals(body.error, "count must be between 1 and 100");
});

Deno.test("count=101 returns 400", async () => {
  const res = await handler.GET(makeCtx("?count=101"));
  assertEquals(res.status, 400);
  const body = await res.json();
  assertEquals(body.error, "count must be between 1 and 100");
});

Deno.test("count=abc returns 400", async () => {
  const res = await handler.GET(makeCtx("?count=abc"));
  assertEquals(res.status, 400);
  const body = await res.json();
  assertEquals(body.error, "count must be between 1 and 100");
});

Deno.test("count=1.5 returns 400", async () => {
  const res = await handler.GET(makeCtx("?count=1.5"));
  assertEquals(res.status, 400);
  const body = await res.json();
  assertEquals(body.error, "count must be between 1 and 100");
});

// ── length and charsets ───────────────────────────────────────────────────────

Deno.test("length=0 returns 400", async () => {
  const res = await handler.GET(makeCtx("?length=0"));
  assertEquals(res.status, 400);
  const body = await res.json();
  assertEquals(body.error, "length must be between 1 and 256");
});

Deno.test("length=257 returns 400", async () => {
  const res = await handler.GET(makeCtx("?length=257"));
  assertEquals(res.status, 400);
  const body = await res.json();
  assertEquals(body.error, "length must be between 1 and 256");
});

Deno.test("length=4 generates passwords of length 4", async () => {
  const res = await handler.GET(makeCtx("?length=4&r=uppercase"));
  const body: string[] = await res.json();
  for (const pwd of body) {
    assertEquals(pwd.length, 4);
  }
});

Deno.test("no r params generates successfully", async () => {
  const res = await handler.GET(makeCtx());
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.length, 1);
});
