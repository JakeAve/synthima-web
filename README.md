# Synthima Password Generator

Generate cryptographically random passwords using `crypto.getRandomValues`.

**[Open the app →](https://synthima-web.jakeave.deno.net/)**

Built on top of the JSR library [Synthima](https://jsr.io/@jakeave/synthima).

---

## Features

- Cryptographically random output via `crypto.getRandomValues`
- 47 built-in character set presets (Latin, Cyrillic, Greek, Arabic, CJK, and more)
- Simple mode: toggle the four common sets (uppercase, lowercase, numbers, symbols)
- Advanced mode: add any preset or hand-type custom character sets with per-requirement min/max
- Shareable URLs — the full configuration is encoded in the URL and updates live

---

## Shareable URLs

Every configuration is encoded in the URL so you can share or bookmark specific setups.

**Format:** `?length=N&r=<preset>&r=<preset>:<min>&r=<preset>:<min>:<max>`

- `length` — password length (default: 12)
- `r` — one requirement per param; value is a preset key, optionally followed by `:min` and `:max`
- Omit `:min` when it's 1 (the default); omit `:max` when there's no upper limit
- Unknown preset keys are treated as raw character strings

### Example links

| Description | Link |
|---|---|
| Strong password (16 chars) | [uppercase + lowercase + numbers + symbols](https://synthima-web.jakeave.deno.net/?length=16&r=uppercase&r=lowercase&r=numbers&r=special) |
| 6-digit PIN | [numbers only](https://synthima-web.jakeave.deno.net/?length=6&r=numbers) |
| Letters only | [uppercase + lowercase, no numbers or symbols](https://synthima-web.jakeave.deno.net/?length=12&r=uppercase&r=lowercase) |
| Numbers-heavy | [at least 4 digits](https://synthima-web.jakeave.deno.net/?length=16&r=uppercase&r=lowercase&r=numbers:4&r=special) |
| Constrained symbols | [max 2 special chars](https://synthima-web.jakeave.deno.net/?length=16&r=uppercase&r=lowercase&r=numbers&r=special:1:2) |
| Greek + numbers | [exotic mix](https://synthima-web.jakeave.deno.net/?length=20&r=greek&r=numbers) |
| Russian + symbols | [Cyrillic with special chars](https://synthima-web.jakeave.deno.net/?length=24&r=russian&r=numbers&r=special) |

### Preset keys

| Key | Characters |
|---|---|
| `uppercase` | A–Z |
| `lowercase` | a–z |
| `numbers` | 0–9 |
| `special` | !@#$%^&* |
| `german-upper` / `german-lower` | Base Latin + ÄÖÜ / äöüß |
| `french-upper` / `french-lower` | Base Latin + French diacritics |
| `spanish` | Base Latin + ñÑ¿¡ |
| `nordic-upper` / `nordic-lower` | Base Latin + ÅÆØÐÞ / åæøðþ |
| `central-eu-upper` / `central-eu-lower` | Base Latin + Central European |
| `romanian-upper` / `romanian-lower` | Base Latin + ĂÂÎȘȚ / ăâîșț |
| `turkish-upper` / `turkish-lower` | Base Latin + ÇĞİŞÖÜ / çğışöü |
| `portuguese-upper` / `portuguese-lower` | Base Latin + Portuguese diacritics |
| `latin-extended` | Full Latin Extended block |
| `extended-special` | £€¥₹ ± × ÷ ≠ ≈ ∞ … and more |
| `currency` | £ € ¥ ₹ ₽ ₩ ₪ ₿ ¢ |
| `math` | ± × ÷ ≠ ≈ ∞ ∑ ∏ √ ∫ ∂ |
| `arrows` | ← → ↑ ↓ ↔ ↗ ↘ ↙ ↖ ⇒ ⇐ ⇑ ⇓ |
| `typographic` | « » „ " " ' ' … † ‡ § ¶ • |
| `superscripts` / `subscripts` | ⁰¹²³… / ₀₁₂₃… |
| `russian` | Full Russian Cyrillic |
| `ukrainian` | Full Ukrainian Cyrillic |
| `bulgarian` | Full Bulgarian Cyrillic |
| `serbian-cyrillic` | Full Serbian Cyrillic |
| `greek` | Full Greek alphabet |
| `arabic-letters` | Arabic consonants |
| `arabic-indic` | Arabic-Indic digits ٠١٢… |
| `arabic-punct` | ، ؛ ؟ |
| `hebrew-letters` | Hebrew alphabet |
| `hindi-consonants` / `hindi-vowels` | Devanagari consonants / vowels |
| `cjk` | 3500 common CJK characters |
| `hiragana` | Japanese Hiragana |
| `katakana` | Japanese Katakana |
| `korean-consonants` / `korean-vowels` | Korean Jamo |
| `georgian` | Georgian Mkhedruli |
| `armenian` | Armenian alphabet |
| `thai-consonants` / `thai-vowels` | Thai consonants / vowels |

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

| Command | What it does |
|---|---|
| `deno task dev` | Start Vite dev server with HMR |
| `deno task build` | Build for production into `_fresh/` |
| `deno task start` | Serve the production build |
| `deno task check` | Run formatter check, lint, and type-check |
| `deno test` | Run the test suite |

### Tech stack

- [Fresh 2](https://fresh.deno.dev/) — Deno-native web framework
- [Preact](https://preactjs.com/) + [@preact/signals](https://preactjs.com/guide/v10/signals/) — UI and reactive state
- [Tailwind CSS v4](https://tailwindcss.com/) — Styling
- [Synthima](https://jsr.io/@jakeave/synthima) — Password generation library
- [Vite](https://vite.dev/) — Build tooling
