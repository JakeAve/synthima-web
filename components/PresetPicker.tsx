// components/PresetPicker.tsx
import { useState } from "preact/hooks";
import { Signal } from "@preact/signals";
import { CHAR_SET_PRESETS, type CharSetPreset } from "../lib/charsets.ts";

interface Props {
  isOpen: Signal<boolean>;
  onAdd: (presets: CharSetPreset[]) => void;
}

export function PresetPicker({ isOpen, onAdd }: Props) {
  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState<Set<string>>(new Set());

  if (!isOpen.value) return null;

  const lower = query.trim().toLowerCase();
  const filtered = lower === ""
    ? CHAR_SET_PRESETS
    : CHAR_SET_PRESETS.filter((p) => p.name.toLowerCase().includes(lower));

  const showCustom = lower === "" || "custom".includes(lower);

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function handleAdd() {
    const selected: CharSetPreset[] = [];
    if (checked.has("__custom__")) {
      selected.push({ name: "Custom", charSet: "" });
    }
    CHAR_SET_PRESETS.forEach((p) => {
      if (checked.has(p.name)) selected.push(p);
    });
    onAdd(selected);
    setQuery("");
    setChecked(new Set());
  }

  function handleClose() {
    isOpen.value = false;
    setQuery("");
    setChecked(new Set());
  }

  const selectedCount = checked.size;

  return (
    <>
      {/* Backdrop */}
      <div
        class="fixed inset-0 bg-neutral-900/60 z-40"
        onClick={handleClose}
      />

      {/* Sheet */}
      <div class="fixed bottom-0 left-0 right-0 z-50 bg-neutral-50 dark:bg-neutral-800 rounded-t-2xl shadow-xl flex flex-col max-h-[75dvh]">
        {/* Header */}
        <div class="p-4 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-xl font-semibold">Add character set</h2>
            <button
              type="button"
              class="text-3xl leading-none px-2"
              onClick={handleClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <input
            type="search"
            placeholder="Search..."
            autoFocus
            class="w-full px-3 py-2 text-lg border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700"
            value={query}
            onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          />
        </div>

        {/* List */}
        <ul class="overflow-y-auto flex-1 p-2">
          {showCustom && (
            <li>
              <label class="flex items-center gap-3 px-3 py-3 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700">
                <input
                  type="checkbox"
                  class="w-6 h-6 flex-shrink-0"
                  checked={checked.has("__custom__")}
                  onChange={() => toggle("__custom__")}
                />
                <span class="text-lg flex-1">Custom</span>
              </label>
            </li>
          )}
          {filtered.map((preset) => (
            <li key={preset.name}>
              <label class="flex items-center gap-3 px-3 py-3 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700">
                <input
                  type="checkbox"
                  class="w-6 h-6 flex-shrink-0"
                  checked={checked.has(preset.name)}
                  onChange={() => toggle(preset.name)}
                />
                <span class="text-lg flex-1">{preset.name}</span>
                <span class="text-sm text-neutral-500 dark:text-neutral-400 flex-shrink-0">
                  ({preset.charSet.length})
                </span>
              </label>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div class="p-4 border-t border-neutral-200 dark:border-neutral-700 flex-shrink-0">
          <button
            type="button"
            disabled={selectedCount === 0}
            class="w-full py-3 text-xl bg-neutral-700 text-white rounded-sm disabled:opacity-40"
            onClick={handleAdd}
          >
            {selectedCount === 0
              ? "Select a character set"
              : `Add ${selectedCount} selected`}
          </button>
        </div>
      </div>
    </>
  );
}
