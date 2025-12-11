import NotionPage from '@/components/NotionPage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import BlogPostListPage from '@/themes/next/components/BlogPostListPage'
import BlogPostListScroll from '@/themes/next/components/BlogPostListScroll'
import BlogPostArchive from '@/themes/next/components/BlogPostArchive'
import TagItem from '@/themes/next/components/TagItem'
import CONFIG from './config'
import { AuroraStyles } from './style'

const updateDocumentTheme = nextTheme => {
  if (!isBrowser) return
  const root = document.documentElement
  root.setAttribute('data-aurora-theme', nextTheme)
  root.classList.toggle('dark', nextTheme === 'dark')
  root.classList.toggle('light', nextTheme !== 'dark')
}

const parseJSONConfig = (value, fallback = []) => {
  if (!value) return fallback
  try {
    if (Array.isArray(value)) return value
    return JSON.parse(value)
  } catch (error) {
    console.warn('[aurora] Failed to parse config JSON', error)
    return fallback
  }
}

const deriveNewsFromPosts = posts => {
  if (!posts || posts.length === 0) return []
  return posts.slice(0, 3).map(post => ({
    date: post?.publishDate || post?.date?.start_date || '',
    title: post?.title || 'Untitled',
    summary: post?.summary || post?.brief || '',
    href: post?.href || (post?.slug ? `/${post.slug}` : '#')
  }))
}

const formatNewsDate = (dateStr, locale = 'en-US') => {
  if (!dateStr) return ''
  const safeDate = new Date(`${dateStr}T00:00:00Z`)
  if (Number.isNaN(safeDate.getTime())) return dateStr
  try {
    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(safeDate)
  } catch (err) {
    return safeDate.toISOString().substring(0, 10)
  }
}

