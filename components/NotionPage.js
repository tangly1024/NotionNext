import { siteConfig } from '@/lib/config'
import { compressImage, mapImgUrl } from '@/lib/db/notion/mapImage'
import NotionEmbed from '@/components/NotionEmbed'
import NotionLink from '@/components/NotionLink'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import mediumZoom from '@fisch0920/medium-zoom'
import 'katex/dist/katex.min.css'
import dynamic from 'next/dynamic'
import { useEffect, useId, useRef } from 'react'
import { NotionRenderer } from 'react-notion-x'
import OriginalityProof from './OriginalityProof'

/**
 * 整个站点的核心组件
 * 将Notion数据渲染成网页
 * @param {*} param0
 * @returns
 */
const NotionPage = ({ post, className }) => {
  // 是否关闭数据库和画册的点击跳转
  const POST_DISABLE_GALLERY_CLICK = siteConfig('POST_DISABLE_GALLERY_CLICK')
  const POST_DISABLE_DATABASE_CLICK = siteConfig('POST_DISABLE_DATABASE_CLICK')
  const SPOILER_TEXT_TAG = siteConfig('SPOILER_TEXT_TAG')

  const zoomRef = useRef(null)
  const articleRef = useRef(null)
  const zoomOwnerId = useId()
  const zoomSequence = useRef(0)
  const IMAGE_ZOOM_IN_WIDTH = siteConfig('IMAGE_ZOOM_IN_WIDTH', 1200)
  // 页面首次打开时执行的勾子
  useEffect(() => {
    // 检测当前的url并自动滚动到对应目标
    autoScrollToHash()
  }, [])

  // 页面文章发生变化时会执行的勾子
  useEffect(() => {
    // 相册视图点击禁止跳转，只能放大查看图片
    if (POST_DISABLE_GALLERY_CLICK) {
      if (!zoomRef.current && isBrowser) {
        zoomRef.current = mediumZoom({
          background: 'rgba(0, 0, 0, 0.2)',
          margin: getMediumZoomMargin()
        })
      }
      // 针对页面中的gallery视图，点击后是放大图片还是跳转到gallery的内部页面
      processGalleryImg(zoomRef?.current)
    }

    // 页内数据库点击禁止跳转，只能查看
    if (POST_DISABLE_DATABASE_CLICK) {
      processDisableDatabaseUrl()
    }
  }, [post, POST_DISABLE_GALLERY_CLICK, POST_DISABLE_DATABASE_CLICK])

  useEffect(() => {
    const articleRoot = articleRef.current
    if (!articleRoot) return
    const zoomSources = new Map()
    const activeZooms = new Map()
    const markerAttribute = 'data-notionnext-zoom-id'
    const finishZoom = (image, entry) => {
      // A broken image can become complete before its error event. medium-zoom
      // may already have appended that HD copy, then lose its reference on error.
      document.querySelectorAll(
        `.medium-zoom-image--opened[${markerAttribute}="${entry.marker}"]`
      ).forEach(copy => copy.remove())
      if (image.getAttribute(markerAttribute) === entry.marker) {
        if (entry.previousMarker === null) image.removeAttribute(markerAttribute)
        else image.setAttribute(markerAttribute, entry.previousMarker)
      }
    }
    const prepareZoomSource = event => {
      const image = event.target
      if (image.tagName !== 'IMG') return
      const zoom = event.detail?.zoom
      if (zoom) {
        const marker = `${zoomOwnerId}-${++zoomSequence.current}`
        activeZooms.set(image, { zoom, marker, previousMarker: image.getAttribute(markerAttribute) })
        image.setAttribute(markerAttribute, marker)
      }
      if (image.hasAttribute('data-zoom-src')) return
      const source = image.currentSrc || image.getAttribute('src')
      const hdSource = compressImage(source, IMAGE_ZOOM_IN_WIDTH)
      if (!hdSource || hdSource === source) return
      zoomSources.set(image, hdSource)
      image.setAttribute('data-zoom-src', hdSource)
    }
    const restoreZoomSource = image => {
      if (!zoomSources.has(image)) return
      if (image.getAttribute('data-zoom-src') === zoomSources.get(image)) {
        image.removeAttribute('data-zoom-src')
      }
      zoomSources.delete(image)
    }
    const onZoomClosed = event => {
      restoreZoomSource(event.target)
      const entry = activeZooms.get(event.target)
      if (entry) finishZoom(event.target, entry)
      activeZooms.delete(event.target)
    }
    const onZoomImageError = event => {
      const image = event.target
      if (!image.classList?.contains('medium-zoom-image--opened')) return
      const marker = image.getAttribute(markerAttribute)
      if ([...activeZooms.values()].some(entry => entry.marker === marker)) image.remove()
    }

    // medium-zoom dispatches a non-bubbling open event on the original image
    // before cloning it into document.body. Supply HD there so its own loader
    // can fall back to the thumbnail if the HD request fails.
    articleRoot.addEventListener('medium-zoom:open', prepareZoomSource, true)
    articleRoot.addEventListener('medium-zoom:closed', onZoomClosed, true)
    document.addEventListener('error', onZoomImageError, true)

    return () => {
      articleRoot.removeEventListener('medium-zoom:open', prepareZoomSource, true)
      articleRoot.removeEventListener('medium-zoom:closed', onZoomClosed, true)
      document.removeEventListener('error', onZoomImageError, true)
      zoomSources.forEach((_source, image) => restoreZoomSource(image))
      activeZooms.forEach((entry, image) => {
        const { zoom } = entry
        if (zoom.getZoomedImage() !== image) {
          finishZoom(image, entry)
          return
        }
        const closeZoom = () => {
          if (zoom.getZoomedImage() === image) void zoom.close()
        }
        // close() is ignored while opening. The original may already be detached,
        // so listen on it directly and close as soon as that animation finishes.
        image.addEventListener('medium-zoom:opened', closeZoom, { once: true })
        image.addEventListener('medium-zoom:closed', () => {
          image.removeEventListener('medium-zoom:opened', closeZoom)
          finishZoom(image, entry)
        }, { once: true })
        closeZoom()
      })
      activeZooms.clear()
    }
  }, [post, IMAGE_ZOOM_IN_WIDTH, zoomOwnerId])

  useEffect(() => {
    // Spoiler文本功能
    if (SPOILER_TEXT_TAG) {
      import('lodash/escapeRegExp').then(escapeRegExp => {
        Promise.all([
          loadExternalResource('/js/spoilerText.js', 'js'),
          loadExternalResource('/css/spoiler-text.css', 'css')
        ]).then(() => {
          window.textToSpoiler &&
            window.textToSpoiler(escapeRegExp.default(SPOILER_TEXT_TAG))
        })
      })
    }
  }, [post])

  // const cleanBlockMap = cleanBlocksWithWarn(post?.blockMap);
  // console.log('NotionPage render with post:', post);

  return (
    <div
      id='notion-article'
      ref={articleRef}
      className={`mx-auto overflow-hidden ${className || ''}`}>
      <NotionRenderer
        recordMap={post?.blockMap}
        mapPageUrl={mapPageUrl}
        mapImageUrl={mapImgUrl}
        components={{
          Code,
          Collection,
          Embed: NotionEmbed,
          Equation,
          Link: NotionLink,
          Modal,
          Pdf,
          Quote: NotionQuote,
          Tweet
        }}
      />

      <AdEmbed />
      <OriginalityProof proof={post?.originalityProof} />
      {hasCodeBlock(post?.blockMap) && <PrismMac />}
    </div>
  )
}

