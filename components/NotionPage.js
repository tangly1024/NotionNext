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
// mermaid图
import mermaid from 'mermaid'
// 化学方程式
import '@/lib/mhchem'

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

  React.useEffect(() => {
    // 准备接入化学方程式
    // console.log('kk', katex)
    // const html = katex.renderToString('\\ce{CO2 + C -> 2 C0}')
    // console.log(html)
    // katex.__parse('\\ce{CO2 + C -> 2 CO}')
    // katex.render('\ce{2H2O->2H2 + O2}', document.getElementById('test1'))
    // katex.render('(\ce{2H + O -> H2O}\)', document.getElementById('test2'))
    // katex.render('\\ce{2H2O->2H2 + O2}', document.getElementById('test3'))

    // document.getElementById('test').innerHTML = katex.renderToString('\ce{2H2O->2H2 + O2}')
    // document.getElementById('test').innerHTML = katex.renderToString('\(\ce{2H + O -> H2O}\)')

    // 支持 Mermaid
    const mermaids = document.querySelectorAll('.notion-code .language-mermaid')
    for (const e of mermaids) {
      const chart = e.innerText
      e.parentElement.parentElement.innerHTML = `<div class="mermaid">${chart}</div>`
      mermaid.contentLoaded()
    }

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

    addWatch4Dom()
  }, [])

  return <div id='container' className='max-w-5xl overflow-x-hidden mx-auto'>
    <script async src="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/contrib/mhchem.min.js" integrity="sha384-5gCAXJ0ZgozlShOzzT0OWArn7yCPGWVIvgo+BAd8NUKbCmulrJiQuCVR9cHlPHeG"></script>
    <div id='test1'></div>
    <div id='test2'></div>
    <div id='test2'></div>
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
          } else if (mutation.target.className && typeof (mutation.target.className) === 'string' && mutation?.target?.className?.indexOf('language-') > -1) {
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
  if (targetNode) {
    observer.observe(targetNode, config)
  }

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
