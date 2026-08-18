/**
 * 分类 / 标签 的 URL slug 映射
 * 页面内仍显示中文名称，仅链接 URL 使用英文 slug。
 *
 * 键（tag/category 名称）会在运行时自动从站点数据中收集，
 * 这里只需要给想用英文 URL 的名称填上英文即可：
 *   游戏: 'game',     // 分类「游戏」的链接变成 /category/game
 *   编程: 'program',  // 标签「编程」的链接变成 /tag/program
 * 未填写的名称保持原来的中文 URL。
 */
const USER_SLUG_MAP = {
  游戏: 'game',
  编程: 'program',
  教程: 'tutorial'
}

/**
 * 根据站点实际的 tag/category 名称列表，合并用户映射，生成完整映射表
 * @param {string[]} names 名称列表
 * @returns {Object<string, string>}
 */
export function buildSlugMap(names = []) {
  const map = {}
  names.forEach(name => {
    map[name] = USER_SLUG_MAP[name] || ''
  })
  return map
}

/**
 * 名称 -> URL slug；未填映射的原样返回
 * @param {string} name
 * @param {Object<string, string>} slugMap
 * @returns {string}
 */
export function toSlug(name, slugMap) {
  return (slugMap && slugMap[name]) || name
}

/**
 * URL slug -> 名称；未匹配到映射的原样返回
 * @param {string} slug
 * @param {Object<string, string>} slugMap
 * @returns {string}
 */
export function fromSlug(slug, slugMap) {
  if (!slugMap) {
    return slug
  }
  const found = Object.keys(slugMap).find(key => slugMap[key] === slug)
  return found || slug
}

export default USER_SLUG_MAP
