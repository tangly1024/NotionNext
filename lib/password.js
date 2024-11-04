import { isBrowser } from './utils'

/**
 * 获取默认密码
 * 用户可以通过url中拼接参数，输入密码
 * 返回的是一组历史密码，便于客户端多次尝试
 */
export const getPasswordQuery = path => {
  // 使用 URL 对象解析 URL
  const url = new URL(path, isBrowser ? window.location.origin : '')

  // 获取查询参数
  const queryParams = Object.fromEntries(url.searchParams.entries())

  // 获取路径部分
  const cleanedPath = url.pathname

  // 将所有密码存储在一个数组中，并过滤掉无效值
  const passwords = [
    queryParams.password
  ].filter(Boolean)

  return passwords
}
