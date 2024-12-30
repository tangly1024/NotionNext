function convertTextToSpoilerSpan(node, className, spoilerTag) {
  const regex = new RegExp(`${spoilerTag}(.*?)${spoilerTag}`, 'g')
  const wholeText = node.wholeText
  const fragments = []
  let lastIndex = 0
  let match
  while ((match = regex.exec(wholeText)) !== null) {
    console.log('符合要求的文字' + wholeText)
    // 添加前面未匹配的部分
    if (match.index > lastIndex) {
      fragments.push(
        document.createTextNode(wholeText.slice(lastIndex, match.index))
      )
    }

    // 创建 span 包裹的内容
    const span = document.createElement('span')
    span.textContent = match[1] // 提取匹配的内容
    if (className) {
      span.className = className
    }
    fragments.push(span)
    // 设置lastIndex
    lastIndex = regex.lastIndex
  }
  if (fragments.length) {
    // 添加剩余未匹配的部分
    if (lastIndex < wholeText.length) {
      fragments.push(document.createTextNode(wholeText.slice(lastIndex)))
    }

    // 替换原节点
    fragments.forEach(fragment => {
      node.parentNode.appendChild(fragment)
    })
    node.remove()
  }
}

function processTextNodes(root, className, spoilerTag) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null)
  const waitProcessNodes = []
  while (walker.nextNode()) {
    const node = walker.currentNode
    waitProcessNodes.push(node)
  }
  for (const waitProcessNode of waitProcessNodes) {
    convertTextToSpoilerSpan(waitProcessNode, className, spoilerTag)
  }
}

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
