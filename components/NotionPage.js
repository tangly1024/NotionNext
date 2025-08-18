// 这是带有调试功能的 components/NotionPage.js
import { siteConfig } from '@/lib/config'
import { compressImage, mapImgUrl } from '@/lib/notion/mapImage'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import mediumZoom from '@fisch0920/medium-zoom'
import 'katex/dist/katex.min.css'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { NotionRenderer } from 'react-notion-x'

const NotionPage = ({ post, className, allPages }) => {
  // --- DEBUGGING START ---
  useEffect(() => {
    // 这个useEffect会在组件加载时，在浏览器控制台打印出allPages的内容
    // 这样我们就能确定数据是否正确传递进来了
    console.log('[DEBUG] allPages data received by NotionPage component:', allPages)
  }, [allPages])
  // --- DEBUGGING END ---

  const POST_DISABLE_GALLERY_CLICK = siteConfig('POST_DISABLE_GALLERY_CLICK')
  // ... (下面的代码和您原来的文件基本一样，我们只修改 mapPageUrl)
  const POST_DISABLE_DATABASE_CLICK = siteConfig('POST_DISABLE_DATABASE_CLICK')
  const SPOILER_TEXT_TAG = siteConfig('SPOILER_TEXT_TAG')

  const zoom =
    isBrowser &&
    mediumZoom({
      background: 'rgba(0, 0, 0, 0.2)',
      margin: getMediumZoomMargin()
    })

  const zoomRef = useRef(zoom ? zoom.clone() : null)
  const IMAGE_ZOOM_IN_WIDTH = siteConfig('IMAGE_ZOOM_IN_WIDTH', 1200)

  useEffect(() => {
    autoScrollToHash()
  }, [])

  useEffect(() => {
    if (POST_DISABLE_GALLERY_CLICK) {
      processGalleryImg(zoomRef?.current)
    }
    if (POST_DISABLE_DATABASE_CLICK) {
      processDisableDatabaseUrl()
    }
    const observer = new MutationObserver((mutationsList, observer) => {
      mutationsList.forEach(mutation => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          if (mutation.target.classList.contains('medium-zoom-image--opened')) {
            setTimeout(() => {
              const src = mutation?.target?.getAttribute('src')
              mutation?.target?.setAttribute(
                'src',
                compressImage(src, IMAGE_ZOOM_IN_WIDTH)
              )
            }, 800)
          }
        }
      })
    })
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class']
    })
    return () => {
      observer.disconnect()
    }
  }, [post])

  useEffect(() => {
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
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(
        '.notion-collection-page-properties'
      )
      elements?.forEach(element => {
        element?.remove()
      })
    }, 1000)
    return () => clearTimeout(timer)
  }, [post])

  // --- 关键修改在这里 ---
  const mapPageUrl = id => {
    if (!allPages) {
      console.log(`[DEBUG] mapPageUrl ID: ${id} -> allPages not ready, fallback to ID link.`)
      return '/' + id.replace(/-/g, '')
    }

    // 关键！我们对比去掉'-'的ID，因为Notion的ID格式有时会不统一
    const page = allPages.find(p => p.id.replaceAll('-', '') === id.replaceAll('-', ''))

    if (page) {
      console.log(`[DEBUG] mapPageUrl ID: ${id} -> SUCCESS, mapped to /${page.slug}`)
      return '/' + page.slug
    } else {
      console.log(`[DEBUG] mapPageUrl ID: ${id} -> FAILED to find in allPages. Fallback to Notion.so link.`)
      return 'https://www.notion.so/' + id.replace(/-/g, '')
    }
  }

  return (
    <div
      id='notion-article'
      className={`mx-auto overflow-hidden ${className || ''}`}>
      <NotionRenderer
        recordMap={post?.blockMap}
        mapPageUrl={mapPageUrl}
        mapImageUrl={mapImgUrl}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
          Tweet
        }}
      />
      <AdEmbed />
      <PrismMac />
    </div>
  )
}

// 下面的辅助函数和组件保持不变
const processDisableDatabaseUrl = () => { if (isBrowser) { const links = document.querySelectorAll('.notion-table a'); for (const e of links) { e.removeAttribute('href') } } }
const processGalleryImg = zoom => { setTimeout(() => { if (isBrowser) { const imgList = document?.querySelectorAll('.notion-collection-card-cover img'); if (imgList && zoom) { for (let i = 0; i < imgList.length; i++) { zoom.attach(imgList[i]) } } const cards = document.getElementsByClassName('notion-collection-card'); for (const e of cards) { e.removeAttribute('href') } } }, 800) }
const autoScrollToHash = () => { setTimeout(() => { const hash = window?.location?.hash; if (hash) { const tocNode = document.getElementById(hash.substring(1)); if (tocNode && tocNode?.className?.indexOf('notion') > -1) { tocNode.scrollIntoView({ block: 'start', behavior: 'smooth' }) } } }, 180) }
function getMediumZoomMargin() { const width = window.innerWidth; if (width < 500) { return 8 } else if (width < 800) { return 20 } else if (width < 1280) { return 30 } else if (width < 1600) { return 40 } else if (width < 1920) { return 48 } else { return 72 } }
const Code = dynamic(() => import('react-notion-x/build/third-party/code').then(m => m.Code), { ssr: false })
const Equation = dynamic(() => import('@/components/Equation').then(async m => { await import('@/lib/plugins/mhchem'); return m.Equation }), { ssr: false })
const Pdf = dynamic(() => import('@/components/Pdf').then(m => m.Pdf), { ssr: false })
const PrismMac = dynamic(() => import('@/components/PrismMac'), { ssr: false })
const TweetEmbed = dynamic(() => import('react-tweet-embed'), { ssr: false })
const AdEmbed = dynamic(() => import('@/components/GoogleAdsense').then(m => m.AdEmbed), { ssr: true })
const Collection = dynamic(() => import('react-notion-x/build/third-party/collection').then(m => m.Collection), { ssr: true })
const Modal = dynamic(() => import('react-notion-x/build/third-party/modal').then(m => m.Modal), { ssr: false })
const Tweet = ({ id }) => { return <TweetEmbed tweetId={id} /> }
export default NotionPage
