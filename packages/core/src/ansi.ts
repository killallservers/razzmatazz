/**
 * ANSI escape sequence builders.
 * These functions modify the output string in-place (mutate).
 */

export function writeFg(output: string, color: number): string {
  if (color === 255) {
    return output + '\x1b[39m'
  } else {
    return output + `\x1b[38;5;${color}m`
  }
}

export function writeBg(output: string, color: number): string {
  if (color === 255) {
    return output + '\x1b[49m'
  } else {
    return output + `\x1b[48;5;${color}m`
  }
}

export function writeStyles(output: string, styles: number): string {
  if (styles === 0) {
    return output + '\x1b[0m'
  }

  let result = output
  if (styles & 1) result += '\x1b[1m' // bold
  if (styles & 2) result += '\x1b[2m' // dim
  if (styles & 4) result += '\x1b[3m' // italic
  if (styles & 8) result += '\x1b[4m' // underline
  if (styles & 16) result += '\x1b[5m' // blink
  if (styles & 32) result += '\x1b[7m' // invert
  if (styles & 64) result += '\x1b[8m' // hidden
  if (styles & 128) result += '\x1b[9m' // strikethrough

  return result
}

export function writeMoveCursor(output: string, x: number, y: number): string {
  return output + `\x1b[${y + 1};${x + 1}H`
}
