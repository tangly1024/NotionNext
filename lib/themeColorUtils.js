const XUHOME_FOREGROUND_VARS = {
  XUHOME_COLOR_PRIMARY: '--xuhome-on-primary-light',
  XUHOME_COLOR_PRIMARY_HOVER: '--xuhome-on-primary-hover-light',
  XUHOME_COLOR_ACCENT: '--xuhome-on-accent-light',
  XUHOME_COLOR_PRIMARY_DARK: '--xuhome-on-primary-dark',
  XUHOME_COLOR_PRIMARY_HOVER_DARK: '--xuhome-on-primary-hover-dark',
  XUHOME_COLOR_ACCENT_DARK: '--xuhome-on-accent-dark'
}

function hexToRgb(hex) {
  const normalized = String(hex || '')
    .trim()
    .replace(/^#/, '')
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map(value => value + value)
          .join('')
      : normalized
  if (!/^[0-9a-f]{6}$/i.test(expanded)) return null
  return [0, 2, 4].map(offset =>
    Number.parseInt(expanded.slice(offset, offset + 2), 16)
  )
}

function relativeLuminance(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  const channels = rgb.map(value => {
    const channel = value / 255
    return channel <= 0.04045
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4)
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

function contrastRatio(first, second) {
  const firstLuminance = relativeLuminance(first)
  const secondLuminance = relativeLuminance(second)
  if (firstLuminance == null || secondLuminance == null) return 0
  const lighter = Math.max(firstLuminance, secondLuminance)
  const darker = Math.min(firstLuminance, secondLuminance)
  return (lighter + 0.05) / (darker + 0.05)
}

export function getReadableForeground(
  background,
  dark = '#000000',
  light = '#ffffff'
) {
  return contrastRatio(background, dark) >= contrastRatio(background, light)
    ? dark
    : light
}

export function writeThemePreviewColor(root, themeId, item, value) {
  root.style.setProperty(item.cssVar, value)

  // The overscroll canvas is outside #theme-heo and cannot inherit its variables.
  if (
    themeId === 'heo' &&
    ['HEO_COLOR_BG', 'HEO_COLOR_BG_DARK'].includes(item.key)
  ) {
    root.ownerDocument?.documentElement.style.setProperty(item.cssVar, value)
  }

  if (themeId === 'xuhome') {
    const foregroundVar = XUHOME_FOREGROUND_VARS[item.key]
    if (foregroundVar) {
      root.style.setProperty(foregroundVar, getReadableForeground(value))
    }
  }
}
