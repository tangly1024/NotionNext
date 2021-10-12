import BLOG from '@/blog.config'
import React from 'react'

const Footer = ({ fullWidth = true }) => {
  const d = new Date()
  const y = d.getFullYear()
  return (
    <footer
      className='flex-shrink-0 m-auto w-full mx-auto text-gray-500 dark:text-gray-400 text-sm text-gray-400 p-6'
    >
      <span className='fa fa-shield leading-6'> <a href='https://beian.miit.gov.cn/' className='ml-1'>闽ICP备20010331号</a></span>
      <br />
      <span className='fa fa-copyright leading-6'> {` ${y}`} {BLOG.author} </span>
      <br />
      <span id='busuanzi_container_site_pv' className=''>
            <a id='busuanzi_container_site_pv' target='_blank' className='fa  fa-eye' rel='noreferrer'
               href='https://www.cnzz.com/stat/website.php?web_id=1279970751'>  <span
              id='busuanzi_value_site_pv' className='px-1'>99999</span> pv</a>
      </span>
      <span id='busuanzi_container_site_uv' className='pl-2'>
        <a className='fa fa-user' rel='noreferrer' target='_blank'
            href='http://tongji.baidu.com/web/10000363165/overview/index?siteId=16809429'>
          <span id='busuanzi_value_site_uv' className='px-1'>99999</span> uv</a>
      </span>
    </footer>
  )
}

export default Footer
