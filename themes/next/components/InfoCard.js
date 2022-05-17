import BLOG from '@/blog.config'
import Router from 'next/router'
import React from 'react'
import SocialButton from './SocialButton'

const InfoCard = (props) => {
  const { siteInfo } = props
  return <>
    <div className='flex flex-col items-center justify-center '>
        <div className='hover:rotate-45 hover:scale-125 transform duration-200 cursor-pointer' onClick={ () => { Router.push('/') }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={siteInfo?.icon} className='rounded-full' width={120}/>
        </div>
        <div className='text-2xl font-serif dark:text-white py-2 hover:scale-105 transform duration-200'>{BLOG.AUTHOR}</div>
        <div className='font-light dark:text-white py-2 hover:scale-105 transform duration-200'>{BLOG.BIO}</div>
        <SocialButton/>
    </div>
  </>
}

export default InfoCard
