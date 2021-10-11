import TagItem from '@/components/TagItem'
import { Code, Collection, CollectionRow, Equation, NotionRenderer } from 'react-notion-x'
import BLOG from '@/blog.config'
import formatDate from '@/lib/formatDate'
import 'gitalk/dist/gitalk.css'
import Comment from '@/components/Comment'
import Progress from '@/components/Progress'
import { useRef } from 'react'
import Image from 'next/image'
import RewardButton from '@/components/RewardButton'
import { useTheme } from '@/lib/theme'
import BlogPostMini from '@/components/BlogPostMini'
import { useRouter } from 'next/router'
import ShareButton from '@/components/ShareButton'
import JumpToTop from '@/components/JumpToTop'
import CommonHead from '@/components/CommonHead'
import TopNav from '@/components/TopNav'
import SideBarResponsive from '@/components/SideBarResponsive'

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}

const ArticleLayout = ({
  children,
  blockMap,
  frontMatter,
  emailHash,
  fullWidth = true,
  tags,
  prev,
  next
}) => {
  const meta = {
    title: frontMatter.title,
    type: 'article'
  }
  const targetRef = useRef(null)
  const { theme } = useTheme()
  const url = BLOG.link + useRouter().asPath

  return (
    <div className={`${BLOG.font} ${theme}`}>
      <CommonHead meta={meta} />

      {/* live2d 看板娘 */}
      <script async src='https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js' />

      <Progress targetRef={targetRef} />

      <div className=' fixed w-full top-0 z-20'>
        <TopNav post={frontMatter}/>
      </div>

      {/* Wrapper */}
      <div className='flex justify-between bg-gray-100 dark:bg-black'>

        <SideBarResponsive tags={tags} post={frontMatter} />

        {/* 主体区块 */}
        <main className='bg-gray-100 dark:bg-black w-full'>
          {/* 中央区域 wrapper */}
          <div>

            <header
              className='hover:scale-105 hover:shadow-2xl duration-200 transform mx-auto max-w-5xl mt-20 md:flex-shrink-0 overflow-y-hidden animate__fadeIn animate__animated'>
              {/* 封面图 */}
              {frontMatter.page_cover && frontMatter.page_cover.length > 1 && (
                <img className='bg-center object-cover w-full' style={{ maxHeight: '40rem' }}
                     src={frontMatter.page_cover} alt={frontMatter.title} />
              )}
            </header>

            <article
              ref={targetRef}
              className='hover:shadow-2xl mb-20 overflow-x-auto px-10 py-10 max-w-5xl mx-auto bg-white dark:border-gray-700 dark:bg-gray-600'>
              {/* 文章标题 */}
              <h1 className='font-bold text-4xl text-black my-5 dark:text-white animate__animated animate__fadeIn'>
                {frontMatter.title}
              </h1>

              {/* 文章信息 */}
              <div className='justify-between flex flex-wrap bg-gray-50 p-2 dark:bg-gray-700 dark:text-white'>
                <div className='flex-nowrap flex'>

                  {frontMatter.slug !== 'about' && (<>
                    <a
                      className='hidden md:block duration-200 px-1' href='/article/about'
                    >
                        <Image alt={BLOG.author} width={33} height={33} src='/avatar.svg'
                                  className='rounded-full cursor-pointer transform hover:scale-125 duration-200' />
                    </a>
                  </>)}
                  {frontMatter.tags && (
                    <div className='flex flex-nowrap leading-8 p-1'>
                      {frontMatter.tags.map(tag => (
                        <TagItem key={tag} tag={tag} />
                      ))}
                    </div>
                  )}

                  {frontMatter.type[0] !== 'Page' && (
                    <div className='flex items-start text-gray-500 dark:text-gray-400 leading-10'>
                      {formatDate(
                        frontMatter?.date?.start_date || frontMatter.createdTime,
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
              <p className='flex justify-center py-5'>
                 - 💖 本 文 结 束 😚 感 谢 您 的 阅 读  💖 -
              </p>

              {/* 版权声明 */}
              <section
                className='overflow-auto dark:bg-gray-700 dark:text-gray-300 bg-gray-100 p-5 leading-8 border-l-4 border-red-500'>
                <ul>
                  <li><strong>本文作者：</strong>{BLOG.author}</li>
                  <li><strong>本文链接：</strong> <a href={url}>{url}</a> 《{frontMatter.title}》</li>
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
              <Comment frontMatter={frontMatter} />
            </article>
          </div>

        </main>

        {/* 下方菜单组 */}
        <div
          className='right-0 space-x-2 fixed flex bottom-24 px-5 py-1 duration-500'>
          <div className='flex-wrap'>
            {/* 分享按钮 */}
            <ShareButton post={frontMatter} />
            {/* 跳回顶部 */}
            <JumpToTop />
          </div>
        </div>
      </div>

    </div>
  )
}

export default ArticleLayout
