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
  return <>
        <div className='text-md flex flex-col space-y-1 justify-center px-3'>
            <div className='inline'>
                <div className='flex justify-between'>
                    <div>文章数:</div>
                    <div>{postCount}</div>
                </div>
            </div>
            <div className='inline'>
                <div className='flex justify-between'>
                    <div>建站天数:</div>
                    <div>{diffDays} 天</div>
                </div>
            </div>
            <div className='hidden busuanzi_container_page_pv'>
                <div className='flex justify-between'>
                    <div>访问量:</div>
                    <div className='busuanzi_value_page_pv' />
                </div>
            </div>
            <div className='hidden busuanzi_container_site_uv'>
                <div className='flex justify-between'>
                    <div>访客数:</div>
                    <div className='busuanzi_value_site_uv' />
                </div>
            </div>
        </div>
        </>
}
