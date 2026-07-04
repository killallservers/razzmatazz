# @razzmatazz/core

Pure TypeScript low-level terminal runtime for Razzmatazz. Built on Bun, no native modules.

This package provides:

- **Renderer**: Game-engine-style diff engine comparing buffers and emitting minimal ANSI sequences
- **Terminal control**: Raw mode, alternate screen, mouse/paste tracking (via ANSI sequences)
- **Input parsing**: Keyboard, mouse, and paste events
- **Inline/fullscreen modes**: For flexible terminal layouts

## Install

```bash
bun install @razzmatazz/core
```

## Quick start

```ts
import { Renderer, TerminalGuard, terminalSize, Cell } from '@razzmatazz/core'

const { cols, rows } = terminalSize()
const guard = new TerminalGuard()
const renderer = new Renderer(cols, rows)
const buf = new Uint32Array(cols * rows * 2)

// Paint a cyan 'A' at (0,0): fg=cyan(6), bg=default(255)
const [charCode, attrCode] = Cell.pack('A', 6, 255, 0)
buf[0] = charCode
buf[1] = attrCode

renderer.render(buf)

process.on('SIGINT', () => {
  guard.leave()
  process.exit(0)
})
```

## Main exports

- `Renderer`, `terminalSize`, `TerminalGuard`
- `Cell`, `StyleMasks`
- `InputParser`
- `RatatatApp`
- `createInlineLoop`

## Docs

- [Quickstart: Raw-buffer mode](../docs/quickstart-raw-buffer.md)
- [Raw Buffer API](../docs/raw-buffer.md)
- [TypeScript Buffer Guide](../docs/ts-buffer-guide.md)
- [Rendering Modes](../docs/rendering-modes.md)

For React components/hooks and Ink-compatible APIs, see [`@razzmatazz/react`](../react/README.md).
