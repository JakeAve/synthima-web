// lib/password-core.ts
//
// Transport-agnostic password generation. The REST route, the stdio MCP entry
// point, and the remote /mcp route all funnel through here so validation and
// defaults live in exactly one place.

import { genChars, type Requirement } from "@jakeave/synthima";
import {
  CHAR_SET_PRESETS,
  PRESET_LOWERCASE,
  PRESET_NUMBERS,
  PRESET_SPECIAL,
  PRESET_UPPERCASE,
} from "./charsets.ts";

export const MIN_LENGTH = 1;
export const MAX_LENGTH = 256;
export const DEFAULT_LENGTH = 12;
export const MIN_COUNT = 1;
export const MAX_COUNT = 100;
export const DEFAULT_COUNT = 1;

/** Applied when the caller supplies no requirements of their own. */
export const DEFAULT_REQUIREMENTS: Requirement[] = [
  { charSet: PRESET_UPPERCASE.charSet, min: 1 },
  { charSet: PRESET_LOWERCASE.charSet, min: 1 },
  { charSet: PRESET_NUMBERS.charSet, min: 1 },
  { charSet: PRESET_SPECIAL.charSet, min: 1 },
];

/** Bad caller input (bounds, unknown preset). Maps to a 400 / tool error. */
export class ValidationError extends Error {
  override name = "ValidationError";
}

/** Requirements that cannot be satisfied for the requested length. */
export class ContradictoryRequirementsError extends Error {
  override name = "ContradictoryRequirementsError";
}

const PRESET_KEY_MAP = new Map(CHAR_SET_PRESETS.map((p) => [p.key, p]));

/**
 * A single requirement as supplied by an MCP caller: either a preset `key`
 * (resolved against the charset catalog) or a literal `charSet`, with optional
 * min/max occurrence counts.
 */
export interface RequirementInput {
  preset?: string;
  charSet?: string;
  min?: number;
  max?: number;
}

export interface GenerateOptions {
  length?: number;
  count?: number;
  /** Already-resolved requirements. Omit/empty to use DEFAULT_REQUIREMENTS. */
  requirements?: Requirement[];
}

/**
 * Turn caller-friendly RequirementInput objects (preset keys or literal
 * charsets) into the synthima Requirement shape. Throws ValidationError for
 * unknown preset keys or items specifying neither a preset nor a charSet.
 */
export function resolveRequirements(
  inputs: RequirementInput[],
): Requirement[] {
  return inputs.map((input, i) => {
    let charSet: string;
    if (input.preset !== undefined) {
      const preset = PRESET_KEY_MAP.get(input.preset);
      if (!preset) {
        throw new ValidationError(
          `Unknown preset "${input.preset}" at requirements[${i}]. ` +
            `Call list_charset_presets for valid keys.`,
        );
      }
      charSet = preset.charSet;
    } else if (input.charSet !== undefined && input.charSet.length > 0) {
      charSet = input.charSet;
    } else {
      throw new ValidationError(
        `requirements[${i}] must specify either "preset" or a non-empty "charSet".`,
      );
    }

    const req: Requirement = { charSet, min: input.min ?? 1 };
    if (input.max !== undefined) req.max = input.max;
    return req;
  });
}

function validateBounds(length: number, count: number): void {
  if (
    isNaN(count) || !Number.isInteger(count) || count < MIN_COUNT ||
    count > MAX_COUNT
  ) {
    throw new ValidationError(
      `count must be between ${MIN_COUNT} and ${MAX_COUNT}`,
    );
  }
  if (isNaN(length) || length < MIN_LENGTH || length > MAX_LENGTH) {
    throw new ValidationError(
      `length must be between ${MIN_LENGTH} and ${MAX_LENGTH}`,
    );
  }
}

/**
 * Generate `count` passwords of the given `length` satisfying `requirements`.
 *
 * @throws {ValidationError} length/count out of bounds.
 * @throws {ContradictoryRequirementsError} requirements impossible for length.
 */
export function generatePasswords(opts: GenerateOptions): string[] {
  const length = opts.length ?? DEFAULT_LENGTH;
  const count = opts.count ?? DEFAULT_COUNT;
  validateBounds(length, count);

  const requirements = opts.requirements && opts.requirements.length > 0
    ? opts.requirements
    : DEFAULT_REQUIREMENTS;

  const passwords: string[] = [];
  try {
    for (let i = 0; i < count; i++) {
      passwords.push(genChars(length, requirements));
    }
  } catch {
    // synthima throws RangeError when minimums/maximums can't fit the length.
    throw new ContradictoryRequirementsError(
      "Requirements are contradictory for the given length",
    );
  }
  return passwords;
}

export interface PresetInfo {
  key: string;
  name: string;
  /** Number of characters (code points) in the set. */
  size: number;
  /** A short preview of the set's characters. */
  sample: string;
}

const SAMPLE_CHARS = 12;

/** The charset catalog, summarized for discovery by an MCP client. */
export function listPresets(): PresetInfo[] {
  return CHAR_SET_PRESETS.map((p) => {
    const chars = [...p.charSet];
    return {
      key: p.key,
      name: p.name,
      size: chars.length,
      sample: chars.slice(0, SAMPLE_CHARS).join(""),
    };
  });
}
