# Razzmatazz Development Guide

## Project Overview

**Razzmatazz** is a pure TypeScript, high-performance terminal UI (TUI) runtime designed for use with Bun. It consists of three core packages:

- **@razzmatazz/core** — Low-level rendering engine with TypeScript diff engine, ANSI control, input parsing
- **@razzmatazz/react** — React adapter with Yoga layout, Ink-compatible components and hooks
- **@razzmatazz/docs** — Documentation and examples

## Build & Development Commands

### Install & Build

```bash
bun install          # Install dependencies (creates bun.lock)
bun run build        # Build both core and react packages
```

### Testing

```bash
bun test             # Full test suite (typecheck + core tests + react tests)
bun run --filter @razzmatazz/core test    # Test core package only
bun run --filter @razzmatazz/react test   # Test react package only
```

### Code Quality

```bash
bun run typecheck    # TypeScript type checking with tsgo (TS7 preview)
bun run lint         # Lint with biome (auto-fix)
bun run format       # Format with biome
```

## Runtime Requirements

- **Bun v1.0+** (exclusive runtime — no Node.js, Deno, or other runtimes)
- **TypeScript 7 preview** (via @typescript/native-preview, compiled with tsgo)
- **Biome** for linting and formatting

## Architecture

### Monorepo Structure

```
razzmatazz/
├── packages/
│   ├── core/        # @razzmatazz/core — rendering, terminal control, input
│   ├── react/       # @razzmatazz/react — React reconciler, components, hooks
│   └── docs/        # @razzmatazz/docs — documentation and examples
├── examples/        # Runnable example apps
├── bunfig.toml      # Bun runtime configuration
├── package.json     # Workspace root (build orchestration)
└── tsconfig.json    # Root TypeScript configuration
```

### Core Engine

The TypeScript diff engine (`packages/core/src/renderer.ts`) implements a game-engine-style rendering loop:

1. Maintain a double-buffered `Uint32Array` where each cell is 2 uint32s: character code + style
2. On each frame, diff the new buffer against the old buffer
3. Emit minimal ANSI sequences for changed cells only
4. Result: capable of 700+ FPS sustained rendering on typical terminals

### React Adapter

The React reconciler (`packages/react/src/reconciler.ts`) follows React's standard reconciliation algorithm:

1. Component trees render to an internal scene graph
2. Yoga layout engine computes positions
3. Scene graph flushes to the Renderer's buffer
4. Diff engine optimizes terminal writes

## Development Workflow

### Adding a Feature

1. Modify the appropriate package under `packages/`
2. Run `bun test` to verify — this builds + tests
3. Check types: `bun run typecheck`
4. Format code: `bun run format` and `bun run lint`

### Publishing Packages

```bash
bun run publish:core        # Publish @razzmatazz/core to npm
bun run publish:react       # Publish @razzmatazz/react to npm
bun run publish:all         # Publish both
```

> Requires npm authentication (run `npm login` first)

## File Conventions

- **Source**: `src/*.ts` → TypeScript source files
- **Tests**: `*.test.ts` in the same directory as source
- **Output**: `dist/` (compiled JS + .d.ts type declarations)
- **Config**: `tsconfig.json` per package, with root-level override

## Important Notes

### TypeScript 7 (tsgo)

The root `tsconfig.json` uses TypeScript 7 preview via `@typescript/native-preview`. The compilation step uses `tsgo` (native Go compiler, ~10x faster than tsc). To compile manually:

```bash
tsgo -p tsconfig.json
```

> Bun's build process wraps this automatically; use `bun run typecheck` for CI

### Biome

Linting and formatting are unified under Biome. Configuration is in `biome.json` (auto-generated; settings in `package.json` prettier config are respected).

```bash
biome format .      # Format code
biome lint . --fix  # Lint and auto-fix
```

### Bun Workspaces

Bun's `--filter` flag selects which workspace packages to run scripts in:

```bash
bun run --filter @razzmatazz/core build    # Build only core
bun run --filter @razzmatazz/react test    # Test only react
```

The root `package.json` orchestrates common tasks across all packages.

## Key APIs

### @razzmatazz/core

```ts
import { Renderer, TerminalGuard, InputParser } from '@razzmatazz/core'

const renderer = new Renderer(cols, rows)
const buf = new Uint32Array(cols * rows * 2)
// Paint cells into buf
renderer.render(buf)
```

### @razzmatazz/react

```ts
import { render, renderInline, Box, Text, useInput } from '@razzmatazz/react'

render(<App />)           // Full-screen React app
renderInline(<App />)     // Inline mode (below cursor)
```

## Distribution

Single executable distribution via `bun build --compile`:

```bash
bun build --compile --outfile ./razzmatazz packages/cli/main.ts
```

Result: a zero-dependency executable for end users.

## Useful Links

- [Bun Documentation](https://bun.sh/docs)
- [React TypeScript Guide](https://react.dev/learn/typescript)
- [Yoga Layout](https://yoga-layout.com/)