const useAuroraTheme = () => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    if (!isBrowser) return
    const stored = localStorage.getItem('auroraTheme')
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
      updateDocumentTheme(stored)
      return
    }
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
    const nextTheme = prefersDark ? 'dark' : 'light'
    setTheme(nextTheme)
    updateDocumentTheme(nextTheme)
  }, [])

  useEffect(() => {
    if (!isBrowser) return
    updateDocumentTheme(theme)
    localStorage.setItem('auroraTheme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(current => (current === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggleTheme }
}

const AuroraHeader = ({ brand, navLinks, contact, onToggleTheme, theme }) => {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!isBrowser) return
    const handleScroll = () => {
      setScrolled(window.scrollY > 12)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const closeMenu = () => setMenuOpen(false)
    router.events?.on('routeChangeComplete', closeMenu)
    return () => {
      router.events?.off('routeChangeComplete', closeMenu)
    }
  }, [router])

  const currentPath = router?.asPath || '/'

  return (
    <header className={`aurora-header${scrolled ? ' is-scrolled' : ''}`} role='banner'>
      <div className='aurora-nav-wrap'>
        <SmartLink href='/' className='aurora-brand'>
          <span className='aurora-brand-avatar' aria-hidden='true' />
          <span>
            <span className='aurora-brand-name'>{brand.name}</span>
            <span className='aurora-brand-role'>{brand.role}</span>
          </span>
        </SmartLink>

        <nav className='aurora-nav' aria-label='Primary'>
          <ul className='aurora-nav-list'>
            {navLinks.map(link => {
              const isActive = link.href === '/' ? currentPath === '/' : currentPath.startsWith(link.href)
              return (
                <li key={link.href}>
                  <SmartLink
                    href={link.href}
                    className='aurora-nav-link'
                    aria-current={isActive ? 'page' : undefined}>
                    {link.label}
                  </SmartLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className='aurora-nav-actions'>
          <button
            type='button'
            aria-label='Toggle color mode'
            className='aurora-btn aurora-btn-icon'
            onClick={onToggleTheme}>
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          {contact?.href && (
            <SmartLink href={contact.href} className='aurora-btn aurora-btn-primary'>
              {contact.label}
            </SmartLink>
          )}
          <button
            type='button'
            className='aurora-btn aurora-btn-icon aurora-menu-toggle'
            aria-label='Open mobile menu'
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(open => !open)}>
            ☰
          </button>
        </div>
      </div>

      <div className={`aurora-mobile-menu${menuOpen ? ' open' : ''}`} aria-label='移动导航'>
        <ul>
          {navLinks.map(link => {
            const isActive = link.href === '/' ? currentPath === '/' : currentPath.startsWith(link.href)
            return (
              <li key={`mobile-${link.href}`}>
                <SmartLink
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}>
                  {link.label}
                </SmartLink>
              </li>
            )
          })}
          {contact?.href && (
            <li>
              <SmartLink href={contact.href}>{contact.label}</SmartLink>
            </li>
          )}
        </ul>
      </div>
    </header>
  )
}

const AuroraHero = ({ organization, headline, description, cta, tags, card }) => (
  <section className='aurora-hero' aria-labelledby='aurora-hero-heading'>
    <div>
      <p className='aurora-subtitle'>{organization}</p>
      <h1 id='aurora-hero-heading'>{headline}</h1>
      <p className='aurora-subtitle'>{description}</p>
      <div className='aurora-cta-group'>
        {cta?.primary && (
          <SmartLink href={cta.primary.href} className='aurora-btn aurora-btn-primary'>
            {cta.primary.label}
          </SmartLink>
        )}
        {cta?.secondary && (
          <SmartLink href={cta.secondary.href} className='aurora-btn'>
            {cta.secondary.label}
          </SmartLink>
        )}
      </div>
      <div className='aurora-hero-tags'>
        {tags.map(tag => (
          <span key={tag} className='aurora-tag'>
            {tag}
          </span>
        ))}
      </div>
    </div>

    <div className='aurora-hero-card' aria-live='polite'>
      <h3 style={{ margin: '0.25rem 0 0' }}>{card.title}</h3>
      <ul style={{ margin: '0.65rem 0 0 1rem', padding: 0 }}>
        {card.items.map((item, idx) => (
          <li key={`hero-card-${idx}`}>{item}</li>
        ))}
      </ul>
    </div>
  </section>
)

const AuroraQuickNav = ({ items }) => (
  <section className='aurora-quick-grid' aria-label='快速导航'>
    {items.map(item => (
      <SmartLink key={item.href} href={item.href} className='aurora-quick-item'>
        <span className='aurora-quick-title'>{item.title}</span>
        <span className='aurora-quick-desc'>{item.desc}</span>
      </SmartLink>
    ))}
  </section>
)

const AuroraNews = ({ items, locale }) => (
  <section className='aurora-section' aria-label='最新动态'>
    <h2>Latest News</h2>
    <div className='aurora-news-grid'>
      {items.map(item => (
        <article key={item.title + item.date} className='aurora-news-card'>
          <time dateTime={item.date}>{formatNewsDate(item.date, locale)}</time>
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
          {item.href && (
            <SmartLink href={item.href}>Read more -&gt;</SmartLink>
          )}
        </article>
      ))}
    </div>
  </section>
)

const AuroraFooter = ({ brand, links }) => {
  const year = new Date().getFullYear()
  return (
    <footer className='aurora-footer'>
      <div className='aurora-footer-wrap'>
        <div>
          &copy; {year} {brand.name} - All rights reserved.
        </div>
        <div className='aurora-footer-links'>
          {links.map(link => (
            <SmartLink key={link.href} href={link.href} target={link.href?.startsWith('http') ? '_blank' : undefined} rel='noreferrer'>
              {link.label}
            </SmartLink>
          ))}
        </div>
      </div>
    </footer>
  )
}

const AuroraContentSection = ({ children }) => (
  <section className='aurora-content-shell'>
    <div className='aurora-card-surface'>{children}</div>
  </section>
)

const LayoutBase = props => {
  const { children, headerSlot } = props
  const brandName = siteConfig('AURORA_BRAND_NAME', 'Aurora Scholar', CONFIG)
  const brandRole = siteConfig('AURORA_BRAND_ROLE', 'Researcher', CONFIG)
  const navLinks = useMemo(
    () => parseJSONConfig(siteConfig('AURORA_NAV_LINKS', null, CONFIG), []),
    []
  )
  const contactEmail = siteConfig('AURORA_CONTACT_EMAIL', null, CONFIG)
  const contact = contactEmail
    ? {
        href: `mailto:${contactEmail}`,
        label: siteConfig('AURORA_CONTACT_LABEL', 'Contact', CONFIG)
      }
    : null
  const footerLinks = useMemo(
    () => parseJSONConfig(siteConfig('AURORA_FOOTER_LINKS', null, CONFIG), []),
    []
  )
  const { theme, toggleTheme } = useAuroraTheme()

  return (
    <div id='theme-aurora' className={`${siteConfig('FONT_STYLE')} scroll-smooth`}>
      <AuroraStyles />
      <a href='#aurora-main' className='aurora-skip-link'>
        Skip to main content
      </a>
      <AuroraHeader
        brand={{ name: brandName, role: brandRole }}
        navLinks={navLinks}
        contact={contact}
        onToggleTheme={toggleTheme}
        theme={theme}
      />
      {headerSlot}
      <main id='aurora-main'>{children}</main>
      <AuroraFooter brand={{ name: brandName }} links={footerLinks} />
    </div>
  )
}

const LayoutIndex = props => {
  const organization = siteConfig('AURORA_ORGANIZATION', siteConfig('TITLE'), CONFIG)
  const heroHeadline = siteConfig('TITLE') || 'Academic Portfolio'
  const heroDescription = siteConfig('AURORA_TAGLINE', siteConfig('DESCRIPTION'), CONFIG)
  const heroTags = parseJSONConfig(siteConfig('AURORA_RESEARCH_TAGS', null, CONFIG), [])
  const highlights = parseJSONConfig(siteConfig('AURORA_HERO_CARD_ITEMS', null, CONFIG), [])
  const quickLinks = parseJSONConfig(siteConfig('AURORA_QUICK_LINKS', null, CONFIG), [])
  const configuredNews = parseJSONConfig(siteConfig('AURORA_NEWS_ITEMS', null, CONFIG), [])
  const newsItems = configuredNews.length > 0 ? configuredNews : deriveNewsFromPosts(props.latestPosts)
  const { locale } = useGlobal()

  const cta = {
    primary: {
      label: siteConfig('AURORA_CTA_PRIMARY_TEXT', 'Explore Research', CONFIG),
      href: siteConfig('AURORA_CTA_PRIMARY_LINK', '/research', CONFIG)
    },
    secondary: {
      label: siteConfig('AURORA_CTA_SECONDARY_TEXT', 'View Publications', CONFIG),
      href: siteConfig('AURORA_CTA_SECONDARY_LINK', '/publications', CONFIG)
    }
  }

  return (
    <>
      <AuroraHero
        organization={organization}
        headline={heroHeadline}
        description={heroDescription}
        cta={cta}
        tags={heroTags}
        card={{
          title: siteConfig('AURORA_HERO_CARD_TITLE', 'Recent Highlights', CONFIG),
          items: highlights
        }}
      />
      {quickLinks.length > 0 && <AuroraQuickNav items={quickLinks} />}
      {newsItems.length > 0 && <AuroraNews items={newsItems} locale={locale?.lang || 'en-US'} />}
    </>
  )
}

const LayoutPostList = props => {
  const isPageMode = siteConfig('POST_LIST_STYLE') === 'page'
  return (
    <AuroraContentSection>
      {isPageMode ? (
        <BlogPostListPage {...props} />
      ) : (
        <BlogPostListScroll {...props} showSummary={true} />
      )}
    </AuroraContentSection>
  )
}

const LayoutSearch = props => {
  const { posts = [], keyword } = props
  const { locale } = useGlobal()
  return (
    <AuroraContentSection>
      <div className='mb-5 font-semibold'>
        <i className='fas fa-search mr-2' /> {posts.length}{' '}
        {locale.COMMON.RESULT_OF_SEARCH} “{keyword}”
      </div>
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogPostListPage {...props} />
      ) : (
        <BlogPostListScroll {...props} showSummary={true} />
      )}
    </AuroraContentSection>
  )
}

