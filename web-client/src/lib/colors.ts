/**
 * Utility functions for color manipulation
 */

/**
 * Converts a hex color string to HSL
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const sanitizedHex = hex.replace(/^#/, '')

  // Handle shorthand hex like #f00
  let r = 0,
    g = 0,
    b = 0
  if (sanitizedHex.length === 3) {
    r = parseInt(sanitizedHex[0] + sanitizedHex[0], 16) / 255
    g = parseInt(sanitizedHex[1] + sanitizedHex[1], 16) / 255
    b = parseInt(sanitizedHex[2] + sanitizedHex[2], 16) / 255
  } else if (sanitizedHex.length === 6) {
    r = parseInt(sanitizedHex.substring(0, 2), 16) / 255
    g = parseInt(sanitizedHex.substring(2, 4), 16) / 255
    b = parseInt(sanitizedHex.substring(4, 6), 16) / 255
  }

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

/**
 * Returns a contrasting text color (white or a dark shade of the input color)
 * based on the background color lightness.
 */
export function getContrastingTextColor(hex: string): string {
  if (!hex || !/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    return 'inherit'
  }

  const sanitizedHex = hex.replace(/^#/, '')
  let r = 0,
    g = 0,
    b = 0
  if (sanitizedHex.length === 3) {
    r = parseInt(sanitizedHex[0] + sanitizedHex[0], 16)
    g = parseInt(sanitizedHex[1] + sanitizedHex[1], 16)
    b = parseInt(sanitizedHex[2] + sanitizedHex[2], 16)
  } else if (sanitizedHex.length === 6) {
    r = parseInt(sanitizedHex.substring(0, 2), 16)
    g = parseInt(sanitizedHex.substring(2, 4), 16)
    b = parseInt(sanitizedHex.substring(4, 6), 16)
  }

  // YIQ formula to calculate perceived brightness
  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  if (yiq >= 150) {
    // 150 is a safe threshold for "light enough to need dark text"
    const { h, s, l } = hexToHsl(hex)
    // Return a much darker version of the same color
    return `hsl(${h}, ${Math.max(s - 10, 0)}%, ${Math.max(l - 50, 10)}%)`
  }

  return '#ffffff'
}
