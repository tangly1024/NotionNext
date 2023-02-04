import LayoutBase from './LayoutBase'
import { useGlobal } from '@/lib/global'
import { React, useRef } from 'react'
import Catalog from './components/Catalog'
import { ArticleDetail } from './components/ArticleDetail'
import { ArticleLock } from './components/ArticleLock'
import JumpToCommentButton from './components/JumpToCommentButton'
import TocDrawer from './components/TocDrawer'
import TocDrawerButton from './components/TocDrawerButton'
import { isBrowser } from '@/lib/utils'

export const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  const { locale } = useGlobal()
  const drawerRight = useRef(null)

  if (!post) {
    return <LayoutBase {...props} showInfoCard={true}
    />
  }

  const slotRight = post?.toc && post?.toc?.length > 3 && (
    <div key={locale.COMMON.TABLE_OF_CONTENTS} >
      <Catalog toc={post.toc} />
    </div>
  )

  const targetRef = isBrowser() ? document.getElementById('container') : null

  const floatSlot = <>
    {post?.toc?.length > 1 && <div className="block xl:hidden">
      <TocDrawerButton
        onClick={() => {
          drawerRight?.current?.handleSwitchVisible()
        }}
      />
    </div>}
    <JumpToCommentButton />
  </>

  return (
    <LayoutBase showInfoCard={true} slotRight={slotRight} floatSlot={floatSlot} {...props} >
      {!lock ? <ArticleDetail {...props} /> : <ArticleLock validPassword={validPassword} />}
      <div className='block xl:hidden'>
        <TocDrawer post={post} cRef={drawerRight} targetRef={targetRef} />
      </div>
    </LayoutBase>
  )
}
