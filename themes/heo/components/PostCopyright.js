import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CONFIG from '../config'
import NotByAI from '@/components/NotByAI'
import LazyImage from '@/components/LazyImage'

/**
 * 版权声明
 * @returns
 */
export default function PostCopyright({ siteInfo }) {
  const router = useRouter()
  const [path, setPath] = useState(siteConfig('LINK') + router.asPath)
  useEffect(() => {
    setPath(window.location.href)
  }, [])

  const { locale } = useGlobal()
  const author = siteConfig('AUTHOR')
  const HEO_HERO_TITLE_3 = siteConfig('HEO_HERO_TITLE_3')
  const homeHref = siteConfig('SUB_PATH', '') || '/about'
  const enableRSS = siteConfig('ENABLE_RSS')
  const authorAvatar = siteInfo?.icon || siteInfo?.pageCover || '/favicon.svg'

  if (!siteConfig('HEO_ARTICLE_COPYRIGHT', null, CONFIG)) {
    return <></>
  }

  return (
    <section className='heo-post-footer__copyright'>
      <div className='overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(248,250,252,0.94))] p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-slate-700/50 dark:bg-[linear-gradient(180deg,rgba(28,29,35,0.94),rgba(22,23,28,0.96))] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:p-6'>
        <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between'>
          <div className='max-w-2xl'>
            <div className='text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500'>
              Article Rights
            </div>
            <div className='mt-1 text-2xl font-semibold text-slate-800 dark:text-slate-100'>
              版权与转载说明
            </div>
            <div className='mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400'>
              本文为原创内容，转载、摘录或引用时请保留作者署名、文章链接与协议说明，保持阅读链路完整。
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-3 lg:justify-end'>
            <SmartLink
              href={homeHref}
              className='inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300/90 hover:text-slate-900 dark:border-slate-700/60 dark:bg-white/5 dark:text-slate-200 dark:hover:border-slate-600/80 dark:hover:text-white'>
              <i className='fas fa-feather-pointed text-sm text-slate-400 dark:text-slate-500' />
              <span>访问作者</span>
            </SmartLink>

            {enableRSS && (
              <SmartLink
                href='/rss/feed.xml'
                className='inline-flex items-center gap-2 rounded-2xl border border-emerald-200/70 bg-emerald-50/85 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300/80 hover:bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-400/[0.08] dark:text-emerald-300 dark:hover:border-emerald-300/35 dark:hover:bg-emerald-400/[0.12]'>
                <i className='fas fa-rss text-sm' />
                <span>{locale?.COMMON?.RSS || '订阅'}</span>
              </SmartLink>
            )}
          </div>
        </div>

        <div className='mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.35fr)]'>
          <div className='rounded-[1.45rem] border border-slate-200/75 bg-white/78 p-4 dark:border-slate-700/45 dark:bg-white/[0.02]'>
            <div className='flex items-center gap-4'>
              <div className='relative h-14 w-14 overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)] dark:border-white/8 dark:bg-[#262830] dark:shadow-[0_10px_24px_rgba(0,0,0,0.18)]'>
                <LazyImage src={authorAvatar} className='h-full w-full object-cover' alt={author} />
              </div>
              <div className='min-w-0 flex-1'>
                <div className='text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500'>
                  Author
                </div>
                <div className='mt-1 truncate text-lg font-semibold text-slate-800 dark:text-slate-100'>
                  {author}
                </div>
                <div className='mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400'>
                  {HEO_HERO_TITLE_3}
                </div>
              </div>
            </div>
          </div>

          <div className='grid gap-3 sm:grid-cols-2 sm:gap-4'>
            <div className='rounded-[1.3rem] border border-slate-200/75 bg-slate-50/72 p-3.5 dark:border-slate-700/45 dark:bg-slate-900/14 sm:rounded-[1.45rem] sm:p-4'>
              <div className='text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500'>
                License
              </div>
              <div className='mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100 sm:text-base'>
                CC BY-NC-ND 4.0
              </div>
            </div>

            <div className='rounded-[1.3rem] border border-slate-200/75 bg-slate-50/72 p-3.5 dark:border-slate-700/45 dark:bg-slate-900/14 sm:rounded-[1.45rem] sm:p-4'>
              <div className='text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500'>
                Notice
              </div>
              <div className='mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100 sm:text-base'>
                BY-NC-SA 协议
              </div>
            </div>
          </div>
        </div>

        <div className='mt-4 rounded-[1.45rem] border border-slate-200/75 bg-white/82 p-4 dark:border-slate-700/45 dark:bg-white/[0.02]'>
          <div className='text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500'>
            Source URL
          </div>
          <a
            className='mt-2 block break-all text-sm leading-7 text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-orange-300'
            href={path}>
            {path}
          </a>
        </div>

        {siteConfig('HEO_ARTICLE_NOT_BY_AI', false, CONFIG) && (
          <div className='mt-5 flex justify-start'>
            <div className='scale-95 sm:scale-100'>
              <NotByAI />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
