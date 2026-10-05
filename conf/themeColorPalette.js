const DEFAULT_LIGHT = {
  PRIMARY: '#2563eb',
  BG: '#ffffff',
  CARD: '#ffffff',
  TEXT: '#111827',
  TEXT_SECONDARY: '#6b7280',
  BORDER: '#e5e7eb'
}

const DEFAULT_DARK = {
  PRIMARY: '#60a5fa',
  BG: '#000000',
  CARD: '#111827',
  TEXT: '#e5e7eb',
  TEXT_SECONDARY: '#9ca3af',
  BORDER: '#374151'
}

const THEME_COLOR_DEFAULTS = {
  commerce: { PRIMARY: '#D2232A', BG: '#f5f5f5' },
  endspace: {
    PRIMARY: '#FBFB45',
    BG: '#fafafa',
    CARD: '#ffffff',
    TEXT: '#18181b',
    TEXT_SECONDARY: '#52525b',
    BORDER: '#e4e4e7',
    PRIMARY_DARK: '#fef08a',
    BG_DARK: '#09090b',
    CARD_DARK: '#18181b',
    TEXT_DARK: '#f4f4f5',
    TEXT_SECONDARY_DARK: '#d4d4d8',
    BORDER_DARK: '#3f3f46'
  },
  example: { PRIMARY: '#6b7280', BG: '#f8fafc' },
  fukasawa: { BG: '#eeedee' },
  fuwari: {
    PRIMARY: '#b8a320',
    BG: '#f3f4f8',
    CARD: '#ffffff',
    TEXT: '#232a37',
    TEXT_SECONDARY: '#72767d',
    BORDER: '#e9e8df',
    PRIMARY_DARK: '#d3bf53',
    BG_DARK: '#0d1117',
    CARD_DARK: '#171f2c',
    TEXT_DARK: '#f3f4f6',
    TEXT_SECONDARY_DARK: '#9ca3af',
    BORDER_DARK: '#283446'
  },
  game: { PRIMARY: '#22c55e', BG: '#ffffff' },
  gitbook: { PRIMARY: '#16a34a' },
  heo: {
    PRIMARY: '#4f65f0',
    BG: '#f7f9fe',
    CARD: '#ffffff',
    TEXT: '#000000',
    TEXT_SECONDARY: '#4b5563',
    PRIMARY_DARK: '#4f65f0',
    BG_DARK: '#18171d',
    CARD_DARK: '#1e1e1e',
    TEXT_DARK: '#f3f4f6',
    TEXT_SECONDARY_DARK: '#d1d5db'
  },
  hexo: { PRIMARY: '#928CEE', BG: '#f5f5f5', TEXT: '#374151' },
  landing: { PRIMARY: '#ef4444' },
  magzine: { PRIMARY: '#7BE986', PRIMARY_DARK: '#62BA6B', BG: '#f6f6f1' },
  matery: { PRIMARY: '#4338ca', BG: '#f5f5f5' },
  medium: { PRIMARY: '#4f46e5' },
  movie: { PRIMARY: '#2563eb', PRIMARY_DARK: '#ca8a04' },
  nav: { PRIMARY: '#000000', BG: '#fbfbfb', TEXT: '#8c8c8c' },
  next: { PRIMARY: '#4e80ee', BG: '#eeedee' },
  nobelium: { PRIMARY: '#6b7280' },
  opc: {
    PRIMARY: '#2563eb',
    BG: '#f8fafc',
    CARD: '#ffffff',
    TEXT: '#111827',
    TEXT_SECONDARY: '#556070',
    BORDER: '#e2e8f0',
    PRIMARY_DARK: '#60a5fa',
    BG_DARK: '#020617',
    CARD_DARK: '#0f172a',
    TEXT_DARK: '#f8fafc',
    TEXT_SECONDARY_DARK: '#94a3b8',
    BORDER_DARK: '#1e293b'
  },
  photo: { PRIMARY: '#2563eb', PRIMARY_DARK: '#ca8a04' },
  plog: { PRIMARY: '#1d4ed8' },
  proxio: {
    PRIMARY: '#3758f9',
    PRIMARY_DARK: '#3758f9',
    BG: '#ffffff',
    CARD: '#ffffff',
    TEXT: '#111827',
    TEXT_SECONDARY: '#637381',
    BORDER: '#e5e7eb',
    BG_DARK: '#121212',
    CARD_DARK: '#181818',
    TEXT_DARK: '#f3f4f6',
    TEXT_SECONDARY_DARK: '#9ca3af',
    BORDER_DARK: '#333333'
  },
  simple: { PRIMARY: '#dd3333', TEXT: '#111827' },
  starter: { PRIMARY: '#3758f9', PRIMARY_DARK: '#3758f9', BG_DARK: '#111928' },
  thoughtlite: {
    PRIMARY: '#2563eb',
    BG: '#faf9f7',
    CARD: '#ffffff',
    TEXT: '#1a1a1a',
    TEXT_SECONDARY: '#6b6b6b',
    BORDER: '#e8e6e3',
    PRIMARY_DARK: '#60a5fa',
    BG_DARK: '#0c0c0d',
    CARD_DARK: '#141416',
    TEXT_DARK: '#ececec',
    TEXT_SECONDARY_DARK: '#9ca3af',
    BORDER_DARK: '#27272a'
  },
  typography: { PRIMARY: '#2e405b', TEXT: '#276077' }
}

const BASE_PALETTE = [
  ['PRIMARY', '主色'],
  ['BG', '页面背景'],
  ['CARD', '卡片背景'],
  ['TEXT', '主文字'],
  ['TEXT_SECONDARY', '次级文字'],
  ['BORDER', '边框'],
  ['PRIMARY_DARK', '深色模式：主色'],
  ['BG_DARK', '深色模式：页面背景'],
  ['CARD_DARK', '深色模式：卡片背景'],
  ['TEXT_DARK', '深色模式：主文字'],
  ['TEXT_SECONDARY_DARK', '深色模式：次级文字'],
  ['BORDER_DARK', '深色模式：边框']
]

export function getThemeColorDefault(themeId, token) {
  const theme = THEME_COLOR_DEFAULTS[themeId] || {}
  if (token.endsWith('_DARK')) {
    const lightToken = token.replace(/_DARK$/, '')
    return theme[token] || DEFAULT_DARK[lightToken] || DEFAULT_DARK.PRIMARY
  }
  return theme[token] || DEFAULT_LIGHT[token] || DEFAULT_LIGHT.PRIMARY
}

export function getThemeColorCssVar(themeId, token) {
  return `--${themeId}-color-${token.toLowerCase().replace(/_/g, '-')}`
}

export function withBaseThemePalette(themeId, palette = []) {
  const existing = new Set(palette.map(item => item.key))
  const prefix = String(themeId).toUpperCase()
  const fallback = BASE_PALETTE
    .map(([token, label]) => ({
      key: `${prefix}_COLOR_${token}`,
      cssVar: getThemeColorCssVar(themeId, token),
      label,
      defaultValue: getThemeColorDefault(themeId, token)
    }))
    .filter(item => !existing.has(item.key))

  return palette.concat(fallback)
}