const LayoutSlug = props => (
  <AuroraContentSection>
    <div id='article-wrapper'>
      <NotionPage {...props} />
    </div>
  </AuroraContentSection>
)

const LayoutArchive = props => {
  const { archivePosts } = props
  return (
    <AuroraContentSection>
      {Object.keys(archivePosts || {}).map(key => (
        <BlogPostArchive key={key} posts={archivePosts[key]} archiveTitle={key} />
      ))}
    </AuroraContentSection>
  )
}

const LayoutCategoryIndex = props => {
  const { categoryOptions = [] } = props
  const { locale } = useGlobal()
  return (
    <AuroraContentSection>
      <h1 className='text-2xl font-bold mb-4'>{locale.COMMON.CATEGORY}</h1>
      <div className='flex flex-wrap gap-3'>
        {categoryOptions.map(category => (
          <SmartLink key={category.name} href={`/category/${category.name}`} className='aurora-btn'>
            {category.name} ({category.count})
          </SmartLink>
        ))}
      </div>
    </AuroraContentSection>
  )
}

const LayoutTagIndex = props => {
  const { tagOptions = [] } = props
  const { locale } = useGlobal()
  return (
    <AuroraContentSection>
      <h1 className='text-2xl font-bold mb-4'>{locale.COMMON.TAGS}</h1>
      <div className='flex flex-wrap'>
        {tagOptions.map(tag => (
          <TagItem key={tag.name} tag={tag} />
        ))}
      </div>
    </AuroraContentSection>
  )
}

const Layout404 = () => (
  <AuroraContentSection>
    <div className='text-center'>
      <p className='text-lg font-semibold mb-2'>404 - Page not found</p>
      <p>We could not find the page you were looking for. Please return home.</p>
      <div className='mt-4'>
        <SmartLink href='/' className='aurora-btn aurora-btn-primary'>
          Back to Home
        </SmartLink>
      </div>
    </div>
  </AuroraContentSection>
)

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
