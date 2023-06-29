import TocDrawerButton from './components/TocDrawerButton'
import LayoutBase from './LayoutBase'
import Card from './components/Card'
import LatestPostsGroup from './components/LatestPostsGroup'
import ArticleDetail from './components/ArticleDetail'
import TocDrawer from './components/TocDrawer'
import { useRef } from 'react'
import CONFIG_NEXT from './config_next'
import { ArticleLock } from './components/ArticleLock'
import { isBrowser } from '@/lib/utils'

export const LayoutSlug = (props) => {
  const { post, latestPosts, lock, validPassword } = props
  const drawerRight = useRef(null)
  const targetRef = isBrowser() ? document.getElementById('container') : null
  const floatSlot = post?.toc?.length > 1
    ? <div className='block lg:hidden'><TocDrawerButton onClick={() => {
      drawerRight?.current?.handleSwitchVisible()
    }} /></div>
    : null

  const rightAreaSlog = CONFIG_NEXT.RIGHT_LATEST_POSTS && <Card><LatestPostsGroup latestPosts={latestPosts} /></Card>

  return (
    <LayoutBase
      {...props}
      floatSlot={floatSlot}
      rightAreaSlot={rightAreaSlog}
    >

      {post && !lock && <ArticleDetail {...props} />}

      {post && lock && <ArticleLock validPassword={validPassword} />}

      {/* 悬浮目录按钮 */}
      {post && <div className='block lg:hidden'>
        <TocDrawer post={post} cRef={drawerRight} targetRef={targetRef} />
      </div>}

    </LayoutBase>
  )
}

export default LayoutSlug
