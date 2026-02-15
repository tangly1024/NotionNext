/**
 * 将 Notion 内容转换为 Markdown，再渲染为带语法高亮的 HTML。
 * 使用内置转换器处理 react-notion-x 格式 blockMap。
 * 渲染：优先 GitHub /markdown API，超限则回退到 marked + highlight.js
 */

/**
 * 获取 README 页面的 Markdown
 * @param {string} pageId - Notion 页面 ID
 * @param {Object} blockMap - react-notion-x 格式 blockMap
 * @returns {string} Markdown 字符串
 */
export function getReadmeMarkdown(pageId, blockMap) {
  if (!blockMap) return ''
  console.log('[README] Markdown 来源: 内置脚本 (react-notion-x blockMap)')
  return notionBlocksToMarkdown(blockMap, pageId)
}

/**
 * 将 Notion Decoration[] 格式的富文本数组转为 Markdown
 */
function richTextToMarkdown(textArray) {
  if (!textArray || !Array.isArray(textArray)) return ''

  return textArray
    .map(item => {
      let value = item[0]
      const decorations = item[1]

      // 特殊占位符：公式
      if (value === '⁍') {
        const eq = decorations?.find(d => d[0] === 'e')
        return eq ? `\`${eq[1]}\`` : ''
      }

      // 特殊占位符：引用链接
      if (value === '‣') {
        const ref = Array.isArray(decorations) ? decorations[0] : null
        if (ref?.[0] === 'lm') {
          const href = ref[1]?.href || '#'
          const title = ref[1]?.title || href
          return `[${title}](${href})`
        }
        if (ref?.[0] === 'd') {
          return ref[1]?.start_date || ''
        }
        return ''
      }

      let md = value

      if (!decorations) return md

      // 按装饰类型逐层包裹 Markdown 语法
      for (const dec of decorations) {
        switch (dec[0]) {
          case 'b':
            md = `**${md}**`
            break
          case 'i':
            md = `_${md}_`
            break
          case 's':
            md = `~~${md}~~`
            break
          case 'c':
            md = `\`${md}\``
            break
          case '_':
            // 下划线，Markdown 无原生语法，用 HTML
            md = `<u>${md}</u>`
            break
          case 'a':
            md = `[${md}](${dec[1]})`
            break
          case 'h':
            // 颜色高亮，跳过
            break
          case 'e':
            // 行内公式
            md = `\`${dec[1]}\``
            break
          default:
            break
        }
      }

      return md
    })
    .join('')
}

/**
 * 将 Notion blockMap 转换为 Markdown
 * @param {Object} blockMap - react-notion-x recordMap 格式
 * @param {string} pageId - 页面 block ID
 * @returns {string} Markdown 字符串
 */
export function notionBlocksToMarkdown(blockMap, pageId) {
  if (!blockMap?.block) return ''

  const blocks = blockMap.block

  // 找到页面 block 获取 content 列表
  const normalizeId = id => (id || '').replace(/-/g, '').toLowerCase()
  const pageBlock = Object.values(blocks).find(b => {
    const v = b?.value
    return v?.type === 'page' && normalizeId(v.id) === normalizeId(pageId)
  })?.value

  const contentIds = pageBlock?.content || []
  if (contentIds.length === 0) return ''

  return renderBlockList(blocks, contentIds)
}

function renderBlockList(blocks, ids) {
  const parts = []
  let i = 0

  while (i < ids.length) {
    const block = blocks[ids[i]]?.value
    if (!block) { i++; continue }

    // 合并连续的无序列表项
    if (block.type === 'bulleted_list') {
      while (i < ids.length && blocks[ids[i]]?.value?.type === 'bulleted_list') {
        parts.push(renderListItem(blocks, blocks[ids[i]].value, '-'))
        i++
      }
      parts.push('')
      continue
    }

    // 合并连续的有序列表项
    if (block.type === 'numbered_list') {
      let num = 1
      while (i < ids.length && blocks[ids[i]]?.value?.type === 'numbered_list') {
        parts.push(renderListItem(blocks, blocks[ids[i]].value, `${num}.`))
        num++
        i++
      }
      parts.push('')
      continue
    }

    // 合并连续的待办项
    if (block.type === 'to_do') {
      while (i < ids.length && blocks[ids[i]]?.value?.type === 'to_do') {
        const b = blocks[ids[i]].value
        const text = richTextToMarkdown(b.properties?.title)
        const checked = b.properties?.checked?.[0]?.[0] === 'Yes'
        parts.push(`- [${checked ? 'x' : ' '}] ${text}`)
        i++
      }
      parts.push('')
      continue
    }

    parts.push(renderBlock(blocks, block))
    i++
  }

  return parts.join('\n')
}

