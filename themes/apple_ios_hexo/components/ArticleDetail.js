import Comment from '@/components/Comment'
import mediumZoom from 'medium-zoom'
import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  Code,
  Collection,
  CollectionRow,
  Equation,
  NotionRenderer
} from 'react-notion-x'
import ArticleAdjacent from './ArticleAdjacent'
import ArticleCopyright from './ArticleCopyright'
import ArticleRecommend from './ArticleRecommend'
import YouTube from 'react-youtube'

/**
 *
 * @param {*} param0
 * @returns
 */
export default function ArticleDetail(props) {
  const [YTTime, setYTTime] = useState(0)
  const router = useRouter()
  const { post } = props
  const zoom =
    typeof window !== 'undefined' &&
    mediumZoom({
      container: '.notion-viewport',
      background: 'rgba(0, 0, 0, 0.2)',
      margin: getMediumZoomMargin()
    })
  const zoomRef = useRef(zoom ? zoom.clone() : null)
  let youtubeId
  if (post?.youtube) {
    const YouTubeURL = new URL(post.youtube)
    const params = new URLSearchParams(YouTubeURL.search)
    youtubeId = params.get('v')
  }

  useEffect(() => {
    // 将所有container下的所有图片添加medium-zoom
    const container = document?.getElementById('container')
    const imgList = container?.getElementsByTagName('img')
    if (imgList && zoomRef.current) {
      for (let i = 0; i < imgList.length; i++) {
        zoomRef.current.attach(imgList[i])
      }
    }
  })

  useEffect(() => {
    const onHashChanged = () => {
      const linkHash = window.location.hash
      if (linkHash.includes('youtube')) {
        setYTTime(parseInt(linkHash.replace(/\D/g, '')))
      }
    }
    window.addEventListener('hashchange', onHashChanged)
    const a = container?.getElementsByClassName('notion-link')
    for (let i = 0; i < a.length; i++) {
      if (a[i].href.includes('youtube')) {
        let urlTime
        if (a[i].href.includes('t=')) {
          //original link
          const itemHref = new URL(a[i].href)
          const itemParams = new URLSearchParams(itemHref.search)
          urlTime = itemParams.get('t')
        } else {
          const hrefCut = a[i].href.split('=')
          urlTime = hrefCut[1]
        }
        a[i].href = `#youtube-time=${urlTime}`
        a[i].target = ''
        a[i].rel = ''
      }
    }

    return () => {
      window.removeEventListener('hashchange', onHashChanged)
    }
  }, [])

  return (
    <div
      id="container"
      className="max-w-5xl overflow-x-auto flex-grow mx-auto md:w-full md:px-5 "
    >
      <article
        itemScope
        itemType="https://schema.org/Movie"
        className="subpixel-antialiased sm:pt-1 md:pt-0"
      >
        {/* Notion文章主体 */}
        <section id="notion-article" className="px-2">
          {youtubeId && (
            <div
              className="video-player w-full"
              style={{ aspectRatio: '16/9' }}
            >
              <YouTube
                videoId={youtubeId}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    start: YTTime,
                    autoplay: 1
                  }
                }}
              />
            </div>
          )}
          ----
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
        </section>

        <section className="px-1 py-2 my-1 text-sm font-light overflow-auto text-gray-600  dark:text-gray-400">
          {/* 文章内嵌广告 */}
          <ins
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center' }}
            data-adtest="on"
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client="ca-pub-2708419466378217"
            data-ad-slot="3806269138"
          />
        </section>

        <ArticleCopyright {...props} />
        <ArticleRecommend {...props} />
        <ArticleAdjacent {...props} />
      </article>

      <hr className="border-dashed" />

      {/* 评论互动 */}
      <div className="duration-200  overflow-x-auto bg-white dark:bg-hexo-black-gray px-3">
        <Comment frontMatter={post} />
      </div>
    </div>
  )
}

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}

function getMediumZoomMargin() {
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
