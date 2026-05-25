# Simple Checkboxes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four familiar checkboxes (uppercase, lowercase, numbers, special
chars) above the Advanced requirements section, with lock + reset behavior when
the user edits Advanced directly.

**Architecture:** New `SimpleControls` island owns the checkbox UI.
`Generator.tsx` owns all new state (`isAdvancedMode`, `simpleChecks`) and
handlers (`onToggle`, `onReset`, `onDirectEdit`). `CharSet.tsx` accepts an
optional `onDirectEdit` callback fired on every field change and delete — this
is how Generator knows the user went off-script. SimpleControls and the Advanced
section share the same `requirements` signal already managed by Generator.

**Tech Stack:** Preact 10, @preact/signals 2, Fresh 2, Tailwind CSS 4, Deno

---

## File Map

| Action | File                         | Responsibility                                                                        |
| ------ | ---------------------------- | ------------------------------------------------------------------------------------- |
| Create | `islands/SimpleControls.tsx` | Renders 4 checkboxes; shows locked state with message, anchor, Reset                  |
| Modify | `islands/CharSet.tsx`        | Accept + fire `onDirectEdit` on all field changes and delete                          |
| Modify | `islands/Generator.tsx`      | Add PRESETS, signals, handlers; render SimpleControls; rename Requirements → Advanced |

---

### Task 1: Add `onDirectEdit` callback to `CharSet.tsx`

**Files:**

- Modify: `islands/CharSet.tsx`

- [ ] **Step 1: Add `onDirectEdit` to the Props interface**

In `islands/CharSet.tsx`, update the `Props` interface (lines 5–8):

```tsx
interface Props extends Requirement {
  reqSignal: Signal<Requirement[]>;
  index: number;
  onDirectEdit?: () => void;
}
```

- [ ] **Step 2: Fire `onDirectEdit` in the delete button**

Update the delete button's `onClick` (currently line 21). Call
`props.onDirectEdit?.()` after `confirm` returns true, before the splice:

```tsx
onClick={() => {
  const confirmed = globalThis.confirm(
    "Are you sure you want to delete this requirement?",
  );
  if (confirmed) {
    props.onDirectEdit?.();
    const arr = [...reqSignal.value];
    arr.splice(index, 1);
    reqSignal.value = arr;
  }
}}
```

- [ ] **Step 3: Fire `onDirectEdit` in the charSet textarea `onChange`**

Update the textarea `onChange` (currently line 48):

```tsx
onChange={(e: JSX.TargetedInputEvent<HTMLTextAreaElement>) => {
  props.onDirectEdit?.();
  const text = e.currentTarget.value;
  const arr = reqSignal.peek();
  arr[index].charSet = text;
  reqSignal.value = arr;
}}
```

- [ ] **Step 4: Fire `onDirectEdit` in the min input `onChange`**

Update the min input `onChange` (currently line 67):

```tsx
onChange={(e: JSX.TargetedInputEvent<HTMLInputElement>) => {
  props.onDirectEdit?.();
  const text = e.currentTarget.value;
  const arr = reqSignal.peek();
  arr[index].min = Number(text);
  reqSignal.value = arr;
}}
```

- [ ] **Step 5: Fire `onDirectEdit` in the max input `onChange`**

Update the max input `onChange` (currently line 89):

```tsx
onChange={(e: JSX.TargetedInputEvent<HTMLInputElement>) => {
  props.onDirectEdit?.();
  const text = e.currentTarget.value;
  const arr = reqSignal.peek();
  arr[index].max = Number(text);
  reqSignal.value = arr;
}}
```

- [ ] **Step 6: Type-check**

```bash
deno check islands/CharSet.tsx
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add islands/CharSet.tsx
git commit -m "feat: add onDirectEdit callback to CharSet"
```

---

### Task 2: Create `islands/SimpleControls.tsx`

**Files:**

- Create: `islands/SimpleControls.tsx`

- [ ] **Step 1: Write the component**

Create `islands/SimpleControls.tsx` with this content:

```tsx
import { Signal } from "@preact/signals";

type PresetKey = "uppercase" | "lowercase" | "numbers" | "special";

interface Props {
  simpleChecks: Signal<Record<PresetKey, boolean>>;
  isAdvancedMode: Signal<boolean>;
  onToggle: (key: PresetKey) => void;
  onReset: () => void;
}

const LABELS: Record<PresetKey, string> = {
  uppercase: "Uppercase (A–Z)",
  lowercase: "Lowercase (a–z)",
  numbers: "Numbers (0–9)",
  special: "Special characters (!@#$%^&*)",
};

const KEYS: PresetKey[] = ["uppercase", "lowercase", "numbers", "special"];

export function SimpleControls(
  { simpleChecks, isAdvancedMode, onToggle, onReset }: Props,
) {
  const locked = isAdvancedMode.value;

  return (
    <div class="flex flex-col gap-4">
      <div class={`grid grid-cols-2 gap-3${locked ? " opacity-50" : ""}`}>
        {KEYS.map((key) => (
          <label key={key} class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={simpleChecks.value[key]}
              disabled={locked}
              onChange={() =>
                onToggle(key)}
              class="w-4 h-4"
            />
            <span>{LABELS[key]}</span>
          </label>
        ))}
      </div>
      {locked && (
        <div class="flex items-center gap-3 text-sm">
          <span>
            Using{" "}
            <a href="#advanced" class="underline">
              advanced configuration
            </a>
          </span>
          <button
            type="button"
            class="px-3 py-1 bg-neutral-700 text-white rounded-sm text-sm"
            onClick={onReset}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
deno check islands/SimpleControls.tsx
```

