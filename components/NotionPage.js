import { NotionRenderer } from 'react-notion-x'
import dynamic from 'next/dynamic'

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

  setTimeout(() => {
    if (typeof document === 'undefined') {
      return
    }
    const buttons = document.getElementsByClassName('notion-code-copy')
    for (const e of buttons) {
      e.addEventListener('click', fixCopy)
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

export default NotionPage
