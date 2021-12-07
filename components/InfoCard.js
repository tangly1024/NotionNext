import BLOG from '@/blog.config'
import Image from 'next/image'
import React from 'react'
import Router from 'next/router'

const InfoCard = () => {
  return <>
    <div className='flex text-center pb-3 pl-4 cursor-pointer' onClick={ () => { Router.push('/') }}>
        <div className='hover:rotate-45 hover:scale-125 transform duration-200'>
          <Image
          alt={BLOG.title}
          width={60}
          height={60}
          loading='lazy'
          src='/avatar.svg'
          className='rounded-full border-black'
        />
        </div>
        <div className='text-3xl dark:text-white ml-5 py-3 hover:scale-105 transform duration-200'>{BLOG.title}</div>
    </div>
  </>
}

export default InfoCard
