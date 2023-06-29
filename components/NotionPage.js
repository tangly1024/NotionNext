import { NotionRenderer } from 'react-notion-x'
import dynamic from 'next/dynamic'
// import mediumZoom from '@fisch0920/medium-zoom'
import React, { useEffect } from 'react'
// import { Code } from 'react-notion-x/build/third-party/code'
import TweetEmbed from 'react-tweet-embed'

import 'katex/dist/katex.min.css'
import { mapImgUrl } from '@/lib/notion/mapImage'

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then(async (m) => {
    return m.Code
  }), { ssr: false }
)

const Equation = dynamic(() =>
  import('@/components/Equation').then(async (m) => {
    // 化学方程式
    await import('@/lib/mhchem')
    return m.Equation
  }), { ssr: false }
)
const Pdf = dynamic(
  () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
  {
    ssr: false
  }
)

// https://github.com/txs
// import PrismMac from '@/components/PrismMac'
const PrismMac = dynamic(() => import('@/components/PrismMac'), {
  ssr: false
})

const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then((m) => m.Collection), { ssr: true }
)

const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal), { ssr: false }
)

const Tweet = ({ id }) => {
  return <TweetEmbed tweetId={id} />
}

const NotionPage = ({ post, className }) => {
  useEffect(() => {
    autoScrollToTarget()
  }, [])

  if (!post || !post.blockMap) {
    return <>{post?.summary || ''}</>
  }

  return <div id='container' className={`mx-auto ${className}`}>
    <NotionRenderer
      recordMap={post.blockMap}
      mapPageUrl={mapPageUrl}
      mapImageUrl={mapImgUrl}
      components={{
        Code,
        Collection,
        Equation,
        Modal,
        Pdf,
        Tweet
      }} />

      <PrismMac/>

  </div>
}

/**
 * 根据url参数自动滚动到指定区域
 */
const autoScrollToTarget = () => {
  setTimeout(() => {
    // 跳转到指定标题
    const needToJumpToTitle = window.location.hash
    if (needToJumpToTitle) {
      const tocNode = document.getElementById(window.location.hash.substring(1))
      if (tocNode && tocNode?.className?.indexOf('notion') > -1) {
        tocNode.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }
    }
  }, 180)
}

/**
 * 将id映射成博文内部链接。
 * @param {*} id
 * @returns
 */
const mapPageUrl = id => {
  // return 'https://www.notion.so/' + id.replace(/-/g, '')
  return '/' + id.replace(/-/g, '')
}

export default NotionPage
