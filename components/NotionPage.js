import { NotionRenderer } from 'react-notion-x'
import dynamic from 'next/dynamic'
// import mediumZoom from 'medium-zoom'
import mediumZoom from '@fisch0920/medium-zoom'
import React from 'react'
import { isBrowser } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Code } from 'react-notion-x/build/third-party/code'
// import { Pdf } from 'react-notion-x/build/third-party/pdf'
// import { Equation } from 'react-notion-x/build/third-party/equation'

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

const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then(async (m) => {
    // 化学方程式
    await import('@/lib/mhchem')
    return m.Equation
  })
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

const NotionPage = ({ post }) => {
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

  if (!post || !post.blockMap) {
    return <>{post?.summary || ''}</>
  }

  return <div id='container' className='max-w-5xl overflow-x-visible mx-auto'>
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

      <PrismMac />

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

export default NotionPage
