import Comment from '@/components/Comment'
import NotionPage from '@/components/NotionPage'
import formatDate from '@/lib/formatDate'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import ArticleAround from './ArticleAround'

/**
 *
 * @param {*} param0
 * @returns
 */
export default function ArticleDetail(props) {
  const { post, prev, next } = props
  if (!post) {
    return <></>
  }
  const { locale } = useGlobal()
  const date = formatDate(post?.date?.start_date || post?.createdTime, locale.LOCALE)
  return (<div id="container" className="max-w-5xl overflow-x-auto flex-grow mx-auto w-screen md:w-full ">
    {post?.type && !post?.type !== 'Page' && post?.page_cover && (
      <div className="w-full relative md:flex-shrink-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={post.title} src={post?.page_cover} className='object-center w-full' />
      </div>
    )}
    <article itemScope itemType="https://schema.org/Movie"
      className="subpixel-antialiased py-10 px-5 lg:pt-24 md:px-32  dark:border-gray-700 bg-white dark:bg-hexo-black-gray"
    >

      <header className='animate__slideInDown animate__animated'>

        {/* 文章Title */}
        <div className="font-bold text-3xl text-black dark:text-white font-serif pt-10">
          {post.title}
        </div>

        <section className="flex-wrap flex mt-2 text-gray-400 dark:text-gray-400 font-light leading-8">
          <div>

            {post?.category && (<>
                <Link href={`/category/${post.category}`} passHref>
                <a className="cursor-pointer text-md mr-2 hover:text-black dark:hover:text-white border-b dark:border-gray-500 border-dashed">
                  <i className="mr-1 fas fa-folder-open" />
                  {post.category}
                </a>
              </Link>
              <span className='mr-2'>|</span>
            </>)}

            {post?.type !== 'Page' && (<>
              <Link
                href={`/archive#${post?.date?.start_date?.substr(0, 7)}`}
                passHref
              >
                <a className="pl-1 mr-2 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 border-b dark:border-gray-500 border-dashed">
                  {date}
                </a>
              </Link>
              <span className='mr-2'>|</span>
              <span className='mx-2 text-gray-400 dark:text-gray-500'>
                {locale.COMMON.LAST_EDITED_TIME}: {post.lastEditedTime}
              </span>
            </>)}

            <div className=" busuanzi_container_page_pv font-light mr-2">
              <i className='mr-1 fas fa-eye' />
              &nbsp;
              <span className="mr-2 busuanzi_value_page_pv" />
            </div>
          </div>

        </section>

      </header>

      {/* Notion文章主体 */}
      <section id='notion-article' className='px-1'>
        {post && <NotionPage post={post} />}
      </section>

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

    </article>

    {post.type === 'Post' && <ArticleAround prev={prev} next={next} /> }

    {/* 评论互动 */}
    <div className="duration-200 shadow px-12 w-screen md:w-full overflow-x-auto dark:border-gray-700 bg-white dark:bg-hexo-black-gray">
      <Comment frontMatter={post} />
    </div>
  </div>)
}
