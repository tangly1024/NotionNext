import BLOG from '@/blog.config'
import Image from 'next/image'
import Router from 'next/router'
import React from 'react'
import SocialButton from './SocialButton'

const InfoCard = () => {
  return <>
    <div className='items-center justify-start font-sans '>
        <div className='hover:scale-105 transform duration-200 cursor-pointer' onClick={ () => { Router.push('/about') }}>
          <Image
          alt={BLOG.AUTHOR}
          width={120}
          height={120}
          loading='lazy'
          src='/avatar.jpg'
          className='rounded-full'
        />
        </div>
        <div className='text-xl py-2 hover:scale-105 transform duration-200'>{BLOG.AUTHOR}</div>
        <div className='font-light text-gray-600 mb-2 hover:scale-105 transform duration-200'>{BLOG.BIO}</div>
        <SocialButton/>
    </div>
  </>
}

export default InfoCard
