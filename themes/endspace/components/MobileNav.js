import { useRouter } from 'next/router'
import { useState, useEffect, useMemo, useRef } from 'react'
import { siteConfig } from '@/lib/config'
import { handleEmailClick } from '@/lib/plugins/mailEncrypt'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { EndspacePlayer } from './EndspacePlayer'
import NotionMenuIcon from './NotionMenuIcon'
import {
  IconMenu2,
  IconX,
  IconBrandX,
  IconChevronDown
} from '@tabler/icons-react'
import { getEndspaceActiveMenuName, getEndspaceMenuItems } from './menu'
// Social Icons (Solid)
import GithubFillIcon from 'remixicon-react/GithubFillIcon'
import WeiboFillIcon from 'remixicon-react/WeiboFillIcon'
import BilibiliFillIcon from 'remixicon-react/BilibiliFillIcon'
import TelegramFillIcon from 'remixicon-react/TelegramFillIcon'
import InstagramFillIcon from 'remixicon-react/InstagramFillIcon'
import YoutubeFillIcon from 'remixicon-react/YoutubeFillIcon'
import LinkedinBoxFillIcon from 'remixicon-react/LinkedinBoxFillIcon'
import WechatFillIcon from 'remixicon-react/WechatFillIcon'
import GlobeFillIcon from 'remixicon-react/GlobeFillIcon'
import MailFillIcon from 'remixicon-react/MailFillIcon'

const OrcidIcon = ({ size = 16 }) => (
  <i
    className='fab fa-orcid'
    aria-hidden='true'
    style={{ fontSize: size, lineHeight: 1 }}
  />
)

const CsdnIcon = ({ size = 16 }) => (
  <i
    className='fab fa-csdn'
    aria-hidden='true'
    style={{ fontSize: size, lineHeight: 1 }}
  />
)

const JuejinIcon = ({ size = 16 }) => (
  <i
    className='fab fa-juejin'
    aria-hidden='true'
    style={{ fontSize: size, lineHeight: 1 }}
  />
)


// Social icon mapping
const SocialIconComponents = {
  'CONTACT_GITHUB': GithubFillIcon,
  'CONTACT_ORCID': OrcidIcon,
  'CONTACT_CSDN': CsdnIcon,
  'CONTACT_JUEJIN': JuejinIcon,
  'CONTACT_TWITTER': IconBrandX,
  'CONTACT_WEIBO': WeiboFillIcon,
  'CONTACT_BILIBILI': BilibiliFillIcon,
  'CONTACT_TELEGRAM': TelegramFillIcon,
  'CONTACT_INSTAGRAM': InstagramFillIcon,
  'CONTACT_YOUTUBE': YoutubeFillIcon,
  'CONTACT_LINKEDIN': LinkedinBoxFillIcon,
  'CONTACT_WEHCHAT_PUBLIC': WechatFillIcon,
  'CONTACT_ZHISHIXINGQIU': GlobeFillIcon
}

