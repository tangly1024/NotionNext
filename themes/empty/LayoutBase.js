import CommonHead from '@/components/CommonHead'
import Live2D from '@/components/Live2D'
import Link from 'next/link'
import React from 'react'
import BLOG from '@/blog.config'
/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏

 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, meta } = props
  const d = new Date()
  const currentYear = d.getFullYear()
  const startYear = BLOG.SINCE && BLOG.SINCE !== currentYear && BLOG.SINCE + '-'
  return (
    <div>
      <CommonHead meta={meta} />
      {/* 导航菜单 */}
      <div className="w-full flex justify-center my-2">
        <nav className="max-w-6xl space-x-3 underline">
          <Link href="/">
            <a>首页</a>
          </Link>
        </nav>
      </div>
      {/* 内容主体 */}
      <main id="wrapper" className="flex justify-center flex-1 pb-12">
        <div className="max-w-4xl px-3">{children}</div>
        <div >
          <div className='sticky top-0 z-40'>
          <Live2D/>
          </div>
        </div>
      </main>
      <footer
      className='font-sans dark:bg-gray-900 flex-shrink-0  justify-center text-center m-auto w-full leading-6 text-sm p-6'
    >
      <i className='fas fa-copyright' /> {`${startYear}${currentYear}`} <span><i className='mx-1 animate-pulse fas fa-heart'/> <a href={BLOG.LINK} className='underline font-bold dark:text-gray-300 '>{BLOG.AUTHOR}</a>.
      <br/>

      <span>Powered by <a href='https://notion.so' className='underline font-bold dark:text-gray-300'>Notion</a> & <a href='https://github.com/tangly1024/NotionNext' className='underline font-bold  dark:text-gray-300'>NotionNext {BLOG.VERSION}</a>.</span></span>

      {BLOG.BEI_AN && <><br /><i className='fas fa-shield-alt' /> <a href='https://beian.miit.gov.cn/' className='mr-2'>{BLOG.BEI_AN}</a><br/></>}
      <br/>
      <span className='hidden busuanzi_container_site_pv'>
            <i className='fas fa-eye'/><span className='px-1 busuanzi_value_site_pv'> </span>  </span>
      <span className='pl-2 hidden busuanzi_container_site_uv'>
        <i className='fas fa-users'/> <span className='px-1 busuanzi_value_site_uv'> </span> </span>
        <br/>
        <h1>{meta?.title || BLOG.TITLE}</h1>
    </footer>
    </div>
  )
}

export default LayoutBase
