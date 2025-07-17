import DarkModeButton from '@/components/DarkModeButton'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { SignInButton, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image' // 导入 Image 组件
import Link from 'next/link'   // 导入 Link 组件
import LogoBar from './LogoBar' // 如果 LogoBar 也不再使用，可以删除
import SearchInput from './SearchInput'

/**
 * 页头：顶部导航栏
 * @param {} props
 * @returns
 */
export default function Header(props) {
  const { className } = props
  const { locale } = useGlobal()

  const enableClerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  return (
    <div id='top-nav' className={'fixed top-0 w-full z-20 ' + className}>
      {/* PC与移动端共用的顶部导航栏 */}
      <div className='flex justify-center border-b dark:border-black items-center w-full h-16 bg-white dark:bg-hexo-black-gray'>
        <div className='px-5 max-w-screen-4xl w-full flex justify-between items-center'>
          
          {/* 左侧：新的Logo */}
          <Link href='/' passHref legacyBehavior>
            <a className='flex items-center gap-3 cursor-pointer'>
              <Image
                src='/favicon.ico'
                alt='StudyGPT Logo'
                width={28}
                height={28}
              />
              <span className='font-bold text-xl hidden md:block'>StudyGPT</span>
            </a>
          </Link>

          {/* 右侧 */}
          <div className='flex items-center gap-4'>
            {/* 登录相关 */}
            {enableClerk && (
              <>
                <SignedOut>
                  <SignInButton mode='modal'>
                    <button className='bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 py-2 text-sm'>
                      {locale.COMMON.SIGN_IN}
                    </button>
                  </SignInButton>
                </SignedOut>
                <UserButton />
              </>
            )}
            
            {/* 搜索框 (仅在桌面端显示) */}
            <SearchInput className='hidden md:flex md:w-52 lg:w-72' />
            
            {/* 亮暗色切换按钮 */}
            <DarkModeButton className='text-sm flex items-center h-full' />
          </div>

        </div>
      </div>
    </div>
  )
}
