import Link from 'next/link'
import React from 'react'
import JumpToTopButton from './JumpToTopButton'

export default function BottomMenuBar ({ className }) {
  return (
    <div className={'sticky bottom-0 w-full h-12 bg-white dark:bg-hexo-black-gray ' + className}>
      <div className='flex justify-between h-full shadow-card'>
        <Link href='/' passHref>
          <div className='flex w-full items-center justify-center cursor-pointer'>
            <i className='fas fa-home' />
          </div>
        </Link>
        <Link href='/search' passHref>
          <div className='flex w-full items-center justify-center cursor-pointer'>
            <i className='fas fa-search'/>
          </div>
        </Link>
        <div className='flex w-full items-center justify-center cursor-pointer'>
          <JumpToTopButton/>
        </div>
      </div>
    </div>
  )
}
