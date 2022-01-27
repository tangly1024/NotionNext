import { faCopyright, faEye, faShieldAlt, faUsers, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import BLOG from '@/blog.config'

const Footer = ({ title }) => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const startYear = BLOG.SINCE && BLOG.SINCE !== currentYear && BLOG.SINCE + '-'
  return (
    <footer
      className='dark:bg-gray-900 flex-shrink-0 justify-center text-center m-auto w-full leading-6 text-gray-400 text-sm p-6'
    >
      <FontAwesomeIcon icon={faCopyright} /> {`${startYear}${currentYear}`} <span><FontAwesomeIcon icon={faHeart} className='mx-1 animate-pulse'/> <a href={BLOG.LINK} className='underline font-bold text-gray-500 dark:text-gray-300 '>{BLOG.AUTHOR}</a>.
      <br/>

      <span>Powered by <a href='https://notion.so' className='underline font-bold text-gray-500 dark:text-gray-300'>Notion</a> & <a href='https://github.com/tangly1024/NotionNext' className='underline font-bold text-gray-500 dark:text-gray-300'>NotionNext</a>.</span></span>

      {BLOG.BEI_AN && <><br /><FontAwesomeIcon icon={faShieldAlt} /> <a href='https://beian.miit.gov.cn/' className='mr-2'>{BLOG.BEI_AN}</a><br/></>}
      <span className='hidden busuanzi_container_site_pv'>
            <FontAwesomeIcon icon={faEye}/><span className='px-1 busuanzi_value_site_pv'> </span>  </span>
      <span className='pl-2 hidden busuanzi_container_site_uv'>
        <FontAwesomeIcon icon={faUsers}/> <span className='px-1 busuanzi_value_site_uv'> </span> </span>
        <br/>
        <h1>{title}</h1>
    </footer>
  )
}

export default Footer
