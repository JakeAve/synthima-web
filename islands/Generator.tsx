import { IS_BROWSER } from "fresh/runtime";
import { genChars, type Requirement } from "@jakeave/synthima";
import { computed, effect, signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { CharSet } from "../components/CharSet.tsx";
import { CharLength } from "./CharLength.tsx";
import Passwords from "./Passwords.tsx";
import { SimpleControls } from "../components/SimpleControls.tsx";
import { Container } from "../components/Container.tsx";
import {
  type CharSetPreset,
  PRESET_LOWERCASE,
  PRESET_NUMBERS,
  PRESET_SPECIAL,
  PRESET_UPPERCASE,
} from "../lib/charsets.ts";
import { PresetPicker } from "../components/PresetPicker.tsx";
import { serializeRequirements } from "../lib/url-params.ts";

const NUMBER_OF_PASSWORDS = 7;

type PresetKey = "uppercase" | "lowercase" | "numbers" | "special";

const PRESET_KEYS: PresetKey[] = [
  "uppercase",
  "lowercase",
  "numbers",
  "special",
];

const PRESETS: Record<PresetKey, Requirement> = {
  uppercase: { charSet: PRESET_UPPERCASE.charSet, min: 1 },
  lowercase: { charSet: PRESET_LOWERCASE.charSet, min: 1 },
  numbers: { charSet: PRESET_NUMBERS.charSet, min: 1 },
  special: { charSet: PRESET_SPECIAL.charSet, min: 1 },
};

const BASIC_CHARSET_SET = new Set(
  PRESET_KEYS.map((k) => PRESETS[k].charSet),
);

interface Props {
  length: number;
  requirements: Requirement[];
}

export function Generator(props: Props) {
  const { length: lengthArg, requirements: requirementsArg } = props;

  // Empty requirements (no URL params) = simple mode with all defaults on.
  // All-basic requirements = simple mode with matching toggles.
  const isSimple = requirementsArg.length === 0 ||
    requirementsArg.every((r) => BASIC_CHARSET_SET.has(r.charSet));

  const initialSimpleChecks: Record<PresetKey, boolean> = {
    uppercase: false,
    lowercase: false,
    numbers: false,
    special: false,
  };
  if (requirementsArg.length === 0) {
    for (const k of PRESET_KEYS) initialSimpleChecks[k] = true;
  } else if (isSimple) {
    for (const r of requirementsArg) {
      for (const k of PRESET_KEYS) {
        if (PRESETS[k].charSet === r.charSet) initialSimpleChecks[k] = true;
      }
    }
  }

  const isAdvancedMode = signal<boolean>(!isSimple);
  const isPickerOpen = signal<boolean>(false);
  const simpleChecks = signal<Record<PresetKey, boolean>>(initialSimpleChecks);

  const initReqs = requirementsArg.length > 0
    ? requirementsArg
    : PRESET_KEYS.map((k) => PRESETS[k]);

  const requirements = signal<Requirement[]>(initReqs);
  const charLength = signal<number>(lengthArg);

  const passwords = signal<string[]>(
    new Array(NUMBER_OF_PASSWORDS).fill("").map(() =>
      genChars(lengthArg, initReqs)
    ),
  );

  // Live URL sync — runs whenever requirements or charLength change
  useEffect(() => {
    return effect(() => {
      const params = serializeRequirements(requirements.value, charLength.value);
      globalThis.history?.replaceState(null, "", "?" + params.toString());
    });
  }, []);

  function generate() {
    try {
      const reqs = requirements.value.filter((r) => !!r.charSet);
      if (reqs.length === 0) {
        globalThis.alert("Select at least one character set.");
        return;
      }
      passwords.value = new Array(NUMBER_OF_PASSWORDS).fill("").map(() =>
        genChars(charLength.value, [...reqs])
      );
    } catch {
      globalThis.alert(
        "Requirements are contradictory. Try making the Number of Characters higher.",
      );
    }
  }

  function onToggle(key: PresetKey) {
    const checks = { ...simpleChecks.value, [key]: !simpleChecks.value[key] };
    simpleChecks.value = checks;
    requirements.value = PRESET_KEYS.filter((k) => checks[k]).map((k) =>
      PRESETS[k]
    );
  }

  function onReset() {
    isAdvancedMode.value = false;
    simpleChecks.value = {
      uppercase: true,
      lowercase: true,
      numbers: true,
      special: true,
    };
    requirements.value = PRESET_KEYS.map((k) => PRESETS[k]);
  }

  function onDirectEdit() {
    isAdvancedMode.value = true;
  }

  function addPresets(presets: CharSetPreset[]) {
    if (presets.length === 0) return;
    onDirectEdit();
    requirements.value = [
      ...requirements.value,
      ...presets.map((p) => ({ charSet: p.charSet, min: 1 })),
    ];
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") isPickerOpen.value = false;
    };
    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
  }, []);

  const requirementElements = computed(() =>
    requirements.value.map((r, i) => (
      <CharSet
        key={i}
        reqSignal={requirements}
        index={i}
        onDirectEdit={onDirectEdit}
        {...r}
      />
    ))
  );

  return (
    <>
      <Container
        bgColor="bg-neutral-50 dark:bg-neutral-800"
        class="min-h-[95dvh] flex flex-col"
      >
        <h1 class="w-full text-center mb-8 text-4xl lg:text-6xl">
          Synthima <br />
          <span class="text-base tracking-widest">Password Generator</span>
        </h1>
        <div class="grid grid-flow-row gap-8 content-center flex-1">
          <Passwords passwordsSignal={passwords} />
          <button
            type="button"
            disabled={!IS_BROWSER}
            class="px-4 py-2 bg-neutral-700 text-white rounded-sm justify-self-center text-2xl"
            onClick={generate}
          >
            Generate
          </button>
          <button
            type="button"
            class="text-center"
            onClick={() =>
              scrollBy({
                top: globalThis.innerHeight * .75,
                behavior: "smooth",
              })}
          >
            ⌄ Configure ⌄
          </button>
        </div>
      </Container>
      <Container
        bgColor="bg-neutral-200 dark:bg-neutral-500"
        class="flex flex-col gap-8"
      >
        <h2 class="text-4xl lg:text-6xl">Configuration</h2>
        <CharLength charLengthSignal={charLength} />
        <SimpleControls
          simpleChecks={simpleChecks}
          isAdvancedMode={isAdvancedMode}
          onToggle={onToggle}
          onReset={onReset}
        />
      </Container>
      <Container
        bgColor="bg-neutral-50 dark:bg-neutral-800"
        class="grid grid-flow-row gap-8"
      >
        <h2 id="advanced" class="text-4xl lg:text-6xl">Advanced</h2>
        <div class="grid gap-8 grid-cols-1 md:grid-cols-2">
          {requirementElements}
        </div>
        <button
          type="button"
          class="px-4 py-2 text-2xl bg-neutral-700 text-white rounded-sm justify-self-center"
          onClick={() => {
            isPickerOpen.value = true;
          }}
        >
          Add requirement
        </button>
        <PresetPicker
          isOpen={isPickerOpen}
          onAdd={(presets) => {
            addPresets(presets);
            isPickerOpen.value = false;
          }}
        />
      </Container>
      <Container
        bgColor="bg-neutral-200 dark:bg-neutral-500"
        class="flex flex-col gap-8"
      >
        <div class="grid place-content-center">
          &copy; {new Date().getFullYear()} Synthima Password Generator
        </div>
      </Container>
    </>
  );
}
