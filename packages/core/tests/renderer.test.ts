import { describe, it, expect } from 'bun:test'
import { Renderer } from '../src/renderer'

describe('Renderer', () => {
  it('should create a renderer with correct dimensions', () => {
    const renderer = new Renderer(80, 24)
    expect(renderer.width).toBe(80)
    expect(renderer.height).toBe(24)
  })

  it('should generate reset sequence on init', () => {
    const renderer = new Renderer(2, 2)
    const buffer = new Uint32Array([
      0x41,
      0x00070000, // 'A' with default colors
      0x42,
      0x00070000, // 'B'
      0x43,
      0x00070000, // 'C'
      0x44,
      0x00070000, // 'D'
    ])

    const output = renderer.renderDiff(buffer)

    // First frame should contain reset
    expect(output).toContain('\x1b[0m')
    // Should contain characters
    expect(output).toContain('A')
    expect(output).toContain('B')
  })

  it('should skip unchanged cells on second render', () => {
    const renderer = new Renderer(2, 2)
    const buffer = new Uint32Array([
      0x41,
      0x00070000, // 'A'
      0x42,
      0x00070000, // 'B'
      0x43,
      0x00070000, // 'C'
      0x44,
      0x00070000, // 'D'
    ])

    const output1 = renderer.renderDiff(buffer)

    // Second render with same buffer should skip unchanged
    const output2 = renderer.renderDiff(buffer)

    // Second output should be much shorter (only reset)
    expect(output2.length).toBeLessThan(output1.length)
  })

  it('should handle resize', () => {
    const renderer = new Renderer(80, 24)
    renderer.resize(120, 40)
    expect(renderer.width).toBe(120)
    expect(renderer.height).toBe(40)
  })

  it('should apply row offset', () => {
    const renderer = new Renderer(2, 2)
    renderer.setRowOffset(5)
    expect(renderer.rowOffset).toBe(5)
  })

  it('should handle color codes', () => {
    const renderer = new Renderer(1, 1)
    const buffer = new Uint32Array([
      0x41, // 'A'
      0x01_05_1f, // fg=31 (red), bg=5, styles=1 (bold)
    ])

    const output = renderer.renderDiff(buffer)

    // Should contain bold escape
    expect(output).toContain('\x1b[1m')
    // Should contain foreground color
    expect(output).toContain('\x1b[38;5;31m')
  })
})
