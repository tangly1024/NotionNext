import BLOG from '@/blog.config'
import Router from 'next/router'
import React from 'react'
import SocialButton from './SocialButton'

const InfoCard = (props) => {
  const { siteInfo } = props
  return <div id='info-card' className='py-4'>
    <div className='items-center justify-center font-sans '>
        <div className='hover:scale-105 transform duration-200 cursor-pointer flex justify-center' onClick={ () => { Router.push('/about') }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={siteInfo?.icon} className='rounded-full' width={120}/>
         </div>
        <div className='text-xl py-2 hover:scale-105 transform duration-200 flex justify-center dark:text-gray-300'>{BLOG.AUTHOR}</div>
        <div className='font-light text-gray-600 mb-2 hover:scale-105 transform duration-200 flex justify-center dark:text-gray-400'>{BLOG.BIO}</div>
        <SocialButton/>
    </div>
  </div>
}

export default InfoCard
