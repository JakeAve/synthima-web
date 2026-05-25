// lib/url-params.ts

import { type Requirement } from "@jakeave/synthima";
import { CHAR_SET_PRESETS } from "./charsets.ts";

const PRESET_KEY_MAP = new Map(
  CHAR_SET_PRESETS.map((p) => [p.key, p]),
);

const CHARSET_TO_KEY_MAP = new Map(
  CHAR_SET_PRESETS.map((p) => [p.charSet, p.key]),
);

export function parseRequirements(
  params: URLSearchParams,
): { requirements: Requirement[]; length: number } {
  const length = Number(params.get("length")) || 12;

  const requirements: Requirement[] = [];
  for (const raw of params.getAll("r")) {
    if (!raw) continue;
    const [keyOrChars, minStr, maxStr] = raw.split(":");
    const preset = PRESET_KEY_MAP.get(keyOrChars);
    const charSet = preset ? preset.charSet : keyOrChars;
    if (!charSet) continue;
    const min = minStr !== undefined ? Number(minStr) : 1;
    const max = maxStr !== undefined ? Number(maxStr) : undefined;
    requirements.push({
      charSet,
      min: isNaN(min) ? 1 : min,
      ...(max !== undefined && !isNaN(max) ? { max } : {}),
    });
  }

  return { requirements, length };
}

export function serializeRequirements(
  requirements: Requirement[],
  length: number,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("length", String(length));

  for (const req of requirements) {
    if (!req.charSet) continue;
    const key = CHARSET_TO_KEY_MAP.get(req.charSet) ?? req.charSet;
    const min = req.min ?? 1;
    const max = req.max;
    let value = key;
    if (min !== 1 || max !== undefined) {
      value += `:${min}`;
      if (max !== undefined) value += `:${max}`;
    }
    params.append("r", value);
  }

  return params;
}
