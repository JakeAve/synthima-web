// lib/url-params.ts

import { type Requirement } from "@jakeave/synthima";
import { CHAR_SET_PRESETS } from "./charsets.ts";

const PRESET_KEY_MAP = new Map(
  CHAR_SET_PRESETS.map((p) => [p.key, p]),
);

const CHARSET_TO_KEY_MAP = new Map(
  CHAR_SET_PRESETS.map((p) => [p.charSet, p.key]),
);

/** A usable min/max count: a non-negative integer, else undefined. */
function toCount(text: string | undefined): number | undefined {
  if (text === undefined || text.trim() === "") return undefined;
  const n = Number(text);
  return Number.isInteger(n) && n >= 0 ? n : undefined;
}

export function parseRequirements(
  params: URLSearchParams,
): { requirements: Requirement[]; length: number } {
  const lengthStr = params.get("length");
  const raw = lengthStr !== null ? Number(lengthStr) : NaN;
  const length = isNaN(raw) ? 12 : raw;

  const requirements: Requirement[] = [];
  for (const raw of params.getAll("r")) {
    if (!raw) continue;
    const parts = raw.split(":");
    const preset = PRESET_KEY_MAP.get(parts[0]);
    if (preset) {
      const max = toCount(parts[2]);
      requirements.push({
        charSet: preset.charSet,
        min: toCount(parts[1]) ?? 1,
        ...(max !== undefined ? { max } : {}),
      });
    } else {
      requirements.push({ charSet: raw, min: 1 });
    }
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
    const presetKey = CHARSET_TO_KEY_MAP.get(req.charSet);
    if (presetKey) {
      const min = req.min ?? 1;
      const max = req.max;
      let value = presetKey;
      if (min !== 1 || max !== undefined) {
        value += `:${min}`;
        if (max !== undefined) value += `:${max}`;
      }
      params.append("r", value);
    } else {
      params.append("r", req.charSet);
    }
  }

  return params;
}
