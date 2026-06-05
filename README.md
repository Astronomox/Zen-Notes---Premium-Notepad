# Zen Notes 2.0

A refined, secure, distraction-free writing space. Light & dark themes.

## Stack
- React 19 + Vite 6 + TypeScript
- Tailwind CSS 3 (semantic token theming)
- Motion (motion/react) v12 for animation
- Zustand v5 for state
- lucide-react for SVG icons
- Web Crypto API (AES-256-GCM + PBKDF2) for encryption

## Run

```bash
pnpm install     # or npm install
pnpm dev         # opens http://localhost:5173
```

## Build

```bash
pnpm build
pnpm preview
```

## What's inside

### Landing page
- Hero with animated reveals + product mockup
- **Express yourself**: a rotating cursive word that erases and retypes a
  different word each cycle, in shifting colors
- **Try the editor**: a live, functional mini-note embedded in the page
- Image showcase built from self-contained SVG scenes (no external assets)
- Feature grid, security spotlight with scroll parallax
- Light/dark theme toggle (defaults to light, remembers your choice)

### App
- Rich-text editor: bold, italic, H1/H2, lists, quote, code, links, undo/redo
- Title, live word count, per-note word goal with animated progress
- Sidebar: instant search, pin, inline delete confirmation, relative times
- Keyboard: Ctrl/Cmd+N new note, Ctrl/Cmd+S save

### Security (real, not decorative)
- Optional passphrase vault. Notes encrypted with AES-256-GCM.
- Key derived from your passphrase via PBKDF2 (310,000 rounds, SHA-256).
- Plaintext copy removed once the vault is enabled. Nothing leaves the device.
- The passphrase cannot be recovered, so choose one you'll remember.

## Theming
All colors flow through CSS variables in `src/index.css` (`:root` = light,
`.dark` = dark) and are exposed to Tailwind as semantic tokens
(`bg-canvas`, `text-fg`, `border-line`, `bg-accent`, etc.) in
`tailwind.config.js`. Add or retune a palette in one place.
