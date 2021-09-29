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
import SideBar from '@/components/SideBar'
import BlogPostMini from '@/components/BlogPostMini'
import { useRouter } from 'next/router'
import ShareButton from '@/components/ShareButton'
import TopJumper from '@/components/TopJumper'
import CommonHead from '@/components/CommonHead'

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

      {/* Wrapper */}
      <div className='flex justify-between bg-gray-100 dark:bg-black'>

        <SideBar tags={tags} post={frontMatter} />

        {/* 主体区块 */}
        <main className='bg-gray-100 dark:bg-black w-full'>
          {/* 中央区域 wrapper */}
          <div>

            <header
              className='mx-auto max-w-5xl mt-20 md:flex-shrink-0 overflow-y-hidden animate__fadeIn animate__animated'>
              {/* 封面图 */}
              {frontMatter.page_cover && frontMatter.page_cover.length > 1 && (
                <img className='bg-center object-cover w-full' style={{ maxHeight: '40rem' }}
                     src={frontMatter.page_cover} alt={frontMatter.title} />
              )}
            </header>

            <article
              ref={targetRef}
              className='mb-20 overflow-x-auto px-10 py-10 max-w-5xl mx-auto bg-white dark:border-gray-700 dark:bg-gray-600'>
              {/* 文章标题 */}
              <h1 className='font-bold text-4xl text-black my-5 dark:text-white animate__animated animate__fadeIn'>
                {frontMatter.title}
              </h1>

              {/* 文章信息 */}
              <div className='justify-between flex flex-wrap bg-gray-50 p-2
                  dark:bg-gray-700 dark:text-white'>
                <div className='flex-nowrap flex'>

                  {frontMatter.tags && (
                    <div className='flex flex-nowrap leading-8 p-1'>
                      {frontMatter.tags.map(tag => (
                        <TagItem key={tag} tag={tag} />
                      ))}
                    </div>
                  )}

                  {frontMatter.slug !== 'about' && (<>
                    <a
                      className='flex-nowrap flex hidden md:block hover:bg-blue-500 hover:text-white duration-200 px-1 mx-1'
                      href='/article/about'>
                      <Image href='https://www.baidu.com' alt={BLOG.author} width={20} height={20} src='/avatar.svg'
                             className='rounded-full' />
                      <div className='mx-2 leading-6 my-1 md:block'>{BLOG.author}</div>
                    </a>
                  </>)}

                  {frontMatter.type[0] !== 'Page' && (
                    <div className='flex items-start text-gray-500 dark:text-gray-400 text-sm leading-8 pr-3'>
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
                ------------- 💖 🌞 本 文 结 束 😚 感 谢 您 的 阅 读 🌞 💖 -------------
              </p>

              {/* 版权声明 */}
              <section
                className='dark:bg-gray-700 dark:text-gray-300 bg-gray-100 p-5 leading-8 border-l-4 border-red-500'>
                <ul>
                  <li><strong>本文作者：</strong>{BLOG.author}</li>
                  <li><strong>本文链接：</strong> <a href={url}>{url}</a> 《{frontMatter.title}》</li>
                  <li><strong>版权声明：</strong> 本博客所有文章除特别声明外，均采用 BY-NC-SA 许可协议。转载请注明出处！</li>
                </ul>
              </section>

              <div className='text-gray-800 my-5 dark:text-gray-300'>
                <div className='mt-4 my-2 font-bold'>继续阅读</div>
                <div className='flex flex-wrap lg:flex-nowrap lg:space-x-3 justify-between py-2'>
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
            <TopJumper />
          </div>
        </div>
      </div>

    </div>
  )
}

export default ArticleLayout
