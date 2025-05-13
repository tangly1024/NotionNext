// 检查是否外链
export function checkStartWithHttp(str) {
  // 检查字符串是否包含http
  if (str?.indexOf('http:') === 0 || str?.indexOf('https:') === 0) {
    // 如果包含，找到http的位置
    return true
  } else {
    // 不包含
    return false
  }
}

// 检查一个字符串是否UUID https://ihateregex.io/expr/uuid/
export function checkStrIsUuid(str) {
  if (!str) {
    return false
  }
  // 使用正则表达式进行匹配
  const regex =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
  return regex.test(str)
}

// 检查一个字符串是否notionid : 32位，仅由数字英文构成
export function checkStrIsNotionId(str) {
  if (!str) {
    return false
  }
  // 使用正则表达式进行匹配
  const regex = /^[a-zA-Z0-9]{32}$/
  return regex.test(str)
}
