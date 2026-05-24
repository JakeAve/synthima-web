import { App, staticFiles } from "fresh";

export const app = new App();

app.use(staticFiles());

// Fresh attaches a per-request nonce (via Symbol.for("__freshNonce")) to its
// inline boot <script type="module">. We must include that nonce in script-src
// so the island hydration actually runs. Passwords are generated client-side
// only; connect-src 'none' ensures no script can exfiltrate them.
const FRESH_NONCE = Symbol.for("__freshNonce");

app.use(async (ctx) => {
  const resp = await ctx.next();
  const nonce =
    (resp as unknown as Record<symbol, string | undefined>)[FRESH_NONCE];
  resp.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      nonce
        ? `script-src 'self' 'nonce-${nonce}'`
        : "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'none'",
      "frame-ancestors 'none'",
    ].join("; "),
  );
  return resp;
});

// Prevent the browser from leaking the current URL in Referer headers
// when users navigate away (e.g. via the GitHub link).
app.use(async (ctx) => {
  const resp = await ctx.next();
  resp.headers.set("Referrer-Policy", "no-referrer");
  return resp;
});

// Guarantee no session state is ever stored in the browser.
app.use(async (ctx) => {
  const resp = await ctx.next();
  resp.headers.delete("Set-Cookie");
  return resp;
});

app.fsRoutes();
