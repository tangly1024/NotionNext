import BLOG from '@/blog.config'

import { useRouter } from 'next/router'
import Progress from '@/components/Progress'
import TagItem from '@/components/TagItem'
import formatDate from '@/lib/formatDate'
import { Code, Collection, CollectionRow, Equation, NotionRenderer } from 'react-notion-x'
import ShareBar from '@/components/ShareBar'
import Comment from '@/components/Comment'
import Link from 'next/link'
import Image from 'next/image'

import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import RecommendPosts from '@/components/RecommendPosts'
import TocDrawer from '@/components/TocDrawer'
import TocDrawerButton from '@/components/TocDrawerButton'
import { useGlobal } from '@/lib/global'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import BlogAround from '@/components/BlogAround'
import { useRef } from 'react'

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}

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
  const date = formatDate(post?.date?.start_date || post.createdTime, BLOG.lang)
  const cover = post.page_cover && post.page_cover.length > 1 ? post.page_cover : undefined
  return (
    <>
     <Progress targetRef={targetRef} />

      <div id="article-wrapper" ref={targetRef} className="flex-grow">
        <div className="max-w-5xl mx-auto mt-16 xl:mt-32 w-screen md:w-full">
          <article
            itemScope
            itemType="https://schema.org/Movie"
            className="duration-300 hover:shadow-2xl pt-10 animate__fadeIn animate__animated subpixel-antialiased lg:pt-32 lg:px-52 px-5 py-2 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            {post.type && !post.type.includes('Page') && cover && (
              <>
                <header className="w-full h-60 lg:h-96 transform duration-200 md:flex-shrink-0 overflow-hidden">
                  <Image
                    src={cover}
                    loading="eager"
                    objectFit="cover"
                    layout="fill"
                    alt={post.title}
                  />
                </header>
              </>
            )}
            {/* 文章Title */}
            <h2 className="font-bold text-2xl text-black dark:text-white font-serif pt-10">
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

              <div id="busuanzi_container_page_pv" className="hidden">
                <FontAwesomeIcon
                  icon={faEye}
                  className="text-gray-500 dark:text-gray-400 mt-3 ml-5"
                />
                &nbsp;
                <span
                  id="busuanzi_value_page_pv"
                  className="text-gray-500 dark:text-gray-400 leading-6"
                ></span>
              </div>
            </section>

            <section className="px-1 py-2 my-1 text-sm font-light bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
              {post.summary}
            </section>

            {/* Notion文章主体 */}
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

            {/* 推荐文章 */}
            <RecommendPosts currentPost={post} recommendPosts={recommendPosts} />

            {/* 版权声明 */}
            <section className="dark:text-gray-300 mt-6">
              <div className="text-2xl mb-2">版权声明</div>
              <ul className="text-sm dark:bg-gray-900 bg-gray-100 p-5 leading-8 border-l-4 border-red-500">
                <li>
                  本文作者:{' '}
                  <Link href="/about">
                    <a className="hover:underline">{BLOG.author}</a>
                  </Link>
                </li>
                <li>
                  本文链接:{' '}
                  <a className="hover:underline" href={url}>
                    {url}
                  </a>
                </li>
                <li>
                  本博客所有文章除特别声明外，均采用 BY-NC-SA
                  许可协议。转载请注明出处！
                </li>
              </ul>
            </section>

            {/* 标签列表 */}
            <section className="md:flex md:justify-between">
              {post.tagItems && (
                <div className="flex flex-nowrap leading-8 p-1 py-4 overflow-x-auto">
                  <div className="hidden md:block dark:text-gray-300">
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
          <div className="my-10 w-screen md:w-full overflow-x-auto dark:border-gray-700 bg-white dark:bg-gray-700">
            <Comment frontMatter={post} />
          </div>
        </div>
      </div>

      {/* 悬浮目录按钮 */}
      <div className="block lg:hidden">
        <TocDrawerButton
          onClick={() => {
            drawerRight.current.handleSwitchVisible()
          }}
        />
        {/* 目录侧边栏 */}
        <TocDrawer post={post} cRef={drawerRight} />
      </div>
    </>
  )
}
