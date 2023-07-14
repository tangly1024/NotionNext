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
import ShareBar from '@/components/ShareBar'

export const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  const drawerRight = useRef(null)

  if (!post) {
    return <LayoutBase
      headerSlot={<HeaderArticle {...props} />}
      {...props}
      showCategory={false}
      showTag={false}
    ></LayoutBase>
  }

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
      <div className="w-full lg:hover:shadow lg:border rounded-t-xl lg:rounded-xl lg:px-2 lg:py-4 bg-white dark:bg-hexo-black-gray dark:border-black article">
        {lock && <ArticleLock validPassword={validPassword} />}

        {!lock && <div id="container" className="overflow-x-auto flex-grow mx-auto md:w-full md:px-5 ">

          <article itemScope itemType="https://schema.org/Movie" className="subpixel-antialiased overflow-y-hidden" >
            {/* Notion文章主体 */}
            <section id='notion-article' className='px-5 justify-center mx-auto max-w-2xl lg:max-w-full'>
              {post && <NotionPage post={post} />}
            </section>

            {/* 分享 */}
            <ShareBar post={post} />
            {post.type === 'Post' && <ArticleCopyright {...props} /> }
            {post.type === 'Post' && <ArticleRecommend {...props} /> }
            {post.type === 'Post' && <ArticleAdjacent {...props} /> }

          </article>

          <div className='pt-4 border-dashed'></div>

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

export default LayoutSlug
