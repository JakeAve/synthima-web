// routes/api/generate.ts
import type { FreshContext } from "fresh";
import { genChars, type Requirement } from "@jakeave/synthima";
import {
  PRESET_LOWERCASE,
  PRESET_NUMBERS,
  PRESET_SPECIAL,
  PRESET_UPPERCASE,
} from "../../lib/charsets.ts";
import { parseRequirements } from "../../lib/url-params.ts";

const DEFAULT_REQUIREMENTS: Requirement[] = [
  { charSet: PRESET_UPPERCASE.charSet, min: 1 },
  { charSet: PRESET_LOWERCASE.charSet, min: 1 },
  { charSet: PRESET_NUMBERS.charSet, min: 1 },
  { charSet: PRESET_SPECIAL.charSet, min: 1 },
];

export const handlers = {
  GET(req: Request, _ctx: FreshContext): Response {
    const url = new URL(req.url);
    const params = url.searchParams;

    const format = params.get("format") ?? "json";
    if (format !== "json" && format !== "csv") {
      return Response.json(
        { error: "format must be json or csv" },
        { status: 400 },
      );
    }

    const rawCount = params.get("count");
    const count = rawCount !== null ? Number(rawCount) : 1;
    if (isNaN(count) || !Number.isInteger(count) || count < 1 || count > 100) {
      return Response.json(
        { error: "count must be between 1 and 100" },
        { status: 400 },
      );
    }

    const { requirements: parsed, length } = parseRequirements(params);
    const requirements = parsed.length > 0 ? parsed : DEFAULT_REQUIREMENTS;

    const passwords: string[] = [];
    for (let i = 0; i < count; i++) {
      passwords.push(genChars(length, requirements));
    }

    if (format === "csv") {
      return new Response(passwords.join("\n"), {
        headers: { "Content-Type": "text/plain" },
      });
    }

    return Response.json(passwords);
  },
};
