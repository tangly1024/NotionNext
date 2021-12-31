import BLOG from '@/blog.config'
import Image from 'next/image'
import Router from 'next/router'
import React from 'react'

const InfoCard = ({ postCount }) => {
  return <>
    <div className='flex flex-col items-center justify-center cursor-pointer' onClick={ () => { Router.push('/') }}>
        <div className='hover:rotate-45 hover:scale-125 transform duration-200'>
          <Image
          alt={BLOG.title}
          width={120}
          height={120}
          loading='lazy'
          src='/avatar.jpg'
          className='rounded-full'
        />
        </div>
        <div className='text-3xl font-serif dark:text-white py-2 hover:scale-105 transform duration-200'>{BLOG.title}</div>
    </div>
  </>
}

export default InfoCard
