// lib/password-core_test.ts
import { assertEquals, assertThrows } from "jsr:@std/assert@1";
import {
  ContradictoryRequirementsError,
  generatePasswords,
  listPresets,
  resolveRequirements,
  ValidationError,
} from "./password-core.ts";

// ── generatePasswords: defaults & counts ────────────────────────────────────

Deno.test("generatePasswords defaults to one 12-char password", () => {
  const pwds = generatePasswords({});
  assertEquals(pwds.length, 1);
  assertEquals(pwds[0].length, 12);
});

Deno.test("generatePasswords honors count", () => {
  const pwds = generatePasswords({ count: 5 });
  assertEquals(pwds.length, 5);
});

Deno.test("generatePasswords honors length", () => {
  const pwds = generatePasswords({ length: 20 });
  assertEquals(pwds[0].length, 20);
});

Deno.test("generatePasswords with empty requirements uses defaults", () => {
  const pwds = generatePasswords({ length: 8, requirements: [] });
  assertEquals(pwds[0].length, 8);
});

// ── generatePasswords: bounds (shared messages with the REST API) ────────────

Deno.test("count below 1 throws ValidationError", () => {
  const e = assertThrows(
    () => generatePasswords({ count: 0 }),
    ValidationError,
  );
  assertEquals(e.message, "count must be between 1 and 100");
});

Deno.test("count above 100 throws ValidationError", () => {
  assertThrows(
    () => generatePasswords({ count: 101 }),
    ValidationError,
    "count must be between 1 and 100",
  );
});

Deno.test("non-integer count throws ValidationError", () => {
  assertThrows(
    () => generatePasswords({ count: 1.5 }),
    ValidationError,
    "count must be between 1 and 100",
  );
});

Deno.test("length below 1 throws ValidationError", () => {
  assertThrows(
    () => generatePasswords({ length: 0 }),
    ValidationError,
    "length must be between 1 and 256",
  );
});

Deno.test("length above 256 throws ValidationError", () => {
  assertThrows(
    () => generatePasswords({ length: 257 }),
    ValidationError,
    "length must be between 1 and 256",
  );
});

// ── generatePasswords: contradictory requirements ───────────────────────────

Deno.test("requirements whose minimums exceed length throw", () => {
  assertThrows(
    () =>
      generatePasswords({
        length: 2,
        requirements: [
          { charSet: "abc", min: 5 },
        ],
      }),
    ContradictoryRequirementsError,
    "Requirements are contradictory for the given length",
  );
});

// ── resolveRequirements ─────────────────────────────────────────────────────

Deno.test("resolveRequirements maps a preset key to its charset", () => {
  const reqs = resolveRequirements([{ preset: "uppercase" }]);
  assertEquals(reqs.length, 1);
  assertEquals(reqs[0].charSet, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  assertEquals(reqs[0].min, 1);
});

Deno.test("resolveRequirements passes a literal charSet through", () => {
  const reqs = resolveRequirements([{ charSet: "xyz", min: 2, max: 4 }]);
  assertEquals(reqs[0].charSet, "xyz");
  assertEquals(reqs[0].min, 2);
  assertEquals(reqs[0].max, 4);
});

Deno.test("resolveRequirements rejects an unknown preset key", () => {
  assertThrows(
    () => resolveRequirements([{ preset: "klingon" }]),
    ValidationError,
    "Unknown preset",
  );
});

Deno.test("resolveRequirements rejects an item with neither preset nor charSet", () => {
  assertThrows(
    () => resolveRequirements([{ min: 1 }]),
    ValidationError,
  );
});

Deno.test("generate_password with a resolved preset only uses that charset", () => {
  const pwds = generatePasswords({
    length: 10,
    requirements: resolveRequirements([{ preset: "numbers" }]),
  });
  for (const ch of pwds[0]) {
    assertEquals("0123456789".includes(ch), true);
  }
});

// ── listPresets ─────────────────────────────────────────────────────────────

Deno.test("listPresets returns every preset with key/name/size/sample", () => {
  const presets = listPresets();
  assertEquals(presets.length > 40, true);
  const upper = presets.find((p) => p.key === "uppercase");
  assertEquals(upper?.name, "Uppercase (A–Z)");
  assertEquals(upper?.size, 26);
  assertEquals(typeof upper?.sample, "string");
});

Deno.test("listPresets sample never exceeds the preset size", () => {
  for (const p of listPresets()) {
    assertEquals([...p.sample].length <= p.size, true);
  }
});

Deno.test("an unsatisfiable min is rejected immediately, not after allocating", () => {
  // Regression guard: this used to reach synthima, which allocated for the
  // requested minimum — ~90s of CPU and enough memory to kill the process,
  // reachable from one unauthenticated /api/generate request.
  const t = performance.now();
  assertThrows(
    () =>
      generatePasswords({
        length: 256,
        count: 100,
        requirements: [{ charSet: "0123456789", min: 9007199254740991 }],
      }),
    ContradictoryRequirementsError,
  );
  assertEquals(performance.now() - t < 1000, true);
});
