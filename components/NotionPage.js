import { NotionRenderer } from 'react-notion-x'
import dynamic from 'next/dynamic'
import mediumZoom from 'medium-zoom'
import React from 'react'
import { isBrowser } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Code } from 'react-notion-x/build/third-party/code'

const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then((m) => m.Collection), { ssr: true }
)

const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation), { ssr: true }
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

  const zoom = isBrowser() && mediumZoom({
    container: '.notion-viewport',
    background: 'rgba(0, 0, 0, 0.2)',
    scrollOffset: 200,
    margin: getMediumZoomMargin()
  })

  const zoomRef = React.useRef(zoom ? zoom.clone() : null)

  React.useEffect(() => {
    setTimeout(() => {
      if (window.location.hash) {
        const tocNode = document.getElementById(window.location.hash.substring(1))
        if (tocNode && tocNode.className.indexOf('notion') > -1) {
          tocNode.scrollIntoView({ block: 'start', behavior: 'smooth' })
        }
      }
    }, 180)

    setTimeout(() => {
      if (isBrowser()) {
        // 将相册gallery下的图片加入放大功能
        const imgList = document.querySelectorAll('.notion-collection-card-cover img')
        if (imgList && zoomRef.current) {
          for (let i = 0; i < imgList.length; i++) {
            (zoomRef.current).attach(imgList[i])
          }
        }

        // 相册中的url替换成可点击
        const cards = document.getElementsByClassName('notion-collection-card')
        for (const e of cards) {
          e.removeAttribute('href')
          const links = e.querySelectorAll('.notion-link')
          if (links && links.length > 0) {
            for (const l of links) {
              l.parentElement.innerHTML = `<a href='${l.innerText}' rel='noreferrer' target='_blank'>${l.innerText}</a>`
            }
          }
        }
      }
    }, 800)

    addWatch4Dom()
  }, [])

  return <div id='container' className='max-w-4xl mx-auto'>
    <NotionRenderer
      recordMap={post.blockMap}
      mapPageUrl={mapPageUrl}
      components={{
        Code,
        Collection,
        Equation,
        Modal,
        Pdf,
        nextImage: Image,
        nextLink: Link
      }} />
  </div>
}

/**
 * 监听DOM变化
 * @param {*} element
 */
function addWatch4Dom(element) {
  // 选择需要观察变动的节点
  const targetNode = element || document?.getElementById('container')
  // 观察器的配置（需要观察什么变动）
  const config = {
    attributes: true,
    childList: true,
    subtree: true
  }

  // 当观察到变动时执行的回调函数
  const mutationCallback = (mutations) => {
    for (const mutation of mutations) {
      const type = mutation.type
      switch (type) {
        case 'childList':
          if (mutation.target.className === 'notion-code-copy') {
            fixCopy(mutation.target)
          } else if (mutation.target.className?.indexOf('language-') > -1) {
            const copyCode = mutation.target.parentElement?.firstElementChild
            if (copyCode) {
              fixCopy(copyCode)
            }
          }
          //   console.log('A child node has been added or removed.')
          break
        case 'attributes':
        //   console.log(`The ${mutation.attributeName} attribute was modified.`)
        //   console.log(mutation.attributeName)
          break
        case 'subtree':
        //   console.log('The subtree was modified.')
          break
        default:
          break
      }
    }
  }

  // 创建一个观察器实例并传入回调函数
  const observer = new MutationObserver(mutationCallback)
  //   console.log(observer)
  // 以上述配置开始观察目标节点
  observer.observe(targetNode, config)

  // observer.disconnect();
}

/**
 * 复制代码后，会重复 @see https://github.com/tangly1024/NotionNext/issues/165
 * @param {*} e
 */
function fixCopy(codeCopy) {
  const codeE = codeCopy.parentElement.lastElementChild
  const codeEnd = codeE.lastChild
  if (codeEnd.nodeName === '#text' && codeE.childNodes.length > 1) {
    codeEnd.nodeValue = null
  }
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
