import BLOG from '@/blog.config'
import React from 'react'
import SocialButton from '@/components/SocialButton'

const Footer = ({ fullWidth = true }) => {
  const d = new Date()
  const y = d.getFullYear()
  const from = +BLOG.since
  return (
    <footer
      className='p-5 flex-shrink-0 m-auto w-full text-gray-500 dark:text-gray-400 bottom-0'
    >
      <SocialButton/>
      <div className='text-sm'>
        <span className='fa fa-shield leading-6'><a href='https://beian.miit.gov.cn/' className='ml-1'>闽ICP备20010331号</a></span>
        <br/>
        <span className='fa fa-copyright leading-6'> {from === y || !from ? y : `${from} - ${y}`} {BLOG.author} </span>
      </div>
    </footer>
  )
}

export default Footer
