import BLOG from '@/blog.config'
import { faEye, faShieldAlt, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function SiteInfo ({ title }) {
  const d = new Date()
  const currentYear = d.getFullYear()
  const startYear = BLOG.SINCE && BLOG.SINCE !== currentYear && BLOG.SINCE + '-'
  return (
        <footer
            className='leading-6 justify-start w-full text-gray-400 text-xs font-sans'
        >
            <span> © {`${startYear}${currentYear}`} <span> <a href={BLOG.LINK} className='text-gray-500 dark:text-gray-300 '>{BLOG.AUTHOR}</a>. <br /></span>

                <span>Powered by  <a href='https://github.com/tangly1024/NotionNext' className='underline font-bold text-gray-500 dark:text-gray-300'>NotionNext</a>.</span><br /></span>

            {BLOG.BEI_AN && <><FontAwesomeIcon icon={faShieldAlt} /> <a href='https://beian.miit.gov.cn/' className='mr-2'>{BLOG.BEI_AN}</a><br/></>}

            <span className='hidden busuanzi_container_site_pv'> <FontAwesomeIcon icon={faEye} /><span className='px-1 busuanzi_value_site_pv'> </span>  </span>
            <span className='pl-2 hidden busuanzi_container_site_uv'> <FontAwesomeIcon icon={faUsers} /> <span className='px-1 busuanzi_value_site_uv'> </span> </span>
            <br />
            <h1>{title}</h1>
        </footer>
  )
}
export default SiteInfo
