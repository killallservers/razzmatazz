# Ink Compatibility

> Part of the [Razzmatazz docs](index.md). See also: [Hooks](hooks.md) · [Components](components.md)

Razzmatazz targets Ink API compatibility for core component and hook workflows, with a few documented stubs and behavior differences.

---

## Core API parity

| Export                       | Status | Notes                                                         |
| ---------------------------- | ------ | ------------------------------------------------------------- |
| `render()`                   | ✅     | Returns `{ rerender, unmount, waitUntilExit, app, input }`    |
| `Box`                        | ✅     | Yoga-backed layout                                            |
| `Text`                       | ✅     | Core style props supported                                    |
| `Newline`                    | ✅     | `count` supported                                             |
| `Spacer`                     | ✅     | Flex grow spacer                                              |
| `Static`                     | ✅     | Append-only semantics                                         |
| `Transform`                  | ✅     | Transform callback support                                    |
| `renderToString()`           | ✅     | Synchronous snapshot                                          |
| `measureElement()`           | ✅     | Returns `{ width, height }`                                   |
| `useApp()`                   | ✅     | `exit` + `quit`                                               |
| `useInput()`                 | ✅     | Arrows, Enter, Escape, Ctrl, Meta, paging keys                |
| `usePaste()`                 | ✅     | Bracketed paste routing                                       |
| `useFocus()`                 | ✅     | Focus state and `focus(id)`                                   |
| `useFocusManager()`          | ✅     | Focus navigation methods                                      |
| `useStdin()`                 | ✅     | Raw mode helpers                                              |
| `useStdout()`                | ✅     | Buffered while app is running                                 |
| `useStderr()`                | ✅     | Buffered while app is running                                 |
| `useBoxMetrics()`            | ✅     | Layout metrics + `hasMeasured` (intended for `render()` mode) |
| `useWindowSize()`            | ✅     | `{ columns, rows }` (intended for `render()` mode)            |
| `useIsScreenReaderEnabled()` | ⚠️     | Stub: always `false`                                          |
| `useCursor()`                | ⚠️     | Stub: `setCursorPosition` is a no-op                          |

---

## Render option differences

`render()` accepts Ink-style options, but these are currently ignored:

- `concurrent`
- `patchConsole`
- `exitOnCtrlC`
- `incrementalRendering`
- `debug`

`maxFps` is used.

---

## Razzmatazz-only API (no Ink equivalent)

| Export                       | Description                             |
| ---------------------------- | --------------------------------------- |
| `useScrollable()`            | Virtual scrolling state helper          |
| `useMouse()`                 | Mouse click/wheel events with modifiers |
| `useTextInput()`             | Managed text editing hook               |
| `Spinner`                    | Animated spinner component              |
| `ProgressBar`                | Progress bar component                  |
| `renderInline()`             | React inline rendering mode             |
| `createInlineLoop()`         | Raw-buffer inline rendering loop        |
| `Renderer` / `TerminalGuard` | Raw-buffer runtime primitives           |

---

## Architectural differences vs Ink

| Concern            | Ink                  | Razzmatazz                   |
| ------------------ | -------------------- | ---------------------------- |
| Render strategy    | JS string renderer   | TS diff over `Uint32Array`   |
| Screen mode        | Inline rewrite model | Alternate screen model       |
| `patchConsole`     | Integrated           | Not implemented              |
| Screen reader hook | Functional           | Stub (`false`)               |
| Cursor hook        | Functional           | Stub (no-op)                 |

---

## Example ports

Razzmatazz includes examples and ports of Ink demos showing compatibility.

- Most files are direct ports with import-path changes from Ink examples
- Some include small TypeScript typing fixes

See [examples/](../../examples/) for the full list of React mode examples.
