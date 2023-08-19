import React from 'react'
import BLOG from '@/blog.config'
// import DarkModeButton from '@/components/DarkModeButton'

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
      className='relative z-10 dark:bg-black flex-shrink-0 bg-hexo-light-gray justify-center text-center m-auto w-full leading-6  text-gray-600 dark:text-gray-100 text-sm p-6'
    >
      {/* <DarkModeButton/> */}

      {/* 将原来处在中间的东西改到第一个区域 */}
      <div className='flex flex-col items-center'>
        <i className='fas fa-copyright' /> {`${copyrightDate}`} <span><i className='mx-1 animate-pulse fas fa-heart'/> <a href={BLOG.LINK} className='underline font-bold  dark:text-gray-300 '>{BLOG.AUTHOR}</a>.
        <h1 className='text-xs pt-4 text-light-400 dark:text-gray-400'>{title} {BLOG.BIO && <>|</>} {BLOG.BIO}</h1>
        <p className='text-xs pt-2 text-light-500 dark:text-gray-500'>基于<a href='https://github.com/tangly1024/NotionNext' className='dark:text-gray-300'>NotionNext {BLOG.VERSION}搭建</a>.</p></span><br/>
      </div>

      {/* 将页脚分为四个区域，使用flex布局 */}
      <div className='flex flex-row justify-around'>
        {/* 第二个区域，显示备案信息 */}
        {BLOG.BEI_AN && <div><i className='fas fa-shield-alt' /> <a href='https://beian.miit.gov.cn/' className='mr-2'>{BLOG.BEI_AN}</a></div>}

        {/* 第三个区域，显示网站访问量 */}
        <div className='busuanzi_container_site_pv'>
            <i className='fas fa-eye'/><span className='px-1 busuanzi_value_site_pv'> </span>  
        </div>

        {/* 第四个区域，显示网站用户数 */}
        <div className='pl-2 busuanzi_container_site_uv'>
          <i className='fas fa-users'/> <span className='px-1 busuanzi_value_site_uv'> </span> 
        </div>
      </div>
    </footer>
  )
}

export default Footer
