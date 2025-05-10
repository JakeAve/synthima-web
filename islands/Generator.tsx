import { IS_BROWSER } from "$fresh/runtime.ts";
import { genChars, type Requirement } from "@jakeave/synthima";
import { computed, signal } from "@preact/signals";
import { CharSet } from "./CharSet.tsx";
import { CharLength } from "./CharLength.tsx";
import Passwords from "./Passwords.tsx";
import { Container } from "../components/Container.tsx";

const NUMBER_OF_PASSWORDS = 7;

interface Props {
  requirements: Requirement[];
  length: number;
}

export function Generator(props: Props) {
  const { requirements: requirementsArg, length: lengthArg } = props;

  const requirements = signal<Requirement[]>(
    requirementsArg,
  );

  const charLength = signal<number>(lengthArg);

  const passwords = signal<string[]>(
    new Array(NUMBER_OF_PASSWORDS).fill("").map(() =>
      genChars(lengthArg, requirementsArg)
    ),
  );

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
          type="button"
          class="px-4 py-2 text-2xl bg-neutral-700 text-white rounded-sm justify-self-center"
          onClick={add}
        >
          Add requirement
        </button>
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
