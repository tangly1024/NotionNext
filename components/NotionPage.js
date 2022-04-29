import { NotionRenderer } from 'react-notion-x'
import dynamic from 'next/dynamic'
import mediumZoom from 'medium-zoom'
import React from 'react'

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code), { ssr: false }
)
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then((m) => m.Collection), { ssr: false }
)

const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation), { ssr: false }
)

const Pdf = dynamic(
  () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf), { ssr: false }
)

const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal), { ssr: false }
)
const NotionPage = ({ post }) => {
  if (!post || !post.blockMap) {
    return <>{post?.summary || ''}</>
  }

  const zoom = typeof window !== 'undefined' && mediumZoom({
    container: '.notion-viewport',
    background: 'rgba(0, 0, 0, 0.2)',
    margin: getMediumZoomMargin()
  })
  const zoomRef = React.useRef(zoom ? zoom.clone() : null)

  setTimeout(() => {
    if (typeof document === 'undefined') {
      return
    }
    const buttons = document.getElementsByClassName('notion-code-copy')
    for (const e of buttons) {
      e.addEventListener('click', fixCopy)
    }
    // 将所有container下的所有图片添加medium-zoom
    const container = document?.getElementById('container')
    const imgList = container?.getElementsByTagName('img')
    if (imgList && zoomRef.current) {
      for (let i = 0; i < imgList.length; i++) {
        (zoomRef.current).attach(imgList[i])
      }
    }
    const cards = document.getElementsByClassName('notion-collection-card')
    for (const e of cards) {
      e.removeAttribute('href')
    }
  }, 500)

  /**
   * 复制代码后，会重复 @see https://github.com/tangly1024/NotionNext/issues/165
   * @param {*} e
   */
  function fixCopy(e) {
    const codeE = e.target.parentElement.parentElement.lastElementChild
    console.log(codeE)
    const codeEnd = codeE.lastChild
    if (codeEnd.nodeName === '#text' && codeE.childNodes.length > 1) {
      codeEnd.nodeValue = null
    }
  }

  return <div id='container' className='max-w-4xl mx-auto'>
    <NotionRenderer
      recordMap={post.blockMap}
      mapPageUrl={mapPageUrl}
      components={{
        Code,
        Collection,
        Equation,
        Modal,
        Pdf
      }} />
  </div>
}

/**
 * 将id映射成博文内部链接。
 * @param {*} id
 * @returns
 */
const mapPageUrl = id => {
  // return 'https://www.notion.so/' + id.replace(/-/g, '')
  return '/article/' + id.replace(/-/g, '')
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

export default NotionPage