Expected: no errors.

---

### Task 3: Update `Generator.tsx`

**Files:**

- Modify: `islands/Generator.tsx`

- [ ] **Step 1: Add imports and constants at the top of the file**

After the existing imports, add the `SimpleControls` import and the PRESETS
constants. Replace the top section of `Generator.tsx` (lines 1–14) with:

```tsx
import { IS_BROWSER } from "fresh/runtime";
import { genChars, type Requirement } from "@jakeave/synthima";
import { computed, signal } from "@preact/signals";
import { CharSet } from "./CharSet.tsx";
import { CharLength } from "./CharLength.tsx";
import Passwords from "./Passwords.tsx";
import { SimpleControls } from "./SimpleControls.tsx";
import { Container } from "../components/Container.tsx";

const NUMBER_OF_PASSWORDS = 7;

type PresetKey = "uppercase" | "lowercase" | "numbers" | "special";

const PRESET_KEYS: PresetKey[] = [
  "uppercase",
  "lowercase",
  "numbers",
  "special",
];

const PRESETS: Record<PresetKey, Requirement> = {
  uppercase: { charSet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", min: 1 },
  lowercase: { charSet: "abcdefghijklmnopqrstuvwxyz", min: 1 },
  numbers: { charSet: "0123456789", min: 1 },
  special: { charSet: "!@#$%^&*", min: 1 },
};

interface Props {
  requirements: Requirement[];
  length: number;
}
```

- [ ] **Step 2: Replace the Generator function body with the full updated
      version**

Replace everything from `export function Generator` to the end of the file with:

```tsx
export function Generator(props: Props) {
  const { length: lengthArg } = props;

  const isAdvancedMode = signal<boolean>(false);
  const simpleChecks = signal<Record<PresetKey, boolean>>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true,
  });

  const requirements = signal<Requirement[]>(
    PRESET_KEYS.map((k) => PRESETS[k]),
  );

  const charLength = signal<number>(lengthArg);

  const passwords = signal<string[]>(
    new Array(NUMBER_OF_PASSWORDS).fill("").map(() =>
      genChars(lengthArg, PRESET_KEYS.map((k) => PRESETS[k]))
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

  function add() {
    onDirectEdit();
    requirements.value = [...requirements.value, { charSet: "", min: 1 }];
  }

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
        <SimpleControls
          simpleChecks={simpleChecks}
          isAdvancedMode={isAdvancedMode}
          onToggle={onToggle}
          onReset={onReset}
        />
        <h2 id="advanced" class="text-4xl lg:text-6xl">Advanced</h2>
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
```

- [ ] **Step 3: Full type-check**

```bash
deno task check
```

Expected: `Checked N files` with no errors, no lint warnings.

- [ ] **Step 4: Build and start the dev server**

```bash
deno task dev
```

Open `http://localhost:5173` in a browser.

- [ ] **Step 5: Verify — initial state**

Confirm all four checkboxes are checked: Uppercase (A–Z), Lowercase (a–z),
Numbers (0–9), Special characters (!@#$%^&*). Confirm the Advanced section shows
four corresponding requirement rows. Confirm no lock message is visible.

- [ ] **Step 6: Verify — unchecking a checkbox**

Uncheck "Numbers (0–9)". Confirm the corresponding requirement row disappears
from Advanced. Re-check it — row reappears.

- [ ] **Step 7: Verify — editing Advanced locks the checkboxes**

Type a character in any charSet textarea in the Advanced section. Confirm the
four checkboxes become disabled (grayed out). Confirm the message "Using
advanced configuration" appears with an underlined link. Confirm a "Reset"
button appears beside the message.

- [ ] **Step 8: Verify — anchor link**

Click the "advanced configuration" link. Confirm the page scrolls to the
Advanced heading.

- [ ] **Step 9: Verify — Reset restores defaults**

With checkboxes locked, click Reset. Confirm checkboxes re-enable with all four
checked. Confirm Advanced shows the four default requirement rows.

- [ ] **Step 10: Verify — Add requirement locks checkboxes**

From clean state (all four checked), click "Add requirement". Confirm checkboxes
become locked immediately.

- [ ] **Step 11: Verify — Delete locks checkboxes**

From clean state, click the garbage icon on a requirement row and confirm the
delete. Confirm checkboxes become locked.

- [ ] **Step 12: Commit**

```bash
git add islands/SimpleControls.tsx islands/Generator.tsx
git commit -m "feat: add simple checkboxes with advanced lock and reset"
```
