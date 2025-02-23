import { useRef } from "preact/hooks";

const charSets = [
    {name: 'Arabic Alphabet', symbols: ''}
]

export function CharSetDialog() {
     const dialogRef = useRef<HTMLDialogElement | null>(null);
    
      function addNewReq() {
        dialogRef.current?.showModal();
      }
    
      function closeDialog() {
        dialogRef.current?.close();
      }
  return (
    <dialog class="p-8 backdrop:bg-neutral-800/50" ref={dialogRef}>
      <form>
        <button>Add</button>
        <button onClick={closeDialog} formmethod="dialog">Cancel</button>
      </form>
    </dialog>
  );
}
