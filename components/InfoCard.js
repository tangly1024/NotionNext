import BLOG from '@/blog.config'
import Image from 'next/image'
import React from 'react'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faFileAlt, faUsers } from '@fortawesome/free-solid-svg-icons'

const InfoCard = ({ postCount }) => {
  return <>
    <div className='flex flex-col items-center justify-center cursor-pointer' onClick={ () => { Router.push('/') }}>
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
        <div className=' dark:text-gray-300 font-light text-xs'>
          <span className='busuanzi_container_site_pv hidden '>
                <FontAwesomeIcon icon={faEye}/><span className='px-1 busuanzi_value_site_pv'> </span>
          </span>
          <span className='pl-2 busuanzi_container_site_uv hidden'>
                <FontAwesomeIcon icon={faUsers}/> <span className='px-1 busuanzi_value_site_pv'> </span>   </span>
          <span className='pl-2'>
          <FontAwesomeIcon icon={faFileAlt}/> <span className='px-1'> {postCount}</span>   </span>
        </div>
    </div>
  </>
}

export default InfoCard
