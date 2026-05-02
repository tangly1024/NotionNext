import { useEffect } from 'react'
import Prism from 'prismjs'
// 所有语言的prismjs 使用autoloader引入
// import 'prismjs/plugins/autoloader/prism-autoloader'
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/toolbar/prism-toolbar.min.css'
import 'prismjs/plugins/show-language/prism-show-language'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

// mermaid图
import { loadExternalResource } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'

/**
 * 代码美化相关
 * @author https://github.com/txs/
 * @returns
 */
const PrismMac = () => {
  const pathname = usePathname()
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
    let stopLineNumbers = () => {}

    const article = getNotionArticle()
    if (!article) return
    const hasCodeBlocks = Boolean(article.querySelector('pre.notion-code'))
    if (!hasCodeBlocks) return

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
          if (typeof window !== 'undefined' && !window.Prism) {
            window.Prism = Prism
          }
          if (window?.Prism?.plugins?.autoloader) {
            window.Prism.plugins.autoloader.languages_path = prismjsPath
          }

          const dispose = renderPrismMac(codeLineNumbers)
          stopLineNumbers = typeof dispose === 'function' ? dispose : () => {}
          renderMermaid(mermaidCDN)
          renderCollapseCode(codeCollapse, codeCollapseExpandDefault)
        } catch (err) {
          console.warn('[PrismMac] render failed:', err)
        }
      })
      .catch(err => {
        console.warn('[PrismMac] prism autoloader load failed:', err)
      })

    return () => {
      isDisposed = true
      try {
        stopLineNumbers()
      } catch (e) {
        /* ignore */
      }
    }
  }, [pathname, isDarkMode])

  return <></>
}

const getNotionArticle = () => {
  const inArticleWrapper = document.querySelector('#article-wrapper #notion-article')
  if (inArticleWrapper) return inArticleWrapper

  const candidates = Array.from(document.querySelectorAll('#notion-article'))
  if (candidates.length <= 1) return candidates[0] || null

  // 多主题并存时可能有多个 notion-article，优先选择正文内容更完整的节点
  const score = el => {
    const codeCount = el.querySelectorAll('pre.notion-code, .code-toolbar').length
    const blockCount = el.querySelectorAll('.notion, .notion-page, .notion-text').length
    return codeCount * 10 + blockCount
  }

  return candidates.sort((a, b) => score(b) - score(a))[0] || null
}

const getNotionArticles = () => {
  const inArticleWrapper = Array.from(
    document.querySelectorAll('#article-wrapper #notion-article')
  )
  if (inArticleWrapper.length > 0) return inArticleWrapper

  return Array.from(document.querySelectorAll('#notion-article'))
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

  const COLLAPSE_MIN_LINES = Number(siteConfig('CODE_COLLAPSE_MIN_LINES', 20))
  const codeBlocks = document.querySelectorAll('.code-toolbar')

  for (const codeBlock of codeBlocks) {
    try {
      if (codeBlock.closest('.collapse-wrapper')) {
        continue
      }

      const code = codeBlock.querySelector('code')
      if (!code) {
        continue
      }

      const className = code.getAttribute('class') || ''
      const languageMatch = className.match(/language-([\w-]+)/)
      const language = languageMatch ? languageMatch[1] : ''

      const text = code.textContent || ''
      const lineCount = text ? text.split('\n').length : 0

      // 方案 C：仅当代码行数超过阈值时才启用折叠
      if (lineCount && lineCount < COLLAPSE_MIN_LINES) {
        continue
      }

      const parent = codeBlock.parentNode
      if (!parent || !parent.contains(codeBlock)) {
        continue
      }

      const collapseWrapper = document.createElement('div')
      collapseWrapper.className = 'collapse-wrapper w-full py-2'

      const panelWrapper = document.createElement('div')
      panelWrapper.className = 'collapse-panel-wrapper'

      const header = document.createElement('button')
      header.type = 'button'
      header.className = 'collapse-header'

      const label = language
        ? `${language.toUpperCase()} · ${lineCount} lines`
        : `${lineCount} lines`

      header.innerHTML = `<span class="collapse-label">${label}</span><svg class="collapse-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.293 6.293a1 1 0 0 1 1.414 0L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z" clip-rule="evenodd"/></svg>`

      const panel = document.createElement('div')
      panel.className = 'collapse-panel'

      panelWrapper.appendChild(header)
      panelWrapper.appendChild(panel)
      collapseWrapper.appendChild(panelWrapper)

      parent.insertBefore(collapseWrapper, codeBlock)
      panel.appendChild(codeBlock)

      function setExpanded(expanded) {
        panelWrapper.classList.toggle('is-expanded', expanded)
        panel.classList.toggle('is-expanded', expanded)
        header.setAttribute('aria-expanded', expanded ? 'true' : 'false')
        panel.style.maxHeight = expanded ? `${panel.scrollHeight}px` : '0px'
      }

      header.addEventListener('click', () => {
        const expanded = panelWrapper.classList.contains('is-expanded')
        setExpanded(!expanded)
      })

      setExpanded(Boolean(codeCollapseExpandDefault))
    } catch (err) {
      console.warn('[PrismMac] collapse code failed:', err)
    }
  }
}

