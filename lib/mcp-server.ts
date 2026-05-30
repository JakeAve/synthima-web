// lib/mcp-server.ts
//
// Builds the MCP server and its two tools. Pure construction — no transport is
// bound here, so the same factory backs both the stdio entry point and the
// remote /mcp route.

import { McpServer } from "./mcp-sdk.ts";
import { z } from "zod";
import {
  ContradictoryRequirementsError,
  DEFAULT_COUNT,
  DEFAULT_LENGTH,
  generatePasswords,
  listPresets,
  MAX_COUNT,
  MAX_LENGTH,
  MIN_COUNT,
  MIN_LENGTH,
  resolveRequirements,
  ValidationError,
} from "./password-core.ts";

const SERVER_INFO = { name: "password-gen", version: "0.1.0" } as const;

const INSTRUCTIONS =
  "Generates cryptographically random passwords. Call list_charset_presets " +
  "to discover available charset keys, then pass them to generate_password " +
  "via the `requirements` array. With no requirements, passwords mix " +
  "uppercase, lowercase, numbers, and special characters.";

const requirementSchema = z.object({
  preset: z.string().optional().describe(
    'A preset key from list_charset_presets (e.g. "uppercase", "greek").',
  ),
  charSet: z.string().optional().describe(
    "A literal set of characters to draw from. Use instead of `preset`.",
  ),
  min: z.number().int().min(0).optional().describe(
    "Minimum occurrences of this set in each password (default 1).",
  ),
  max: z.number().int().min(0).optional().describe(
    "Maximum occurrences of this set in each password.",
  ),
});

function errorResult(message: string) {
  return { content: [{ type: "text" as const, text: message }], isError: true };
}

export function createServer(): McpServer {
  const server = new McpServer(SERVER_INFO, { instructions: INSTRUCTIONS });

  server.registerTool(
    "generate_password",
    {
      title: "Generate password",
      description:
        "Generate one or more cryptographically random passwords. Returns " +
        "one password per line. Optionally constrain which character sets " +
        "are used and how often via `requirements`.",
      inputSchema: {
        length: z.number().int().min(MIN_LENGTH).max(MAX_LENGTH).default(
          DEFAULT_LENGTH,
        ).describe(`Password length (${MIN_LENGTH}–${MAX_LENGTH}).`),
        count: z.number().int().min(MIN_COUNT).max(MAX_COUNT).default(
          DEFAULT_COUNT,
        ).describe(
          `How many passwords to generate (${MIN_COUNT}–${MAX_COUNT}).`,
        ),
        requirements: z.array(requirementSchema).optional().describe(
          "Character-set requirements. Omit to use a strong default mix of " +
            "uppercase, lowercase, numbers, and special characters.",
        ),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ length, count, requirements }) => {
      try {
        const resolved = requirements
          ? resolveRequirements(requirements)
          : undefined;
        const passwords = generatePasswords({
          length,
          count,
          requirements: resolved,
        });
        return {
          content: [{ type: "text", text: passwords.join("\n") }],
          structuredContent: { passwords },
        };
      } catch (e) {
        if (
          e instanceof ValidationError ||
          e instanceof ContradictoryRequirementsError
        ) {
          return errorResult(e.message);
        }
        throw e;
      }
    },
  );

  server.registerTool(
    "list_charset_presets",
    {
      title: "List charset presets",
      description:
        "List the available character-set presets (key, human name, size, " +
        "and a short sample). Use a preset's `key` in generate_password's " +
        "`requirements`.",
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    () => {
      const presets = listPresets();
      return {
        content: [{ type: "text", text: JSON.stringify(presets, null, 2) }],
        structuredContent: { presets },
      };
    },
  );

  return server;
}
