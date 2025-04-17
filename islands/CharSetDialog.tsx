import { useRef } from "preact/hooks";

export function CharSetDialog() {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  function closeDialog() {
    dialogRef.current?.close();
  }
  return (
    <dialog class="p-8 backdrop:bg-neutral-800/50" ref={dialogRef}>
      <form>
        <button type="button">Add</button>
        <button type="button" onClick={closeDialog} formmethod="dialog">
          Cancel
        </button>
      </form>
    </dialog>
  );
}
