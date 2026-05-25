// lib/url-params_test.ts

import { assertEquals } from "jsr:@std/assert@1";
import { parseRequirements, serializeRequirements } from "./url-params.ts";
import {
  PRESET_GREEK,
  PRESET_LOWERCASE,
  PRESET_NUMBERS,
  PRESET_SPECIAL,
  PRESET_UPPERCASE,
} from "./charsets.ts";

// ── parseRequirements ─────────────────────────────────────────────────────────

Deno.test("parseRequirements: defaults when no params", () => {
  const { requirements, length } = parseRequirements(new URLSearchParams());
  assertEquals(length, 12);
  assertEquals(requirements, []);
});

Deno.test("parseRequirements: reads length param", () => {
  const { length } = parseRequirements(new URLSearchParams("length=20"));
  assertEquals(length, 20);
});

Deno.test("parseRequirements: non-numeric length defaults to 12", () => {
  const { length } = parseRequirements(new URLSearchParams("length=abc"));
  assertEquals(length, 12);
});

Deno.test("parseRequirements: known preset key resolves to charSet", () => {
  const { requirements } = parseRequirements(
    new URLSearchParams("r=uppercase"),
  );
  assertEquals(requirements.length, 1);
  assertEquals(requirements[0].charSet, PRESET_UPPERCASE.charSet);
  assertEquals(requirements[0].min, 1);
  assertEquals(requirements[0].max, undefined);
});

Deno.test("parseRequirements: multiple preset keys", () => {
  const params = new URLSearchParams(
    "r=uppercase&r=lowercase&r=numbers&r=special",
  );
  const { requirements } = parseRequirements(params);
  assertEquals(requirements.length, 4);
  assertEquals(requirements[0].charSet, PRESET_UPPERCASE.charSet);
  assertEquals(requirements[1].charSet, PRESET_LOWERCASE.charSet);
  assertEquals(requirements[2].charSet, PRESET_NUMBERS.charSet);
  assertEquals(requirements[3].charSet, PRESET_SPECIAL.charSet);
});

Deno.test("parseRequirements: parses min from colon-delimited value", () => {
  const { requirements } = parseRequirements(
    new URLSearchParams("r=numbers:3"),
  );
  assertEquals(requirements[0].min, 3);
  assertEquals(requirements[0].max, undefined);
});

Deno.test("parseRequirements: parses min and max", () => {
  const { requirements } = parseRequirements(
    new URLSearchParams("r=numbers:2:8"),
  );
  assertEquals(requirements[0].min, 2);
  assertEquals(requirements[0].max, 8);
});

Deno.test("parseRequirements: unknown key treated as raw charSet", () => {
  const { requirements } = parseRequirements(new URLSearchParams("r=ABC123"));
  assertEquals(requirements[0].charSet, "ABC123");
  assertEquals(requirements[0].min, 1);
});

Deno.test("parseRequirements: skips empty r param", () => {
  const params = new URLSearchParams("r=uppercase&r=");
  const { requirements } = parseRequirements(params);
  assertEquals(requirements.length, 1);
});

Deno.test("parseRequirements: greek preset resolves correctly", () => {
  const { requirements } = parseRequirements(new URLSearchParams("r=greek"));
  assertEquals(requirements[0].charSet, PRESET_GREEK.charSet);
});

// ── serializeRequirements ─────────────────────────────────────────────────────

Deno.test("serializeRequirements: includes length", () => {
  const params = serializeRequirements([], 16);
  assertEquals(params.get("length"), "16");
});

Deno.test("serializeRequirements: preset charSet uses key (min=1, no max)", () => {
  const params = serializeRequirements(
    [{ charSet: PRESET_UPPERCASE.charSet, min: 1 }],
    12,
  );
  assertEquals(params.getAll("r"), ["uppercase"]);
});

Deno.test("serializeRequirements: non-default min includes min in value", () => {
  const params = serializeRequirements(
    [{ charSet: PRESET_NUMBERS.charSet, min: 3 }],
    12,
  );
  assertEquals(params.getAll("r"), ["numbers:3"]);
});

Deno.test("serializeRequirements: max appended when present", () => {
  const params = serializeRequirements(
    [{ charSet: PRESET_NUMBERS.charSet, min: 2, max: 5 }],
    12,
  );
  assertEquals(params.getAll("r"), ["numbers:2:5"]);
});

Deno.test("serializeRequirements: raw charSet when no preset match", () => {
  const params = serializeRequirements(
    [{ charSet: "XYZ", min: 1 }],
    12,
  );
  assertEquals(params.getAll("r"), ["XYZ"]);
});

Deno.test("serializeRequirements: multiple requirements", () => {
  const params = serializeRequirements(
    [
      { charSet: PRESET_UPPERCASE.charSet, min: 1 },
      { charSet: PRESET_LOWERCASE.charSet, min: 1 },
      { charSet: PRESET_NUMBERS.charSet, min: 2 },
    ],
    20,
  );
  assertEquals(params.getAll("r"), ["uppercase", "lowercase", "numbers:2"]);
  assertEquals(params.get("length"), "20");
});

Deno.test("serializeRequirements: skips requirements with empty charSet", () => {
  const params = serializeRequirements(
    [{ charSet: "", min: 1 }],
    12,
  );
  assertEquals(params.getAll("r"), []);
});

// ── round-trip ────────────────────────────────────────────────────────────────

Deno.test("round-trip: preset requirements survive encode→decode", () => {
  const original = [
    { charSet: PRESET_UPPERCASE.charSet, min: 1 },
    { charSet: PRESET_NUMBERS.charSet, min: 2, max: 6 },
    { charSet: PRESET_GREEK.charSet, min: 1 },
  ];
  const params = serializeRequirements(original, 18);
  const { requirements, length } = parseRequirements(params);
  assertEquals(length, 18);
  assertEquals(requirements, original);
});

Deno.test("round-trip: raw charSet survives encode→decode", () => {
  const original = [{ charSet: "ABC", min: 1 }];
  const params = serializeRequirements(original, 10);
  const { requirements } = parseRequirements(params);
  assertEquals(requirements[0].charSet, "ABC");
});

Deno.test("round-trip: raw charSet with colon survives encode→decode", () => {
  const original = [{ charSet: "a:b", min: 1 }];
  const params = serializeRequirements(original, 10);
  const { requirements } = parseRequirements(params);
  assertEquals(requirements[0].charSet, "a:b");
});

Deno.test("parseRequirements: length=0 does not default to 12", () => {
  const { length } = parseRequirements(new URLSearchParams("length=0"));
  assertEquals(length, 0);
});

Deno.test("serializeRequirements: raw charSet with non-default min emits only charSet (no min)", () => {
  const params = serializeRequirements(
    [{ charSet: "XYZ", min: 3 }],
    10,
  );
  assertEquals(params.getAll("r"), ["XYZ"]);
});
