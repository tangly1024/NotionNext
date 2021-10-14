import TagItem from '@/components/TagItem'
import { Code, Collection, CollectionRow, Equation, NotionRenderer } from 'react-notion-x'
import BLOG from '@/blog.config'
import formatDate from '@/lib/formatDate'
import 'gitalk/dist/gitalk.css'
import Comment from '@/components/Comment'
import Progress from '@/components/Progress'
import React, { useRef } from 'react'
import Image from 'next/image'
import RewardButton from '@/components/RewardButton'
import BlogPostMini from '@/components/BlogPostMini'
import { useRouter } from 'next/router'
import ShareButton from '@/components/ShareButton'
import JumpToTop from '@/components/JumpToTop'
import SideBar from '@/components/SideBar'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import TocBar from '@/components/TocBar'
import TopNav from '@/components/TopNav'

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}

const ArticleLayout = ({
  children,
  blockMap,
  post,
  emailHash,
  fullWidth = true,
  tags,
  prev,
  next
}) => {
  const meta = {
    title: post.title,
    type: 'article'
  }
  const targetRef = useRef(null)
  const url = BLOG.link + useRouter().asPath

  return (
    <Container meta={meta} tags={tags}>

      {/* live2d 看板娘 */}
      <script async src='https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js' />

      <Progress targetRef={targetRef} />

      <TopNav tags={tags} post={post} />

      {/* Wrapper */}
      <div className='flex justify-between bg-gray-100'>

        <SideBar tags={tags} post={post} />

        {/* 主体区块 */}
        <main className='bg-gray-100 w-full dark:bg-gray-800' ref={targetRef} >
          {/* 中央区域 wrapper */}
            <header
              className='hover:scale-105 hover:shadow-2xl duration-200 transform mx-auto max-w-5xl mt-16 lg:mt-20 md:flex-shrink-0 animate__fadeIn animate__animated'>
              {/* 封面图 */}
              {post.page_cover && post.page_cover.length > 1 && (
                <img className='bg-center object-cover w-full' style={{ maxHeight: '40rem' }}
                     src={post.page_cover} alt={post.title} />
              )}
            </header>

            <article className='mb-10 overflow-x-auto md:px-10 px-5 py-10 max-w-5xl mx-auto bg-white dark:border-gray-700 dark:bg-gray-700'>
              {/* 文章标题 */}
              <h1 className='font-bold text-4xl text-black my-5 dark:text-white animate__animated animate__fadeIn'>
                {post.title}
              </h1>

              {/* 文章信息 */}
              <div className='justify-between flex flex-wrap bg-gray-50 p-2 dark:bg-gray-700 dark:text-white'>
                <div className='flex-nowrap flex'>

                  {post.slug !== 'about' && (<>
                    <a
                      className='hidden md:block duration-200 px-1' href='/article/about'
                    >
                        <Image alt={BLOG.author} width={33} height={33} src='/avatar.svg'
                                  className='rounded-full cursor-pointer transform hover:scale-125 duration-200' />
                    </a>
                  </>)}
                  {post.tags && (
                    <div className='flex flex-nowrap leading-8 p-1'>
                      {post.tags.map(tag => (
                        <TagItem key={tag} tag={tag} />
                      ))}
                    </div>
                  )}

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
                  <a href='https://analytics.google.com/analytics/web/#/p273013569/reports/reportinghub'
                     className='fa fa-eye text-gray-500 text-sm leading-none py-1 px-2'>
                    &nbsp;<span id='busuanzi_value_page_pv' className='leading-6'></span>
                  </a>
                </div>
              </div>

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

              <div className='flex justify-center pt-5'>
                <RewardButton />
              </div>
              <p className='flex justify-center py-5 dark:text-gray-200'>
                 - 💖 本 文 结 束 😚 感 谢 您 的 阅 读  💖 -
              </p>

              {/* 版权声明 */}
              <section
                className='overflow-auto dark:bg-gray-700 dark:text-gray-300 bg-gray-100 p-5 leading-8 border-l-4 border-red-500'>
                <ul>
                  <li><strong>本文作者：</strong>{BLOG.author}</li>
                  <li><strong>本文链接：</strong> <a href={url}>{url}</a> 《{post.title}》</li>
                  <li><strong>版权声明：</strong> 本博客所有文章除特别声明外，均采用 BY-NC-SA 许可协议。转载请注明出处！</li>
                </ul>
              </section>

              <div className='text-gray-800 my-5 dark:text-gray-300'>
                <div className='mt-4 my-2 font-bold'>继续阅读</div>
                <div className='flex flex-wrap lg:flex-nowrap lg:space-x-10 justify-between py-2'>
                  <BlogPostMini post={prev} />
                  <BlogPostMini post={next} />
                </div>
              </div>
              {/* 评论互动 */}
              <Comment frontMatter={post} />
            </article>

            <div className='w-full border-t px-10 max-w-5xl mx-auto'>
              <Footer/>
            </div>

        </main>

        {/* 目录 */}
        <aside className='dark:bg-gray-800'>
          <section className='xl:static xl:block hidden top-0 right-0 fixed h-full w-52 dark:bg-gray-800 duration-500'>
            <div className='sticky top-16'>
              <div className='border-t dark:border-gray-600 border-b text-2xl bg-white font-bold text-black dark:bg-black dark:text-white py-6 px-6'>
                文章目录
              </div>
              <TocBar toc={post.toc} />
            </div>
          </section>
        </aside>

        {/* 下方菜单组 */}
        <div
          className='right-0 space-x-2 fixed flex bottom-24 px-5 py-1 duration-500'>
          <div className='flex-wrap'>
            {/* 分享按钮 */}
            <ShareButton post={post} />
            {/* 跳回顶部 */}
            <JumpToTop targetRef={targetRef}/>
          </div>
        </div>
      </div>

    </Container>
  )
}

export default ArticleLayout
