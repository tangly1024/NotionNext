import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import SmartLink from '@/components/SmartLink'
import { EndspacePlayer } from './EndspacePlayer'
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandWeibo,
  IconBrandBilibili,
  IconBrandTelegram,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandLinkedin,
  IconBrandWechat,
  IconBrandX,
  IconPlanet
} from '@tabler/icons-react'
import RadarFillIcon from 'remixicon-react/RadarFillIcon'
import MailSendFillIcon from 'remixicon-react/MailSendFillIcon'
// Conceptual Navigation Icons (Solid, Angular)
import AppsFillIcon from 'remixicon-react/AppsFillIcon'
import FolderFillIcon from 'remixicon-react/FolderFillIcon'
import BookMarkFillIcon from 'remixicon-react/BookMarkFillIcon'
import BarcodeFillIcon from 'remixicon-react/BarcodeFillIcon'
import StackFillIcon from 'remixicon-react/StackFillIcon'
import Compass3FillIcon from 'remixicon-react/Compass3FillIcon'
import EarthFillIcon from 'remixicon-react/EarthFillIcon'
import ProfileFillIcon from 'remixicon-react/ProfileFillIcon'

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

// Icon mapping (Conceptual Remix Icons)
const IconComponents = {
  'Home': AppsFillIcon,
  'Category': FolderFillIcon,
  'Tag': BarcodeFillIcon,
  'Archive': StackFillIcon,
  'Search': Compass3FillIcon,
  'Friends': EarthFillIcon,
  'Portfolio': ProfileFillIcon
}

// Social icon mapping
const SocialIconComponents = {
  'CONTACT_GITHUB': GithubFillIcon,
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

export const SideNav = (props) => {
  const router = useRouter()
  const { siteInfo } = useGlobal()
  const [isHovered, setIsHovered] = useState(false)
  const [activeTab, setActiveTab] = useState('Home')
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, opacity: 0 })
  const navRef = useRef(null)
  const itemRefs = useRef({})
  
  // Get avatar from props or global context (Hexo way uses props)
  const avatarUrl = props?.siteInfo?.icon || siteInfo?.icon || siteConfig('AVATAR')

  // All navigation items
  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Category', path: '/category', show: siteConfig('ENDSPACE_MENU_CATEGORY', null, CONFIG) },
    { name: 'Tag', path: '/tag', show: siteConfig('ENDSPACE_MENU_TAG', null, CONFIG) },
    { name: 'Archive', path: '/archive', show: siteConfig('ENDSPACE_MENU_ARCHIVE', null, CONFIG) },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Friends', path: '/friends' },
    { name: 'Search', path: '/search', show: siteConfig('ENDSPACE_MENU_SEARCH', null, CONFIG) }
  ].filter(item => item.show !== false)

  // Social icon config - using contact.config.js settings
  const socialLinks = [
    { key: 'CONTACT_GITHUB', label: 'GitHub' },
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

  // Email
  const email = siteConfig('CONTACT_EMAIL')

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
    // Set active tab based on path
    const path = router.asPath
    let newTab = 'Home'
    if (path === '/') newTab = 'Home'
    else if (path.includes('/category')) newTab = 'Category'
    else if (path.includes('/tag')) newTab = 'Tag'
    else if (path.includes('/archive')) newTab = 'Archive'
    else if (path.includes('/search')) newTab = 'Search'
    else if (path.includes('/friends')) newTab = 'Friends'
    else if (path.includes('/portfolio')) newTab = 'Portfolio'
    
    setActiveTab(newTab)
  }, [router.asPath])

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
  const renderIcon = (name, isActive) => {
    const IconComponent = IconComponents[name]
    if (!IconComponent) return null
    return (
      <IconComponent 
        size={20} 
        stroke={1.5}
        className={`transition-all duration-300 ${isActive ? 'scale-110' : ''}`}
      />
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
          return (
            <SmartLink key={item.name} href={item.path}>
              <div 
                ref={el => itemRefs.current[item.name] = el}
                className={`nier-nav-item relative h-[3rem] flex items-center cursor-pointer group transition-colors duration-300 hover:bg-[#d4d4d8] ${isActive ? 'active bg-[#d4d4d8]' : ''}`}
              >
                {/* Icon Container */}
                <div className="w-[5rem] flex-shrink-0 flex items-center justify-center z-10">
                  {renderIcon(item.name, isActive)}
                </div>

                {/* Text Label (Reveal on Hover) */}
                <span className={`text-sm font-medium tracking-wide uppercase whitespace-nowrap transition-opacity duration-300 z-10 ${isHovered ? 'opacity-100 delay-75' : 'opacity-0 w-0'}`}>
                  {item.name.toUpperCase()}
                </span>
              </div>
            </SmartLink>
          )
        })}
      </div>

      {/* BOTTOM SECTION - Tools & Config */}
      {/* Music Player, Contact, and Toggle */}
      <div className="flex-shrink-0 flex flex-col justify-end h-auto pb-4">
        
        {/* Music Player Section */}
        <EndspacePlayer isExpanded={isHovered} />

        {/* Contact Links Section */}
        <div className="py-3 transition-all duration-300">
          
          {/* Collapsed State: Contact Button with light gray background */}
          <div className={`flex justify-center transition-all duration-300 ${isHovered ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            <div className="w-[2.5rem] h-[2.5rem] flex items-center justify-center bg-gray-200 text-gray-500 rounded-full cursor-pointer hover:text-white hover:bg-gray-600 transition-colors">
              <RadarFillIcon size={18} />
            </div>
          </div>

          {/* Expanded State: Horizontal Icon Row - Single line */}
          <div className={`px-3 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
              {/* Social Icons - Horizontal Layout, single row with light gray background */}
              <div className="flex items-center justify-center gap-1.5 flex-nowrap">
                {/* Email Icon */}
                {email && (
                    <a 
                    href={`mailto:${email}`}
                    title={email}
                    className="w-[1.75rem] h-[1.75rem] flex items-center justify-center bg-gray-200 text-gray-500 rounded-full hover:text-white hover:bg-gray-600 transition-colors flex-shrink-0"
                  >
                    <MailFillIcon size={14} />
                </a>
              )}
              
              {/* Social Links */}
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
                    className="w-[1.75rem] h-[1.75rem] flex items-center justify-center bg-gray-200 text-gray-500 rounded-full hover:text-white hover:bg-gray-600 transition-colors flex-shrink-0"
                  >
                    {renderSocialIcon(key, svg, label)}
                  </a>
                )
              })}
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
