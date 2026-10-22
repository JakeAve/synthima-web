// Turn the built Fresh server into a static site: render the home and 404
// pages through the production handler and drop them next to the client
// assets, so `_fresh/client` can be served as-is by any static host.
//
//   BASE_PATH=/synthima-web/ deno task build:site
//
// BASE_PATH must match the one used for `deno task build`.

const base = Deno.env.get("BASE_PATH") ?? "/";
const outDir = "_fresh/client";

// Resolved at runtime so `deno check` passes before the build output exists.
const { default: server } = await import(
  new URL("./_fresh/server.js", import.meta.url).href
);

async function render(path: string): Promise<string> {
  const res = await server.fetch(new Request(`http://localhost${base}${path}`));
  const html: string = await res.text();
  if (base === "/") return html;
  // Fresh prefixes its island imports with the base path but leaves the
  // stylesheet link and the app's own root-relative hrefs alone.
  return html.replaceAll(
    new RegExp(`(href|src)="/(?!/|${base.slice(1)})`, "g"),
    `$1="${base}`,
  );
}

await Deno.writeTextFile(`${outDir}/index.html`, await render(""));
await Deno.writeTextFile(`${outDir}/404.html`, await render("404"));
console.log(`prerendered index.html and 404.html into ${outDir}`);
