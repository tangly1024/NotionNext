import { NotionRenderer } from 'react-notion-x'
import dynamic from 'next/dynamic'
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

  React.useEffect(() => {
    addWatch4Dom()
  })

  return <div id='container'>
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

export default NotionPage

/**
 * 监听DOM变化
 * @param {*} element
 */
function addWatch4Dom(element) {
  // 选择需要观察变动的节点
  const targetNode = element || document.getElementById('container')
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
            // console.log('1', mutation)
            fixCopy(mutation)
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
function fixCopy(e) {
  const codeE = e.target.parentElement.lastElementChild
  //   console.log('2', codeE)
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
