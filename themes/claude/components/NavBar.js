import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { decryptEmail } from '@/lib/plugins/mailEncrypt'
import LazyImage from '@/components/LazyImage'
import { MenuList } from './MenuList'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

const getGithubUsername = githubUrl => {
  if (!githubUrl || typeof githubUrl !== 'string') {
    return ''
  }

  try {
    const { pathname } = new URL(githubUrl)
    return pathname.replace(/^\/+|\/+$/g, '')
  } catch (error) {
    return githubUrl.replace(/^https?:\/\/github\.com\//, '').replace(/^\/+|\/+$/g, '')
  }
}

const resolveEmail = raw => {
  if (!raw || typeof raw !== 'string') {
    return ''
  }
  if (raw.includes('@')) {
    return raw
  }
  return decryptEmail(raw)
}

/**
 * 侧边栏导航 — Claude Docs 风格
 * 上方: 站名 → 下方: 导航链接 + 社交图标
 */
export default function NavBar(props) {
  const { siteInfo } = useGlobal()
  const subtitleDarkOnly = siteConfig('CLAUDE_SUBTITLE_DARK_ONLY', false, CONFIG)
  const avatar =
    siteConfig('CLAUDE_PROFILE_AVATAR', '', CONFIG) ||
    siteConfig('AVATAR') ||
    siteInfo?.icon ||
    '/avatar.svg'
  const author = siteConfig('AUTHOR') || siteConfig('CLAUDE_BLOG_NAME')
  const bio = siteConfig('BIO')
  const githubUrl = siteConfig('CONTACT_GITHUB')
  const githubLabel = getGithubUsername(githubUrl) || githubUrl?.replace(/^https?:\/\//, '')
  const profileEmail = resolveEmail(siteConfig('CONTACT_EMAIL'))
  const hasContact = Boolean(githubUrl || profileEmail)

  return (
    <>
      {/* 桌面端：GitHub Profile 风格侧栏 */}
      <div className='hidden md:block'>
        <div className='claude-sidebar-profile'>
          <div className='claude-profile-avatar-wrap'>
            <LazyImage
              src={avatar}
              alt={author}
              width={260}
              height={260}
              className='claude-profile-avatar'
              priority
            />
          </div>

          <div className='claude-profile-heading'>
            <div className='claude-profile-name'>{author}</div>
          </div>

          {bio && <div className='claude-profile-bio'>{bio}</div>}

          {hasContact && (
            <section className='claude-profile-section claude-profile-contact-section'>
              {githubUrl && (
                <SmartLink href={githubUrl} className='claude-profile-contact-row'>
                  <i className='fab fa-github claude-profile-contact-icon' />
                  <span className='claude-profile-contact-value'>{githubLabel}</span>
                </SmartLink>
              )}
              {profileEmail && (
                <a href={`mailto:${profileEmail}`} className='claude-profile-contact-row'>
                  <i className='far fa-envelope claude-profile-contact-icon' />
                  <span className='claude-profile-contact-value'>{profileEmail}</span>
                </a>
              )}
            </section>
          )}

          <section className='claude-profile-section claude-profile-nav-section'>
            <MenuList {...props} />
          </section>
        </div>
      </div>

      {/* 移动端：保留简洁导航 */}
      <div className='flex flex-col gap-6 md:hidden'>
        <header className='px-1'>
          <SmartLink href='/'>
            <div className='claude-site-title' id='blog-name'>
              {siteConfig('CLAUDE_BLOG_NAME')}
            </div>
            <div
              className={`claude-site-subtitle mt-0.5 ${subtitleDarkOnly ? 'hidden dark:block' : ''}`}
              id='blog-name-en'>
              {siteConfig('CLAUDE_BLOG_NAME_EN')}
            </div>
          </SmartLink>
        </header>

        <nav>
          <MenuList {...props} />
        </nav>
      </div>
    </>
  )
}
