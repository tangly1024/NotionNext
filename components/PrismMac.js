import React from 'react'
import Prism from 'prismjs'
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/show-language/prism-show-language'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'
import 'prismjs/plugins/autoloader/prism-autoloader'

/**
 * @author https://github.com/txs/
 * @returns
 */
const PrismMac = () => {
  React.useEffect(() => {
    const container = document?.getElementById('notion-article')
    const existPreMac = container?.getElementsByClassName('pre-mac')
    const existCodeToolbar = container?.getElementsByClassName('code-toolbar')
    const existCodeCopy = container?.getElementsByClassName('notion-code-copy')
    Array.from(existCodeCopy).forEach(item => item.remove())
    // Remove existCodeToolbar and existPreMac
    Array.from(existPreMac).forEach(item => item.remove())
    Array.from(existCodeToolbar).forEach(item => item.remove())
    const codeBlocks = container?.getElementsByTagName('pre')
    Array.from(codeBlocks).forEach(item => {
      // Add line numbers
      item.classList.add('line-numbers')
      // item.classList.add('show-language')
      item.style.whiteSpace = 'pre-wrap'
      // Add pre-mac element for Mac Style UI
      if (existPreMac.length <= codeBlocks.length) {
        const preMac = document.createElement('div')
        preMac.classList.add('pre-mac')
        preMac.innerHTML = '<span></span><span></span><span></span>'
        item?.parentElement?.insertBefore(preMac, item)
      }
    })

    console.log('测试', container?.getElementsByClassName('pre-mac'))

    addWatch4Dom()

    Prism.highlightAll()
  }, [])
  return <></>
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
          console.log('A child node has been added or removed.', mutation.targetNode)
          break
        case 'attributes':
          console.log(`The ${mutation.attributeName} attribute was modified.`)
          console.log(mutation.attributeName)
          break
        case 'subtree':
          console.log('The subtree was modified.')
          break
        default:
          break
      }
    }
  }

  // 创建一个观察器实例并传入回调函数
  const observer = new MutationObserver(mutationCallback)
  console.log('observer', observer)
  // 以上述配置开始观察目标节点
  if (targetNode) {
    observer.observe(targetNode, config)
  }

  observer.disconnect()
}

export default PrismMac
