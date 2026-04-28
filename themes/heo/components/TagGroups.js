import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

/**
 * 标签组
 * @param tags
 * @param currentTag
 * @returns {JSX.Element}
 * @constructor
 */
const TagGroups = ({ tags, className }) => {
  const router = useRouter()
  const { tag: currentTag } = router.query
  if (!tags) return <></>

  const featuredTags = tags.slice(0, 6)
  const remainingTags = tags.slice(6, 24)

  return (
        <div id='tags-group' className='space-y-5'>
            <div className='rounded-[28px] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_45%),linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(241,245,249,0.9))] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-gray-700 dark:bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.18),_transparent_42%),linear-gradient(135deg,_rgba(19,22,29,0.98),_rgba(27,31,42,0.94))]'>
                <div className='flex items-start justify-between gap-4'>
                    <div>
                        <div className='text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400'>
                            Topic Map
                        </div>
                        <h3 className='mt-2 text-xl font-semibold text-slate-900 dark:text-white'>
                            站内热门主题
                        </h3>
                        <p className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300'>
                            从 AI 工具、研究方法到增长实践，按主题快速进入。
                        </p>
                    </div>
                    <div className='rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300'>
                        {tags.length} tags
                    </div>
                </div>

                <div className='mt-5 grid gap-3'>
                    {featuredTags.map((tag, index) => {
                      const selected = currentTag === tag.name
                      return (
                            <SmartLink
                                passHref
                                key={index}
                                href={`/tag/${encodeURIComponent(tag.name)}`}
                                className='block'
                            >
                                <div
                                    className={`${className || ''} ${
                                      selected
                                        ? 'border-blue-600 bg-blue-600 text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)] dark:border-yellow-500 dark:bg-yellow-500 dark:text-slate-950 dark:shadow-[0_18px_40px_rgba(234,179,8,0.22)]'
                                        : 'border-white/70 bg-white/80 text-slate-800 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:border-yellow-500/40 dark:hover:bg-white/10'
                                    } flex items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-200`}
                                >
                                    <div>
                                        <div className='text-base font-semibold'>{tag.name}</div>
                                        <div className={`text-xs ${selected ? 'text-white/80 dark:text-slate-900/70' : 'text-slate-500 dark:text-slate-400'}`}>
                                            Explore posts in this topic
                                        </div>
                                    </div>
                                    {tag.count ? (
                                        <div className={`rounded-full px-2.5 py-1 text-xs font-semibold ${selected ? 'bg-white/20 text-white dark:bg-slate-900/10 dark:text-slate-950' : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300'}`}>
                                            {tag.count}
                                        </div>
                                    ) : null}
                                </div>
                            </SmartLink>
                      )
                    })}
                </div>
            </div>

            {remainingTags.length > 0 && (
                <div className='rounded-[24px] border border-dashed border-slate-200 bg-white/80 p-4 dark:border-gray-700 dark:bg-[#151821]'>
                    <div className='mb-3 flex items-center justify-between gap-3'>
                        <div className='text-sm font-semibold text-slate-800 dark:text-slate-200'>
                            More angles
                        </div>
                        <div className='text-xs text-slate-500 dark:text-slate-400'>
                            Quick browse
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-2.5'>
                        {remainingTags.map((tag, index) => {
                          const selected = currentTag === tag.name
                          return (
                                <SmartLink
                                    passHref
                                    key={index}
                                    href={`/tag/${encodeURIComponent(tag.name)}`}
                                    className='inline-block whitespace-nowrap'
                                >
                                    <div
                                        className={`${className || ''} ${
                                          selected
                                            ? 'border-blue-600 bg-blue-600 text-white dark:border-yellow-500 dark:bg-yellow-500 dark:text-slate-950'
                                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-yellow-500/40 dark:hover:bg-white/10'
                                        } flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-all duration-200`}
                                    >
                                        <span>{tag.name}</span>
                                        {tag.count ? (
                                            <span className={`text-[11px] ${selected ? 'text-white/80 dark:text-slate-900/70' : 'text-slate-500 dark:text-slate-400'}`}>
                                                {tag.count}
                                            </span>
                                        ) : null}
                                    </div>
                                </SmartLink>
                          )
                        })}
                    </div>
                </div>
            )}
        </div>
  )
}

export default TagGroups
