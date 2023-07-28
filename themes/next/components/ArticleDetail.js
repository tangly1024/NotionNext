import BLOG from '@/blog.config'
import BlogAround from './BlogAround'
import Comment from '@/components/Comment'
import RecommendPosts from './RecommendPosts'
import ShareBar from '@/components/ShareBar'
import TagItem from './TagItem'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ArticleCopyright from './ArticleCopyright'
import WordCount from './WordCount'
import NotionPage from '@/components/NotionPage'
import CONFIG from '../config'
import NotionIcon from '@/components/NotionIcon'
import LazyImage from '@/components/LazyImage'
import { formatDateFmt } from '@/lib/formatDate'

/**
 *
 * @param {*} param0
 * @returns
 */
export default function ArticleDetail(props) {
  const { post, recommendPosts, prev, next } = props
  const url = BLOG.LINK + useRouter().asPath
  const { locale } = useGlobal()
  const showArticleInfo = CONFIG.ARTICLE_INFO

  return (
        <div id="article-wrapper"
            className="shadow md:hover:shadow-2xl overflow-x-auto flex-grow mx-auto w-screen md:w-full ">
            <div itemScope itemType="https://schema.org/Movie"
                data-aos="fade-down"
                data-aos-duration="300"
                data-aos-once="true"
                data-aos-anchor-placement="top-bottom"
                className="subpixel-antialiased overflow-y-hidden py-10 px-5 lg:pt-24 md:px-24  dark:border-gray-700 bg-white dark:bg-hexo-black-gray"
            >

                {showArticleInfo && <header>
                    {/* 头图 */}
                    {CONFIG.POST_HEADER_IMAGE_VISIBLE && post?.type && !post?.type !== 'Page' && post?.pageCover && (
                        <div className="w-full relative md:flex-shrink-0 overflow-hidden">
                            <LazyImage alt={post.title} src={post?.pageCover} className='object-center w-full' />
                        </div>
                    )}

                    {/* title */}
                    <div className=" text-center font-bold text-3xl text-black dark:text-white font-serif pt-6">
                        <NotionIcon icon={post.pageIcon} />{post.title}
                    </div>

                    {/* meta */}
                    <section className="mt-2 text-gray-400 dark:text-gray-400 font-light leading-7 text-sm">
                        <div className='flex flex-wrap justify-center'>
                            {post?.type !== 'Page' && (<>
                                <Link
                                    href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
                                    passHref
                                    legacyBehavior>
                                    <div className="pl-1 mr-2 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 border-b dark:border-gray-500 border-dashed">
                                        <i className='far fa-calendar mr-1' /> {post?.publishTime}
                                    </div>
                                </Link>
                                <span className='mr-2'> | <i className='far fa-calendar-check mr-2' />{post.lastEditedTime} </span>

                                <div className="hidden busuanzi_container_page_pv font-light mr-2">
                                    <i className='mr-1 fas fa-eye' />
                                    <span className="mr-2 busuanzi_value_page_pv" />
                                </div>

                            </>)}
                        </div>

                        <WordCount />
                    </section>

                </header>}

                {/* Notion内容主体 */}
                <article className='px-1 max-w-3xl mx-auto'>
                    {post && (<NotionPage post={post} />)}
                </article>

                {showArticleInfo && <>

                    {/* 分享 */}
                    <ShareBar post={post} />

                    {/* 版权声明 */}
                    {post?.type === 'Post' && <ArticleCopyright author={BLOG.AUTHOR} url={url} />}

                    {/* 推荐文章 */}
                    {post?.type === 'Post' && <RecommendPosts currentPost={post} recommendPosts={recommendPosts} />}

                    <section className="flex justify-between">
                        {/* 分类 */}
                        {post.category && <>
                            <div className="cursor-pointer my-auto text-md mr-2 hover:text-black dark:hover:text-white border-b dark:text-gray-500 border-dashed">
                                <Link href={`/category/${post.category}`} passHref legacyBehavior>
                                    <><i className="mr-1 far fa-folder-open" /> {post.category}</>
                                </Link>
                            </div>

                        </>}

                        {/* 标签列表 */}
                        {post?.type === 'Post' && (
                            <>
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
                            </>
                        )}
                    </section>
                    {post?.type === 'Post' && <BlogAround prev={prev} next={next} />}
                </>}

                {/* 评论互动 */}
                <div className="duration-200 w-full dark:border-gray-700 bg-white dark:bg-hexo-black-gray">
                    <Comment frontMatter={post} />
                </div>
            </div>

        </div>
  )
}
