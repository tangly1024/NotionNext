import Link from 'next/link'
import BLOG from '@/blog.config'
import React, { useState } from 'react'
import { useLocale } from '@/lib/locale'
import Router, { useRouter } from 'next/router'
import DarkModeButton from '@/components/DarkModeButton'
import Image from 'next/image'
import SideBarEmbed from '@/components/SideBarEmbed'

const TopNav = ({ tags, currentTag, post }) => {
  const locale = useLocale()
  const [showDrawer, switchShowDrawer] = useState(false)
  // 点击按钮更改侧边抽屉状态
  const handleMenuClick = () => {
    switchShowDrawer(!showDrawer)
  }
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const handleSearch = () => {
    if (searchValue && searchValue !== '') {
      Router.push({ pathname: '/', query: { s: searchValue } }).then(r => {
        console.log(r)
      })
    }
  }
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      handleSearch()
    }
  }

  return (
    <div className='bg-white dark:bg-gray-600 border-b dark:border-gray-700 shadow'>

      <div className='fixed top-0 left-0 z-30 h-full'>
        <div className={(showDrawer ? 'shadow-2xl' : '-ml-72') + ' duration-200 w-72 h-full bg-white dark:bg-gray-800 border-r dark:border-gray-600'}>
          <div className='flex space-x-4 px-5 py-1 dark:border-gray-500 border-b dark:bg-gray-600'>
            <div
              className='z-10 p-1 duration-200 mr-2 bg-white dark:bg-gray-600 text-gray-600 text-xl cursor-pointer dark:text-gray-300'>
              <i className='fa hover:scale-125 transform duration-200 fa-bars ' onClick={handleMenuClick}/>
            </div>
            <Link href='/'>
              <a
                className='flex justify-center font-bold font-semibold hover:bg-gray-800 hover:text-white p-2 duration-200
               dark:text-gray-300
              '>{BLOG.title}</a>
            </Link>
          </div>
          <SideBarEmbed post={post}/>
        </div>
      </div>
      <div className={(showDrawer ? 'block' : 'hidden') + ' fixed top-0 left-0 z-20 w-full h-full bg-black bg-opacity-40' } onClick={handleMenuClick}/>

      {/* 导航栏 */}
      <div
        id='sticky-nav'
        className='text-sm m-auto w-full flex flex-row justify-between items-center px-5'
      >
        <div className='flex space-x-4'>
          <div
            className='z-10 p-1 duration-200 mr-2 bg-white dark:bg-gray-600 text-gray-600 text-xl cursor-pointer dark:text-gray-300'>
            <i className='fa hover:scale-125 transform duration-200 fa-bars '
               onClick={handleMenuClick} />
          </div>
          <Link href='/'>
            <a
              className='hidden md:block  flex justify-center font-bold font-semibold hover:bg-gray-800 hover:text-white p-2 duration-200
               dark:text-gray-300
              '>{BLOG.title}</a>
          </Link>
        </div>

        <div>
          {/* 搜索框 */}
          <div className='flex border dark:border-gray-600'>
            <input
              type='text'
              placeholder={currentTag ? `${locale.SEARCH.TAGS} #${currentTag}` : `${locale.SEARCH.ARTICLES}`}
              className={'md:w-80 w-32 transition duration-200 leading-10 pl-2 block border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white'}
              onKeyUp={handleKeyUp}
              onChange={e => setSearchValue(e.target.value)}
              defaultValue={router.query.s ?? ''}
            />
            <div className='py-3 px-5 bg-gray-50 flex border-l dark:border-gray-700 dark:bg-gray-500 justify-center align-middle cursor-pointer'
                 onClick={handleSearch}>
              <i className='fa fa-search text-black absolute cursor-pointer' />
            </div>
          </div>
        </div>

        <div className='flex flex-nowrap space-x-1'>

          <DarkModeButton />
          <a className='flex align-middle cursor-pointer' href='/article/about'>
            <Image
              alt={BLOG.author}
              width={28}
              height={28}
              src='/avatar.svg'
              className='rounded-full border-black'
            />
          </a>
        </div>
      </div>
    </div>
  )
}

export default TopNav
