import { checkStartWithHttp, isBrowser } from '@/lib/utils/index'

/**
 * 诸如 article/https://test.com 等被错误拼接前缀的slug进行处理
 * 转换为 https://test.com
 * @param {*} str
 * @returns
 */
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

/**
 * 是否是一个相对或绝对路径的ur类
 * @param {*} str
 * @returns
 */
export function isUrl(str) {
  if (!str) {
    return false
  }

  return str?.indexOf('/') === 0 || checkStartWithHttp(str)
} // 截取url中最后一个 / 后面的内容
export function getLastPartOfUrl(url) {
  if (!url) {
    return ''
  }
  // 找到最后一个斜杠的位置
  const lastSlashIndex = url.lastIndexOf('/')

  // 如果找不到斜杠，则返回整个字符串
  if (lastSlashIndex === -1) {
    return url
  }

  // 截取最后一个斜杠后面的内容
  const lastPart = url.substring(lastSlashIndex + 1)

  return lastPart
}

/**
 * 将相对路径的url  test 转为绝对路径 /test
 * 判断url如果不是以 /开头，则拼接一个 /
 * 同时如果开头有重复的多个  // ，则只保留一个
 * @param {*} str
 */
export function convertUrlStartWithOneSlash(str) {
  if (!str) {
    return '#'
  }
  // 判断url是否以 / 开头
  if (!str.startsWith('/')) {
    // 如果不是，则在前面拼接一个 /
    str = '/' + str
  }
  // 移除开头的多个连续斜杠，只保留一个
  str = str.replace(/\/+/g, '/')
  return str
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
  if (!url) {
    return ''
  }
  // 移除哈希部分
  const urlWithoutHash = url.split('#')[0]
  const searchParams = new URLSearchParams(urlWithoutHash.split('?')[1])
  return searchParams.get(param)
}

/**
 * 获取url最后一个斜杆后面的内容
 * @param {*} url
 * @returns
 */
export function getLastSegmentFromUrl(url) {
  if (!url) {
    return ''
  }
  // 去掉 URL 中的查询参数部分
  const trimmedUrl = url.split('?')[0]
  // 获取最后一个斜杠后面的内容
  const segments = trimmedUrl.split('/')
  return segments[segments.length - 1]
}
