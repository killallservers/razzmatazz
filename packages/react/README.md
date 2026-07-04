# @razzmatazz/react

React renderer for Razzmatazz with an Ink-compatible API, powered by pure TypeScript and Bun.

Built on top of [`@razzmatazz/core`](../core/README.md), this package provides components, hooks, layout, and render lifecycle APIs for terminal UIs.

**Requires Bun**: Razzmatazz is Bun-first and does not support Node.js or Deno.

## Install

```bash
bun install @razzmatazz/react react
```

## Quick start

```tsx
import React from 'react'
import { render, Box, Text, useInput } from '@razzmatazz/react'

function App() {
  useInput((input, key) => {
    if (key.ctrl && input === 'c') process.exit(0)
  })

  return (
    <Box padding={1}>
      <Text color="cyan">Hello from @razzmatazz/react</Text>
    </Box>
  )
}

render(<App />)
```

## Main exports

- Rendering: `render`, `renderInline`, `renderToString`
- Components: `Box`, `Text`, `Static`, `Transform`, `Spinner`, `ProgressBar`, `Newline`, `Spacer`
- Hooks: `useInput`, `useApp`, `usePaste`, `useMouse`, `useFocus`, `useFocusManager`, `useScrollable`, `useTextInput`, `useWindowSize`, `useStdout`, `useStderr`

## Docs

- [Quickstart: React mode](../docs/quickstart-react.md)
- [Components reference](../docs/components.md)
- [Hooks reference](../docs/hooks.md)
- [Ink compatibility matrix](../docs/ink-compat.md)
- [Examples catalog](../docs/examples.md)

For low-level non-React rendering, use [`@razzmatazz/core`](../core/README.md).
