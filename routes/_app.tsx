import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html class="bg-neutral-50 dark:bg-neutral-800">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Synthima</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="bg-neutral-50 dark:bg-neutral-800">
        <Component />
      </body>
    </html>
  );
}
