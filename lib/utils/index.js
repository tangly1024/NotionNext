// 封装异步加载资源的方法


/**
 * 加载外部资源
 * @param url 地址 例如 https://xx.com/xx.js
 * @param type js 或 css
 * @returns {Promise<unknown>}
 */
export function loadExternalResource(url, type = 'js') {
  // 检查是否已存在
  const elements =
    type === 'js'
      ? document.querySelectorAll(`[src='${url}']`)
      : document.querySelectorAll(`[href='${url}']`)

  return new Promise((resolve, reject) => {
    if (elements.length > 0 || !url) {
      resolve(url)
      return url
    }

    let tag

    if (type === 'css') {
      tag = document.createElement('link')
      tag.rel = 'stylesheet'
      tag.href = url
    } else if (type === 'font') {
      tag = document.createElement('link')
      tag.rel = 'preload'
      tag.as = 'font'
      tag.href = url
    } else if (type === 'js') {
      tag = document.createElement('script')
      tag.src = url
    }
    if (tag) {
      tag.onload = () => {
        // console.log('Load Success', url)
        resolve(url)
      }
      tag.onerror = () => {
        console.warn('Load Error', url)
        reject(url)
      }
      document.head.appendChild(tag)
    }
  })
}

/**
 * 延时
 * @param {*} ms
 * @returns
 */
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

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

