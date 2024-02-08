/* eslint-disable no-unreachable */
import throttle from 'lodash.throttle';
import { useCallback, useEffect } from 'react'
import { MenuList } from './MenuList';
import { DarkModeButton } from './DarkModeButton';
import { Logo } from './Logo';
import { useRouter } from 'next/router';

/**
 * 顶部导航栏
 */
export const NavBar = () => {
  const router = useRouter()
  useEffect(() => {
    // ======= Sticky
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
      const scrollY = window.scrollY;
      // 控制台输出当前滚动位置和 sticky 值
      if (scrollY > 0) {
        ud_header.classList.add('sticky');
      } else {
        ud_header.classList.remove('sticky');
      }
    }, throttleMs)
  )

  return <>
        {/* <!-- ====== Navbar Section Start --> */}
        <div className="ud-header absolute left-0 top-0 z-40 flex w-full items-center bg-transparent" >

        <div className="container">

            <div className="relative -mx-4 flex items-center justify-between">

                {/* Logo */}
                <Logo/>

                <div className="flex w-full items-center justify-between px-4">

                    {/* 中间菜单 */}
                    <MenuList/>

                    {/* 右侧功能 */}
                    <div className="flex items-center justify-end pr-16 lg:pr-0">
                        {/* 深色模式切换 */}
                        <DarkModeButton/>
                        {/* 注册登录功能 */}
                        <div className="hidden sm:flex">
                            <a
                            href="signin.html"
                            className={`loginBtn px-[22px] py-2 text-base font-medium ${router.route === '/' ? 'text-white' : ''} hover:opacity-70`}
                            >
                            Sign In
                            </a>
                            <a
                            href="signup.html"
                            className={`signUpBtn rounded-md bg-white bg-opacity-20 px-6 py-2 text-base font-medium ${router.route === '/' ? 'text-white' : ''} duration-300 ease-in-out hover:bg-opacity-100 hover:text-dark`}
                            >
                            Sign Up
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    {/* <!-- ====== Navbar Section End --> */}
    </>
}
