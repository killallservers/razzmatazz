/**
 * Terminal control and size management.
 * This is a pure TypeScript implementation using Bun's built-in capabilities.
 */

export interface TerminalSize {
  cols: number
  rows: number
}

/**
 * Query the current terminal size without entering any special mode.
 * Returns default 80×24 if not a TTY or size detection fails.
 */
export function terminalSize(): TerminalSize {
  const cols = getTerminalColumns()
  const rows = getTerminalRows()
  return { cols: cols || 80, rows: rows || 24 }
}

/**
 * Get terminal width from environment or process.stdout.
 */
function getTerminalColumns(): number | null {
  // Try Bun runtime
  if (typeof process !== 'undefined' && process.stdout && 'columns' in process.stdout) {
    return process.stdout.columns || null
  }
  // Fallback to environment
  return parseInt(process.env.COLUMNS || '', 10) || null
}

/**
 * Get terminal height from environment or process.stdout.
 */
function getTerminalRows(): number | null {
  // Try Bun runtime
  if (typeof process !== 'undefined' && process.stdout && 'rows' in process.stdout) {
    return process.stdout.rows || null
  }
  // Fallback to environment
  return parseInt(process.env.LINES || '', 10) || null
}

/**
 * RAII guard that enters raw mode + alternate screen on construction
 * and restores the terminal on drop (or explicit `leave()` call).
 *
 * In a pure TypeScript implementation, we use ANSI escape sequences.
 * For a production implementation with Bun, consider using FFI to termios.
 */
export class TerminalGuard {
  private left: boolean = false
  private originalRawMode: boolean = false

  /**
   * Enter raw mode, switch to the alternate screen, and hide the cursor.
   * Optionally enable SGR mouse tracking and bracketed paste mode.
   */
  constructor(mouse: boolean = false) {
    try {
      // Save original raw mode state
      if (typeof process !== 'undefined' && process.stdin && typeof (process.stdin as any).setRawMode === 'function') {
        this.originalRawMode = (process.stdin as any).isRaw ?? false
        ;(process.stdin as any).setRawMode?.(true)
      }

      // Enter alternate screen
      process.stdout.write('\x1b[?1049h')

      // Hide cursor
      process.stdout.write('\x1b[?25l')

      // Enable SGR mouse tracking if requested
      if (mouse) {
        process.stdout.write('\x1b[?1006h') // SGR mouse tracking
        process.stdout.write('\x1b[?1005h') // UTF-8 mouse tracking
        process.stdout.write('\x1b[?1002h') // Mouse motion tracking
      }

      // Enable bracketed paste
      process.stdout.write('\x1b[?2004h')
    } catch (err) {
      // Silent fallback — some environments don't support raw mode
    }
  }

  /**
   * Restore the terminal to its original state.
   * Safe to call multiple times — only the first call has any effect.
   */
  leave(): void {
    if (this.left) return
    this.left = true

    try {
      // Disable bracketed paste
      process.stdout.write('\x1b[?2004l')

      // Disable mouse tracking
      process.stdout.write('\x1b[?1006l')
      process.stdout.write('\x1b[?1005l')
      process.stdout.write('\x1b[?1002l')

      // Show cursor
      process.stdout.write('\x1b[?25h')

      // Exit alternate screen
      process.stdout.write('\x1b[?1049l')

      // Restore raw mode
      if (typeof process !== 'undefined' && process.stdin && typeof (process.stdin as any).setRawMode === 'function') {
        ;(process.stdin as any).setRawMode?.(this.originalRawMode)
      }
    } catch (err) {
      // Silent fallback
    }
  }

  /**
   * Query the current terminal size.
   */
  getSize(): TerminalSize {
    return terminalSize()
  }
}
