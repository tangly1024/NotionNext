import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSimpleGlobal } from '..'
import { MenuList } from './MenuList'
import SocialButton from './SocialButton'
import Link from 'next/link'

/**
 * 菜单导航
 * @param {*} props
 * @returns
 */
export default function NavBar(props) {
  return (
    <div className='flex flex-col justify-between md:mt-20 md:h-[70vh]'>
      <header className='md:pb-8 md:border-l-2 md:border-gray-700 text-[var(--primary-color)] md:[writing-mode:vertical-lr] px-4'>
        <Link href='/'>
          <div className='flex flex-col-reverse md:flex-col items-center md:items-start'>
            <div className='font-bold text-4xl text-center' id='blog-name'>活版印字</div>
            <div className='font-bold text-xl text-center' id='blog-name-en'>Typography</div>
          </div>
        </Link>
      </header>
      <nav className='md:pt-0  z-20  dark:border-hexo-black-gray dark:bg-black flex-shrink-0'>
        <div id='nav-bar-inner' className='text-sm md:text-md'>
          <MenuList {...props} />
        </div>
        <SocialButton />
      </nav>
    </div>
  )
}
