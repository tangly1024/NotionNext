import { getPageTableOfContents } from 'notion-utils'
import { useRef } from 'react'
import { ArticleLock } from './components/ArticleLock'
import HeaderArticle from './components/HeaderArticle'
import JumpToCommentButton from './components/JumpToCommentButton'
import TocDrawer from './components/TocDrawer'
import TocDrawerButton from './components/TocDrawerButton'
import LayoutBase from './LayoutBase'
import Comment from '@/components/Comment'
import NotionPage from '@/components/NotionPage'
import ArticleAdjacent from './components/ArticleAdjacent'
import ArticleCopyright from './components/ArticleCopyright'
import ArticleRecommend from './components/ArticleRecommend'
import { isBrowser } from '@/lib/utils'

export const LayoutSlug = props => {
  const { post, lock, validPassword } = props

  if (!post) {
    return <LayoutBase
      headerSlot={<HeaderArticle {...props} />}
      {...props}
      showCategory={false}
      showTag={false}
    ></LayoutBase>
  }

  if (!lock && post?.blockMap?.block) {
    post.content = Object.keys(post.blockMap.block)
    post.toc = getPageTableOfContents(post, post.blockMap)
  }

  const drawerRight = useRef(null)
  const targetRef = isBrowser() ? document.getElementById('container') : null

  const floatSlot = <>
    {post?.toc?.length > 1 && <div className="block lg:hidden">
      <TocDrawerButton
        onClick={() => {
          drawerRight?.current?.handleSwitchVisible()
        }}
      />
    </div>}
    <JumpToCommentButton />
  </>

  return (
    <LayoutBase
      headerSlot={<HeaderArticle {...props} />}
      {...props}
      showCategory={false}
      showTag={false}
      floatSlot={floatSlot}
    >
      <div className="w-full lg:shadow-sm lg:hover:shadow lg:border lg:rounded-xl lg:px-2 lg:py-4 bg-white dark:bg-hexo-black-gray dark:border-black">
        {lock && <ArticleLock password={post.password} validPassword={validPassword} />}

        {!lock && <div id="container" className="overflow-x-auto flex-grow mx-auto md:w-full md:px-5 ">

          <article itemScope itemType="https://schema.org/Movie" className="subpixel-antialiased" >
            {/* Notion文章主体 */}
            <section id='notion-article' className='px-5 justify-center mx-auto max-w-2xl lg:max-w-full'>
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

            <ArticleCopyright {...props} />
            <ArticleRecommend {...props} />
            <ArticleAdjacent {...props} />
          </article>

          <hr className='border-dashed' />

          {/* 评论互动 */}
          <div className="duration-200 overflow-x-auto bg-white dark:bg-hexo-black-gray px-3">
            <Comment frontMatter={post} />
          </div>
        </div>}
      </div>

      <div className='block lg:hidden'>
        <TocDrawer post={post} cRef={drawerRight} targetRef={targetRef} />
      </div>

    </LayoutBase>
  )
}
