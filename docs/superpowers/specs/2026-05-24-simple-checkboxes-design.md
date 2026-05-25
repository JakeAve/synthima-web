# Simple Checkboxes Design

**Date:** 2026-05-24\
**Status:** Approved

## Overview

Add familiar password generator controls (uppercase, lowercase, numbers, special
characters checkboxes) above the existing Requirements section. The two sections
share the same `requirements` signal. Editing the Advanced section directly
locks the checkboxes; a Reset button restores defaults.

## State & Data Model

Two new signals in `Generator.tsx`:

```ts
isAdvancedMode: Signal<boolean>; // starts false
simpleChecks: Signal<{
  uppercase: boolean; // starts true
  lowercase: boolean; // starts true
  numbers: boolean; // starts true
  special: boolean; // starts true
}>;
```

Four fixed preset constants (not state):

```ts
PRESETS = {
  uppercase: { charSet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", min: 1 },
  lowercase: { charSet: "abcdefghijklmnopqrstuvwxyz", min: 1 },
  numbers: { charSet: "0123456789", min: 1 },
  special: { charSet: "!@#$%^&*", min: 1 },
};
```

When `isAdvancedMode` is false, `requirements` is always the array of presets
whose checkbox is checked. Toggling a checkbox rebuilds `requirements`
immediately. When `isAdvancedMode` is true, `requirements` is managed freely by
the Advanced section.

## Components

### New: `islands/SimpleControls.tsx`

Renders 4 labeled checkboxes. Props:

- `simpleChecks` signal
- `isAdvancedMode` signal
- `onToggle(key: string)` callback
- `onReset()` callback

**Normal state:** 4 interactive checkboxes.

**Locked state** (`isAdvancedMode === true`):

- Checkboxes disabled, reduced opacity
- Message below: `"Using advanced configuration"` with an `<a href="#advanced">`
  inline anchor
- Reset button inline with message (small, consistent with app styling)

### Modified: `Generator.tsx`

- Add `isAdvancedMode` and `simpleChecks` signals
- Add `PRESETS` constants
- Add `onToggle(key)`: flips `simpleChecks[key]`, rebuilds `requirements` from
  checked presets
- Add `onReset()`: sets `isAdvancedMode = false`, all `simpleChecks = true`,
  rebuilds `requirements` from all four presets
- Pass `onDirectEdit` callback to the Requirements section
- Render `<SimpleControls>` between the length section and the Requirements
  section
- Add `id="advanced"` to the Requirements section heading

### Modified: `CharSet.tsx`

- Accept `onDirectEdit` callback prop
- Fire `onDirectEdit` on any change: charSet textarea, min input, max input

### Modified: `Generator.tsx` (Requirements list handlers)

- "Add requirement" click → call `onDirectEdit` before adding row
- Delete button click → call `onDirectEdit` before removing row

## Lock Detection

Any of these actions triggers `isAdvancedMode = true`:

- Typing in a charSet textarea
- Changing a min or max input
- Clicking "Add requirement"
- Clicking delete on a requirement row

Once locked, checkboxes remain disabled until Reset is clicked.

## Reset Behavior

Reset always restores the full defaults — not last simple state:

1. `isAdvancedMode` → false
2. `simpleChecks` → all four true
3. `requirements` → all four presets

## Out of Scope

- URL params integration (deferred to follow-up)
