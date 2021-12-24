import { useGlobal } from '@/lib/global'
import { faChartBar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * 统计网站信息
 * @param {*} param0
 * @returns
 */
export default function Analytics ({ postCount }) {
  const { locale } = useGlobal()

  return <>
    <div className='px-5 text-sm font-light pb-1 text-gray-600 dark:text-gray-200'><FontAwesomeIcon icon={faChartBar} className='mr-2' />{locale.COMMON.ANALYTICS}</div>
    <div className='mt-2 text-center dark:text-gray-300 font-light text-xs'>
        <span className='px-1 '>
          <strong className='font-medium'>{postCount}</strong>{locale.COMMON.POSTS}</span>
        {/* <span className='px-1 busuanzi_container_site_uv hidden'> */}
        {/* | <strong className='pl-1 busuanzi_value_site_uv font-medium'></strong>{locale.COMMON.VISITORS}</span> */}
        <span className='px-1 busuanzi_container_site_pv hidden'>
        | <strong className='pl-1 busuanzi_value_site_pv font-medium'></strong>{locale.COMMON.VIEWS}</span>
      </div>
</>
}