const pathMatches = (asPath, path) => {
  const cleanPath = asPath.split(/[?#]/)[0] || '/'
  if (!path || path.startsWith('http') || path.startsWith('#')) return false
  if (path === '/') return cleanPath === '/'
  return cleanPath === path || cleanPath.startsWith(`${path}/`)
}

export const MobileNav = (props) => {
  const router = useRouter()
  const { siteInfo } = useGlobal()
  const { customNav, customMenu } = props
  const [activeTab, setActiveTab] = useState('Home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openSubMenuId, setOpenSubMenuId] = useState(null)
  const emailIcon = useRef(null)
  
  // Get avatar from props or global context
  const avatarUrl = props?.siteInfo?.icon || siteInfo?.icon || siteConfig('AVATAR')

  const menuItems = useMemo(
    () => getEndspaceMenuItems({ customNav, customMenu }),
    [customMenu, customNav]
  )

  // Social icon config - using contact.config.js settings
  const socialLinks = [
    { key: 'CONTACT_GITHUB', label: 'GitHub' },
    { key: 'CONTACT_ORCID', label: 'ORCID' },
    { key: 'CONTACT_CSDN', label: 'CSDN' },
    { key: 'CONTACT_JUEJIN', label: '稀土掘金' },
    { key: 'CONTACT_TWITTER', label: 'X' },
    { key: 'CONTACT_WEIBO', label: 'Weibo' },
    { key: 'CONTACT_BILIBILI', label: 'Bilibili' },
    { key: 'CONTACT_TELEGRAM', label: 'Telegram' },
    { key: 'CONTACT_INSTAGRAM', label: 'Instagram' },
    { key: 'CONTACT_YOUTUBE', label: 'YouTube' },
    { key: 'CONTACT_XIAOHONGSHU', svg: '/svg/xiaohongshu.svg', label: 'Xiaohongshu' },
    { key: 'CONTACT_LINKEDIN', label: 'LinkedIn' },
    { key: 'CONTACT_ZHISHIXINGQIU', label: 'Zhishixingqiu' },
    { key: 'CONTACT_WEHCHAT_PUBLIC', label: 'WeChat' },
  ]

  const CONTACT_EMAIL = siteConfig('CONTACT_EMAIL')

  useEffect(() => {
    setActiveTab(getEndspaceActiveMenuName(menuItems, router.asPath))
  }, [router.asPath, menuItems])

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
    setOpenSubMenuId(null)
  }, [router.asPath])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Render icon component
  const renderIcon = (item) => {
    const icon = item.pageIcon || item.customIcon || ''
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center">
        <NotionMenuIcon icon={icon} />
      </span>
    )
  }

  // Render social icon
  const renderSocialIcon = (key, svg, label) => {
    if (svg) {
      return <img src={svg} alt={label} className="w-4 h-4 opacity-60" />
    }
    const IconComponent = SocialIconComponents[key]
    if (IconComponent) {
      return <IconComponent size={16} />
    }
    return null
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 md:hidden bg-white border-b border-[var(--endspace-border-base)] safe-area-top">
        <div className="flex items-center justify-between h-20 px-5">
          {/* Left: Avatar */}
          <SmartLink href="/aboutme" title="Profile" className="flex-shrink-0 flex items-center">
            <div className="w-14 h-14 rounded-full overflow-hidden transition-colors">
              <img 
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </SmartLink>

          {/* Right: Hamburger Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-14 h-14 flex items-center justify-center text-[var(--endspace-text-primary)] hover:text-[#d4d4d8] transition-colors"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <IconX size={28} stroke={1.5} />
            ) : (
              <IconMenu2 size={28} stroke={1.5} />
            )}
          </button>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Slide-in Menu Panel */}
      <div 
        className={`fixed top-20 left-0 right-0 bottom-0 z-40 md:hidden bg-white transition-transform duration-300 ease-out overflow-y-auto ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Navigation Items */}
        <div className="flex flex-col items-start p-6 space-y-2">
          {menuItems.map(item => {
            const hasSubMenu = item.subMenus?.length > 0
            const isOpen = openSubMenuId === item.id
            const className = `flex items-center gap-4 py-3 w-full transition-all group ${
              activeTab === item.name
                ? 'text-black font-bold'
                : 'text-[var(--endspace-text-secondary)] hover:text-black'
            }`

            if (!hasSubMenu) {
              return (
                <SmartLink key={item.id || item.name} href={item.path} className={className}>
                  <div className="endspace-menu-icon-wrap transition-colors">
                     {renderIcon(item)}
                  </div>
                  <span className="text-xl font-medium">{item.name}</span>
                </SmartLink>
              )
            }

            return (
              <div key={item.id || item.name} className="w-full">
                <button
                  type="button"
                  className={`${className} text-left`}
                  aria-expanded={isOpen}
                  onClick={() => setOpenSubMenuId(isOpen ? null : item.id)}
                >
                  <div className="endspace-menu-icon-wrap transition-colors">
                     {renderIcon(item)}
                  </div>
                  <span className="text-xl font-medium">{item.name}</span>
                  <IconChevronDown
                    size={18}
                    stroke={1.5}
                    className={`ml-auto transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="ml-10 border-l border-[var(--endspace-border-base)] py-1">
                    {item.subMenus.map(subItem => (
                      <SmartLink
                        key={subItem.id || subItem.path}
                        href={subItem.path}
                        target={subItem.target}
                        className={`block py-2 pl-4 pr-2 text-sm transition-colors hover:text-black ${
                          pathMatches(router.asPath, subItem.path)
                            ? 'font-bold text-black'
                            : 'text-[var(--endspace-text-secondary)]'
                        }`}
                      >
                        {subItem.name}
                      </SmartLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Music Player (No Label, No Divider) */}
        <div className="px-6 pb-2">
          <EndspacePlayer isExpanded={true} />
        </div>

        {/* Social Links (No Label, No Divider) */}
        <div className="px-6 pb-8">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Email */}
            {CONTACT_EMAIL && (
              <a
                onClick={e =>
                  handleEmailClick(e, emailIcon, CONTACT_EMAIL)
                }
                title='email'
                className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[var(--endspace-bg-secondary)] text-[var(--endspace-text-muted)] transition-colors hover:bg-[#d4d4d8] hover:text-[var(--endspace-text-primary)]'
                ref={emailIcon}>
                <MailFillIcon size={16} />
              </a>
            )}
            {socialLinks.map(social => {
              const url = siteConfig(social.key)
              if (!url) return null
              return (
                <a
                  key={social.key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--endspace-bg-secondary)] text-[var(--endspace-text-muted)] hover:text-[var(--endspace-text-primary)] hover:bg-[#d4d4d8] transition-colors"
                >
                  {renderSocialIcon(social.key, social.svg, social.label)}
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top spacer for content */}
      <div className="h-20 md:hidden" />
    </>
  )
}

export default MobileNav