function renderBlock(blocks, block) {
  const text = richTextToMarkdown(block.properties?.title)
  const children = block.content?.length
    ? renderBlockList(blocks, block.content)
    : ''

  switch (block.type) {
    case 'text':
      if (!text && !children) return ''
      return `${text}\n${children}`

    case 'header':
      return `# ${text}\n${children}`

    case 'sub_header':
      return `## ${text}\n${children}`

    case 'sub_sub_header':
      return `### ${text}\n${children}`

    case 'quote': {
      const lines = text.split('\n').map(l => `> ${l}`).join('\n')
      const childLines = children
        ? '\n' + children.split('\n').map(l => `> ${l}`).join('\n')
        : ''
      return `${lines}${childLines}\n`
    }

    case 'callout': {
      const icon = block.format?.page_icon || ''
      const prefix = icon ? `${icon} ` : ''
      return `> ${prefix}${text}\n`
    }

    case 'code': {
      const lang = (block.properties?.language?.[0]?.[0] || '').toLowerCase()
      const code = block.properties?.title
        ? block.properties.title.map(t => t[0]).join('')
        : ''
      return `\`\`\`${lang}\n${code}\n\`\`\`\n`
    }

    case 'divider':
      return '---\n'

    case 'image': {
      const src = block.format?.display_source || block.properties?.source?.[0]?.[0] || ''
      const caption = block.properties?.caption
        ? block.properties.caption.map(t => t[0]).join('')
        : ''
      if (!src) return ''
      return `![${caption}](${src})\n`
    }

    case 'bookmark': {
      const link = block.properties?.link?.[0]?.[0] || ''
      const title = text || link
      return link ? `[${title}](${link})\n` : ''
    }

    case 'toggle': {
      const summary = text || 'Toggle'
      return `<details>\n<summary>${summary}</summary>\n\n${children}\n</details>\n`
    }

    case 'table':
      return renderTable(blocks, block) + '\n'

    case 'column_list':
    case 'column':
      return children

    case 'alias':
    case 'breadcrumb':
    case 'external_object_instance':
    case 'transclusion_container':
    case 'transclusion_reference':
      return children || ''

    case 'page':
      return ''

    default:
      return text ? `${text}\n${children}` : children
  }
}

function renderListItem(blocks, block, prefix) {
  const text = richTextToMarkdown(block.properties?.title)
  const children = block.content?.length
    ? renderBlockList(blocks, block.content)
      .split('\n')
      .map(l => `  ${l}`)
      .join('\n')
    : ''
  return `${prefix} ${text}${children ? '\n' + children : ''}`
}

function renderTable(blocks, block) {
  const rowIds = block.content || []
  if (rowIds.length === 0) return ''

  const rows = rowIds.map(id => blocks[id]?.value).filter(Boolean)
  const columnOrder = block.format?.table_block_column_order || []

  const renderRow = row => {
    const props = row.properties || {}
    const cells = columnOrder.map(col => richTextToMarkdown(props[col]) || ' ')
    return `| ${cells.join(' | ')} |`
  }

  const header = renderRow(rows[0])
  const separator = `| ${columnOrder.map(() => '---').join(' | ')} |`
  const body = rows.slice(1).map(r => renderRow(r)).join('\n')

  return `${header}\n${separator}\n${body}`
}

/**
 * 调用 GitHub /markdown API 将 Markdown 渲染为带语法高亮的 HTML
 * - 优先读缓存（同内容命中则跳过 API，避免 60 次/小时 超限）
 * - 超限或失败时用缓存中的最新结果，无缓存则回退到本地 marked + highlight.js
 * @param {string} markdown - Markdown 文本
 * @param {{ useCache?: boolean }} options - 缓存选项（默认启用）
 * @returns {Promise<{ html: string, source: 'github' | 'local' }>} 渲染后的 HTML 及来源
 */
export async function renderMarkdownToHtml(markdown, options = {}) {
  if (!markdown) return { html: '', source: 'github' }

  const md5 = (await import('js-md5')).default
  const { getDataFromCache, setDataToCache } = await import('@/lib/cache/cache_manager')
  const cacheKey = `readme_github_md_${md5(markdown)}`
  const useCache = options.useCache !== false
  console.log(`[README] GitHub HTML 缓存开关: ${useCache ? '开启' : '关闭'}`)

  // 1. 先查缓存：同内容上次成功的结果可直接复用
  if (useCache) {
    const cached = await getDataFromCache(cacheKey, true)
    console.log(`[README] GitHub HTML 缓存: ${cached?.html ? '命中' : '未命中'}`)
    if (cached?.html) {
      console.log('[README] GitHub Markdown API: 使用缓存')
      return { html: cached.html, source: 'github' }
    }
  } else {
    console.log('[README] GitHub HTML 缓存: 已关闭，跳过读取')
  }

  // 2. 调用 GitHub API（未认证同一 IP 60 次/小时）
  try {
    const response = await fetch('https://api.github.com/markdown', {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: markdown,
        mode: 'gfm'
      })
    })

    if (response.ok) {
      const html = await response.text()
      if (useCache) {
        await setDataToCache(cacheKey, { html })
      }
      console.log('[README] GitHub Markdown API: 调用成功')
      return { html, source: 'github' }
    }
    // 403 超限或 422 等
    console.warn('[README] GitHub Markdown API: 调用失败', response.status, await response.text())
  } catch (err) {
    console.warn('[README] GitHub Markdown API: 调用失败', err.message)
  }

  // 3. 超限时再次查缓存（可能是其他 build 写入的，或启用 ENABLE_CACHE 前的历史数据）
  if (useCache) {
    const fallbackCached = await getDataFromCache(cacheKey, true)
    if (fallbackCached?.html) {
      console.log('[README] GitHub Markdown API: 超限/失败，使用缓存')
      return { html: fallbackCached.html, source: 'github' }
    }
  }

  // 4. 无缓存时回退：本地 marked + highlight.js（使用 .hljs-* 类）
  console.log('[README] GitHub Markdown API: 超限/失败，回退到本地 marked+highlight.js')
  try {
    const { marked } = await import('marked')
    const hljs = (await import('highlight.js')).default
    marked.setOptions({
      highlight: (code, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value
        }
        return hljs.highlightAuto(code).value
      }
    })
    const html = marked.parse(markdown)
    return { html: typeof html === 'string' ? html : '', source: 'local' }
  } catch (err) {
    console.warn('[README] Local markdown fallback failed:', err.message)
    return { html: '', source: 'github' }
  }
}

/** @deprecated 使用 renderMarkdownToHtml */
export async function renderMarkdownViaGitHub(markdown) {
  const { html } = await renderMarkdownToHtml(markdown)
  return html
}
