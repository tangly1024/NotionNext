import { useRouter } from 'next/router'
import { useState, useEffect, useMemo, useRef } from 'react'
import { siteConfig } from '@/lib/config'
import { handleEmailClick } from '@/lib/plugins/mailEncrypt'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { EndspacePlayer } from './EndspacePlayer'
import NotionMenuIcon from './NotionMenuIcon'
import {
  IconBrandX,
  IconChevronDown
} from '@tabler/icons-react'
import RadarFillIcon from 'remixicon-react/RadarFillIcon'
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

export const SideNav = (props) => {
  const router = useRouter()
  const { siteInfo } = useGlobal()
  const { customNav, customMenu } = props
  const [isHovered, setIsHovered] = useState(false)
  const [activeTab, setActiveTab] = useState('Home')
  const [openSubMenuId, setOpenSubMenuId] = useState(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, opacity: 0 })
  const navRef = useRef(null)
  const itemRefs = useRef({})
  const emailIcon = useRef(null)
  
  // Get avatar from props or global context (Hexo way uses props)
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
    { key: 'CONTACT_TWITTER', label: 'Twitter' },
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

  // Update indicator position - with validation to prevent stuck indicator
  const updateIndicatorPosition = (tabName) => {
    const itemEl = itemRefs.current[tabName]
    const navEl = navRef.current
    if (itemEl && navEl) {
      const navRect = navEl.getBoundingClientRect()
      const itemRect = itemEl.getBoundingClientRect()
      
      // Validate that elements have proper dimensions (not zero-height)
      if (itemRect.height > 0 && navRect.height > 0) {
        setIndicatorStyle({
          top: itemRect.top - navRect.top,
          opacity: 1
        })
      }
    }
  }

  useEffect(() => {
    setActiveTab(getEndspaceActiveMenuName(menuItems, router.asPath))
  }, [router.asPath, menuItems])

  // Update indicator position when activeTab changes
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is fully rendered
    const rafId = requestAnimationFrame(() => {
      updateIndicatorPosition(activeTab)
    })
    return () => cancelAnimationFrame(rafId)
  }, [activeTab])
  
  // Also update on window resize to prevent stuck indicator
  useEffect(() => {
    const handleResize = () => {
      updateIndicatorPosition(activeTab)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [activeTab])

  // Render icon component
  const renderIcon = (item, isActive) => {
    const icon = item.pageIcon || item.customIcon || ''
    return (
      <span
        className={`inline-flex h-5 w-5 items-center justify-center transition-all duration-300 ${isActive ? 'scale-110' : ''}`}
      >
        <NotionMenuIcon icon={icon} active={isActive} />
      </span>
    )
  }

  // Render social icon
  const renderSocialIcon = (key, svg, label) => {
    if (svg) {
      return <img src={svg} alt={label} className="w-3 h-3 opacity-60 hover:opacity-100" />
    }
    const IconComponent = SocialIconComponents[key]
    if (IconComponent) {
      return <IconComponent size={14} stroke={1.5} />
    }
    return null
  }

  return (
    <div 
      className={`fixed left-0 top-0 bottom-0 z-40 hidden md:flex flex-col bg-[var(--endspace-bg-base)] border-r border-[var(--endspace-border-base)] transition-all duration-300 ease-in-out shadow-md ${isHovered ? 'w-[16rem]' : 'w-[5rem]'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar Section - Top of sidebar, clickable to personal page */}
      {/* Fixed height container to prevent layout shift when expanded */}
      <div className="flex-shrink-0 h-[10rem] py-6 flex flex-col items-center">
        <SmartLink href="/aboutme" title="Profile">
          <div className="w-[3rem] h-[3rem] flex-shrink-0 transition-transform duration-300 cursor-pointer hover:scale-105">
            <img 
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover shadow-lg transition-colors"
            />
          </div>
        </SmartLink>
        {/* Author Info - shown when expanded, fills the reserved space below avatar */}
        <div className={`mt-3 text-center transition-all duration-300 overflow-hidden ${isHovered ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'}`}>
          <SmartLink href="/aboutme" className="hover:text-[var(--endspace-accent-yellow)] transition-colors">
            <div className="text-sm font-bold text-[var(--endspace-text-primary)] uppercase tracking-wider">
              {siteConfig('AUTHOR') || ''}
            </div>
          </SmartLink>
          <div className="text-xs text-[var(--endspace-text-muted)] mt-1 px-3 line-clamp-3 leading-relaxed">
            {siteConfig('BIO') || ''}
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION - Navigation Items */}
      {/* Reverted to flex-1 as requested to restore original behavior */}
      <div ref={navRef} className="flex-1 py-4 flex flex-col gap-2 overflow-y-auto overflow-x-hidden relative">
        {/* Animated Active Indicator Bar - Higher z-index */}
        <div 
          className="absolute left-0 w-1.5 h-[3rem] bg-[var(--endspace-text-primary)] transition-all duration-300 ease-out z-10"
          style={{ top: indicatorStyle.top, opacity: indicatorStyle.opacity }}
        />
        
        {menuItems.map((item) => {
          const isActive = activeTab === item.name
          const hasSubMenu = item.subMenus?.length > 0
          const isOpen = openSubMenuId === item.id
          const toggleSubMenu = () => setOpenSubMenuId(isOpen ? null : item.id)

          const itemContent = (
            <div
              ref={el => itemRefs.current[item.name] = el}
              className={`nier-nav-item relative h-[3rem] flex items-center cursor-pointer group transition-colors duration-300 hover:bg-[#d4d4d8] ${isActive ? 'active bg-[#d4d4d8]' : ''}`}
              onClick={hasSubMenu ? toggleSubMenu : undefined}
              role={hasSubMenu ? 'button' : undefined}
              tabIndex={hasSubMenu ? 0 : undefined}
              aria-expanded={hasSubMenu ? isOpen : undefined}
              onKeyDown={hasSubMenu
                ? e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      toggleSubMenu()
                    }
                  }
                : undefined}
            >
              {/* Icon Container */}
              <div className="endspace-menu-icon-wrap w-[5rem] flex-shrink-0 flex items-center justify-center z-10">
                {renderIcon(item, isActive)}
              </div>

              {/* Text Label (Reveal on Hover) */}
              <span className={`text-sm font-medium tracking-wide uppercase whitespace-nowrap transition-opacity duration-300 z-10 ${isHovered ? 'opacity-100 delay-75' : 'opacity-0 w-0'}`}>
                {item.name.toUpperCase()}
              </span>
              {hasSubMenu && (
                <IconChevronDown
                  size={16}
                  stroke={1.5}
                  className={`ml-auto mr-4 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} ${isOpen ? 'rotate-180' : ''}`}
                />
              )}
            </div>
          )

          return (
            <div key={item.id || item.name}>
              {hasSubMenu ? itemContent : <SmartLink href={item.path}>{itemContent}</SmartLink>}
              {hasSubMenu && isOpen && isHovered && (
                <div className="ml-[5rem] mr-3 border-l border-[var(--endspace-border-base)] py-1">
                  {item.subMenus.map(subItem => (
                    <SmartLink key={subItem.id || subItem.path} href={subItem.path} target={subItem.target}>
                      <div className={`py-2 pl-4 pr-2 text-xs uppercase tracking-wide transition-colors hover:bg-[var(--endspace-bg-secondary)] ${
                        pathMatches(router.asPath, subItem.path)
                          ? 'font-bold text-[var(--endspace-text-primary)]'
                          : 'text-[var(--endspace-text-secondary)]'
                      }`}>
                        {subItem.name}
                      </div>
                    </SmartLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* BOTTOM SECTION - Tools & Config */}
      {/* Music Player, Contact, and Toggle */}
      <div className="flex-shrink-0 flex flex-col justify-end h-auto pb-4">
        <div className={`mx-auto transition-[width] duration-300 ease-out ${isHovered ? 'w-[13.5rem]' : 'w-[3rem]'}`}>
          <div className={`overflow-visible border border-gray-200 bg-gray-100/95 shadow-sm transition-[border-radius] duration-200 ${isHovered ? 'h-[7rem] rounded-2xl px-3 py-2' : 'h-[6.75rem] rounded-full px-1 py-2'}`}>
            {/* Music Player Section */}
            <div className={`flex items-center justify-center ${isHovered ? 'h-[3rem]' : 'h-10'}`}>
              <EndspacePlayer isExpanded={isHovered} embedded />
            </div>

            <div className={`mx-auto h-px bg-gray-300/80 transition-[width] duration-300 ease-out ${isHovered ? 'my-1.5 w-full' : 'my-2 w-5'}`} />

            {/* Contact Links Section */}
            <div className="flex h-10 items-center justify-center overflow-hidden">
              {/* Collapsed State: Contact Button */}
              <div className={`flex justify-center transition-opacity duration-150 ${isHovered ? 'pointer-events-none absolute opacity-0' : 'opacity-100'}`}>
                <div className="w-10 h-10 flex items-center justify-center text-gray-500 rounded-full cursor-pointer hover:text-black hover:bg-gray-200 transition-colors">
                  <RadarFillIcon size={18} />
                </div>
              </div>

              {/* Expanded State: Horizontal Icon Row */}
              <div className={`transition-opacity duration-150 ${isHovered ? 'opacity-100' : 'pointer-events-none absolute opacity-0'}`}>
                <div className="mx-auto flex w-full items-center justify-center gap-1.5 flex-nowrap px-1">
                  {CONTACT_EMAIL && (
                    <a
                      onClick={e =>
                        handleEmailClick(e, emailIcon, CONTACT_EMAIL)
                      }
                      title='email'
                      className='w-[1.75rem] h-[1.75rem] flex cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-200 hover:text-black flex-shrink-0'
                      ref={emailIcon}>
                      <MailFillIcon size={14} />
                    </a>
                  )}

                  {socialLinks.map(({ key, svg, label }) => {
                    const url = siteConfig(key)
                    if (!url) return null
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        title={label}
                        className="w-[1.75rem] h-[1.75rem] flex items-center justify-center text-gray-500 rounded-full hover:text-black hover:bg-gray-200 transition-colors flex-shrink-0"
                      >
                        {renderSocialIcon(key, svg, label)}
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Toggle Button - Simple Black Triangle */}
        <div className="py-4">
          <div className="flex justify-center">
            <div 
              className="w-[2rem] h-[2rem] flex items-center justify-center cursor-pointer"
              title={isHovered ? 'Collapse' : 'Expand'}
            >
              {/* Simple Black Triangle */}
              <div 
                className={`w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent transition-transform duration-300 ${
                  isHovered 
                    ? 'border-r-[10px] border-r-[var(--endspace-text-primary)] border-l-0' 
                    : 'border-l-[10px] border-l-[var(--endspace-text-primary)] border-r-0'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
