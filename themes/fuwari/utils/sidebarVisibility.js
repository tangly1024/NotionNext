/**
 * 解析单页是否隐藏 Fuwari SidePanel。
 * 优先读页面属性，不改其它 Page 的默认行为。
 *
 * Notion 可用方式（任选其一）：
 * 1. 页面 Full width（fullWidth）
 * 2. 数据库字段 HIDE_SIDEBAR = true / Yes / 是
 * 3. 数据库字段 SIDEBAR = false / No / 否
 * 4. ext JSON：{"HIDE_SIDEBAR":true} 或 {"SIDEBAR":false}
 */
export function shouldHideFuwariSidebar(post) {
  if (!post) return false
  if (post.fullWidth) return true

  const hideRaw =
    post.HIDE_SIDEBAR ??
    post.hide_sidebar ??
    post.hideSidebar ??
    post.ext?.HIDE_SIDEBAR ??
    post.ext?.hide_sidebar ??
    post.ext?.hideSidebar

  if (hideRaw !== undefined && hideRaw !== null && hideRaw !== '') {
    return parseTruthyFlag(hideRaw)
  }

  const sidebarRaw =
    post.SIDEBAR ?? post.sidebar ?? post.ext?.SIDEBAR ?? post.ext?.sidebar

  if (sidebarRaw !== undefined && sidebarRaw !== null && sidebarRaw !== '') {
    return !parseTruthyFlag(sidebarRaw)
  }

  return false
}

function parseTruthyFlag(raw) {
  const value = Array.isArray(raw) ? raw[0] : raw
  if (typeof value === 'string') {
    return !['false', '0', 'no', '否', 'off'].includes(value.trim().toLowerCase())
  }
  return Boolean(value)
}
