import React from 'react'
import Prism from 'prismjs'
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/show-language/prism-show-language'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'
import 'prismjs/plugins/autoloader/prism-autoloader'

// mermaid图
import mermaid from 'mermaid'
import { useRouter } from 'next/router'

/**
 * @author https://github.com/txs/
 * @returns
 */
const PrismMac = () => {
  const router = useRouter()
  React.useEffect(() => {
    // addWatch4Dom()
    renderPrismMac()
    router.events.on('routeChangeComplete', renderPrismMac)
    return () => {
      router.events.off('routeChangeComplete', renderPrismMac)
    }
  }, [])
  return <></>
}

function renderPrismMac() {
  const container = document?.getElementById('container-inner')

  const codeBlocks = container?.getElementsByTagName('pre')
  Array.from(codeBlocks).forEach(item => {
    // Add line numbers
    if (!item.classList.contains('line-numbers')) {
      item.classList.add('line-numbers')
      item.style.whiteSpace = 'pre-wrap'
    }
  })

  const codeToolBars = container?.getElementsByClassName('code-toolbar')

  Array.from(codeToolBars).forEach(item => {
    // Add pre-mac element for Mac Style UI
    const findPreMac = item.getElementsByClassName('pre-mac')
    if (findPreMac.length === 0) {
      const preMac = document.createElement('div')
      preMac.classList.add('pre-mac')
      preMac.innerHTML = '<span></span><span></span><span></span>'
      item?.appendChild(preMac, item)
    }
  })

  // 支持 Mermaid
  const mermaids = document.querySelectorAll('.notion-code .language-mermaid')
  for (const e of mermaids) {
    const chart = e.innerText
    e.parentElement.parentElement.classList.remove('code-toolbar')
    e.parentElement.parentElement.innerHTML = `<div class="mermaid">${chart}</div>`
    mermaid.contentLoaded()
  }

  try {
    Prism.highlightAll()
  } catch (err) {
    console.log('代码渲染', err)
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

  // 当观察到变动时执行的回调函数
  const mutationCallback = (mutations) => {
    for (const mutation of mutations) {
      const type = mutation.type
      switch (type) {
        case 'childList':
        //   console.log('A child node has been added or removed.', mutation.target)
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
  //   console.log('observer', observer)
  // 以上述配置开始观察目标节点
  if (targetNode) {
    observer.observe(targetNode, config)
  }

//   observer.disconnect()
}

export default PrismMac
