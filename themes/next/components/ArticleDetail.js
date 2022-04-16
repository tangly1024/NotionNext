import BLOG from '@/blog.config'
import BlogAround from './BlogAround'
import Comment from '@/components/Comment'
import RecommendPosts from './RecommendPosts'
import ShareBar from './ShareBar'
import TagItem from './TagItem'
import formatDate from '@/lib/formatDate'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ArticleCopyright from './ArticleCopyright'
import WordCount from './WordCount'
import NotionPage from '@/components/NotionPage'

/**
 *
 * @param {*} param0
 * @returns
 */
export default function ArticleDetail(props) {
  const { post, recommendPosts, prev, next, showArticleInfo } = props
  const url = BLOG.LINK + useRouter().asPath
  const { locale } = useGlobal()
  const date = formatDate(post?.date?.start_date || post?.createdTime, locale.LOCALE)

  return (<div id="container" className="shadow md:hover:shadow-2xl overflow-x-auto flex-grow mx-auto w-screen md:w-full ">
    <div itemScope itemType="https://schema.org/Movie"
      className="subpixel-antialiased py-10 px-5 lg:pt-24 md:px-24  dark:border-gray-700 bg-white dark:bg-hexo-black-gray"
    >

      {showArticleInfo && <header className='animate__slideInDown animate__animated'>
        {post?.type && !post?.type.includes('Page') && post?.page_cover && (
          <div className="w-full relative md:flex-shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={post.title} src={post?.page_cover} className='object-center w-full' />
          </div>
        )}

        {/* 文章Title */}
        <div className="font-bold text-3xl text-black dark:text-white font-serif pt-10">
          {post.title}
        </div>

        <section className="flex-wrap flex mt-2 text-gray-400 dark:text-gray-400 font-light leading-8">
          <div className='flex  flex-wrap'>
            {post.category && <>
              <Link href={`/category/${post.category}`} passHref>
                <a className="cursor-pointer text-md mr-2 hover:text-black dark:hover:text-white border-b dark:border-gray-500 border-dashed">
                  <i className="mr-1 far fa-folder-open" />  {post.category}
                </a>
              </Link>
              <span className='mr-2'>|</span>
            </>}
            {post?.type[0] !== 'Page' && (<>
              <Link
                href={`/archive#${post?.date?.start_date?.substr(0, 7)}`}
                passHref
              >
                <a className="pl-1 mr-2 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 border-b dark:border-gray-500 border-dashed">
                  {date}
                </a>
              </Link>
              <span className='mr-2'>|</span>
              <div className="hidden busuanzi_container_page_pv font-light mr-2">
                <i className='mr-1 fas fa-eye' />
                &nbsp;
                <span className="mr-2 busuanzi_value_page_pv" />
              </div>

            </>)}

          </div>

          <div className='mr-2'>
            <i className='far fa-clock mr-2' />{locale.COMMON.LAST_EDITED_TIME} {post.lastEditedTime}
          </div>

          <div className='flex flex-nowrap whitespace-nowrap items-center font-light text-md'>
            <WordCount />
          </div>
        </section>

      </header>}

      {/* Notion内容主体 */}
      <article id='notion-article' className='px-1'>
        {post && (<NotionPage post={post} />)}
      </article>

      <section className="px-1 py-2 my-1 text-sm font-light overflow-auto text-gray-600  dark:text-gray-400">
        {/* 文章内嵌广告 */}
        <ins className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-adtest="on"
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-2708419466378217"
          data-ad-slot="3806269138" />
      </section>

      {showArticleInfo && <>
        {/* 版权声明 */}
        <ArticleCopyright author={BLOG.AUTHOR} url={url} />

        {/* 推荐文章 */}
        <RecommendPosts currentPost={post} recommendPosts={recommendPosts} />

        {/* 标签列表 */}
        <section className="md:flex md:justify-between">
          {post.tagItems && (
            <div className="flex flex-nowrap leading-8 p-1 py-4 overflow-x-auto">
              <div className="hidden md:block dark:text-gray-300 whitespace-nowrap">
                {locale.COMMON.TAGS}：
              </div>
              {post.tagItems.map(tag => (
                <TagItem key={tag.name} tag={tag} />
              ))}
            </div>
          )}
          <div>
            <ShareBar post={post} />
          </div>
        </section>

        <BlogAround prev={prev} next={next} />
      </>}

      {/* 评论互动 */}
      <div className="duration-200 w-full dark:border-gray-700 bg-white dark:bg-gray-800">
        <Comment frontMatter={post} />
      </div>
    </div>

  </div>)
}
