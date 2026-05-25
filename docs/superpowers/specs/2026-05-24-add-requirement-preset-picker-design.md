# Design: Add Requirement Preset Picker

## Overview

Replace the plain "Add requirement" button with a button that opens a searchable
dropdown picker. Users choose from ~80 preset character sets or add a blank
custom requirement. The character set library becomes the single source of truth
for all character sets in the app, including the existing SimpleControls
checkboxes.

---

## 1. Character Set Library (`lib/charsets.ts`)

A pure data module — no logic, no UI. Exports a typed array of all presets.

```ts
export interface CharSetPreset {
  name: string;
  charSet: string;
  category: string; // used for display grouping (not shown in filtered results)
}

export const CHAR_SET_PRESETS: CharSetPreset[] = [ ... ];

// Named exports for SimpleControls to import directly
export const PRESET_UPPERCASE = CHAR_SET_PRESETS.find(p => p.name === "Uppercase (A–Z)")!;
// ... etc
```

### Preset List (~80 entries)

**LATIN — Basic**

- Custom _(special entry, charSet: "")_
- Uppercase (A–Z)
- Lowercase (a–z)
- Numbers (0–9)
- Special (!@#$%^&*)

**LATIN — Extended by language**

- German uppercase (ÄÖÜ)
- German lowercase (äöüß)
- French uppercase (ÉÀÂÊÎÔÙÛÇŒÆ)
- French lowercase (éàâêîôùûçœæ)
- Spanish (ñÑ¿¡)
- Nordic uppercase (ÅÆØÐÞ)
- Nordic lowercase (åæøðþ)
- Central European uppercase (ČŠŽŘÝŮĚŇŤĎ + Polish ĄĆĘŁŃÓŚŹŻ)
- Central European lowercase (čšžřýůěňťď + ąćęłńóśźż)
- Romanian uppercase (ĂÂÎȘȚ)
- Romanian lowercase (ăâîșț)
- Turkish uppercase (ÇĞİŞÖÜ)
- Turkish lowercase (çğışöü)
- Portuguese (ãõáéíóúâêîôûàç + caps)
- Latin Extended (large pooled set: all of the above combined)

**SYMBOLS**

- Extended special (£€¥₹±×÷©®™…)
- Currency (£€¥₹₽₩₪₿¢)
- Math (±×÷≠≈∞∑∏√∫∂)
- Arrows (←→↑↓↔↗↘↙↖⇒⇐⇑⇓)
- Typographic («»„""''…†‡§¶•)
- Superscripts (⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ)
- Subscripts (₀₁₂₃₄₅₆₇₈₉)

**CYRILLIC**

- Russian uppercase (А–Я + Ё)
- Russian lowercase (а–я + ё)
- Ukrainian uppercase (А–Я + ЄІЇҐ)
- Ukrainian lowercase (а–я + єіїґ)
- Bulgarian uppercase
- Bulgarian lowercase
- Serbian Cyrillic uppercase (АБВГДЂЕЖЗИЈКЛЉМНЊОПРСТЋУФХЦЧЏШ)
- Serbian Cyrillic lowercase

**GREEK**

- Greek uppercase (ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ)
- Greek lowercase (αβγδεζηθικλμνξοπρστυφχψω + ς)

**ARABIC**

- Arabic letters (ا–ي, isolated forms)
- Arabic-Indic digits (٠١٢٣٤٥٦٧٨٩)
- Arabic punctuation (،؛؟...)

**HEBREW**

- Hebrew letters (א–ת)

**DEVANAGARI**

- Hindi consonants (क–ह)
- Hindi vowels (अ–औ + ं ः)

**EAST ASIAN**

- Common CJK (~3,500 most-used characters, HSK/Jōyō standard)
- Japanese Hiragana (あ–ん)
- Japanese Katakana (ア–ン)
- Korean Jamo consonants (ㄱ–ㅎ)
- Korean Jamo vowels (ㅏ–ㅣ)

**OTHER SCRIPTS**

- Georgian (ა–ჰ, Mkhedruli)
- Armenian uppercase (Ա–Փ)
- Armenian lowercase (ա–փ)
- Thai consonants (ก–ฮ)
- Thai vowels (า–์)

---

## 2. SimpleControls Refactor

`SimpleControls` currently hardcodes its four character strings. After this
change it imports the four basic presets from `lib/charsets.ts`:

```ts
import {
  PRESET_LOWERCASE,
  PRESET_NUMBERS,
  PRESET_SPECIAL,
  PRESET_UPPERCASE,
} from "../lib/charsets.ts";
```

`Generator.tsx` `PRESETS` map also pulls from the library. No behavior change —
just the strings move to one place.

---

## 3. Picker UI

### Trigger

"Add requirement" button unchanged in appearance. On click, opens the picker
dropdown.

### Bottom Sheet

- Slides up from the bottom of the screen, full viewport width
- Backdrop overlay behind it; tapping backdrop closes the sheet
- Search input at top (autofocused on open)
- Scrollable checklist below: **Custom** always first, then all presets filtered
  by name as user types
- Each row: checkbox + preset name + character count in parentheses e.g.
  `Russian lowercase (33)`
- Users can check multiple presets before confirming
- "Add X selected" button at the bottom (disabled when nothing checked); tapping
  it adds all checked presets as separate requirements, enters advanced mode,
  closes sheet
- Custom, when checked, adds one blank requirement
- Close on: "Add X selected", tap-backdrop, Escape key — unchecked selections
  are discarded on close
- On desktop the sheet still anchors to the bottom edge

### Component

`components/PresetPicker.tsx` renders the sheet, backdrop, search input,
checklist, and confirm button. Open/close state lives in `Generator.tsx` as a
signal passed down as a prop. Local state inside the component: search string
and set of checked preset names (reset on open).

```ts
const isPickerOpen = signal(false);

function addPresets(presets: CharSetPreset[]) {
  onDirectEdit();
  requirements.value = [
    ...requirements.value,
    ...presets.map((p) => ({ charSet: p.charSet, min: 1 })),
  ];
  isPickerOpen.value = false;
}
```

---

## 4. Files Changed

| File                            | Change                                                                     |
| ------------------------------- | -------------------------------------------------------------------------- |
| `lib/charsets.ts`               | New — full preset library                                                  |
| `components/SimpleControls.tsx` | Import basic presets from library                                          |
| `islands/Generator.tsx`         | Import presets, `add()` accepts charSet, picker open/close logic           |
| `components/PresetPicker.tsx`   | New component: search input + filtered list, receives props from Generator |

> `islands/CharSetDialog.tsx` already exists — read it before starting; it may
> be reusable or may need replacement. The picker itself is a plain component
> (not an island) since all reactive state lives in `Generator.tsx`.

---

## 5. Out of Scope

- Saving user-defined custom presets between sessions
- Grouped display in the picker (flat filtered list only)
- Emoji character sets
