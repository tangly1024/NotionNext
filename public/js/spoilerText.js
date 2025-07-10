/**
 * 转义正则表达式中的特殊字符
 * @param {string} string 需要转义的字符串
 * @returns {string} 转义后的字符串
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 将Node文本中的指定标签内容转换为带有指定类名的span
 * @param regex
 * @param node
 * @param className
 */
function convertTextToSpoilerSpan(regex, node, className) {
  // 使用 textContent 替代 wholeText 以确保类型安全
  const textContent = node.textContent
  let outerSpan = document.createElement('span')
  const fragments = []
  let lastIndex = 0
  let match
  while ((match = regex.exec(textContent)) !== null) {
    console.log('符合要求的文字' + textContent)
    // 添加前面未匹配的部分
    if (match.index > lastIndex) {
      outerSpan.appendChild(
        document.createTextNode(textContent.slice(lastIndex, match.index))
      )
    }

    // 创建 span 包裹的内容
    const span = document.createElement('span')
    span.textContent = match[1] // 提取匹配的内容
    if (className) {
      span.className = className
    }
    outerSpan.appendChild(span)
    // 设置lastIndex
    lastIndex = regex.lastIndex
  }
  if (outerSpan.childNodes.length) {
    // 添加剩余未匹配的部分
    if (lastIndex < textContent.length) {
      outerSpan.appendChild(
        document.createTextNode(textContent.slice(lastIndex))
      )
    }
    node.replaceWith(outerSpan)
  }
}

/**
 * 收集并处理指定节点下的所有文本节点
 * @param root
 * @param className
 * @param spoilerTag
 */
function processTextNodes(root, className, spoilerTag) {
  const regex = new RegExp(`${spoilerTag}(.*?)${spoilerTag}`, 'g')
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return regex.test(node.textContent)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_REJECT
    }
  })
  const waitProcessNodes = []
  while (walker.nextNode()) {
    const node = walker.currentNode
    waitProcessNodes.push(node)
  }
  for (const waitProcessNode of waitProcessNodes) {
    convertTextToSpoilerSpan(regex, waitProcessNode, className)
  }

  // 处理跨节点的 spoiler 标记
  processCrossNodeSpoilers(root, className, spoilerTag)
}

/**
 * 处理跨节点的 spoiler 标记
 * @param {Element} root 要处理的根元素
 * @param {string} className 应用于 spoiler 内容的类名
 * @param {string} spoilerTag spoiler 标记符号
 */
function processCrossNodeSpoilers(root, className, spoilerTag) {
  if (root.nodeType !== Node.ELEMENT_NODE) return

  const html = root.innerHTML

  // 处理原始标签，如果是已经转义过的，则去除转义
  let originalTag = spoilerTag
  if (spoilerTag.startsWith('\\') || spoilerTag.includes('\\[')) {
    originalTag = spoilerTag.replace(/\\/g, '')
  }

  // 创建正则表达式，直接匹配原始标签
  const regex = new RegExp(`\\${originalTag}([\\s\\S]*?)\\${originalTag}`, 'g')

  const hasMatch = regex.test(html)

  if (!hasMatch) return

  // 重置正则表达式
  regex.lastIndex = 0

  // 替换匹配项
  const newHtml = html.replace(regex, function (match, content) {
    return `<span class="${className}">${content}</span>`
  })

  // 如果内容有变化，更新 DOM
  if (newHtml !== html) {
    root.innerHTML = newHtml
  }
}

/**
 * 定位到目标处理位置，开始进行文本到spoiler的转换
 * @param spoilerTag
 */
function textToSpoiler(spoilerTag) {
  const intervalID = setInterval(() => {
    const articleElement = document.querySelector(
      '#article-wrapper #notion-article main'
    )
    if (articleElement) {
      setTimeout(() => {
        processTextNodes(articleElement, 'spoiler-text', spoilerTag)
        clearInterval(intervalID)
      }, 300)
    }
  }, 1000)
}

window.textToSpoiler = textToSpoiler
