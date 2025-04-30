/**
 * 将Node文本中的指定标签内容转换为带有指定类名的span
 * @param regex
 * @param node
 * @param className
 */
function convertTextToSpoilerSpan(regex, node, className) {
  const wholeText = node.wholeText
  let outerSpan = document.createElement('span')
  const fragments = []
  let lastIndex = 0
  let match
  while ((match = regex.exec(wholeText)) !== null) {
    console.log('符合要求的文字' + wholeText)
    // 添加前面未匹配的部分
    if (match.index > lastIndex) {
      outerSpan.appendChild(
        document.createTextNode(wholeText.slice(lastIndex, match.index))
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
    if (lastIndex < wholeText.length) {
      outerSpan.appendChild(document.createTextNode(wholeText.slice(lastIndex)))
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
      return regex.test(node.wholeText)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT
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
