import { useEffect } from 'react'
import Prism from 'prismjs'
// 所有语言的prismjs 使用autoloader引入
// import 'prismjs/plugins/autoloader/prism-autoloader'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

// mermaid图
import { loadExternalResource } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'

/**
 * 代码美化相关
 * @author https://github.com/txs/
 * @returns
 */
const PrismMac = () => {
  const router = useRouter()
  const { isDarkMode } = useGlobal()
  const codeMacBar = siteConfig('CODE_MAC_BAR')
  const prismjsAutoLoader = siteConfig('PRISM_JS_AUTO_LOADER')
  const prismjsPath = siteConfig('PRISM_JS_PATH')

  const prismThemeSwitch = siteConfig('PRISM_THEME_SWITCH')
  const prismThemeDarkPath = siteConfig('PRISM_THEME_DARK_PATH')
  const prismThemeLightPath = siteConfig('PRISM_THEME_LIGHT_PATH')
  const prismThemePrefixPath = siteConfig('PRISM_THEME_PREFIX_PATH')

  const mermaidCDN = siteConfig('MERMAID_CDN')
  const codeLineNumbers = siteConfig('CODE_LINE_NUMBERS')

  const codeCollapse = siteConfig('CODE_COLLAPSE')
  const codeCollapseExpandDefault = siteConfig('CODE_COLLAPSE_EXPAND_DEFAULT')

  useEffect(() => {
    let isDisposed = false
    let mermaidDispose = null
    let fixLineNumberDispose = null

    if (codeMacBar) {
      loadExternalResource('/css/prism-mac-style.css', 'css')
    }
    // 加载prism样式
    loadPrismThemeCSS(
      isDarkMode,
      prismThemeSwitch,
      prismThemeDarkPath,
      prismThemeLightPath,
      prismThemePrefixPath
    )
    // 折叠代码
    loadExternalResource(prismjsAutoLoader, 'js')
      .then(() => {
        if (isDisposed) return

        try {
          // prism autoloader 脚本依赖 window.Prism
          if (typeof window !== 'undefined' && !window.Prism) {
            window.Prism = Prism
          }

          if (window?.Prism?.plugins?.autoloader) {
            window.Prism.plugins.autoloader.languages_path = prismjsPath
          }

          fixLineNumberDispose = renderPrismMac(codeLineNumbers)
          mermaidDispose = renderMermaid(mermaidCDN, isDarkMode)
          renderCollapseCode(codeCollapse, codeCollapseExpandDefault)
        } catch (err) {
          // 防止代码高亮/mermaid 渲染异常导致整页崩溃
          console.warn('[PrismMac] render failed:', err)
        }
      })
      .catch(err => {
        console.warn('[PrismMac] prism autoloader load failed:', err)
      })

    return () => {
      isDisposed = true
      try {
        mermaidDispose?.()
      } catch (err) {
        console.warn('[PrismMac] mermaid cleanup failed:', err)
      }
      try {
        fixLineNumberDispose?.()
      } catch (err) {
        console.warn('[PrismMac] lineNumbers cleanup failed:', err)
      }
    }
  }, [router.asPath, isDarkMode])

  return <></>
}

/**
 * 加载Prism主题样式
 */
const loadPrismThemeCSS = (
  isDarkMode,
  prismThemeSwitch,
  prismThemeDarkPath,
  prismThemeLightPath,
  prismThemePrefixPath
) => {
  let PRISM_THEME
  let PRISM_PREVIOUS
  if (prismThemeSwitch) {
    if (isDarkMode) {
      PRISM_THEME = prismThemeDarkPath
      PRISM_PREVIOUS = prismThemeLightPath
    } else {
      PRISM_THEME = prismThemeLightPath
      PRISM_PREVIOUS = prismThemeDarkPath
    }
    const previousTheme = document.querySelector(
      `link[href="${PRISM_PREVIOUS}"]`
    )
    if (
      previousTheme &&
      previousTheme.parentNode &&
      previousTheme.parentNode.contains(previousTheme)
    ) {
      previousTheme.parentNode.removeChild(previousTheme)
    }
    loadExternalResource(PRISM_THEME, 'css')
  } else {
    loadExternalResource(prismThemePrefixPath, 'css')
  }
}

/*
 * 将代码块转为可折叠对象
 */
const renderCollapseCode = (codeCollapse, codeCollapseExpandDefault) => {
  if (!codeCollapse) {
    return
  }
  const container = document?.getElementById('notion-article')
  if (!container) return

  // 注意：不要移动 React 管理的节点（例如把 pre 包进新的 wrapper），否则后续动态组件挂载时可能触发
  // `insertBefore` NotFoundError。这里只做“新增兄弟节点 + 控制 display”，不改变原有节点层级。
  const codeBlocks = container.querySelectorAll('pre.notion-code')
  for (const pre of codeBlocks) {
    try {
      if (pre.dataset?.ntnxCollapsed === 'inited') {
        continue
      }
      pre.dataset.ntnxCollapsed = 'inited'

      const code = pre.querySelector('code')
      const className =
        code?.getAttribute('class') || pre?.getAttribute('class') || ''
      const languageMatch = className.match(/language-([\w-]+)/)
      const language = languageMatch?.[1] || ''
      if (!language) {
        continue
      }

      const parent = pre.parentNode
      if (!parent) continue

      const header = document.createElement('div')
      header.className =
        'collapse-header flex justify-between items-center px-4 py-2 cursor-pointer select-none border dark:border-gray-600 rounded-md hover:border-indigo-500 duration-200 transition-colors'
      header.innerHTML = `<h3 class="text-lg font-medium">${language}</h3><svg class="transition-all duration-200 w-5 h-5 transform rotate-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.293 6.293a1 1 0 0 1 1.414 0L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z" clip-rule="evenodd"/></svg>`

      // header 放在 pre 前面，pre 本身仅做 show/hide，不改层级
      parent.insertBefore(header, pre)

      let isExpanded = !!codeCollapseExpandDefault

      const apply = () => {
        pre.style.display = isExpanded ? '' : 'none'
        header.querySelector('svg')?.classList.toggle('rotate-180', isExpanded)
      }

      header.addEventListener('click', () => {
        isExpanded = !isExpanded
        apply()
      })

      apply()
    } catch (err) {
      console.warn('[PrismMac] collapse code failed:', err)
    }
  }
}

