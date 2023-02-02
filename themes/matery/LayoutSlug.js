import React from 'react'
import { ArticleLock } from './components/ArticleLock'
import HeaderArticle from './components/HeaderArticle'
import LayoutBase from './LayoutBase'
import Comment from '@/components/Comment'
import NotionPage from '@/components/NotionPage'
import ArticleAdjacent from './components/ArticleAdjacent'
import ArticleCopyright from './components/ArticleCopyright'
import { ArticleInfo } from './components/ArticleInfo'
import Catalog from './components/Catalog'
import JumpToCommentButton from './components/JumpToCommentButton'

export const LayoutSlug = props => {
  const { post, lock, validPassword } = props

  const [show, switchShow] = React.useState(false)

  const scrollListener = () => {
    const scrollY = window.pageYOffset
    const shouldShow = scrollY > 220 && post?.toc?.length > 0
    if (shouldShow !== show) {
      switchShow(shouldShow)
    }
  }
  React.useEffect(() => {
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [show])

  if (!post) {
    return <LayoutBase
            headerSlot={<HeaderArticle {...props} />}
            {...props}
            showCategory={false}
            showTag={false}
        ></LayoutBase>
  }

  return (
        <LayoutBase
            headerSlot={<HeaderArticle {...props} />}
            {...props}
            showCategory={false}
            showTag={false}
        >

            <div id='inner-wrapper'>
                <div className={'drop-shadow-xl w-full lg:max-w-3xl 2xl:max-w-4xl'}>
                    <div className="-mt-32 rounded-md mx-3 lg:border lg:rounded-xl lg:py-4 bg-white dark:bg-hexo-black-gray  dark:border-black">
                        {lock && <ArticleLock validPassword={validPassword} />}

                        {!lock && <div id="container" className="overflow-x-auto md:w-full px-3 ">
                            {post?.type === 'Post' && <>
                                <div
                                    data-aos="fade-down"
                                    data-aos-duration="500"
                                    data-aos-easing="ease-in-out"
                                    data-aos-once="false"
                                    data-aos-anchor-placement="top-center"
                                    className='px-10'>
                                    <ArticleInfo post={post} />
                                </div>
                                <hr />
                            </>}

                            <div className='lg:px-10 '>
                                <article itemScope itemType="https://schema.org/Movie" className="subpixel-antialiased overflow-y-hidden" >
                                    {/* Notion文章主体 */}
                                    <section id='notion-article'
                                        data-aos-delay="200"
                                        data-aos="fade-down"
                                        data-aos-duration="500"
                                        data-aos-easing="ease-in-out"
                                        data-aos-once="false"
                                        data-aos-anchor-placement="top-bottom"
                                        className='justify-center mx-auto max-w-2xl lg:max-w-full'>
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

                                    {post.type === 'Post' && <ArticleCopyright {...props} />}

                                </article>

                                <hr className='border-dashed' />

                                {/* 评论互动 */}
                                <div className="duration-200 overflow-x-auto dark:bg-hexo-black-gray px-3">
                                    <Comment frontMatter={post} />
                                </div>
                            </div>

                        </div>}
                    </div>
                    {post.type === 'Post' && <ArticleAdjacent {...props} />}

                    {post?.toc?.length > 0 && <div id='toc-wrapper' style={{ zIndex: '-1' }} className='absolute top-0 w-full h-full xl:block hidden' >
                        <div data-aos-delay="200"
                            data-aos="fade-down"
                            data-aos-duration="500"
                            data-aos-easing="ease-in-out"
                            data-aos-once="false"
                            data-aos-anchor-placement="top-center"
                            className='relative h-full'>
                            <div className='float-right xl:-mr-72 xl:w-72 w-56 -mr-56 h-full mt-40'>
                                <div className='sticky top-24'>
                                    <Catalog toc={post.toc} />
                                </div>
                            </div>
                        </div>
                    </div>}

                </div>

                <div className='fixed bottom-28 right-4'>
                    <JumpToCommentButton />
                </div>

            </div>

        </LayoutBase>
  )
}