const hasCodeBlock = blockMap => {
  const blocks = blockMap?.block
  if (!blocks) return false
  return Object.values(blocks).some(
    item => item?.value?.type === 'code'
  )
}

/**
 * 页面的数据库链接禁止跳转，只能查看
 */
const processDisableDatabaseUrl = () => {
  if (isBrowser) {
    const links = document.querySelectorAll('.notion-table a')
    for (const e of links) {
      e.removeAttribute('href')
    }
  }
}

/**
 * gallery视图，点击后是放大图片还是跳转到gallery的内部页面
 */
const processGalleryImg = zoom => {
  setTimeout(() => {
    if (isBrowser) {
      const imgList = document?.querySelectorAll(
        '.notion-collection-card-cover img'
      )
      if (imgList && zoom) {
        for (let i = 0; i < imgList.length; i++) {
          zoom.attach(imgList[i])
        }
      }

      const cards = document.getElementsByClassName('notion-collection-card')
      for (const e of cards) {
        e.removeAttribute('href')
      }
    }
  }, 800)
}

/**
 * 根据url参数自动滚动到锚位置
 */
const autoScrollToHash = () => {
  setTimeout(() => {
    // 跳转到指定标题
    const hash = window?.location?.hash
    const needToJumpToTitle = hash && hash.length > 0
    if (needToJumpToTitle) {
      console.log('jump to hash', hash)
      const tocNode = document.getElementById(hash.substring(1))
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

/**
 * 缩放
 * @returns
 */
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

// 代码
const Code = dynamic(
  () =>
    import('react-notion-x/build/third-party/code').then(m => {
      return m.Code
    }),
  { ssr: false }
)

// 公式
const Equation = dynamic(
  () =>
    import('@/components/Equation').then(async m => {
      // 化学方程式
      await import('@/lib/plugins/mhchem')
      return m.Equation
    }),
  { ssr: true }
)

// 原版文档
// const Pdf = dynamic(
//   () => import('react-notion-x/build/third-party/pdf').then(m => m.Pdf),
//   {
//     ssr: false
//   }
// )
const Pdf = dynamic(() => import('@/components/Pdf').then(m => m.Pdf), {
  ssr: false
})

// 美化代码 from: https://github.com/txs
const PrismMac = dynamic(() => import('@/components/PrismMac'), {
  ssr: false
})

/**
 * tweet嵌入
 */
const TweetEmbed = dynamic(() => import('react-tweet-embed'), {
  ssr: false
})

/**
 * 文内google广告
 */
const AdEmbed = dynamic(
  () => import('@/components/GoogleAdsense').then(m => m.AdEmbed),
  { ssr: true }
)

const Collection = dynamic(
  () => import('@/components/NotionCollection'),
  {
    ssr: true
  }
)

const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then(m => m.Modal),
  { ssr: false }
)

const Tweet = ({ id }) => {
  return <TweetEmbed tweetId={id} />
}

// Custom Quote override: react-notion-x drops quotes without properties.title
// (returns null from early guard). This renders them correctly — fixes #4140.
const NotionQuote = ({ block, children }) => {
  const title = block?.properties?.title
  return (
    <blockquote className='notion-quote'>
      {title && <NotionText value={title} />}
      {children}
    </blockquote>
  )
}

// Minimal inline text renderer for Notion rich-text arrays.
// Each segment is [plainText, [[formatType, optionalValue], ...]].
const NotionText = ({ value }) => {
  if (!Array.isArray(value)) return null
  return value.map((segment, i) => {
    if (!Array.isArray(segment) || !segment[0]) return null
    const [text, formats] = segment
    let element = <>{text}</>
    if (Array.isArray(formats)) {
      for (const fmt of formats) {
        const type = Array.isArray(fmt) ? fmt[0] : fmt
        if (type === 'b') element = <strong>{element}</strong>
        else if (type === 'i') element = <em>{element}</em>
        else if (type === 's') element = <s>{element}</s>
        else if (type === 'c') element = <code>{element}</code>
        else if (type === 'a') element = <a href={Array.isArray(fmt) ? fmt[1] : '#'}>{element}</a>
      }
    }
    return <span key={i}>{element}</span>
  })
}

export default NotionPage
