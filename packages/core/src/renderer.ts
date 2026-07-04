import { writeFg, writeBg, writeStyles, writeMoveCursor } from './ansi'

const CONTINUATION_CELL = 0x0011_0000

export interface RendererOptions {
  width: number
  height: number
}

/**
 * Razzmatazz's core diff engine: compares a back buffer against an internal
 * front buffer and emits only the minimal ANSI escape sequences needed to
 * update the terminal.
 *
 * Buffer format: flat Uint32Array where each cell uses 2 u32 values:
 *   buffer[idx * 2]     = Unicode codepoint
 *   buffer[idx * 2 + 1] = attr code = (styles << 16) | (bg << 8) | fg
 */
export class Renderer {
  width: number
  height: number
  rowOffset: number = 0
  private frontBuffer: Uint32Array

  constructor(width: number, height: number) {
    this.width = width
    this.height = height

    // Sentinel: fill with 0xFFFFFFFF so the first frame diffs every cell
    this.frontBuffer = new Uint32Array(width * height * 2)
    this.frontBuffer.fill(0xffffffff)
  }

  /**
   * Resize the renderer and reset the front buffer.
   */
  resize(width: number, height: number): void {
    this.width = width
    this.height = height
    this.frontBuffer = new Uint32Array(width * height * 2)
    this.frontBuffer.fill(0xffffffff)
  }

  /**
   * Set a row offset for inline/partial-screen modes.
   * All cursor positioning will be shifted down by this many rows.
   */
  setRowOffset(offset: number): void {
    this.rowOffset = offset
  }

  /**
   * Generate the minimal ANSI diff string to update the terminal.
   * Returns a string of ANSI escape sequences.
   */
  renderDiff(backBuffer: Uint32Array): string {
    return this.generateDiff(backBuffer)
  }

  /**
   * Render the back buffer to stdout by generating and writing ANSI sequences.
   * This writes directly to process.stdout.
   */
  render(backBuffer: Uint32Array): void {
    const diff = this.generateDiff(backBuffer)
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write(diff)
    }
  }

  /**
   * Write raw bytes directly to stdout.
   * Used for cursor positioning or other direct terminal control.
   */
  writeRaw(data: string): void {
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write(data)
    }
  }

  /**
   * Core diff algorithm: compares back against front, emits ANSI sequences.
   */
  private generateDiff(backBuffer: Uint32Array): string {
    let output = '\x1b[0m'
    let currentX = -1
    let currentY = -1

    let lastFg = 255
    let lastBg = 255
    let lastStyle = 0

    const cols = this.width

    for (let i = 0; i < this.width * this.height; i++) {
      const offset = i * 2

      // Bounds check for safety
      if (offset + 1 >= backBuffer.length) break

      const charCode = backBuffer[offset]
      const attrCode = backBuffer[offset + 1]

      // Skip if cell hasn't changed
      if (charCode === this.frontBuffer[offset] && attrCode === this.frontBuffer[offset + 1]) {
        continue
      }

      const x = i % cols
      const y = Math.floor(i / cols)

      // Continuation cell: non-printing marker for wide glyphs
      if (charCode === CONTINUATION_CELL) {
        this.frontBuffer[offset] = charCode
        this.frontBuffer[offset + 1] = attrCode
        currentX = x
        currentY = y
        continue
      }

      // Cursor movement: only move if not contiguous
      if (currentX + 1 !== x || currentY !== y) {
        output = writeMoveCursor(output, x, y + this.rowOffset)
      }

      // Extract color and style from attr code
      const fg = attrCode & 0xff
      const bg = (attrCode >> 8) & 0xff
      const styles = (attrCode >> 16) & 0xff

      // Convert codepoint to character, fallback to space
      const ch = charCode === 0 ? ' ' : (String.fromCodePoint(charCode) ?? ' ')

      // Measure character width (for wide glyphs like CJK)
      const displayWidth = charWidth(ch)

      // Diff styles
      if (styles !== lastStyle) {
        output = writeStyles(output, styles)
        lastStyle = styles

        // Style reset clears colors, force redraw
        if (styles === 0) {
          lastFg = 255
          lastBg = 255
        }
      }

      // Diff foreground color
      if (fg !== lastFg) {
        output = writeFg(output, fg)
        lastFg = fg
      }

      // Diff background color
      if (bg !== lastBg) {
        output = writeBg(output, bg)
        lastBg = bg
      }

      // Write the character
      output += ch

      // Update front buffer
      this.frontBuffer[offset] = charCode
      this.frontBuffer[offset + 1] = attrCode

      // Advance cursor position
      currentX = x + displayWidth - 1
      currentY = y
    }

    return output
  }
}

/**
 * Estimate character display width (simple: 2 for CJK, emoji; 1 for ASCII).
 * This is a simplified version; a full implementation would use a library.
 */
function charWidth(ch: string): number {
  const code = ch.charCodeAt(0)

  // CJK ranges: common blocks for full-width characters
  if (
    (code >= 0x4e00 && code <= 0x9fff) || // CJK Unified Ideographs
    (code >= 0x3040 && code <= 0x309f) || // Hiragana
    (code >= 0x30a0 && code <= 0x30ff) || // Katakana
    (code >= 0xac00 && code <= 0xd7af) // Hangul
  ) {
    return 2
  }

  // Most emoji are width 2
  if (code >= 0x1f000) {
    return 2
  }

  // Default ASCII and most others are width 1
  return 1
}
