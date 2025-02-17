import { useGlobal } from '@/lib/global'
import { useEffect, useState } from 'react'
import { siteConfig } from '@/lib/config'
import AISummary from '@/components/AISummary'
import WWAds from '@/components/WWAds'
import dynamic from 'next/dynamic'

const PostLock = dynamic(() =>
  import('./components/PostLock').then(mod => mod.PostLock)
)

const NotionPage = dynamic(() => import('@/components/NotionPage'))

const AdSlot = dynamic(() =>
  import('@/components/GoogleAdsense').then(mod => mod.AdSlot)
)

const PostAdjacent = dynamic(() => import('./components/PostAdjacent'), {
  ssr: false
})

const PostRecommend = dynamic(() => import('./components/PostRecommend'))
const PostCopyright = dynamic(() => import('./components/PostCopyright'))
const Comment = dynamic(() => import('@/components/Comment'))
const ShareBar = dynamic(() => import('@/components/ShareBar'))

const FloatTocButton = dynamic(() => import('./components/FloatTocButton'))
/**
 * 文章详情
 * @param {*} props
 * @returns
 */
export const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  const { locale, fullWidth } = useGlobal()

  const [hasCode, setHasCode] = useState(false)

  useEffect(() => {
    const hasCode = document.querySelectorAll('[class^="language-"]').length > 0
    setHasCode(hasCode)
  }, [])

  const commentEnable =
    siteConfig('COMMENT_TWIKOO_ENV_ID') ||
    siteConfig('COMMENT_WALINE_SERVER_URL') ||
    siteConfig('COMMENT_VALINE_APP_ID') ||
    siteConfig('COMMENT_GISCUS_REPO') ||
    siteConfig('COMMENT_CUSDIS_APP_ID') ||
    siteConfig('COMMENT_UTTERRANCES_REPO') ||
    siteConfig('COMMENT_GITALK_CLIENT_ID') ||
    siteConfig('COMMENT_WEBMENTION_ENABLE')

  return (
    <>
      <div
        className={`article h-full w-full ${fullWidth ? '' : 'xl:max-w-5xl'} ${hasCode ? 'xl:w-[73.15vw]' : ''}  bg-white dark:bg-[#18171d] dark:border-gray-600 lg:hover:shadow lg:border rounded-2xl lg:px-2 lg:py-4 `}>
        {/* 文章锁 */}
        {lock && <PostLock validPassword={validPassword} />}

        {!lock && post && (
          <div className='mx-auto md:w-full md:px-5'>
            {/* 文章主体 */}
            <article
              id='article-wrapper'
              itemScope
              itemType='https://schema.org/Movie'>
              {/* Notion文章主体 */}
              <section
                className='wow fadeInUp p-5 justify-center mx-auto'
                data-wow-delay='.2s'>
                <AISummary aiSummary={post.aiSummary} />
                <WWAds orientation='horizontal' className='w-full' />
                {
                  <NotionPage
                    post={post}
                    allNavPages={props.allNavPages}
                    uuidSlugMap={props.uuidSlugMap}
                  />
                }
                <WWAds orientation='horizontal' className='w-full' />
              </section>

              {/* 上一篇\下一篇文章 */}
              <PostAdjacent {...props} />

              {/* 分享 */}
              <ShareBar post={post} />
              {post.type === 'Post' && (
                <div className='px-5'>
                  {/* 版权 */}
                  <PostCopyright {...props} />
                  {/* 文章推荐 */}
                  <PostRecommend {...props} />
                </div>
              )}
            </article>

            {/* 评论区 */}
            {fullWidth ? null : (
              <div className={`${commentEnable && post ? '' : 'hidden'}`}>
                <hr className='my-4 border-dashed' />
                {/* 评论区上方广告 */}
                <div className='py-2'>
                  <AdSlot />
                </div>
                {/* 评论互动 */}
                <div className='duration-200 overflow-x-auto px-5'>
                  <div className='text-2xl dark:text-white'>
                    <i className='fas fa-comment mr-1' />
                    {locale.COMMON.COMMENTS}
                  </div>
                  <Comment frontMatter={post} className='' />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <FloatTocButton {...props} />
    </>
  )
}
