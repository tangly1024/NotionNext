import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * 博客统计卡牌
 * @param {*} props
 * @returns
 */
export function AnalyticsCard(props) {
  const targetDate = new Date(siteConfig('HEO_SITE_CREATE_TIME', null, CONFIG))
  const today = new Date()
  const diffTime = today.getTime() - targetDate.getTime() // 获取两个日期之间的毫秒数差值
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) // 将毫秒数差值转换为天数差值

  const { postCount } = props
  return (
    <>
      <div className='text-md flex flex-col space-y-1 justify-center px-3'>
        <div className='inline'>
          <div className='flex justify-between'>
            <div>Articles:</div>
            <div>{postCount}</div>
          </div>
        </div>
        <div className='inline'>
          <div className='flex justify-between'>
            <div>Online Days:</div>
            <div>{diffDays} Days</div>
          </div>
        </div>
        <div className='hidden busuanzi_container_page_pv'>
          <div className='flex justify-between'>
            <div>Traffic:</div>
            <div className='busuanzi_value_page_pv' />
          </div>
        </div>
        <div className='hidden busuanzi_container_site_uv'>
          <div className='flex justify-between'>
            <div>Visitors:</div>
            <div className='busuanzi_value_site_uv' />
          </div>
        </div>
      </div>
    </>
  )
}
