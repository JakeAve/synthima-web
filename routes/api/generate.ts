// routes/api/generate.ts
import type { Context } from "fresh";
import {
  ContradictoryRequirementsError,
  generatePasswords,
  ValidationError,
} from "../../lib/password-core.ts";
import { parseRequirements } from "../../lib/url-params.ts";

export const handler = {
  GET(ctx: Context<unknown>): Response {
    const url = new URL(ctx.req.url);
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
    const { requirements, length } = parseRequirements(params);

    let passwords: string[];
    try {
      passwords = generatePasswords({ length, count, requirements });
    } catch (e) {
      if (
        e instanceof ValidationError ||
        e instanceof ContradictoryRequirementsError
      ) {
        return Response.json({ error: e.message }, { status: 400 });
      }
      throw e;
    }

    if (format === "csv") {
      return new Response(passwords.join("\n"), {
        headers: { "Content-Type": "text/plain" },
      });
    }

    return Response.json(passwords);
  },
};
