import BLOG from '@/blog.config'
import React from 'react'

const Footer = ({ fullWidth = true }) => {
  const d = new Date()
  const y = d.getFullYear()
  return (
    <footer
      className='flex-shrink-0 m-auto w-full text-gray-500 dark:text-gray-400 text-sm text-gray-400 p-6'
    >
        <span className='fa fa-shield leading-6'> <a href='https://beian.miit.gov.cn/' className='ml-1'>闽ICP备20010331号</a></span>
        <br />
        <span className='fa fa-copyright leading-6'> {` ${y}`} {BLOG.author} </span>
        <br />
    </footer>
  )
}

export default Footer
