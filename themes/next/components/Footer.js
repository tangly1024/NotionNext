import React from 'react'
import BLOG from '@/blog.config'
import DarkModeButton from '@/components/DarkModeButton'

const Footer = ({ title }) => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const copyrightDate = (function () {
    if (Number.isInteger(BLOG.SINCE) && BLOG.SINCE < currentYear) {
      return BLOG.SINCE + '-' + currentYear
    }
    return currentYear
  })()

  return (
        <footer
            className='relative z-10 dark:bg-gray-800 flex-shrink-0 justify-center text-center m-auto w-full leading-6 text-sm p-6 bg-white dark:text-gray-400'
        >

            <span>
                <DarkModeButton />

        <span className='hidden busuanzi_container_site_pv'>
          <i className='fas fa-eye' /><span className='px-1 busuanzi_value_site_pv'> </span> </span>
        <span className='pl-2 hidden busuanzi_container_site_uv'>
          <i className='fas fa-users' /> <span className='px-1 busuanzi_value_site_uv'> </span> </span>
        <br />
        <h1>{title}</h1>
        <a href="https://ipw.cn/ipv6webcheck/?site=66619.eu.org" title="本站支持IPv6访问" target='_blank'>本站支持IPv6访问</a>
        <br />
        <a href="https://icp.gov.moe/?keyword=20225199" target="_blank">萌ICP备20225199号</a>
        <br />
        <span className='text-xs font-serif  text-gray-500 dark:text-gray-300 '>Proudly powered by  <a href='https://github.com/tangly1024/NotionNext' className='underline '>NotionNext {BLOG.VERSION}</a>.</span>
       </span>
    </footer>
  )
}
export default Footer
