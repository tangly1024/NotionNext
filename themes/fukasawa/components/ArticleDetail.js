import TagItemMini from './TagItemMini'
import Comment from '@/components/Comment'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import ArticleAround from './ArticleAround'
import { AdSlot } from '@/components/GoogleAdsense'
import LazyImage from '@/components/LazyImage'
import { formatDateFmt } from '@/lib/formatDate'
import WWAds from '@/components/WWAds'
import NotionIcon from '@/components/NotionIcon'

/**
 *
 * @param {*} param0
 * @returns
 */
export default function ArticleDetail(props) {
  const { post, prev, next } = props
  const { locale, fullWidth } = useGlobal()

  if (!post) {
    return <></>
  }
  return (
    <div id="container" className={`${fullWidth ? 'px-10' : 'max-w-5xl '} overflow-x-auto flex-grow mx-auto w-screen md:w-full`}>
      {post?.type && !post?.type !== 'Page' && post?.pageCover && (
        <div className="w-full relative md:flex-shrink-0 overflow-hidden">
          <LazyImage alt={post.title} src={post?.pageCover} className='object-cover max-h-[60vh] w-full' />
        </div>
      )}

      <article itemScope itemType="https://schema.org/Movie" className="subpixel-antialiased overflow-y-hidden py-10 px-5 lg:pt-24 md:px-32  dark:border-gray-700 bg-white dark:bg-hexo-black-gray" >

        <header>

          {/* 文章Title */}
          <div className="font-bold text-4xl text-black dark:text-white">
            <NotionIcon icon={post?.pageIcon} />{post.title}
          </div>

          <section className="flex-wrap flex mt-2 text-gray-400 dark:text-gray-400 font-light leading-8">
            <div>
              {post?.category && (<>
                  <Link
                    href={`/category/${post.category}`}
                    passHref
                    className="cursor-pointer text-md mr-2 hover:text-black dark:hover:text-white border-b dark:border-gray-500 border-dashed">

                    <i className="mr-1 fas fa-folder-open" />
                    {post.category}

                  </Link>
                <span className='mr-2'>|</span>
              </>)}

              {post?.type !== 'Page' && (<>
                <Link
                  href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
                  passHref
                  className="pl-1 mr-2 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 border-b dark:border-gray-500 border-dashed">

                  {post?.publishDay}

                </Link>
                <span className='mr-2'>|</span>
                <span className='mx-2 text-gray-400 dark:text-gray-500'>
                  {locale.COMMON.LAST_EDITED_TIME}: {post.lastEditedDay}
                </span>
              </>)}

            <div className='my-2'>
                {post.tagItems && (
                    <div className="flex flex-nowrap overflow-x-auto">
                        {post.tagItems.map(tag => (
                            <TagItemMini key={tag.name} tag={tag} />
                        ))}
                    </div>
                )}
            </div>
            </div>

          </section>

          <WWAds className='w-full' orientation='horizontal'/>
        </header>

        {/* Notion文章主体 */}
        <section id='article-wrapper'>
          {post && <NotionPage post={post} />}
        </section>

        <section>
          <AdSlot type='in-article'/>
           {/* 分享 */}
           <ShareBar post={post} />
        </section>

      </article>

      {post?.type === 'Post' && <ArticleAround prev={prev} next={next} /> }

      {/* 评论互动 */}
      <div className="duration-200 shadow py-6 px-12 w-screen md:w-full overflow-x-auto dark:border-gray-700 bg-white dark:bg-hexo-black-gray">
        <Comment frontMatter={post} />
      </div>
    </div>
  )
}
