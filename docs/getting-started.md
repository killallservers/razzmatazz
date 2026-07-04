# Getting Started

Razzmatazz supports three runtime modes.

| Mode            | Primary API                         | Import path                              | Best for                                         |
| --------------- | ----------------------------------- | ---------------------------------------- | ------------------------------------------------ |
| React mode      | `render(<App />)`                   | `@razzmatazz/react`                      | Component-driven TUIs with hooks and Yoga layout |
| Raw-buffer mode | `Renderer` + `renderer.render`      | `@razzmatazz/core`                       | Direct per-cell rendering and custom loops       |
| Inline mode     | `renderInline` / `createInlineLoop` | `@razzmatazz/react` / `@razzmatazz/core` | Fixed-height UI below the cursor                 |

---

## Install

### React apps (most users)

```bash
bun install @razzmatazz/react react
```

### Raw-buffer / non-React apps

```bash
bun install @razzmatazz/core
```

> `@razzmatazz/core` is a pure TypeScript TUI runtime with a high-performance cell-based diff engine.

---

## Requirements

- **Bun 1.0+** (Node.js and Deno are not supported)
- A real TTY (Terminal.app, iTerm2, Ghostty, kitty, etc.)

> [!NOTE]
> Razzmatazz is Bun-first and exclusively targets Bun runtime. This enables single executable distribution (`bun build --compile`), native test runner, and simplified build pipeline.

---

## Run examples in this repository

```bash
# React mode
bun examples/kitchen-sink.tsx
bun examples/counter.tsx

# Raw-buffer mode
bun examples-raw/matrix.ts
bun examples-raw/conway.ts

# Inline mode (React)
bun examples/inline-minimal.tsx
```

See [Examples](examples.md) for the full list.

---

## Ink migration (typical)

```diff
- import { render, Box, Text } from 'ink'
+ import { render, Box, Text } from '@razzmatazz/react'
```

Most app-level API usage maps directly. See [Ink Compatibility](ink-compat.md) for caveats and stubs.

---

## Next steps

- [Package Map](package-map.md)
- [Quickstart: React mode](quickstart-react.md)
- [Quickstart: Raw-buffer mode](quickstart-raw-buffer.md)
