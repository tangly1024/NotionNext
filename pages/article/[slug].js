import { getAllCategories, getAllPosts, getAllTags, getPostBlocks } from '@/lib/notion'
import BLOG from '@/blog.config'
import { getPageTableOfContents } from 'notion-utils'
import { useRouter } from 'next/router'
import Progress from '@/components/Progress'
import TagItem from '@/components/TagItem'
import formatDate from '@/lib/formatDate'
import { Code, Collection, CollectionRow, Equation, NotionRenderer } from 'react-notion-x'
import RewardButton from '@/components/RewardButton'
import ShareBar from '@/components/ShareBar'
import Comment from '@/components/Comment'
import BaseLayout from '@/layouts/BaseLayout'
import React, { useRef } from 'react'
import Custom404 from '@/pages/404'
import Link from 'next/link'

import 'prismjs/themes/prism-okaidia.css'
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

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}
const ArticleDetail = ({ post, blockMap, tags, prev, next, posts, categories }) => {
  if (!post) {
    return <Custom404 />
  }
  const meta = {
    title: `${post.title} | ${BLOG.title}`,
    description: post.summary,
    type: 'article',
    tags: post.tags
  }
  const targetRef = useRef(null)
  const drawerRight = useRef(null)
  const url = BLOG.link + useRouter().asPath
  const { locale } = useGlobal()

  return <BaseLayout meta={meta} tags={tags} post={post} totalPosts={posts} categories={categories}>
    <Progress targetRef={targetRef} />

    <div id='article-wrapper' ref={targetRef} className='flex-grow bg-gray-200 dark:bg-black pt-16'>
      {/* 中央区域 wrapper */}
      {post.type && !post.type.includes('Page') && (<>
        <header
          className='hover:shadow-2xl hover:scale-105 transform duration-200 mx-auto max-w-5xl mb-2 md:flex-shrink-0 animate__fadeIn animate__animated'>
          {/* 封面图 */}
          {post.page_cover && post.page_cover.length > 1 && (
            <img className='bg-center object-cover w-full' style={{ maxHeight: '40rem' }} loading='lazy'
                 src={post.page_cover} alt={post.title} />
          )}
        </header>
      </>)}

      <article
        className='hover:shadow-2xl duration-200 shadow-card mb-20 w-screen md:w-full overflow-x-auto md:px-10 px-5 pt-10 max-w-5xl mx-auto dark:border-gray-700 bg-white dark:bg-gray-900'>

        {post.type && !post.type.includes('Page') && (<>
            {/* 文章信息 */}
            <h1 className='font-bold text-4xl text-black my-5 dark:text-white animate__animated animate__fadeIn'> {post.title}</h1>
            <h2 className='text-gray-500 text-xs my-5 dark:text-gray-400 animate__animated animate__fadeIn'>{post.summary}</h2>
            <div className='justify-between flex flex-wrap bg-gray-100 p-2 dark:bg-gray-900 dark:text-white'>
              <div className='flex-nowrap flex'>
                <div className='py-2 opacity-50'>
                  {locale.COMMON.CATEGORY}：
                </div>
                <Link href={`/category/${post.category}`} passHref>
                  <div className='cursor-pointer text-md py-2 mx-3 hover:underline'><i
                    className='fa fa-folder-open-o mr-1' />{post.category}</div>
                </Link>

                {post.type[0] !== 'Page' && (
                  <div className='flex items-start text-gray-500 dark:text-gray-400 leading-10'>
                    {formatDate(
                      post?.date?.start_date || post.createdTime,
                      BLOG.lang
                    )}
                  </div>
                )}
              </div>

              {/* 不蒜子 */}
              <div id='busuanzi_container_page_pv' className='hidden'>
                <div className='fa fa-eye text-gray-500 text-sm leading-none py-1 px-2'>
                  &nbsp;<span id='busuanzi_value_page_pv' className='leading-6'></span>
                </div>
              </div>
            </div>
        </>)}

        {/* Notion文章主体 */}
        {blockMap && (
          <NotionRenderer recordMap={blockMap} mapPageUrl={mapPageUrl}
                          components={{
                            equation: Equation,
                            code: Code,
                            collectionRow: CollectionRow,
                            collection: Collection
                          }}
          />
        )}

        {/* 赞赏按钮 */}
        <RewardButton />

        {/* 推荐文章 */}
        <RecommendPosts currentPost={post} totalPosts={posts} />

        {/* 版权声明 */}
        <section
          className='overflow-auto dark:bg-gray-800 dark:text-gray-300 bg-gray-100 p-5 leading-8 border-l-4 border-red-500'>
          <ul>
            <li>本文作者: {BLOG.author}</li>
            <li>本文链接: <a href={url}>{url}</a></li>
            <li>版权声明: 本博客所有文章除特别声明外，均采用 BY-NC-SA 许可协议。转载请注明出处！</li>
          </ul>
        </section>

        {/* 标签列表 */}
        <section className='md:flex md:justify-between'>
           {post.tagItems && (
            <div className='flex flex-nowrap leading-8 p-1 py-4 overflow-x-auto'>
              <div className='hidden md:block dark:text-gray-300'>{locale.COMMON.TAGS}：</div>
              {post.tagItems.map(tag => (
                <TagItem key={tag.name} tag={tag} />
              ))}
            </div>
           )}
          <div>
            <ShareBar post={post} />
          </div>
        </section>

        {/* 上一篇下一篇文章 */}
        <div className='text-gray-800 my-5 dark:text-gray-300'>
          <hr />
          <div className='flex flex-wrap lg:flex-nowrap lg:space-x-10 justify-between py-2'>
            <Link href={`/article/${prev.slug}`}>
              <div className='py-3 text-blue-500 text-lg hover:underline cursor-pointer'><i
                className='fa fa-angle-double-left mr-1' />{prev.title}</div>
            </Link>
            <Link href={`/article/${next.slug}`}>
              <div className='flex py-3 text-blue-500 text-lg hover:underline cursor-pointer'>{next.title}<i
                className='fa fa-angle-double-right ml-1' /></div>
            </Link>
          </div>
        </div>
      </article>

      {/* 评论互动 */}
      <div
        className='shadow-card mb-20 w-screen md:w-full overflow-x-auto md:px-10 px-5 py-10 max-w-5xl mx-auto dark:border-gray-700 bg-white dark:bg-gray-700'>
        <Comment frontMatter={post} />
      </div>

    </div>

    {/* 悬浮目录按钮 */}
    <div className='block lg:hidden'>
      <TocDrawerButton onClick={() => {
        drawerRight.current.handleSwitchVisible()
      }} />
      {/* 目录侧边栏 */}
      <TocDrawer post={post} cRef={drawerRight} />
    </div>

  </BaseLayout>
}

export async function getStaticPaths () {
  let posts = []
  if (BLOG.isProd) {
    posts = await getAllPosts({ from: 'slug - paths', includePage: true })
  }
  return {
    paths: posts.map(row => `${BLOG.path}/article/${row.slug}`),
    fallback: true
  }
}

export async function getStaticProps ({ params: { slug } }) {
  let posts = await getAllPosts({ from: 'slug-props', includePage: true })
  const post = posts.find(t => t.slug === slug)
  if (!post) {
    return {
      props: {},
      revalidate: 1
    }
  }

  const blockMap = await getPostBlocks(post.id, 'slug')
  if (blockMap) {
    post.toc = getPageTableOfContents(post, blockMap)
  } else {
    post.toc = []
  }
  posts = posts.filter(post => post.type[0] === 'Post')
  const tags = await getAllTags(posts)
  const categories = await getAllCategories(posts)

  // 获取推荐文章
  const index = posts.indexOf(post)
  const prev = posts.slice(index - 1, index)[0] ?? posts.slice(-1)[0]
  const next = posts.slice(index + 1, index + 2)[0] ?? posts[0]

  return {
    props: { post, blockMap, tags, prev, next, posts, categories },
    revalidate: 1
  }
}

export default ArticleDetail
