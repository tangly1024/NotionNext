import BLOG from '@/blog.config'

function SiteInfo ({ title }) {
  const d = new Date()
  const currentYear = d.getFullYear()
  const startYear = BLOG.SINCE && BLOG.SINCE !== currentYear && BLOG.SINCE + '-'
  return (
        <footer
            className='leading-6 justify-start w-full text-gray-400 text-xs font-sans'
        >
            <span> © {`${startYear}${currentYear}`} <span> <a href={BLOG.LINK} className='text-gray-500 dark:text-gray-300 '>{BLOG.AUTHOR}</a>. <br /></span>

            {BLOG.BEI_AN && <><i className='fas fa-shield-alt' /> <a href='https://beian.miit.gov.cn/' className='mr-2'>{BLOG.BEI_AN}</a><br/></>}

            <span className='hidden busuanzi_container_site_pv'> <i className='fas fa-eye' /><span className='px-1 busuanzi_value_site_pv'> </span>  </span>
            <span className='pl-2 hidden busuanzi_container_site_uv'> <i className='fas fa-users' /> <span className='px-1 busuanzi_value_site_uv'> </span> </span>
            <br />
            <span><i className='mx-1 animate-pulse fas fa-heart'/> <a href='https://github.com/tangly1024/NotionNext' className='underline font-bold text-gray-500 dark:text-gray-300'>NotionNext {BLOG.VERSION}</a></span><br /></span>
            <h1>{title}</h1>
        </footer>
  )
}
export default SiteInfo
