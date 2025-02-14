import { type Requirement } from "@jakeave/synthima";
import { Signal } from "@preact/signals";
import { type JSX } from "preact/jsx-runtime";

interface Props extends Requirement {
  reqSignal: Signal<Requirement[]>;
  index: number;
}

export function CharSet(props: Props) {
  const { reqSignal, index } = props;

  const uuid = crypto.randomUUID();

  return (
    <div class="flex flex-row gap-2 w-full items-center text-lg">
      <button
        aria-label="Remove requirement"
        onClick={() => {
          const confirmed = globalThis.confirm(
            "Are you sure you want to delete this requirement?",
          );
          if (confirmed) {
            const arr = [...reqSignal.value];
            arr.splice(index, 1);
            reqSignal.value = arr;
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
          alt="garbage can"
        >
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
        </svg>
      </button>
      <form class="grid grid-cols-2 gap-1 bg-neutral-200 dark:bg-neutral-700 rounded-md px-4 py-2 flex-grow">
        <label class="col-span-2" for={`chars-${uuid}`}>Characters</label>
        <textarea
          class="col-span-2 border bg-neutral-50 dark:bg-neutral-600 border-neutral-300 dark:border-neutral-700 px-2 py-1 w-full resize-none"
          id={`chars-${uuid}`}
          value={reqSignal.value[index].charSet || ""}
          onChange={(e: JSX.TargetedInputEvent<HTMLTextAreaElement>) => {
            const text = e.currentTarget.value;
            const arr = reqSignal.peek();
            arr[index].charSet = text;
            reqSignal.value = arr;
          }}
        />
        <div class="flex flex-row gap-2 items-center">
          <label for={`min-${uuid}`}>Min</label>
          <input
            class="w-12 p-1 bg-neutral-50 dark:bg-neutral-600 border border-neutral-300 dark:border-neutral-700"
            id={`max-${uuid}`}
            type="number"
            step="1"
            min="0"
            placeholder="1"
            pattern="[0-9]*"
            inputmode="numeric"
            value={reqSignal.value[index].min || ""}
            onChange={(e: JSX.TargetedInputEvent<HTMLInputElement>) => {
              const text = e.currentTarget.value;
              const arr = reqSignal.peek();
              arr[index].min = Number(text);
              reqSignal.value = arr;
            }}
          />
        </div>
        <div class="flex flex-row gap-2 items-center">
          <label for={`max-${uuid}`}>
            Max
          </label>
          <input
            class="w-12 p-1 bg-neutral-50 border dark:bg-neutral-600 border-neutral-300 dark:border-neutral-700"
            id={`max-${uuid}`}
            type="number"
            step="1"
            min="0"
            placeholder="∞"
            pattern="[0-9]*"
            inputmode="numeric"
            value={reqSignal.value[index].max || ""}
            onChange={(e: JSX.TargetedInputEvent<HTMLInputElement>) => {
              const text = e.currentTarget.value;
              const arr = reqSignal.peek();
              arr[index].max = Number(text);
              reqSignal.value = arr;
            }}
          />
        </div>
      </form>
    </div>
  );
}
