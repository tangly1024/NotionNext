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

/**
 * @author https://github.com/txs/
 * @returns
 */
const PrismMac = () => {
  React.useEffect(() => {
    renderPrismMac()
  })
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

  //   支持 Mermaid
  const mermaids = document.querySelectorAll('.notion-code .language-mermaid')
  if (mermaids) {
    for (const e of mermaids) {
      e.parentElement.classList.remove('code-toolbar')
      const chart = e.firstChild.textContent
      if (e.firstElementChild) {
        e.parentElement.remove()
        continue
      }
      if (chart) {
        e.parentElement.innerHTML = `<div class="mermaid">${chart}</div>`
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

  // 重新渲染之前检查所有的多余text

  try {
    Prism.highlightAll()
  } catch (err) {
    console.log('代码渲染', err)
  }

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
}

export default PrismMac
