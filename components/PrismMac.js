import React from 'react'
import Prism from 'prismjs'
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/show-language/prism-show-language'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'
// import 'prismjs/plugins/autoloader/prism-autoloader'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

// mermaid图
import mermaid from 'mermaid'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { isBrowser } from '@/lib/utils'
// 页面渲染观察者
let observer

/**
 * @author https://github.com/txs/
 * @returns
 */
const PrismMac = () => {
  const router = useRouter()
  const { isDarkMode } = useGlobal()
  const scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop

  if (isBrowser() && !observer) {
    addWatch4Dom()
  }

  React.useEffect(() => {
    renderPrismMac()
    window.scrollTo(0, scrollTop)
    router.events.on('routeChangeComplete', renderPrismMac)
    return () => {
      router.events.off('routeChangeComplete', renderPrismMac)
    }
  }, [isDarkMode])
  return <></>
}

function renderPrismMac() {
  const container = document?.getElementById('container-inner')
  const codeToolBars = container?.getElementsByClassName('code-toolbar')

  if (codeToolBars) {
    Array.from(codeToolBars).forEach(item => {
      const codeBlocks = item.getElementsByTagName('pre')
      if (codeBlocks.length === 0) {
        item.remove()
      }
    })
  }
  // 重新渲染之前检查所有的多余text

  try {
    Prism.highlightAll()
    // Add line numbers
    const codeBlocks = container?.getElementsByTagName('pre')
    if (codeBlocks) {
      Array.from(codeBlocks).forEach(item => {
        if (!item.classList.contains('line-numbers')) {
          item.classList.add('line-numbers')
          item.style.whiteSpace = 'pre-wrap'
        }
      })
    }

    setTimeout(() => {
      // Add pre-mac element for Mac Style UI
      if (codeToolBars) {
        Array.from(codeToolBars).forEach(item => {
          const existPreMac = item.getElementsByClassName('pre-mac')
          if (existPreMac.length < codeToolBars.length) {
            const preMac = document.createElement('div')
            preMac.classList.add('pre-mac')
            preMac.innerHTML = '<span></span><span></span><span></span>'
            item?.appendChild(preMac, item)
          }
        })
      }
    }, 10)
  } catch (err) {
    console.log('代码渲染', err)
  }

  //   支持 Mermaid
  const mermaids = document.querySelectorAll('.notion-code .language-mermaid')
  if (mermaids) {
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

  const mermaidsSvg = document.querySelectorAll('.mermaid')
  if (mermaidsSvg) {
    for (const e of mermaidsSvg) {
      if (e?.firstChild?.nodeName !== 'svg') {
        mermaid.contentLoaded()
      }
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
            if (mutation.addedNodes[0].nodeName === '#text') {
              mutation.addedNodes[0].remove() // 移除新增的内容
            }
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

export default PrismMac
