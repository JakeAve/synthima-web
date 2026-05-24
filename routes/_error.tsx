import { HttpError } from "fresh";
import type { PageProps } from "fresh";
import { Redirect } from "../islands/Redirect.tsx";

export default function ErrorPage({ error }: PageProps) {
  if (error instanceof HttpError && error.status === 404) {
    return (
      <div class="font-thin text-neutral-700 dark:text-neutral-200 text-lg h-screen flex justify-center items-center">
        This page does not exist. Redirecting.
        <Redirect />
      </div>
    );
  }

  return (
    <div class="font-thin text-neutral-700 dark:text-neutral-200 text-lg h-screen flex justify-center items-center">
      Something went wrong.
    </div>
  );
}
