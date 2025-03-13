import { Redirect } from "../islands/Redirect.tsx";

export default function Error404() {
  return (
    <div class="font-thin text-neutral-700 dark:text-neutral-200 text-lg h-screen flex justify-center items-center">
      This page does not exist. Redirecting.
      <Redirect />
    </div>
  );
}
