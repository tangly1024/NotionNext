import { NotionRenderer } from 'react-notion-x'
import dynamic from 'next/dynamic'
// import mediumZoom from 'medium-zoom'
import mediumZoom from '@fisch0920/medium-zoom'
import React from 'react'
import { isBrowser } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Code } from 'react-notion-x/build/third-party/code'
import { Pdf } from 'react-notion-x/build/third-party/pdf'
import { Equation } from 'react-notion-x/build/third-party/equation'

import 'prismjs/components/prism-bash.js'
import 'prismjs/components/prism-markup-templating.js'
import 'prismjs/components/prism-markup.js'
import 'prismjs/components/prism-c.js'
import 'prismjs/components/prism-cpp.js'
import 'prismjs/components/prism-csharp.js'
import 'prismjs/components/prism-docker.js'
import 'prismjs/components/prism-java.js'
import 'prismjs/components/prism-js-templates.js'
import 'prismjs/components/prism-coffeescript.js'
import 'prismjs/components/prism-diff.js'
import 'prismjs/components/prism-git.js'
import 'prismjs/components/prism-go.js'
import 'prismjs/components/prism-graphql.js'
import 'prismjs/components/prism-handlebars.js'
import 'prismjs/components/prism-less.js'
import 'prismjs/components/prism-makefile.js'
import 'prismjs/components/prism-markdown.js'
import 'prismjs/components/prism-objectivec.js'
import 'prismjs/components/prism-ocaml.js'
import 'prismjs/components/prism-python.js'
import 'prismjs/components/prism-reason.js'
import 'prismjs/components/prism-rust.js'
import 'prismjs/components/prism-sass.js'
import 'prismjs/components/prism-scss.js'
import 'prismjs/components/prism-solidity.js'
import 'prismjs/components/prism-sql.js'
import 'prismjs/components/prism-stylus.js'
import 'prismjs/components/prism-swift.js'
import 'prismjs/components/prism-wasm.js'
import 'prismjs/components/prism-yaml.js'
import 'prismjs/components/prism-r.js'

// 化学方程式
import '@/lib/mhchem'
// 页面渲染观察者
let observer

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

  if (isBrowser() && !observer) {
    addWatch4Dom()
  }

  React.useEffect(() => {
    setTimeout(() => {
      if (window.location.hash) {
        const tocNode = document.getElementById(window.location.hash.substring(1))
        if (tocNode && tocNode?.className?.indexOf('notion') > -1) {
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

        // 相册图片点击不跳转
        const cards = document.getElementsByClassName('notion-collection-card')
        for (const e of cards) {
          e.removeAttribute('href')
        }
      }
    }, 800)
  }, [])

  return <div id='container' className='max-w-5xl overflow-x-visible mx-auto'>
    <PrismMac />
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
 * 将id映射成博文内部链接。
 * @param {*} id
 * @returns
 */
const mapPageUrl = id => {
  // return 'https://www.notion.so/' + id.replace(/-/g, '')
  return '/' + id.replace(/-/g, '')
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

/**
 * 监听DOM变化
 * @param {*} element
 */
// eslint-disable-next-line no-unused-vars
function addWatch4Dom(element) {
  // 选择需要观察变动的节点
  const targetNode = element || document?.getElementById('container')
  // 观察器的配置（需要观察什么变动）
  const config = {
    attributes: true,
    childList: true,
    subtree: true
  }

  // 创建一个观察器实例并传入回调函数
  observer = new MutationObserver(mutationCallback)
  //   console.log('观察节点变化', observer)
  // 以上述配置开始观察目标节点
  if (targetNode) {
    observer.observe(targetNode, config)
  }

  //   observer.disconnect()
}

// 当页面发生时会调用此函数
const mutationCallback = (mutations) => {
  for (const mutation of mutations) {
    const type = mutation.type
    switch (type) {
      case 'childList':
        //   console.log('A child node has been added or removed.', mutation)
        if (mutation.addedNodes.length > 0) {
          if (mutation?.target?.parentElement?.nodeName === 'PRE' || mutation?.target?.parentElement?.nodeName === 'CODE') {
            if (mutation.addedNodes[0].nodeName === '#text' && mutation.target.childElementCount > 0) {
              mutation.addedNodes[0].remove() // 移除新增的内容
            }
          }
          if (mutation?.target?.className === 'language-mermaid') {
            // mermaid重刷新bug TODO
          }
        }
        break
      case 'attributes':
        //   console.log(`The ${mutation.attributeName} attribute was modified.`, mutation.target)
        //   console.log(mutation.attributeName)
        break
      case 'subtree':
        //   console.log('The subtree was modified.', mutation.target)
        break
      default:
        break
    }
  }
}

export default NotionPage
