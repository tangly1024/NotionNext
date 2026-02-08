import { isBrowser } from '.'

/**
 * 获取默认密码
 * 用户可以通过url中拼接参数，输入密码
 * 输入过一次的密码会被存储在浏览器中，便于下一次免密访问
 * 返回的是一组历史密码，便于客户端多次尝试
 */
export const getPasswordQuery = path => {
  // 使用 URL 对象解析 URL
  const url = new URL(path, isBrowser ? window.location.origin : '')

  // 获取查询参数
  const queryParams = Object.fromEntries(url.searchParams.entries())

  // 请求中带着密码
  if (queryParams.password) {
    // 将已输入密码作为默认密码存放在 localStorage，便于下次读取并自动尝试
    localStorage.setItem('password_default', queryParams.password)
  }

  // 获取路径部分
  const cleanedPath = url.pathname

  // 从 localStorage 中获取相关密码
  const storedPassword = localStorage.getItem('password_' + cleanedPath)
  const defaultPassword = localStorage.getItem('password_default')

  // 将所有密码存储在一个数组中，并过滤掉无效值
  const passwords = [
    queryParams.password,
    storedPassword,
    defaultPassword
  ].filter(Boolean)

  return passwords
}
