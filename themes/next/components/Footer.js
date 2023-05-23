import React from 'react'
import BLOG from '@/blog.config'
import DarkModeButton from '@/components/DarkModeButton'

const Footer = ({ title }) => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const copyrightDate = (function() {
    if (Number.isInteger(BLOG.SINCE) && BLOG.SINCE < currentYear) {
      return BLOG.SINCE + '-' + currentYear
    }
    return currentYear
  })()

  return (
    <footer
      className='relative z-10 dark:bg-gray-800 flex-shrink-0 justify-center text-center m-auto w-full leading-6 text-sm p-6 bg-white dark:text-gray-400'
    >
      <DarkModeButton/>
      <span>
        <i className='fas fa-copyright' /> {`${copyrightDate}`} <span className='mx-1 animate-pulse'><i className='fas fa-heart' /></span> <a href={BLOG.LINK} className='underline font-bold '>{BLOG.AUTHOR}</a>.<br />

        {BLOG.BEI_AN && <><i className='fas fa-shield-alt' /> <a href='https://beian.miit.gov.cn/' className='mr-2'>{BLOG.BEI_AN}</a><br /></>}

        <span className='hidden busuanzi_container_site_pv'>
          <i className='fas fa-eye' /><span className='px-1 busuanzi_value_site_pv'> </span> </span>
        <span className='pl-2 hidden busuanzi_container_site_uv'>
          <i className='fas fa-users' /> <span className='px-1 busuanzi_value_site_uv'> </span> </span>
        <br />
        <h1>{title}</h1>
        <span className='no-underline ml-4'>
                    本站由<a href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral" className=' hover:underline'>
                  <img src="https://xiaoti.oss-cn-hangzhou.aliyuncs.com/upyun.png"   alt="又拍云"/> </a>提供CDN加速
        </span>
      </span>
    </footer>
  )
}

export default Footer
