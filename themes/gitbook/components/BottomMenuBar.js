import Link from 'next/link'
import React from 'react'
import { useMediumGlobal } from '../LayoutBase'
import JumpToTopButton from './JumpToTopButton'

export default function BottomMenuBar({ post, className }) {
  const { tocVisible, changeTocVisible, pageNavVisible, changePageNavVisible } = useMediumGlobal()
  const showTocBotton = post?.toc?.length > 0

  const toggleToc = () => {
    changeTocVisible(!tocVisible)
  }

  const togglePageNavVisible = () => {
    changePageNavVisible(!pageNavVisible)
  }

  return (
        <div className={'sticky z-10 bottom-0 w-full h-12 bg-white dark:bg-hexo-black-gray ' + className}>
            <div className='flex justify-between h-full shadow-card'>
                <div onClick={togglePageNavVisible} className='flex w-full items-center justify-center cursor-pointer'>
                    <i className="fa-regular fa-chart-bar"></i>
                </div>
                <div className='flex w-full items-center justify-center cursor-pointer'>
                    <JumpToTopButton />
                </div>
                {showTocBotton && <div onClick={toggleToc} className='flex w-full items-center justify-center cursor-pointer'>
                    <i className='fas fa-list-ol ' />
                </div>}
                {!showTocBotton && <Link href='/' passHref legacyBehavior>
                    <div className='flex w-full items-center justify-center cursor-pointer'>
                        <i className='fas fa-home' />
                    </div>
                </Link>}
            </div>
        </div>
  )
}
