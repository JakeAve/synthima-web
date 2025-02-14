import { IS_BROWSER } from "$fresh/runtime.ts";
import { genChars, level2CharSet, type Requirement } from "@jakeave/synthima";
import { computed, signal } from "@preact/signals";
import { CharSet } from "./CharSet.tsx";
import { CharLength } from "./CharLength.tsx";
import Passwords from "./Passwords.tsx";
import { Container } from "../components/Container.tsx";

const CHAR_LENGTH = 12;
const NUMBER_OF_PASSWORDS = 7;

const requirements = signal<Requirement[]>(
  level2CharSet,
);

const passwords = signal<string[]>(
  new Array(NUMBER_OF_PASSWORDS).fill("").map(() =>
    genChars(CHAR_LENGTH, requirements.value)
  ),
);

const charLength = signal<number>(CHAR_LENGTH);

function generate() {
  try {
    const reqs = requirements.value.filter((r) => !!r.charSet);
    passwords.value = new Array(NUMBER_OF_PASSWORDS).fill("").map(() =>
      genChars(charLength.value, [...reqs])
    );
  } catch {
    globalThis.alert(
      "Requirements are contradictory. Try making the Number of Characters higher.",
    );
  }
}

function add() {
  requirements.value = [...requirements.value, { charSet: "", min: 1 }];
}

const requirementElements = computed(() =>
  requirements.value.map((r, i) => (
    <CharSet key={i} reqSignal={requirements} index={i} {...r} />
  ))
);

export function Generator() {
  return (
    <>
      <Container
        bgColor="bg-neutral-50 dark:bg-neutral-800"
        class="min-h-[95dvh] flex flex-col"
      >
        <h1 class="w-full text-center mb-8 text-4xl lg:text-6xl">
          Synthima Password Generator
        </h1>
        <div class="grid grid-flow-row gap-8 content-center flex-1">
          <Passwords passwordsSignal={passwords} />
          <button
            disabled={!IS_BROWSER}
            class="px-4 py-2 bg-neutral-700 text-white rounded-sm justify-self-center text-2xl"
            onClick={generate}
          >
            Generate
          </button>
          <button
            class="text-center"
            onClick={() =>
              scrollBy({
                top: globalThis.innerHeight * .75,
                behavior: "smooth",
              })}
          >
            ⌄ Customize ⌄
          </button>
        </div>
      </Container>
      <Container
        bgColor="bg-neutral-200 dark:bg-neutral-500"
        class="flex flex-col gap-8"
      >
        <CharLength charLengthSignal={charLength} />
      </Container>
      <Container
        bgColor="bg-neutral-50 dark:bg-neutral-800"
        class="grid grid-flow-row gap-8"
      >
        <h2 class="text-4xl lg:text-6xl">Requirements</h2>
        <div class="grid gap-8 grid-cols-1 md:grid-cols-2">
          {requirementElements}
        </div>
        <button
          class="px-4 py-2 text-2xl bg-neutral-700 text-white rounded-sm justify-self-center"
          onClick={add}
        >
          Add requirement
        </button>
      </Container>
    </>
  );
}
