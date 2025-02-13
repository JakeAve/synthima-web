import { Signal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";

interface Props {
  charLengthSignal: Signal<number>;
}

export function CharLength(props: Props) {
  const { charLengthSignal } = props;

  return (
    <>
      <label class="text-4xl lg:text-6xl" for="char-length">
        Number of Characters
      </label>
      <div class="w-full">
        <input
          class="w-full"
          id="char-length"
          type="range"
          step="1"
          min="1"
          max="100"
          value={charLengthSignal.value}
          onChange={(e: JSX.TargetedInputEvent<HTMLInputElement>) => {
            charLengthSignal.value = Number(e.currentTarget.value);
          }}
        />
      </div>
      <div class="flex justify-around items-center self-center w-full max-w-96">
        <button
          class="h-20 w-20 text-4xl bg-neutral-700 text-white rounded-full"
          onClick={() => charLengthSignal.value--}
          onDblClick={() => charLengthSignal.value--}
        >
          -
        </button>
        <p class="text-4xl text-center flex-1">{charLengthSignal}</p>
        <button
          class="h-20 w-20 text-4xl bg-neutral-700 text-white rounded-full"
          onClick={() => charLengthSignal.value++}
          onDblClick={() => charLengthSignal.value++}
        >
          +
        </button>
      </div>
    </>
  );
}
