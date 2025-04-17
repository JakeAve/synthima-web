import { IS_BROWSER } from "$fresh/runtime.ts";

export function Redirect() {
  if (IS_BROWSER) {
    const search = globalThis.location.search;
    globalThis.location.replace(`/${search}`);
  }

  // deno-lint-ignore jsx-no-useless-fragment
  return <></>;
}
