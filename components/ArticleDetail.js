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
import { useEffect, useRef } from 'react'

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

  useEffect(() => {
    countWords()
  })

  return (<>
      <div id="article-wrapper" ref={targetRef} className="flex-grow mt-14 md:mt-0 max-w-5xl mx-auto w-screen md:w-full ">
          <article itemScope itemType="https://schema.org/Movie"
            className="rounded-xl shadow-md duration-300 hover:shadow-2xl animate__fadeIn animate__animated subpixel-antialiased py-10 px-5 lg:pt-24 lg:px-48 dark:border-gray-700 bg-white dark:bg-gray-900"
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

                <section className="px-1 py-2 my-1 text-sm font-light  text-gray-600  dark:text-gray-400">
                  {post.summary}
                </section>

                <section className='flex justify-end py-2 pl-1 dark:text-white items-center font-light italic text-sm'>
                    本文共<strong id='wordCount'>0</strong>字，阅读需要约<strong id='readTime'>0</strong>分钟
                </section>
            </header>

            {/* Notion文章主体 */}
            <section id='notion-article'>
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
          <div className="mt-5 shadow-lg rounded-xl w-screen md:w-full overflow-x-auto dark:border-gray-700 bg-white dark:bg-gray-700">
            <Comment frontMatter={post} />
          </div>
      </div>

      {/* 悬浮目录按钮 */}
      <div className="block lg:hidden">
        <TocDrawerButton onClick={() => { drawerRight.current.handleSwitchVisible() }} />
        <TocDrawer post={post} cRef={drawerRight} />
      </div>

      <Progress targetRef={targetRef} />
    </>)
}

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}

/**
 * 更新字数统计和阅读时间
 */
function countWords () {
  if (window) {
    const articleElement = document.getElementById('notion-article')
    if (articleElement) {
      const articleText = deleteHtmlTag(articleElement.innerHTML)
      const wordCount = fnGetCpmisWords(articleText)
      // 阅读速度 300-500每分钟
      document.getElementById('wordCount').innerHTML = wordCount
      document.getElementById('readTime').innerHTML = Math.floor(wordCount / 400)
    }
  }
}

// 去除html标签
function deleteHtmlTag (str) {
  str = str.replace(/<[^>]+>|&[^>]+;/g, '').trim()// 去掉所有的html标签和&nbsp;之类的特殊符合
  return str
}

// 用word方式计算正文字数
function fnGetCpmisWords (str) {
  let sLen = 0
  try {
    // eslint-disable-next-line no-irregular-whitespace
    str = str.replace(/(\r\n+|\s+|　+)/g, '龘')
    // eslint-disable-next-line no-control-regex
    str = str.replace(/[\x00-\xff]/g, 'm')
    str = str.replace(/m+/g, '*')
    str = str.replace(/龘+/g, '')
    sLen = str.length
  } catch (e) {

  }
  return sLen
}
