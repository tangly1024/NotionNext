/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

/**
 * 站点图标
 * @returns
 */
export const Logo = props => {
  const { siteInfo, white } = props
  const router = useRouter()

  const { isDarkMode } = useGlobal()
  const [logoTextColor, setLogoTextColor] = useState('text-white')

  useEffect(() => {
    // 滚动监听
    const throttleMs = 200
    const navBarScrollListener = throttle(() => {
      const scrollY = window.scrollY
      // 何时显示浅色或白底的logo
      const homePageNavBar = router.route === '/' && scrollY < 10 // 在首页并且视窗在页面顶部

      if (white || isDarkMode || homePageNavBar) {
        setLogoTextColor('text-white')
      } else {
        setLogoTextColor('text-black')
      }
    }, throttleMs)

    navBarScrollListener()
    window.addEventListener('scroll', navBarScrollListener)
    return () => {
      window.removeEventListener('scroll', navBarScrollListener)
    }
  }, [isDarkMode, router])

  return (
    <div className='w-60 max-w-full px-4'>
      <div className='navbar-logo flex items-center w-full py-5 cursor-pointer'>
        <LazyImage
          priority
          src={siteInfo?.icon}
          width={24}
          height={20}
          alt={siteConfig('AUTHOR')}
          className='mr-2 hidden md:inline-block'
        />
        {/* logo文字 */}
        <span
          onClick={() => {
            router.push('/')
          }}
          className={`${logoTextColor} logo dark:text-white py-1.5 header-logo-text whitespace-nowrap font-semibold`}>
          {siteConfig('TITLE')}
        </span>
      </div>
    </div>
  )
}
