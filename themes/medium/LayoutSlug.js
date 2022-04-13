import { getPageTableOfContents } from 'notion-utils'

import LayoutBase from './LayoutBase'
import { useGlobal } from '@/lib/global'
import React from 'react'
import Catalog from './components/Catalog'
import { ArticleDetail } from './components/ArticleDetail'
import { ArticleLock } from './components/ArticleLock'

export const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  if (!post) {
    return <LayoutBase
      {...props}
      showInfoCard={true}
    />
  }

  if (!lock && post?.blockMap?.block) {
    post.content = Object.keys(post.blockMap.block)
    post.toc = getPageTableOfContents(post, post.blockMap)
  }
  const { locale } = useGlobal()

  const slotRight = post?.toc && post?.toc?.length > 3 && (
    <div key={locale.COMMON.TABLE_OF_CONTENTS} >
      <Catalog toc={post.toc} />
    </div>
  )

  return (
    <LayoutBase
      {...props}
      showInfoCard={true}
      slotRight={slotRight}
    >

      {!lock && <ArticleDetail {...props} />}

      {lock && <ArticleLock password={post.password} validPassword={validPassword} />}
    </LayoutBase>
  )
}
