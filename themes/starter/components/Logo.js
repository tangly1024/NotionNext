import { siteConfig } from '@/lib/config';
import { useGlobal } from '@/lib/global';
import throttle from 'lodash.throttle';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CONFIG from '../config';

/**
 * 站点图标
 * @returns
 */
export const Logo = () => {
  const router = useRouter()
  const { isDarkMode } = useGlobal()
  useEffect(() => {
    navBarScrollListener()
    window.addEventListener('scroll', navBarScrollListener)
    return () => {
      window.removeEventListener('scroll', navBarScrollListener)
    }
  })

  // 滚动监听
  const throttleMs = 200
  const navBarScrollListener = throttle(() => {
    const logo = document.querySelector('.header-logo');
    const scrollY = window.scrollY;
    // 何时显示浅色或白底的logo
    if (isDarkMode || (!isDarkMode && router.route === '/' && scrollY < 1)) {
      logo.src = siteConfig('STARTER_LOGO_WHITE', null, CONFIG);
    } else {
      logo.src = siteConfig('STARTER_LOGO', null, CONFIG);
    }
  }, throttleMs)

  return <>
    <div className="w-60 max-w-full px-4">
                    <Link href="/" className="navbar-logo block w-full py-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/images/landing-2/logo/logo-white.svg"
                        alt="logo"
                        className="header-logo w-full"
                    />
                    </Link>
                </div>
                </>
}
