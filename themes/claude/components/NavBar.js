import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { MenuList } from './MenuList'
import SocialButton from './SocialButton'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

/**
 * 侧边栏导航 — Claude Docs 风格
 * 上方: 站名 → 下方: 导航链接 + 社交图标
 */
export default function NavBar(props) {
  const subtitleDarkOnly = siteConfig('CLAUDE_SUBTITLE_DARK_ONLY', false, CONFIG)

  return (
    <div className='flex flex-col gap-6'>
      {/* 站名 */}
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

      {/* 导航链接 */}
      <nav>
        <MenuList {...props} />
      </nav>

      {/* 社交图标 */}
      <SocialButton />
    </div>
  )
}
