import React from 'react'
import Prism from 'prismjs'
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/show-language/prism-show-language'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'
import 'prismjs/plugins/autoloader/prism-autoloader'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

// mermaid图
import mermaid from 'mermaid'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'

/**
 * @author https://github.com/txs/
 * @returns
 */
const PrismMac = () => {
  const router = useRouter()
  const { isDarkMode } = useGlobal()

  React.useEffect(() => {
    renderPrismMac()
    const codeToolBars = document?.getElementsByClassName('code-toolbar')
    // Add pre-mac element for Mac Style UI
    Array.from(codeToolBars).forEach(item => {
      const existPreMac = item.getElementsByClassName('pre-mac')
      if (existPreMac.length < codeToolBars.length) {
        const preMac = document.createElement('div')
        preMac.classList.add('pre-mac')
        preMac.innerHTML = '<span></span><span></span><span></span>'
        item?.appendChild(preMac, item)
      }
    })
    router.events.on('routeChangeComplete', renderPrismMac)
    return () => {
      router.events.off('routeChangeComplete', renderPrismMac)
    }
  }, [isDarkMode])

  React.useEffect(() => {
    mermaid.contentLoaded()
  })
  return <></>
}

function renderPrismMac() {
  const container = document?.getElementById('container-inner')
  const codeToolBars = container?.getElementsByClassName('code-toolbar')

  Array.from(codeToolBars).forEach(item => {
    const codeBlocks = item.getElementsByTagName('pre')
    if (codeBlocks.length === 0) {
      item.remove()
    }
  })

  try {
    Prism.highlightAll()
  } catch (err) {
    console.log('代码渲染', err)
  }

  // Add line numbers
  const codeBlocks = container?.getElementsByTagName('pre')
  Array.from(codeBlocks).forEach(item => {
    if (!item.classList.contains('line-numbers')) {
      item.classList.add('line-numbers')
      item.style.whiteSpace = 'pre-wrap'
    }
  })

  // 支持 Mermaid
  const mermaids = document.querySelectorAll('.notion-code .language-mermaid')
  for (const e of mermaids) {
    e.parentElement.parentElement.classList.remove('code-toolbar')
    const chart = e.firstChild.textContent
    if (e.firstElementChild) {
      e.parentElement.parentElement.remove()
      continue
    }
    if (chart) {
      e.parentElement.parentElement.innerHTML = `<div class="mermaid">${chart}</div>`
    }
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
          console.log('A child node has been added or removed.', mutation.target)
          break
        case 'attributes':
          console.log(`The ${mutation.attributeName} attribute was modified.`, mutation.target)
          console.log(mutation.attributeName)
          break
        case 'subtree':
          console.log('The subtree was modified.', mutation.target)
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
