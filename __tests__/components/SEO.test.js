import { render } from '@testing-library/react'
import SEO, { generateStructuredData } from '@/components/SEO'

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn()
}))

jest.mock('@/lib/global', () => ({
  useGlobal: () => ({
    locale: {
      NAV: { ARCHIVE: 'Archive', SEARCH: 'Search', PAGE_NOT_FOUND: 'Not Found' },
      COMMON: { CATEGORY: 'Category', TAGS: 'Tags' }
    }
  })
}))

const { siteConfig } = require('@/lib/config')

const baseSiteConfig = {
  AUTHOR: 'Example Author',
  BACKGROUND_DARK: '#ffffff',
  BLOG_FAVICON: '/favicon.ico',
  FONT_URL: '',
  KEYWORDS: 'notion,next',
  LANG: 'en-US',
  LINK: 'https://example.com',
  PATH: '',
  SUB_PATH: '',
  TITLE: 'Example Blog'
}

const renderSeo = fontUrl => {
  siteConfig.mockImplementation((key, defaultVal) => {
    if (key === 'FONT_URL') return fontUrl
    return Object.prototype.hasOwnProperty.call(baseSiteConfig, key)
      ? baseSiteConfig[key]
      : defaultVal
  })

  return render(
    <SEO
      siteInfo={{
        title: 'Example Blog',
        description: 'Example description',
        icon: '/logo.png',
        pageCover: '/cover.png',
        link: 'https://example.com'
      }}
    />
  )
}

describe('SEO structured data', () => {
  const siteInfo = {
    title: 'Example Blog',
    description: 'Example description',
    icon: '/logo.png'
  }

  it('generates BlogPosting data for published articles', () => {
    const data = generateStructuredData(
      {
        type: 'Post',
        title: 'Structured data in NotionNext',
        description: 'A test article',
        publishTime: '2026-07-01T00:00:00.000Z',
        modifiedTime: '2026-07-02T00:00:00.000Z',
        tags: ['notion', 'seo'],
        category: 'Engineering'
      },
      siteInfo,
      'https://example.com/article/structured-data',
      'https://example.com/cover.png',
      'Example Author',
      'https://example.com'
    )

    expect(data).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'Structured data in NotionNext',
      url: 'https://example.com/article/structured-data',
      datePublished: '2026-07-01T00:00:00.000Z',
      dateModified: '2026-07-02T00:00:00.000Z',
      keywords: 'notion, seo',
      articleSection: 'Engineering',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://example.com/article/structured-data'
      }
    })
    expect(data.publisher.logo.url).toBe('https://example.com/logo.png')
  })

  it('generates WebSite data for non-article pages', () => {
    const data = generateStructuredData(
      { type: 'Page' },
      siteInfo,
      'https://example.com/about',
      'https://example.com/cover.png',
      'Example Author',
      'https://example.com'
    )

    expect(data).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Example Blog',
      url: 'https://example.com'
    })
  })
})

describe('SEO font resource hints', () => {
  it('omits Google Fonts hints for non-Google font URLs', () => {
    const { container } = renderSeo(
      'https://npm.elemecdn.com/lxgw-wenkai-webfont@1.6.0/style.css'
    )

    expect(
      container.querySelector('link[href="//fonts.googleapis.com"]')
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('link[href="https://fonts.gstatic.com"]')
    ).not.toBeInTheDocument()
  })

  it('emits Google Fonts hints for Google font URLs', () => {
    const { container } = renderSeo([
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap'
    ])

    expect(
      container.querySelector('link[href="//fonts.googleapis.com"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('link[href="https://fonts.gstatic.com"]')
    ).toBeInTheDocument()
  })
})

describe('font config defaults', () => {
  const originalFontUrl = process.env.NEXT_PUBLIC_FONT_URL

  afterEach(() => {
    jest.resetModules()
    if (originalFontUrl === undefined) {
      delete process.env.NEXT_PUBLIC_FONT_URL
    } else {
      process.env.NEXT_PUBLIC_FONT_URL = originalFontUrl
    }
  })

  it('does not load large Chinese Google Fonts by default', () => {
    delete process.env.NEXT_PUBLIC_FONT_URL
    jest.resetModules()

    const fontConfig = require('@/conf/font.config')
    const defaultFontUrls = Array.isArray(fontConfig.FONT_URL)
      ? fontConfig.FONT_URL
      : [fontConfig.FONT_URL]

    expect(defaultFontUrls).not.toEqual(
      expect.arrayContaining([
        expect.stringContaining('Noto+Sans+SC'),
        expect.stringContaining('Noto+Serif+SC')
      ])
    )
  })

  it('keeps NEXT_PUBLIC_FONT_URL opt-in support', () => {
    process.env.NEXT_PUBLIC_FONT_URL =
      'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400&display=swap'
    jest.resetModules()

    const fontConfig = require('@/conf/font.config')

    expect(fontConfig.FONT_URL).toBe(process.env.NEXT_PUBLIC_FONT_URL)
  })
})
