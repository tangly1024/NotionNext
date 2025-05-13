/**
 * 判断是否客户端
 * @returns {boolean}
 */
export const isBrowser = typeof window !== 'undefined'
/**
 * google机器人
 * @returns
 */
export const isSearchEngineBot =
  typeof navigator !== 'undefined' &&
  /Googlebot|bingbot|Baidu/.test(navigator.userAgent)
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