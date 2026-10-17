import { render } from '@testing-library/react'
import { siteConfig } from '@/lib/config'
import { writeThemePreviewColor } from '@/lib/themeColorUtils'
import { Style } from '@/themes/heo/style'

jest.mock('@/lib/config', () => ({ siteConfig: jest.fn() }))

const lightBackground = { key: 'HEO_COLOR_BG', cssVar: '--heo-color-bg' }
const darkBackground = {
  key: 'HEO_COLOR_BG_DARK',
  cssVar: '--heo-color-bg-dark'
}

beforeEach(() => {
  siteConfig.mockImplementation((key, fallback) => fallback)
})

afterEach(() => {
  document.documentElement.removeAttribute('style')
})

it('updates both light and dark backgrounds outside the theme wrapper', () => {
  const { container, unmount } = render(
    <div id='theme-heo'>
      <Style />
    </div>
  )
  const root = container.firstChild
  writeThemePreviewColor(root, 'heo', lightBackground, '#aabbcc')
  writeThemePreviewColor(root, 'heo', darkBackground, '#112233')
  expect(root.style.getPropertyValue(lightBackground.cssVar)).toBe('#aabbcc')
  expect(root.style.getPropertyValue(darkBackground.cssVar)).toBe('#112233')
  expect(
    document.documentElement.style.getPropertyValue(lightBackground.cssVar)
  ).toBe('#aabbcc')
  expect(
    document.documentElement.style.getPropertyValue(darkBackground.cssVar)
  ).toBe('#112233')

  unmount()
  expect(
    document.documentElement.style.getPropertyValue(lightBackground.cssVar)
  ).toBe('')
  expect(
    document.documentElement.style.getPropertyValue(darkBackground.cssVar)
  ).toBe('')
})

it('restores existing document colors and priorities when leaving Heo', () => {
  const documentStyle = document.documentElement.style
  documentStyle.setProperty(lightBackground.cssVar, '#f0f0f0', 'important')
  const { container, unmount } = render(
    <div id='theme-heo'>
      <Style />
    </div>
  )
  writeThemePreviewColor(
    container.firstChild,
    'heo',
    lightBackground,
    '#aabbcc'
  )
  expect(documentStyle.getPropertyValue(lightBackground.cssVar)).toBe('#aabbcc')
  unmount()
  expect(documentStyle.getPropertyValue(lightBackground.cssVar)).toBe('#f0f0f0')
  expect(documentStyle.getPropertyPriority(lightBackground.cssVar)).toBe(
    'important'
  )
})

it('keeps other Heo colors and other themes scoped to their own root', () => {
  const root = document.createElement('div')
  const primary = { key: 'HEO_COLOR_PRIMARY', cssVar: '--heo-color-primary' }
  writeThemePreviewColor(root, 'heo', primary, '#123456')
  expect(root.style.getPropertyValue(primary.cssVar)).toBe('#123456')
  expect(document.documentElement.style.getPropertyValue(primary.cssVar)).toBe(
    ''
  )
  writeThemePreviewColor(root, 'hexo', lightBackground, '#abcdef')
  expect(
    document.documentElement.style.getPropertyValue(lightBackground.cssVar)
  ).toBe('')
})
