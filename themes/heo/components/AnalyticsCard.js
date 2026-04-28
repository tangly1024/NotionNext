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
  const postCountTitle = siteConfig('HEO_POST_COUNT_TITLE', null, CONFIG)
  const siteTimeTitle = siteConfig('HEO_SITE_TIME_TITLE', null, CONFIG)
  const siteVisitTitle = siteConfig('HEO_SITE_VISIT_TITLE', null, CONFIG)
  const siteVisitorTitle = siteConfig('HEO_SITE_VISITOR_TITLE', null, CONFIG)

  const { postCount } = props
  return <>
        <div className='rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-gray-700 dark:bg-[#16181f]'>
            <div className='mb-4 flex items-start justify-between gap-3'>
                <div>
                    <div className='text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400'>
                        Site Pulse
                    </div>
                    <div className='mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300'>
                        持续更新 AI 工具、研究工作流与实践观察。
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-2 gap-3 text-sm'>
                <div className='rounded-2xl bg-white px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:bg-[#1d212b]'>
                    <div className='text-[11px] uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500'>{postCountTitle}</div>
                    <div className='mt-2 text-2xl font-semibold text-slate-900 dark:text-white'>{postCount}</div>
                </div>
                <div className='rounded-2xl bg-white px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:bg-[#1d212b]'>
                    <div className='text-[11px] uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500'>{siteTimeTitle}</div>
                    <div className='mt-2 text-2xl font-semibold text-slate-900 dark:text-white'>{diffDays}</div>
                    <div className='text-xs text-slate-500 dark:text-slate-400'>days online</div>
                </div>
            </div>
            <div className='hidden busuanzi_container_page_pv'>
                <div className='flex justify-between'>
                    <div>{siteVisitTitle}</div>
                    <div className='busuanzi_value_page_pv' />
                </div>
            </div>
            <div className='hidden busuanzi_container_site_uv'>
                <div className='flex justify-between'>
                    <div>{siteVisitorTitle}</div>
                    <div className='busuanzi_value_site_uv' />
                </div>
            </div>
        </div>
        </>
}
