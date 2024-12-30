import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function LatestPostsGroupMini({ latestPosts, siteInfo }) {
  const currentPath = useRouter().asPath
  const { locale } = useGlobal()
  const SUB_PATH = siteConfig('SUB_PATH', '')

  return latestPosts ? (
    <>
      <div className='mb-4 px-1 flex flex-nowrap justify-between items-center relative'>
        <div className='font-medium flex items-center'>
          <div className='relative'>
            <i className='mr-2 fas fa-history text-indigo-600 dark:text-yellow-600 animate-spin-slow relative z-10' />
            <div className='absolute -inset-1 bg-indigo-500/20 dark:bg-yellow-500/20 rounded-full blur-sm animate-pulse'></div>
          </div>
          <span className='text-[15px] font-semibold bg-gradient-to-r from-indigo-400 to-indigo-600 dark:from-yellow-400 dark:to-yellow-600 bg-clip-text text-transparent'>
            {locale.COMMON.LATEST_POSTS}
          </span>
        </div>
        <Link href='/archive' className='group flex items-center'>
          <div className='text-xs bg-gradient-to-r p-[1px] from-indigo-500 to-indigo-600 dark:from-yellow-500 dark:to-yellow-600 rounded-full overflow-hidden'>
            <div className='px-2 py-0.5 bg-white dark:bg-[#1e1e1e] rounded-full transition-colors duration-200 
              group-hover:bg-opacity-90 dark:group-hover:bg-opacity-90 flex items-center gap-1'>
              <span className='bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-yellow-500 dark:to-yellow-600 bg-clip-text text-transparent'>更多</span>
              <i className='fas fa-angle-right text-indigo-500 dark:text-yellow-500 group-hover:translate-x-0.5 transition-transform duration-200'></i>
            </div>
          </div>
        </Link>
      </div>
      <div className='space-y-3 relative'>
        <div className='absolute -inset-2 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-yellow-500/5 dark:to-orange-500/5 rounded-xl blur-xl'></div>
        {latestPosts.map((post, index) => {
          const selected = currentPath === `${SUB_PATH}/${post.slug}`
          const headerImage = post?.pageCoverThumbnail
            ? post.pageCoverThumbnail
            : siteInfo?.pageCover

          return (
            <Link
              key={post.id}
              title={post.title}
              href={post?.href}
              passHref
              className={'block group relative'}>
              <div className='flex space-x-3 p-2 rounded-xl transition-all duration-300 bg-white dark:bg-[#1e1e1e]
                hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 
                dark:hover:from-gray-800 dark:hover:to-gray-800
                hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] 
                dark:hover:shadow-[0_8px_16px_rgba(255,255,255,0.08)]
                relative z-10'>
                <div className='w-24 h-16 overflow-hidden relative rounded-lg'>
                  <div className='absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-700 dark:to-gray-800 animate-pulse'></div>
                  <LazyImage
                    src={`${headerImage}`}
                    className='object-cover w-full h-full transform group-hover:scale-110 transition-all duration-500 relative z-10'
                  />
                  <div className='absolute inset-0 ring-1 ring-black/5 dark:ring-white/5 rounded-lg'></div>
                  <div className='absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 dark:from-yellow-500/10 dark:to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                </div>
                <div className='flex flex-col justify-between flex-1 py-1'>
                  <div className='space-y-1'>
                    <div
                      className={`text-sm font-medium line-clamp-2 leading-snug
                        ${selected ? 'text-indigo-500 dark:text-yellow-500' : 'text-gray-700 dark:text-gray-200'}
                        group-hover:text-indigo-600 dark:group-hover:text-yellow-500 transition-colors duration-300`
                      }>
                      {post.title}
                    </div>
                    <div className='flex items-center gap-2 text-[10px] text-gray-400'>
                      <span className='px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800'>#{index + 1}</span>
                      {post?.category && (
                        <span className='px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-gray-800 text-indigo-500 dark:text-yellow-500'>
                          {post.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='text-xs text-gray-400 flex items-center justify-between group-hover:text-indigo-400 dark:group-hover:text-yellow-400 transition-colors duration-300'>
                    <div className='flex items-center space-x-1'>
                      <i className='fas fa-calendar-alt'></i>
                      <span>{post.lastEditedDay}</span>
                    </div>
                    <div className='flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0'>
                      <span className='text-[10px]'>阅读全文</span>
                      <i className='fas fa-angle-right transform group-hover:translate-x-1 transition-transform duration-300'></i>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  ) : null
}
