// 封装异步加载资源的方法
import { memo } from 'react'

/**
 * 判断是否客户端
 * @returns {boolean}
 */
export const isBrowser = typeof window !== 'undefined'

/**
 * 打乱数组
 * @param {*} array
 * @returns
 */
export const shuffleArray = array => {
  if (!array) {
    return []
  }
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

/**
 * google机器人
 * @returns
 */
export const isSearchEngineBot = () => {
  if (typeof navigator === 'undefined') {
    return false
  }
  // 获取用户代理字符串
  const userAgent = navigator.userAgent
  // 使用正则表达式检测是否包含搜索引擎爬虫关键字
  return /Googlebot|bingbot|Baidu/.test(userAgent)
}

/**
 * 组件持久化
 */
export const memorize = Component => {
  const MemoizedComponent = props => {
    return <Component {...props} />
  }
  return memo(MemoizedComponent)
}

// 转换外链
export function sliceUrlFromHttp(str) {
  // 检查字符串是否包含http
  if (str?.includes('http:') || str?.includes('https:')) {
    // 如果包含，找到http的位置
    const index = str?.indexOf('http')
    // 返回http之后的部分
    return str.slice(index, str.length)
  } else {
    // 如果不包含，返回原字符串
    return str
  }
}

// 检查是否外链
export function checkContainHttp(str) {
  // 检查字符串是否包含http
  if (str?.includes('http:') || str?.includes('https:')) {
    // 如果包含，找到http的位置
    return str?.indexOf('http') > -1
  } else {
    // 不包含
    return false
  }
}

/**
 * 加载外部资源
 * @param url 地址 例如 https://xx.com/xx.js
 * @param type js 或 css
 * @returns {Promise<unknown>}
 */
export function loadExternalResource(url, type) {
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
        console.log('Load Success', url)
        resolve(url)
      }
      tag.onerror = () => {
        console.log('Load Error', url)
        reject(url)
      }
      document.head.appendChild(tag)
    }
  })
}

/**
 * 查询url中的query参数
 * @param {}} variable
 * @returns
 */
export function getQueryVariable(key) {
  const query = isBrowser ? window.location.search.substring(1) : ''
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] === key) {
      return pair[1]
    }
  }
  return false
}
/**
 * 获取 URL 中指定参数的值
 * @param {string} url
 * @param {string} param
 * @returns {string|null}
 */
export function getQueryParam(url, param) {
  // 移除哈希部分
  const urlWithoutHash = url.split('#')[0]
  const searchParams = new URLSearchParams(urlWithoutHash.split('?')[1])
  return searchParams.get(param)
}

/**
 * 深度合并两个对象
 * @param target
 * @param sources
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }
  return mergeDeep(target, ...sources)
}

/**
 * 是否对象
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * 是否可迭代
 * @param {*} obj
 * @returns
 */
export function isIterable(obj) {
  return obj != null && typeof obj[Symbol.iterator] === 'function'
}

/**
 * 深拷贝对象
 * 根据源对象类型深度复制，支持object和array
 * @param {*} obj
 * @returns
 */
export function deepClone(obj) {
  if (Array.isArray(obj)) {
    // If obj is an array, create a new array and deep clone each element
    return obj.map(item => deepClone(item))
  } else if (obj && typeof obj === 'object') {
    const newObj = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (obj[key] instanceof Date) {
          newObj[key] = new Date(obj[key].getTime()).toISOString()
        } else {
          newObj[key] = deepClone(obj[key])
        }
      }
    }
    return newObj
  } else {
    return obj
  }
}
/**
 * 延时
 * @param {*} ms
 * @returns
 */
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取从第1页到指定页码的文章
 * @param pageIndex 第几页
 * @param list 所有文章
 * @param pageSize 每页文章数量
 * @returns {*}
 */
export const getListByPage = function (list, pageIndex, pageSize) {
  return list.slice(0, pageIndex * pageSize)
}

/**
 * 判断是否移动设备
 */
export const isMobile = () => {
  let isMobile = false
  if (!isBrowser) {
    return isMobile
  }

  // 这个判断会引发 TypeError: navigator.userAgentData.mobile is undefined 问题，导致博客无法正常工作
  // if (!isMobile && navigator.userAgentData.mobile) {
  //   isMobile = true
  // }

  if (!isMobile && /Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    isMobile = true
  }

  if (/Android|iPhone|iPad|iPod/i.test(navigator.platform)) {
    isMobile = true
  }

  if (typeof window.orientation !== 'undefined') {
    isMobile = true
  }

  return isMobile
}

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
