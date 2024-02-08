import throttle from 'lodash.throttle';
import Link from 'next/link'
import { useCallback, useEffect } from 'react';

/**
 * 站点图标
 * @returns
 */
export const Logo = () => {
  useEffect(() => {
    window.addEventListener('scroll', navBarScollListener)
    return () => {
      window.removeEventListener('scroll', navBarScollListener)
    }
  }, [])

  // 滚动监听
  const throttleMs = 200
  const navBarScollListener = useCallback(
    throttle(() => {
    // eslint-disable-next-line camelcase
      const ud_header = document.querySelector('.ud-header');
      const logo = document.querySelector('.header-logo');

      const scrollY = window.scrollY;

      // 控制台输出当前滚动位置和 sticky 值
      if (scrollY > 0) {
        ud_header.classList.add('sticky');
        // 根据导航栏状态修改 logo
        if (logo) {
          logo.src = '/images/landing-2/logo/logo.svg';
        }
      } else {
        ud_header.classList.remove('sticky');
        // 根据导航栏状态修改 logo
        if (logo) {
          logo.src = '/images/landing-2/logo/logo-white.svg';
        }
      }

      // 显示或隐藏返回顶部按钮
      const backToTop = document.querySelector('.back-to-top');
      backToTop.style.display = scrollY > 50 ? 'flex' : 'none';
    }, throttleMs)
  )

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
