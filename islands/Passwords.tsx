import { Signal } from "@preact/signals";
import { Fragment, JSX } from "preact/jsx-runtime";

interface Props {
  passwordsSignal: Signal<string[]>;
}

export default function Passwords(props: Props) {
  const { passwordsSignal } = props;

  return (
    <div class="text-2xl w-full overflow-x-scroll grid grid-cols-[auto_auto] gap-x-1 gap-y-2 items-center">
      {passwordsSignal.value.map((v, i) => (
        <Fragment key={i}>
          <button
            class="w-6 h-6 active:bg-neutral-700 active:text-neutral-50 ml-auto"
            onClick={(e: JSX.TargetedPointerEvent<HTMLButtonElement>) => {
              const btn = e.currentTarget.closest("button");

              try {
                navigator.clipboard.writeText(v);

                if (btn) {
                  btn.innerHTML =
                    '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>';
                }

                setTimeout(() => {
                  if (btn) {
                    btn.innerHTML =
                      '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>';
                  }
                }, 3000);
              } catch {
                const selection = globalThis.getSelection();

                if (!selection) {
                  return;
                }

                if (selection.rangeCount > 0) {
                  selection.removeAllRanges();
                }

                btn?.nextElementSibling?.childNodes.forEach(
                  (n) => {
                    const range = document.createRange();
                    range.selectNode(n);
                    selection.addRange(range);
                  },
                );
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="100%"
              viewBox="0 -960 960 960"
              width="100%"
              fill="currentColor"
            >
              <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
            </svg>
          </button>
          <span
            class="whitespace-pre mr-auto"
            onClick={(e: JSX.TargetedPointerEvent<HTMLDivElement>) =>
              (e.currentTarget.previousElementSibling as HTMLInputElement)
                .select()}
          >
            {v}
          </span>
        </Fragment>
      ))}
    </div>
  );
}
