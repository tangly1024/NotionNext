import BLOG from '@/blog.config'
import Image from 'next/image'
import React from 'react'
import Router from 'next/router'

const InfoCard = () => {
  return <>
    <div className='flex flex-col align-middle justify-center cursor-pointer' onClick={ () => { Router.push('/') }}>
        <div className='hover:rotate-45 hover:scale-125 transform duration-200 mx-auto'>
          <Image
          alt={BLOG.title}
          width={120}
          height={120}
          loading='lazy'
          src='/avatar.svg'
          className='rounded-full border-black'
        />
        </div>
        <div className='text-3xl font-serif dark:text-white mx-auto py-4 hover:scale-105 transform duration-200'>{BLOG.title}</div>
    </div>
  </>
}

export default InfoCard