/**
 * 将mermaid语言 渲染成图片
 */
const renderMermaid = mermaidCDN => {
  const articles = getNotionArticles()
  if (!articles || articles.length === 0) return

  let hasMermaidBlocks = false

  for (const article of articles) {
    const mermaidCodeBlocks = article.querySelectorAll(
      '.notion-code.language-mermaid'
    )
    for (const codeBlock of mermaidCodeBlocks) {
      const chart = codeBlock.querySelector('code')?.textContent
      if (!chart) continue
      hasMermaidBlocks = true
      let mermaidChart = codeBlock.querySelector('.mermaid')
      if (!mermaidChart) {
        mermaidChart = document.createElement('pre')
        mermaidChart.className = 'mermaid'
        mermaidChart.textContent = chart
        codeBlock.appendChild(mermaidChart)
      }
    }
  }

  if (!hasMermaidBlocks) return

  loadExternalResource(mermaidCDN, 'js')
    .then(() => {
      setTimeout(() => {
        try {
          const mermaid = window.mermaid
          if (!mermaid) return
          mermaid?.contentLoaded()
        } catch (err) {
          console.warn('[PrismMac] mermaid render failed:', err)
        }
      }, 60)
    })
    .catch(err => {
      console.warn('[PrismMac] mermaid load failed:', err)
    })
}

function renderPrismMac(codeLineNumbers) {
  const container = getNotionArticle()

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
  // 重新渲染之前检查所有的多余text

  try {
    if (container && typeof Prism.highlightAllUnder === 'function') {
      Prism.highlightAllUnder(container)
    } else {
      Prism.highlightAll()
    }
  } catch (err) {
    console.warn('[PrismMac] prism highlight failed:', err)
  }

  const codeToolBars = container?.getElementsByClassName('code-toolbar')
  // Add pre-mac element for Mac Style UI
  if (codeToolBars) {
    Array.from(codeToolBars).forEach(item => {
      try {
        const existPreMac = item.getElementsByClassName('pre-mac')
        if (existPreMac.length < 1) {
          const preMac = document.createElement('div')
          preMac.classList.add('pre-mac')
          preMac.innerHTML = '<span></span><span></span><span></span>'
          item.appendChild(preMac)
        }
      } catch (err) {
        console.warn('[PrismMac] pre-mac failed:', err)
      }
    })
  }

  // 折叠代码行号bug
  if (codeLineNumbers) {
    return fixCodeLineStyle()
  }
  return () => {}
}

/**
 * 行号样式在首次渲染或被detail折叠后行高判断错误
 * 在此手动resize计算
 */
const fixCodeLineStyle = () => {
  const article = getNotionArticle()
  if (!article) {
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
          } catch (e) {
            /* ignore */
          }
        }
      }
    }
  })
  observer.observe(article, {
    attributes: true,
    subtree: true
  })
  const timeoutId = setTimeout(() => {
    const preCodes = article.querySelectorAll('pre.notion-code')
    for (const preCode of preCodes) {
      try {
        Prism.plugins.lineNumbers.resize(preCode)
      } catch (e) {
        /* ignore */
      }
    }
  }, 10)

  return () => {
    clearTimeout(timeoutId)
    observer.disconnect()
  }
}

export default PrismMac
