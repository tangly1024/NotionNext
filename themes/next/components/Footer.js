import React from 'react'
import BLOG from '@/blog.config'
import DarkModeButton from '@/components/DarkModeButton'

const Footer = ({ title }) => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const startYear = BLOG.SINCE && BLOG.SINCE !== currentYear && BLOG.SINCE + '-'
  return (
    <footer
      className='dark:bg-gray-900 flex-shrink-0 justify-center text-center m-auto w-full leading-6 text-sm p-6 dark:text-gray-400'
    >
      <DarkModeButton/>
      <span>
        <i className='fas fa-copyright' /> {`${startYear}${currentYear}`} <span className='mx-1 animate-pulse'><i className='fas fa-heart' /></span> <a href={BLOG.LINK} className='underline font-bold '>{BLOG.AUTHOR}</a>.<br />

        {BLOG.BEI_AN && <><i className='fas fa-shield-alt' /> <a href='https://beian.miit.gov.cn/' className='mr-2'>{BLOG.BEI_AN}</a><br /></>}

        <span className='hidden busuanzi_container_site_pv'>
          <i className='fas fa-eye' /><span className='px-1 busuanzi_value_site_pv'> </span> </span>
        <span className='pl-2 hidden busuanzi_container_site_uv'>
          <i className='fas fa-users' /> <span className='px-1 busuanzi_value_site_uv'> </span> </span>
        <br />
        <h1>{title}</h1>
        <span className='text-xs font-serif  text-gray-500 dark:text-gray-300 '>Powered by  <a href='https://github.com/tangly1024/NotionNext' className='underline '>NotionNext {BLOG.VERSION}</a>.</span>
      </span>
    </footer>
  )
}

export default Footer
