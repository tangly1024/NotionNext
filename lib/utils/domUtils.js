/**
 * 扫描页面上的所有文本节点，将url格式的文本转为可点击链接
 * @param {*} node
 */
export const scanAndConvertToLinks = node => {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent
    const urlRegex = /https?:\/\/[^\s]+/g
    let lastIndex = 0
    let match

    const newNode = document.createElement('span')

    while ((match = urlRegex.exec(text)) !== null) {
      const beforeText = text.substring(lastIndex, match.index)
      const url = match[0]

      if (beforeText) {
        newNode.appendChild(document.createTextNode(beforeText))
      }

      const link = document.createElement('a')
      link.href = url
      link.target = '_blank'
      link.textContent = url

      newNode.appendChild(link)

      lastIndex = urlRegex.lastIndex
    }

    if (lastIndex < text.length) {
      newNode.appendChild(document.createTextNode(text.substring(lastIndex)))
    }

    node.parentNode.replaceChild(newNode, node)
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (const childNode of node.childNodes) {
      scanAndConvertToLinks(childNode)
    }
  }
}
