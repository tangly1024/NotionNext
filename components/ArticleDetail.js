import BLOG from '@/blog.config'
import BlogAround from '@/components/BlogAround'
import Comment from '@/components/Comment'
import RecommendPosts from '@/components/RecommendPosts'
import ShareBar from '@/components/ShareBar'
import TagItem from '@/components/TagItem'
import TocDrawer from '@/components/TocDrawer'
import TocDrawerButton from '@/components/TocDrawerButton'
import formatDate from '@/lib/formatDate'
import { useGlobal } from '@/lib/global'
import { faEye, faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import { useRef } from 'react'
import { Code, Collection, CollectionRow, Equation, NotionRenderer } from 'react-notion-x'
import ArticleCopyright from './ArticleCopyright'
import WordCount from './WordCount'

/**
 *
 * @param {*} param0
 * @returns
 */
export default function ArticleDetail ({ post, blockMap, recommendPosts, prev, next }) {
  const targetRef = useRef(null)
  const drawerRight = useRef(null)
  const url = BLOG.link + useRouter().asPath
  const { locale } = useGlobal()
  const date = formatDate(post?.date?.start_date || post.createdTime, locale.LOCALE)

  return (<>
      <div id="article-wrapper" ref={targetRef} className="flex-grow mt-14 md:mt-0 max-w-5xl mx-auto w-screen md:w-full ">
          <article itemScope itemType="https://schema.org/Movie"
            className="shadow hover:shadow-2xl duration-300 animate__fadeIn animate__animated subpixel-antialiased py-10 px-5 lg:pt-24 md:px-24 xl:px-32 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <header>
                {post.type && !post.type.includes('Page') && post?.page_cover && (
                          <div className="w-full h-60 lg:h-96 transform duration-200 md:flex-shrink-0 overflow-hidden">
                            <Image
                              src={post?.page_cover}
                              loading="eager"
                              objectFit="cover"
                              layout="fill"
                              alt={post.title}
                            />
                          </div>
                )}
                {/* 文章Title */}
                <h2 className="font-bold text-3xl text-black dark:text-white font-serif pt-10">
                  {' '}
                  {post.title}
                </h2>
                <hr className="mt-4" />
                <section className="flex-nowrap flex  mt-1 dark:text-white font-light">
                  <Link href={`/category/${post.category}`} passHref>
                    <a className="cursor-pointer text-md py-2 ml-1 mr-3 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white">
                      <FontAwesomeIcon icon={faFolderOpen} className="mr-1" />
                      {post.category}
                    </a>
                  </Link>
                  {post.type[0] !== 'Page' && (
                    <Link
                      href={`/archive#${post?.date?.start_date?.substr(0, 7)}`}
                      passHref
                    >
                      <a className="pl-1 cursor-pointer hover:text-gray-700  dark:hover:text-gray-200 text-gray-400 dark:text-gray-400 leading-10">
                        {date}
                      </a>
                    </Link>
                  )}

                  <div className="hidden busuanzi_container_page_pv font-light">
                    <FontAwesomeIcon
                      icon={faEye}
                      className="text-gray-500 dark:text-gray-400 mt-3 ml-5"
                    />
                    &nbsp;
                    <span className="text-gray-500 dark:text-gray-400 leading-6 busuanzi_value_page_pv"
                    ></span>
                  </div>
                </section>

                <h2 className="px-1 py-2 my-1 text-md font-light  text-gray-600  dark:text-gray-400">
                  {post.summary}
                </h2>

                <section className='flex justify-end py-2 pl-1 dark:text-white items-center font-light italic text-sm'>
                    <WordCount/>
                </section>

            </header>

            {/* Notion文章主体 */}
            <section id='notion-article' className='overflow-x-auto px-1'>
              {blockMap && (
                <NotionRenderer
                  className={`${BLOG.font}`}
                  recordMap={blockMap}
                  mapPageUrl={mapPageUrl}
                  components={{
                    equation: Equation,
                    code: Code,
                    collectionRow: CollectionRow,
                    collection: Collection
                  }}
                />
              )}
            </section>

            <section className="px-1 py-2 my-1 text-sm font-light  text-gray-600  dark:text-gray-400">
              {/* 文章内嵌广告 */}
              <ins className="adsbygoogle"
                style={{ display: 'block', textAlign: 'center' }}
                data-adtest="on"
                data-ad-layout="in-article"
                data-ad-format="fluid"
                data-ad-client="ca-pub-2708419466378217"
                data-ad-slot="3806269138"></ins>
            </section>

            {/* 推荐文章 */}
            <RecommendPosts currentPost={post} recommendPosts={recommendPosts} />

            {/* 版权声明 */}
            <ArticleCopyright author={BLOG.author} url={url} />

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

          </article>

          {/* 评论互动 */}
          <div className="mt-5 lg:px-40 hover:shadow-2xl duration-200 shadow-lg w-screen md:w-full overflow-x-auto dark:border-gray-700 bg-white dark:bg-gray-700">
            <Comment frontMatter={post} />
          </div>
      </div>

      {/* 悬浮目录按钮 */}
      <div className="block lg:hidden">
        <TocDrawerButton onClick={() => { drawerRight.current.handleSwitchVisible() }} />
        <TocDrawer post={post} cRef={drawerRight} targetRef={targetRef} />
      </div>
    </>)
}

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}
