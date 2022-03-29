import BLOG from '@/blog.config'
import { getPageTableOfContents } from 'notion-utils'
import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import {
  Code,
  Collection,
  CollectionRow,
  Equation,
  NotionRenderer
} from 'react-notion-x'
import LayoutBase from './LayoutBase'
import { useRef, useEffect } from 'react'
import { ArticleLock } from './components/ArticleLock'
import mediumZoom from 'medium-zoom'

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}

export const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  const meta = {
    title: `${post.title} | ${BLOG.TITLE}`,
    description: post.summary,
    type: 'article',
    tags: post.tags
  }

  if (!lock && post?.blockMap?.block) {
    post.content = Object.keys(post.blockMap.block)
    post.toc = getPageTableOfContents(post, post.blockMap)
  }

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
  return (
    <LayoutBase {...props} meta={meta}>
      <div>
        <h2>{post?.title}</h2>

        {lock && <ArticleLock password={post.password} validPassword={validPassword} />}

        {!lock && <section id="notion-article" className="px-1">
            {post.blockMap && (
              <NotionRenderer
                recordMap={post.blockMap}
                mapPageUrl={mapPageUrl}
                components={{
                  equation: Equation,
                  code: Code,
                  collectionRow: CollectionRow,
                  collection: Collection
                }}
              />
            )}
          </section>}

      </div>
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
