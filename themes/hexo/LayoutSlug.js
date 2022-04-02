import { getPageTableOfContents } from 'notion-utils'
import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import { useRef } from 'react'
import ArticleDetail from './components/ArticleDetail'
import { ArticleLock } from './components/ArticleLock'
import HeaderArticle from './components/HeaderArticle'
import JumpToCommentButton from './components/JumpToCommentButton'
import TocDrawer from './components/TocDrawer'
import TocDrawerButton from './components/TocDrawerButton'
import LayoutBase from './LayoutBase'

export const LayoutSlug = props => {
  const { post, lock, validPassword } = props

  if (!lock && post?.blockMap?.block) {
    post.content = Object.keys(post.blockMap.block)
    post.toc = getPageTableOfContents(post, post.blockMap)
  }

  const drawerRight = useRef(null)
  const targetRef = typeof window !== 'undefined' ? document.getElementById('container') : null

  const floatSlot = <>
  {post?.toc?.length > 1 && <div className="block lg:hidden">
        <TocDrawerButton
          onClick={() => {
            drawerRight?.current?.handleSwitchVisible()
          }}
        />
      </div>}
        <JumpToCommentButton/>
      </>

  return (
    <LayoutBase
      headerSlot={<HeaderArticle {...props}/>}
      {...props}
      showCategory={false}
      showTag={false}
      floatSlot={floatSlot}
    >
      <div className="w-full lg:shadow-sm lg:hover:shadow lg:border lg:rounded-xl lg:px-2 lg:py-4 bg-white dark:bg-hexo-black-gray dark:border-black">
        {!lock && <ArticleDetail {...props} />}
        {lock && <ArticleLock password={post.password} validPassword={validPassword} />}
      </div>

      <div className='block lg:hidden'>
        <TocDrawer post={post} cRef={drawerRight} targetRef={targetRef} />
      </div>

    </LayoutBase>
  )
}
