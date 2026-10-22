import { IS_BROWSER } from "fresh/runtime";

export function Redirect() {
  if (IS_BROWSER) {
    const search = globalThis.location.search;
    globalThis.location.replace(`${import.meta.env.BASE_URL}${search}`);
  }

  // deno-lint-ignore jsx-no-useless-fragment
  return <></>;
}
