import { getAllPosts, getAllTags, getPostBlocks } from '@/lib/notion'
import BLOG from '@/blog.config'
import { getPageTableOfContents } from 'notion-utils'
import { useRouter } from 'next/router'
import Progress from '@/components/Progress'
import Image from 'next/image'
import TagItem from '@/components/TagItem'
import formatDate from '@/lib/formatDate'
import { Code, Collection, CollectionRow, Equation, NotionRenderer } from 'react-notion-x'
import RewardButton from '@/components/RewardButton'
import ShareBar from '@/components/ShareBar'
import BlogPostMini from '@/components/BlogPostMini'
import Comment from '@/components/Comment'
import TocBar from '@/components/TocBar'
import BaseLayout from '@/layouts/BaseLayout'
import { useRef } from 'react'
import Custom404 from '@/pages/404'

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}
const BlogPost = ({ post, blockMap, tags, prev, next }) => {
  if (!post) {
    return <Custom404/>
  }
  const meta = {
    title: post.title,
    description: post.summary,
    type: 'article'
  }
  const targetRef = useRef(null)
  const url = BLOG.link + useRouter().asPath

  return <BaseLayout meta={meta} tags={tags} post={post}>
    {/* 阅读进度条 */}
    <Progress targetRef={targetRef} />

    <div id='article-wrapper' ref={targetRef} className='flex-grow bg-gray-100 dark:bg-gray-800'>
      {/* 中央区域 wrapper */}
      <header
        className='hover:scale-105 hover:shadow-2xl duration-200 transform mx-auto max-w-5xl mt-16 lg:mt-20 md:flex-shrink-0 animate__fadeIn animate__animated'>
        {/* 封面图 */}
        {post.page_cover && post.page_cover.length > 1 && (
          <img className='bg-center object-cover w-full' style={{ maxHeight: '40rem' }}
               src={post.page_cover} alt={post.title} />
        )}
      </header>

      <article
        className='w-screen md:w-full overflow-x-auto md:px-10 px-5 py-10 max-w-5xl mx-auto bg-white dark:border-gray-700 dark:bg-gray-700'>
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
            <a href='/#'
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
          - 💖 本 文 结 束 😚 感 谢 您 的 阅 读 💖 -
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

        <section className='flex'>
          <div className='text-gray-800 my-5 dark:text-gray-300 font-bold my-5 mr-2'>分享本文&nbsp;</div>
          <ShareBar post={post} />
        </section>

        <div className='text-gray-800 my-5 dark:text-gray-300'>
          <div className='mt-4 font-bold'>继续阅读</div>
          <div className='flex flex-wrap lg:flex-nowrap lg:space-x-10 justify-between py-2'>
            <BlogPostMini post={prev} />
            <BlogPostMini post={next} />
          </div>
        </div>
        {/* 评论互动 */}
        <Comment frontMatter={post} />
      </article>

    </div>

    {/* 右侧目录 */}
    <aside className='dark:bg-gray-800 bg-white z-10'>
      <section
        className='h-full xl:static xl:block hidden top-0 right-0 fixed h-full w-52 dark:bg-gray-800 duration-500'>
        <div id='right-toc' className='sticky top-16 duration-500'>
          <div
            className='border-t dark:border-gray-600 border-b text-2xl bg-white font-bold text-black dark:bg-gray-900 dark:text-white py-6 px-6'>
            文章目录
          </div>
          <TocBar toc={post.toc} />
        </div>
      </section>
    </aside>

    {/* 右下角悬浮菜单 */}
  </BaseLayout>
}

export async function getStaticPaths () {
  let posts = await getAllPosts({ from: 'slug - paths' })
  posts = posts.filter(post => post.status[0] === 'Published')
  return {
    paths: posts.map(row => `${BLOG.path}/article/${row.slug}`),
    fallback: true
  }
}

export async function getStaticProps ({ params: { slug } }) {
  let posts = await getAllPosts({ from: 'slug-props' })
  posts = posts.filter(post => post.status[0] === 'Published')
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
  // 获取推荐文章
  const index = posts.indexOf(post)
  const prev = posts.slice(index - 1, index)[0] ?? posts.slice(-1)[0]
  const next = posts.slice(index + 1, index + 2)[0] ?? posts[0]

  return {
    props: { post, blockMap, tags, prev, next },
    revalidate: 1
  }
}

export default BlogPost
