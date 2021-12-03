import BLOG from '@/blog.config'
import Image from 'next/image'
import React from 'react'
import Router from 'next/router'

const InfoCard = () => {
  return <>
    <div className='flex justify-center text-center'>
      <div className='pb-6 mx-auto leading-8'>
        <div className='hover:rotate-45 hover:scale-125 transform duration-200 cursor-pointer' onClick={ () => { Router.push('/') }}>
          <Image
          alt={BLOG.author}
          width={100}
          height={100}
          loading='lazy'
          src='/avatar.svg'
          className='rounded-full border-black'
        />
        </div>
        <h1 className='text-2xl dark:text-white py-2'>{BLOG.author}</h1>
        <h2 className='text-sm text-gray-500 dark:text-gray-400'>{BLOG.description}</h2>
      </div>
    </div>
  </>
}

export default InfoCard
