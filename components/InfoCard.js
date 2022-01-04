import BLOG from '@/blog.config'
import Image from 'next/image'
import Router from 'next/router'
import React from 'react'
import SocialButton from './SocialButton'

const InfoCard = ({ postCount }) => {
  return <>
    <div className='flex flex-col items-center justify-center '>
        <div className='hover:rotate-45 hover:scale-125 transform duration-200 cursor-pointer' onClick={ () => { Router.push('/about') }}>
          <Image
          alt={BLOG.author}
          width={120}
          height={120}
          loading='lazy'
          src='/avatar.jpg'
          className='rounded-full'
        />
        </div>
        <div className='text-2xl font-serif dark:text-white py-2 hover:scale-105 transform duration-200'>{BLOG.author}</div>
        <div className='font-light dark:text-white py-2 hover:scale-105 transform duration-200'>{BLOG.bio}</div>
        <SocialButton/>
    </div>
  </>
}

export default InfoCard
