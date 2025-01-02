/**
 * 更新字数统计和阅读时间
 */
export function countWords(pageContentText) {
  const wordCount = fnGetCpmisWords(pageContentText)
  // 阅读速度 300-500每分钟
  const readTime = Math.floor(wordCount / 400) + 1
  return { wordCount, readTime }
}

// 用word方式计算正文字数
function fnGetCpmisWords(str) {
  if (!str) {
    return 0
  }
  let sLen = 0
  try {
    // eslint-disable-next-line no-irregular-whitespace
    str = str.replace(/(\r\n+|\s+|　+)/g, '龘')
    // eslint-disable-next-line no-control-regex
    str = str.replace(/[\x00-\xff]/g, 'm')
    str = str.replace(/m+/g, '*')
    str = str.replace(/龘+/g, '')
    sLen = str.length
  } catch (e) {}
  return sLen
}
