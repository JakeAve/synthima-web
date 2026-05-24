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
  return (
    <div class="flex flex-col gap-4">
      <div
        class={`grid grid-cols-2 gap-3${
          isAdvancedMode.value ? " opacity-50" : ""
        }`}
      >
        {KEYS.map((key) => (
          <label key={key} class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={simpleChecks.value[key]}
              disabled={isAdvancedMode.value}
              onChange={() =>
                onToggle(key)}
              class="w-4 h-4"
            />
            <span>{LABELS[key]}</span>
          </label>
        ))}
      </div>
      {isAdvancedMode.value && (
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
            aria-label="Reset to simple mode"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
