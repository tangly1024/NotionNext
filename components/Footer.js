import { faCopyright, faEye, faShieldAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Link from 'next/link'

const Footer = ({ fullWidth = true }) => {
  const d = new Date()
  const y = d.getFullYear()
  return (
    <footer
      className='bg-gray-800 dark:bg-black dark:border-gray-900 border-t flex-shrink-0 justify-center text-center m-auto w-full text-gray-400 text-sm p-6'
    >
      <FontAwesomeIcon size='sm' className='text-sm w-5' icon={faCopyright} /> {` ${y}`} <span> <a href='https://blog.tangly1024.com/article/about' className='underline font-bold text-gray-100'>blog.tangly1024.com</a>. Powered by <a href='https://notion.so' className='underline font-bold text-gray-100'>Notion</a> & <a href='https://github.com/tangly1024/NotionNext' className='underline font-bold text-gray-100'>NotionNext</a>.</span>
      <br />
      <FontAwesomeIcon size='sm' className='text-sm w-5' icon={faShieldAlt} /> <a href='https://beian.miit.gov.cn/' className='ml-1 font-bold'>闽ICP备20010331号</a>
      <span > <Link href='/article/privacy-policy' ><a className='ml-1 font-bold underline'>隐私政策</a></Link></span>

      <span id='busuanzi_container_site_pv' className='hidden'>
            <FontAwesomeIcon size='sm' className='text-sm w-5' icon={faEye}/><span id='busuanzi_value_site_pv' className='px-1'> </span>pv
      </span>
      <span id='busuanzi_container_site_uv' className='pl-2 hidden'>
        <FontAwesomeIcon size='sm' className='text-sm w-5' icon={faUser}/> <span id='busuanzi_value_site_uv' className='px-1'> </span>uv   </span>
    </footer>
  )
}

export default Footer
