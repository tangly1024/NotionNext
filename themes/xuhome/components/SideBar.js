import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { uuidToId } from 'notion-utils'
import { useRouter } from 'next/router'
import Announcement from './Announcement'
import Uptime from './Uptime'

export default function SideBar(props) {
  const { categoryOptions, tagOptions, latestPosts, post, notice } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const currentKeyword = router.query.keyword || ''

  const handleSearch = e => {
    if (e.key === 'Enter' && e.target.value) {
      const query = { keyword: e.target.value }
      if (router.query.theme) query.theme = router.query.theme
      router.push({ pathname: '/search/[keyword]', query })
    }
  }

  return (
    <div className='space-y-6'>
      <div className='border-2 border-[#0284c7] rounded-sm shadow-[3px_3px_0px_0px_#0284c7] bg-[#ffffff] dark:bg-slate-800 p-4'>
        <h3 className='font-black text-xs text-[#0284c7] uppercase tracking-wider mb-3 border-b-2 border-[#fde68a] pb-2'>
          {locale.NAV.SEARCH}
        </h3>
        <input
          key={router.asPath}
          type='text'
          placeholder='Search...'
          defaultValue={currentKeyword}
          onKeyDown={handleSearch}
          className='w-full border-[3px] border-[#0284c7] rounded-sm shadow-[2px_2px_0px_0px_#0284c7] px-3 py-2 font-extrabold text-sm outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400'
        />
      </div>

      {post?.toc && post?.toc.length > 2 && (
        <div className='border-2 border-[#0284c7] rounded-sm shadow-[3px_3px_0px_0px_#0284c7] bg-[#ffffff] dark:bg-slate-800 p-4'>
          <h3 className='font-black text-xs text-[#0284c7] uppercase tracking-wider mb-3 border-b-2 border-[#fde68a] pb-2'>
            {locale.COMMON.TABLE_OF_CONTENTS}
          </h3>
          <nav className='space-y-1'>
            {post.toc.map(item => (
              <a
                key={item.id}
                href={`#${uuidToId(item.id)}`}
                className='block text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0284c7] py-0.5'
                style={{ paddingLeft: `${(item.indentLevel || 0) * 12 + 4}px` }}
              >
                {item.text}
              </a>
            ))}
          </nav>
        </div>
      )}

      {categoryOptions?.length > 0 && (
        <div className='border-2 border-[#0284c7] rounded-sm shadow-[3px_3px_0px_0px_#0284c7] bg-[#ffffff] dark:bg-slate-800 p-4'>
          <h3 className='font-black text-xs text-[#0284c7] uppercase tracking-wider mb-3 border-b-2 border-[#fde68a] pb-2'>
            {locale.COMMON.CATEGORY}
          </h3>
          <div className='space-y-1'>
            {categoryOptions.map(cat => (
              <SmartLink
                key={cat.name}
                href={`/category/${cat.name}`}
                className='no-underline'
              >
                <div className='flex justify-between text-xs font-extrabold text-slate-600 dark:text-slate-400 hover:text-[#0284c7] py-1.5 px-1 border-l-[3px] border-transparent hover:border-[#fde68a] transition-all'>
                  <span>{cat.name}</span>
                  <span className='tabular-nums'>{cat.count}</span>
                </div>
              </SmartLink>
            ))}
          </div>
        </div>
      )}

      {tagOptions?.length > 0 && (
        <div className='border-2 border-[#0284c7] rounded-sm shadow-[3px_3px_0px_0px_#0284c7] bg-[#ffffff] dark:bg-slate-800 p-4'>
          <h3 className='font-black text-xs text-[#0284c7] uppercase tracking-wider mb-3 border-b-2 border-[#fde68a] pb-2'>
            {locale.COMMON.TAGS}
          </h3>
          <div className='flex flex-wrap gap-1.5'>
            {tagOptions.slice(0, 15).map(tag => (
              <SmartLink
                key={tag.name}
                href={`/tag/${encodeURIComponent(tag.name)}`}
              >
                <span className='inline-block border-2 border-[#0284c7] rounded-sm shadow-[1px_1px_0px_0px_#0284c7] px-2 py-0.5 text-xs font-black uppercase tracking-wider text-[#0284c7] bg-[#ffffff] dark:bg-slate-700 hover:bg-[#fde68a] transition-colors'>
                  {tag.name}
                </span>
              </SmartLink>
            ))}
          </div>
        </div>
      )}

      <Announcement post={notice} />
      <Uptime />

      {latestPosts?.length > 0 && (
        <div className='border-2 border-[#0284c7] rounded-sm shadow-[3px_3px_0px_0px_#0284c7] bg-[#ffffff] dark:bg-slate-800 p-4'>
          <h3 className='font-black text-xs text-[#0284c7] uppercase tracking-wider mb-3 border-b-2 border-[#fde68a] pb-2'>
            {locale.COMMON.LATEST_POSTS}
          </h3>
          <div className='space-y-1'>
            {latestPosts.slice(0, 5).map(p => (
              <SmartLink
                key={p.id}
                href={`/${p.slug}`}
                className='no-underline'
              >
                <div className='text-xs font-extrabold text-slate-600 dark:text-slate-400 hover:text-[#0284c7] py-1 truncate transition-colors'>
                  {p.title}
                </div>
              </SmartLink>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