/**
 * 将mermaid语言 渲染成图片
 */
const renderMermaid = (mermaidCDN, isDarkMode) => {
  const container = document?.getElementById('notion-article')
  if (!container) {
    return () => {}
  }

  let isDisposed = false
  let debounceTimer = null
  let isRendering = false

  const ensureMermaidNodes = () => {
    const mermaidBlocks = container.querySelectorAll(
      'pre.notion-code[class*="language-mermaid"],pre[class*="language-mermaid"]'
    )

    const nodes = []
    for (const block of mermaidBlocks) {
      const sourceCode =
        block.querySelector('code.language-mermaid') || block.querySelector('code')

      const chart = sourceCode?.textContent?.trim()
      if (!chart) {
        continue
      }

      let target = block.querySelector('code.mermaid[data-ntnx-mermaid="true"]')
      if (!target) {
        target = document.createElement('code')
        target.className = 'mermaid'
        target.setAttribute('data-ntnx-mermaid', 'true')
        target.style.display = 'block'
        target.textContent = chart
        block.appendChild(target)
      }

      nodes.push(target)
    }

    return nodes
  }

  const run = async () => {
    if (isDisposed || isRendering) return
    isRendering = true

    try {
      const nodes = ensureMermaidNodes()
      if (!nodes.length) return

      await loadExternalResource(mermaidCDN, 'js')
      if (isDisposed) return

      const mermaid = window?.mermaid
      if (!mermaid) return

      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: isDarkMode ? 'dark' : 'default'
        })
      } catch (err) {
        // ignore initialize errors (might be called repeatedly)
      }

      if (typeof mermaid.run === 'function') {
        await mermaid.run({ nodes })
      } else if (typeof mermaid.init === 'function') {
        mermaid.init(undefined, nodes)
      } else if (typeof mermaid.contentLoaded === 'function') {
        mermaid.contentLoaded()
      }
    } catch (err) {
      console.warn('[PrismMac] mermaid render failed:', err)
    } finally {
      isRendering = false
    }
  }

  const schedule = () => {
    if (isDisposed) return
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(run, 50)
  }

  // 首次尝试渲染（部分内容可能是动态加载，后续由 observer 触发补齐）
  schedule()

  const observer = new MutationObserver(mutationsList => {
    for (const m of mutationsList) {
      if (m.type !== 'childList') continue
      for (const n of m.addedNodes) {
        if (!n || n.nodeType !== 1) continue
        const el = /** @type {Element} */ (n)
        if (
          el.matches('pre[class*="language-mermaid"],code.language-mermaid') ||
          el.querySelector('pre[class*="language-mermaid"],code.language-mermaid')
        ) {
          schedule()
          return
        }
      }
    }
  })

  observer.observe(container, {
    childList: true,
    subtree: true
  })

  return () => {
    isDisposed = true
    if (debounceTimer) clearTimeout(debounceTimer)
    observer.disconnect()
  }
}

function renderPrismMac(codeLineNumbers) {
  const container = document?.getElementById('notion-article')
  if (!container) {
    return () => {}
  }

  // Add line numbers
  if (codeLineNumbers) {
    const codeBlocks = container?.getElementsByTagName('pre')
    if (codeBlocks) {
      Array.from(codeBlocks).forEach(item => {
        if (!item.classList.contains('line-numbers')) {
          item.classList.add('line-numbers')
          item.style.whiteSpace = 'pre-wrap'
        }
      })
    }
  }
  try {
    Prism.highlightAllUnder(container)
  } catch (err) {
    console.log('代码渲染', err)
  }

  // 折叠代码行号bug
  if (codeLineNumbers) {
    return fixCodeLineStyle(container)
  }

  return () => {}
}

/**
 * 行号样式在首次渲染或被detail折叠后行高判断错误
 * 在此手动resize计算
 */
const fixCodeLineStyle = container => {
  if (!container) {
    return () => {}
  }

  if (!Prism?.plugins?.lineNumbers?.resize) {
    return () => {}
  }

  const observer = new MutationObserver(mutationsList => {
    for (const m of mutationsList) {
      if (m.target.nodeName === 'DETAILS') {
        const preCodes = m.target.querySelectorAll('pre.notion-code')
        for (const preCode of preCodes) {
          try {
            Prism.plugins.lineNumbers.resize(preCode)
          } catch (err) {
            // ignore
          }
        }
      }
    }
  })
  observer.observe(container, {
    attributes: true,
    subtree: true
  })
  const timeoutId = setTimeout(() => {
    const preCodes = document.querySelectorAll('pre.notion-code')
    for (const preCode of preCodes) {
      try {
        Prism.plugins.lineNumbers.resize(preCode)
      } catch (err) {
        // ignore
      }
    }
  }, 10)

  return () => {
    clearTimeout(timeoutId)
    observer.disconnect()
  }
}

export default PrismMac
