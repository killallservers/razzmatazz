# Package Map

Razzmatazz is a multi-package workspace.

Use this page to decide which package to install and where each API lives.

## Quick choice

| If you want to…                                       | Use package         | Why                                                              |
| ----------------------------------------------------- | ------------------- | ---------------------------------------------------------------- |
| Build a React TUI with components and hooks           | `@razzmatazz/react` | Includes the React renderer and Ink-compatible API               |
| Paint terminal cells directly from a `Uint32Array`    | `@razzmatazz/core`  | Lowest-level runtime, direct control over render loop and buffer |
| Browse docs for all packages                          | `@razzmatazz/docs`  | Monorepo docs package (private)                                  |

---

## `@razzmatazz/core`

Framework-agnostic pure-TypeScript runtime with a high-performance cell-based diff engine.

Primary APIs are exposed to TypeScript/JavaScript with all rendering handled in TypeScript.

Primary exports:

- `Renderer`
- `TerminalGuard`
- `terminalSize`
- `Cell`, `StyleMasks`
- `InputParser`
- `RazzmatazzApp`
- `createInlineLoop`

Install:

```bash
npm install @razzmatazz/core
```

---

## `@razzmatazz/react`

React adapter and Ink-compatible component/hook surface.

Depends on `@razzmatazz/core` for terminal output + native diffing.

Primary exports:

- `render`, `renderInline`, `renderToString`
- components: `Box`, `Text`, `Static`, `Transform`, `Spinner`, `ProgressBar`, `Newline`, `Spacer`
- hooks: `useInput`, `useApp`, `useFocus`, `useFocusManager`, `usePaste`, `useMouse`, `useScrollable`, `useTextInput`, etc.

Install:

```bash
npm install @razzmatazz/react react
```

---

## `@razzmatazz/docs`

Private docs workspace package.

- not intended for npm publish/consumption
- source of truth for monorepo docs pages

---

## Related pages

- [Getting Started](getting-started.md)
- [Quickstart: React mode](quickstart-react.md)
- [Quickstart: Raw-buffer mode](quickstart-raw-buffer.md)
- [Rendering Modes](rendering-modes.md)
