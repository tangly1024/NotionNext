import { getPageTableOfContents } from 'notion-utils'

import LayoutBase from './LayoutBase'
import { useGlobal } from '@/lib/global'
import mediumZoom from 'medium-zoom'
import React, { useEffect, useRef } from 'react'
import Catalog from './components/Catalog'
import { ArticleDetail } from './components/ArticleDetail'
import { ArticleLock } from './components/ArticleLock'

export const LayoutSlug = props => {
  const { post, lock, validPassword } = props

  if (!lock && post?.blockMap?.block) {
    post.content = Object.keys(post.blockMap.block)
    post.toc = getPageTableOfContents(post, post.blockMap)
  }
  const { locale } = useGlobal()

  const zoom =
    typeof window !== 'undefined' &&
    mediumZoom({
      container: '.notion-viewport',
      background: 'rgba(0, 0, 0, 0.2)',
      margin: getMediumZoomMargin()
    })
  const zoomRef = useRef(zoom ? zoom.clone() : null)

  useEffect(() => {
    // 将所有container下的所有图片添加medium-zoom
    const container = document.getElementById('notion-article')
    const imgList = container?.getElementsByTagName('img')
    if (imgList && zoomRef.current) {
      for (let i = 0; i < imgList.length; i++) {
        zoomRef.current.attach(imgList[i])
      }
    }
  })

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

function getMediumZoomMargin () {
  const width = window.innerWidth

  if (width < 500) {
    return 8
  } else if (width < 800) {
    return 20
  } else if (width < 1280) {
    return 30
  } else if (width < 1600) {
    return 40
  } else if (width < 1920) {
    return 48
  } else {
    return 72
  }
}
