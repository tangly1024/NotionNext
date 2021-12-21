import { faCopyright, faEye, faShieldAlt, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Link from 'next/link'
import BLOG from '@/blog.config'

const Footer = ({ title }) => {
  const d = new Date()
  const y = d.getFullYear()
  return (
    <footer
      className='bg-gray-800 dark:bg-black dark:border-gray-900 border-t flex-shrink-0 justify-center text-center m-auto w-full text-gray-400 text-sm p-6'
    >
      <FontAwesomeIcon icon={faCopyright} /> {` ${y}`} <span> <a href={BLOG.link} className='underline font-bold text-gray-100'>{BLOG.author}</a>. Powered by <a href='https://notion.so' className='underline font-bold text-gray-100'>Notion</a> & <a href='https://github.com/tangly1024/NotionNext' className='underline font-bold text-gray-100'>NotionNext</a>.</span>
      <br />
      <FontAwesomeIcon icon={faShieldAlt} /> <a href='https://beian.miit.gov.cn/' className='ml-1 font-bold'>闽ICP备20010331号</a>
      <span > <Link href='/article/privacy-policy' ><a className='ml-1 mr-1 font-bold underline'>隐私政策</a></Link></span>

      <span className='hidden busuanzi_container_site_pv'>
            <FontAwesomeIcon icon={faEye}/><span className='px-1 busuanzi_value_site_pv'> </span>pv
      </span>
      <span className='pl-2 hidden busuanzi_container_site_uv'>
        <FontAwesomeIcon icon={faUsers}/> <span className='px-1 busuanzi_value_site_uv'> </span>uv   </span>
        <br/>
        <h1>{title}</h1>
    </footer>
  )
}

export default Footer
