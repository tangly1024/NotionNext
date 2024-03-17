/* eslint-disable @next/next/no-html-link-for-pages */
import { siteConfig } from '@/lib/config';
import { useGlobal } from '@/lib/global';
import throttle from 'lodash.throttle';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CONFIG from '../config';

/**
 * 站点图标
 * @returns
 */
export const Logo = ({ white }) => {
  const router = useRouter()
  const { isDarkMode } = useGlobal()
  const logoWhite = siteConfig('STARTER_LOGO_WHITE', null, CONFIG)
  const [logo, setLogo] = useState(logoWhite)
  const [logoTextColor, setLogoTextColor] = useState('text-white')

  useEffect(() => {
    // 滚动监听
    const throttleMs = 200
    const navBarScrollListener = throttle(() => {
      const scrollY = window.scrollY;
      // 何时显示浅色或白底的logo
      const homePageNavBar = router.route === '/' && scrollY < 10 // 在首页并且视窗在页面顶部
      console.log('白色', homePageNavBar, router.route, scrollY < 10)
      if (white || isDarkMode || homePageNavBar) {
        setLogo(siteConfig('STARTER_LOGO_WHITE', null, CONFIG))
        setLogoTextColor('text-white')
      } else {
        setLogo(siteConfig('STARTER_LOGO', null, CONFIG))
        setLogoTextColor('text-black')
      }
    }, throttleMs)

    navBarScrollListener()
    window.addEventListener('scroll', navBarScrollListener)
    return () => {
      window.removeEventListener('scroll', navBarScrollListener)
    }
  }, [isDarkMode, router])

  return <div className="w-60 max-w-full px-4">
        <div className="navbar-logo flex items-center w-full py-5 cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {logo && <img
                onClick={() => {
                  router.push('/')
                }}
                src={logo}
                alt="logo"
                className="header-logo w-full"
            />}
            {/* logo文字 */}
            <span onClick={() => { router.push('/') }} className={`${logoTextColor} dark:text-white py-1.5 header-logo-text whitespace-nowrap text-2xl font-semibold`}>
                {siteConfig('TITLE')}
            </span>
        </div>
    </div>
}
