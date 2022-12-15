import LayoutBase from './LayoutBase'
import { useGlobal } from '@/lib/global'
import React from 'react'
import Catalog from './components/Catalog'
import { ArticleDetail } from './components/ArticleDetail'
import { ArticleLock } from './components/ArticleLock'

export const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  const { locale } = useGlobal()

  if (!post) {
    return <LayoutBase {...props} showInfoCard={true}
    />
  }

  const slotRight = post?.toc && post?.toc?.length > 3 && (
    <div key={locale.COMMON.TABLE_OF_CONTENTS} >
      <Catalog toc={post.toc} />
    </div>
  )

  return (
    <LayoutBase showInfoCard={true} slotRight={slotRight} {...props} >
      {!lock ? <ArticleDetail {...props} /> : <ArticleLock validPassword={validPassword} />}
    </LayoutBase>
  )
}
