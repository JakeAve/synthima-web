import { App, staticFiles } from "fresh";

export const app = new App();

app.use(staticFiles());

// Passwords are generated client-side only; block all outbound connections
// so no script—injected or otherwise—can exfiltrate generated passwords.
app.use(async (_ctx, next) => {
  const resp = await next();
  resp.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'none'",
      "frame-ancestors 'none'",
    ].join("; "),
  );
  return resp;
});

// Guarantee no session state is ever stored in the browser.
app.use(async (_ctx, next) => {
  const resp = await next();
  resp.headers.delete("Set-Cookie");
  return resp;
});

app.fsRoutes();
