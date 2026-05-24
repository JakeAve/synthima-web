import { type PageProps } from "fresh";
export default function App({ Component }: PageProps) {
  return (
    <html class="bg-neutral-50 dark:bg-neutral-800">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Synthima</title>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body class="bg-neutral-50 dark:bg-neutral-800">
        <Component />
      </body>
    </html>
  );
}
