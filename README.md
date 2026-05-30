# Synthima Password Generator

Generate cryptographically random passwords using `crypto.getRandomValues`.

**[Open the app →](https://synthima-web.jakeave.deno.net/)**

Built on top of the JSR library [Synthima](https://jsr.io/@jakeave/synthima).

---

## Features

- Cryptographically random output via `crypto.getRandomValues`
- 47 built-in character set presets (Latin, Cyrillic, Greek, Arabic, CJK, and
  more)
- Simple mode: toggle the four common sets (uppercase, lowercase, numbers,
  symbols)
- Advanced mode: add any preset or hand-type custom character sets with
  per-requirement min/max
- Shareable URLs — the full configuration is encoded in the URL and updates live

---

## Shareable URLs

Every configuration is encoded in the URL so you can share or bookmark specific
setups.

**Format:** `?length=N&r=<preset>&r=<preset>:<min>&r=<preset>:<min>:<max>`

- `length` — password length (default: 12)
- `r` — one requirement per param; value is a preset key, optionally followed by
  `:min` and `:max`
- Omit `:min` when it's 1 (the default); omit `:max` when there's no upper limit
- Unknown preset keys are treated as raw character strings

### Example links

| Description                | Link                                                                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Strong password (16 chars) | [uppercase + lowercase + numbers + symbols](https://synthima-web.jakeave.deno.net/?length=16&r=uppercase&r=lowercase&r=numbers&r=special) |
| 6-digit PIN                | [numbers only](https://synthima-web.jakeave.deno.net/?length=6&r=numbers)                                                                 |
| Letters only               | [uppercase + lowercase, no numbers or symbols](https://synthima-web.jakeave.deno.net/?length=12&r=uppercase&r=lowercase)                  |
| Numbers-heavy              | [at least 4 digits](https://synthima-web.jakeave.deno.net/?length=16&r=uppercase&r=lowercase&r=numbers:4&r=special)                       |
| Constrained symbols        | [max 2 special chars](https://synthima-web.jakeave.deno.net/?length=16&r=uppercase&r=lowercase&r=numbers&r=special:1:2)                   |
| Greek + numbers            | [exotic mix](https://synthima-web.jakeave.deno.net/?length=20&r=greek&r=numbers)                                                          |
| Russian + symbols          | [Cyrillic with special chars](https://synthima-web.jakeave.deno.net/?length=24&r=russian&r=numbers&r=special)                             |

### Preset keys

| Key                                     | Characters                         |
| --------------------------------------- | ---------------------------------- |
| `uppercase`                             | A–Z                                |
| `lowercase`                             | a–z                                |
| `numbers`                               | 0–9                                |
| `special`                               | !@#$%^&*                           |
| `german-upper` / `german-lower`         | Base Latin + ÄÖÜ / äöüß            |
| `french-upper` / `french-lower`         | Base Latin + French diacritics     |
| `spanish`                               | Base Latin + ñÑ¿¡                  |
| `nordic-upper` / `nordic-lower`         | Base Latin + ÅÆØÐÞ / åæøðþ         |
| `central-eu-upper` / `central-eu-lower` | Base Latin + Central European      |
| `romanian-upper` / `romanian-lower`     | Base Latin + ĂÂÎȘȚ / ăâîșț         |
| `turkish-upper` / `turkish-lower`       | Base Latin + ÇĞİŞÖÜ / çğışöü       |
| `portuguese-upper` / `portuguese-lower` | Base Latin + Portuguese diacritics |
| `latin-extended`                        | Full Latin Extended block          |
| `extended-special`                      | £€¥₹ ± × ÷ ≠ ≈ ∞ … and more        |
| `currency`                              | £ € ¥ ₹ ₽ ₩ ₪ ₿ ¢                  |
| `math`                                  | ± × ÷ ≠ ≈ ∞ ∑ ∏ √ ∫ ∂              |
| `arrows`                                | ← → ↑ ↓ ↔ ↗ ↘ ↙ ↖ ⇒ ⇐ ⇑ ⇓          |
| `typographic`                           | « » „ " " ' ' … † ‡ § ¶ •          |
| `superscripts` / `subscripts`           | ⁰¹²³… / ₀₁₂₃…                      |
| `russian`                               | Full Russian Cyrillic              |
| `ukrainian`                             | Full Ukrainian Cyrillic            |
| `bulgarian`                             | Full Bulgarian Cyrillic            |
| `serbian-cyrillic`                      | Full Serbian Cyrillic              |
| `greek`                                 | Full Greek alphabet                |
| `arabic-letters`                        | Arabic consonants                  |
| `arabic-indic`                          | Arabic-Indic digits ٠١٢…           |
| `arabic-punct`                          | ، ؛ ؟                              |
| `hebrew-letters`                        | Hebrew alphabet                    |
| `hindi-consonants` / `hindi-vowels`     | Devanagari consonants / vowels     |
| `cjk`                                   | 3500 common CJK characters         |
| `hiragana`                              | Japanese Hiragana                  |
| `katakana`                              | Japanese Katakana                  |
| `korean-consonants` / `korean-vowels`   | Korean Jamo                        |
| `georgian`                              | Georgian Mkhedruli                 |
| `armenian`                              | Armenian alphabet                  |
| `thai-consonants` / `thai-vowels`       | Thai consonants / vowels           |

---

## REST API

Generate passwords programmatically via `GET /api/generate`.

**Base URL:** `https://synthima-web.jakeave.deno.net/api/generate`

### Parameters

| Param    | Default | Description                                                       |
| -------- | ------- | ----------------------------------------------------------------- |
| `length` | `12`    | Password length (integer ≥ 1)                                     |
| `r`      | —       | Charset requirement — repeatable; same format as URL params above |
| `count`  | `1`     | Number of passwords to return (integer 1–100)                     |
| `format` | `json`  | `json` → JSON array, `csv` → one password per line                |

### Examples

```bash
# One password, default settings
curl "https://synthima-web.jakeave.deno.net/api/generate"
# ["M#0DpNE7c45&"]

# 5 strong passwords, 16 chars
curl "https://synthima-web.jakeave.deno.net/api/generate?length=16&r=uppercase&r=lowercase&r=numbers&r=special&count=5"

# 10 PINs as plain text (one per line)
curl "https://synthima-web.jakeave.deno.net/api/generate?length=6&r=numbers&count=10&format=csv"
```

### Errors

Invalid parameters return `400` with a JSON error body:

```json
{ "error": "count must be between 1 and 100" }
{ "error": "format must be json or csv" }
{ "error": "length must be between 1 and 256" }
```

---

## MCP server

The generator is also available as a
[Model Context Protocol](https://modelcontextprotocol.io) server, so MCP clients
(Claude Desktop, Claude Code, etc.) can generate passwords directly. It exposes
two tools:

| Tool                   | Arguments                                                                                             | Returns                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `generate_password`    | `length` (1–256, default 12), `count` (1–100, default 1), `requirements` (optional array — see below) | The generated password(s), one per line       |
| `list_charset_presets` | none                                                                                                  | Every preset as `{ key, name, size, sample }` |

Each `requirements` item is either a preset `key` or a literal `charSet`, with
optional `min`/`max` occurrence counts. With no `requirements`, passwords use a
strong default mix of uppercase, lowercase, numbers, and special characters.

```jsonc
// example generate_password arguments
{
  "length": 20,
  "count": 3,
  "requirements": [
    { "preset": "uppercase", "min": 2 },
    { "preset": "numbers", "min": 2 },
    { "charSet": "!@#$", "max": 4 }
  ]
}
```

### Remote endpoint (hosted)

Streamable HTTP at `POST /mcp` — no install required, just add the URL:

```bash
claude mcp add --transport http password-gen https://synthima-web.jakeave.deno.net/mcp
```

In Claude Desktop / Claude.ai: **Settings → Connectors → Add custom connector**
and paste `https://synthima-web.jakeave.deno.net/mcp`.

### Local (stdio)

Runs on your machine over stdio — nothing leaves the process. Requires
[Deno](https://deno.com/) v2+ and a checkout of this repo:

```bash
claude mcp add password-gen -- deno run -A /absolute/path/to/synthima-web/mcp/stdio.ts
```

Or configure it directly in your client:

```jsonc
{
  "mcpServers": {
    "password-gen": {
      "command": "deno",
      "args": ["run", "-A", "mcp/stdio.ts"],
      "cwd": "/absolute/path/to/synthima-web"
    }
  }
}
```

Both transports are thin wrappers over the same generator core as the web app
and REST API.

---

## Setup

**Prerequisites:** [Deno](https://deno.com/) v2+

```bash
# Clone the repo
git clone https://github.com/JakeAve/synthima-web.git
cd synthima-web

# Install git hooks (runs fmt, lint, type-check, and tests on push)
deno task install:githooks

# Start the dev server
deno task dev
```

The app will be available at `http://localhost:5173/`.

### Available tasks

| Command              | What it does                                      |
| -------------------- | ------------------------------------------------- |
| `deno task dev`      | Start Vite dev server with HMR                    |
| `deno task build`    | Build for production into `_fresh/`               |
| `deno task start`    | Serve the production build                        |
| `deno task check`    | Run formatter check, lint, and type-check         |
| `deno task test`     | Run the unit tests (`lib/`, `routes/`)            |
| `deno task test:e2e` | Build, then run the stdio + HTTP end-to-end tests |

### Tech stack

- [Fresh 2](https://fresh.deno.dev/) — Deno-native web framework
- [Preact](https://preactjs.com/) +
  [@preact/signals](https://preactjs.com/guide/v10/signals/) — UI and reactive
  state
- [Tailwind CSS v4](https://tailwindcss.com/) — Styling
- [Synthima](https://jsr.io/@jakeave/synthima) — Password generation library
- [Vite](https://vite.dev/) — Build tooling
