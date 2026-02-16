import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { decryptEmail } from '@/lib/plugins/mailEncrypt'
import LazyImage from '@/components/LazyImage'
import { MenuList } from './MenuList'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import { useEffect, useRef } from 'react'

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

const formatTerminalLoginTime = date => {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')
  return `${weekdays[date.getDay()]} ${months[date.getMonth()]} ${day} ${hour}:${minute}:${second}`
}

/**
 * 模块级终端会话缓存 — 在整个浏览器会话期间只创建一次。
 * 只有用户刷新页面（JS 模块重新加载）时才会重置。
 * 客户端路由切换导致的组件 remount 不会影响这个值。
 */
let _cachedTerminalSession = null
function getOrCreateTerminalSession() {
  if (!_cachedTerminalSession) {
    const ttySuffix = Math.floor(Math.random() * 10)
    _cachedTerminalSession = {
      loginTime: formatTerminalLoginTime(new Date()),
      tty: `ttys00${ttySuffix}`
    }
  }
  return _cachedTerminalSession
}

/**
 * 侧边栏导航 — Claude Docs 风格
 * 上方: 站名 → 下方: 导航链接 + 社交图标
 */
export default function NavBar(props) {
  const { siteInfo } = useGlobal()
  const avatar =
    siteConfig('CLAUDE_PROFILE_AVATAR', '', CONFIG) ||
    siteConfig('AVATAR') ||
    siteInfo?.icon ||
    '/avatar.svg'
  const blogName = siteConfig('CLAUDE_BLOG_NAME')
  const author = siteConfig('AUTHOR') || blogName
  const bio = siteConfig('BIO')
  const githubUrl = siteConfig('CONTACT_GITHUB')
  const githubLabel = getGithubUsername(githubUrl) || githubUrl?.replace(/^https?:\/\//, '')
  const profileEmail = resolveEmail(siteConfig('CONTACT_EMAIL'))
  const hasContact = Boolean(githubUrl || profileEmail)
  const terminalMetaRef = useRef(null)
  const terminalShellRef = useRef(null)
  const terminalShellTextRef = useRef(null)
  const terminalCommandRef = useRef(null)
  const terminalCursorRef = useRef(null)
  const terminalBodyRef = useRef(null)
  const terminalSession = getOrCreateTerminalSession()

  useEffect(() => {
    const shell = terminalShellRef.current
    const body = terminalBodyRef.current
    if (!shell || !body) {
      return
    }

    const maxFontSize = 13
    const minFontSize = 8
    const step = 0.5

    const fitLine = ({ ref, cssVar, max, min }) => {
      if (!ref?.current) {
        return
      }
      const line = ref.current
      let size = max
      line.style.setProperty(cssVar, `${size}px`)
      while (size > min && line.scrollWidth > line.clientWidth) {
        size = Math.max(min, size - step)
        line.style.setProperty(cssVar, `${size}px`)
      }
    }

    const fitShellLine = () => {
      if (
        !terminalShellRef.current ||
        !terminalShellTextRef.current ||
        !terminalCommandRef.current ||
        !terminalCursorRef.current
      ) {
        return
      }

      const shellLine = terminalShellRef.current
      let size = maxFontSize
      shellLine.style.setProperty('--claude-terminal-shell-font-size', `${size}px`)

      const isOverflow = () => {
        const shellWidth = shellLine.clientWidth
        const textWidth = terminalShellTextRef.current.getBoundingClientRect().width
        const commandWidth = terminalCommandRef.current.getBoundingClientRect().width
        const cursorWidth = terminalCursorRef.current.getBoundingClientRect().width
        return textWidth + commandWidth + cursorWidth > shellWidth
      }

      while (size > minFontSize && isOverflow()) {
        size = Math.max(minFontSize, size - step)
        shellLine.style.setProperty('--claude-terminal-shell-font-size', `${size}px`)
      }
    }

    const fitTerminalLines = () => {
      fitLine({
        ref: terminalMetaRef,
        cssVar: '--claude-terminal-meta-font-size',
        max: 10,
        min: 6
      })
      fitShellLine()
    }

    fitTerminalLines()

    const observer = new ResizeObserver(() => {
      fitTerminalLines()
    })
    observer.observe(body)

    return () => {
      observer.disconnect()
    }
  }, [author, blogName])

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

          <section className='claude-profile-section claude-profile-terminal-section'>
            <div className='claude-terminal'>
              <div className='claude-terminal-bar' aria-hidden='true'>
                <span className='claude-terminal-dot claude-terminal-dot-red' />
                <span className='claude-terminal-dot claude-terminal-dot-amber' />
                <span className='claude-terminal-dot claude-terminal-dot-green' />
              </div>
              <div className='claude-terminal-body' ref={terminalBodyRef}>
                <div className='claude-terminal-line claude-terminal-meta' ref={terminalMetaRef}>
                  Last login: {terminalSession.loginTime} on {terminalSession.tty}
                </div>
                <div className='claude-terminal-line claude-terminal-shell' ref={terminalShellRef}>
                  <span className='claude-terminal-shell-text' ref={terminalShellTextRef}>
                    {`${author}@Macintosh ~ % `}
                  </span>
                  <span ref={terminalCommandRef}>
                    <SmartLink href='/' className='claude-terminal-command'>
                      {blogName}
                    </SmartLink>
                  </span>
                  <span className='claude-terminal-cursor' ref={terminalCursorRef} aria-hidden='true' />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 移动端：保留简洁导航 */}
      <div className='flex flex-col gap-6 md:hidden'>
        <header className='px-1'>
          <SmartLink href='/'>
            <div className='claude-site-title' id='blog-name'>
              {blogName}
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
