/**
 * 分类 / 标签 的 URL slug 映射
 * 页面内仍显示中文名称，仅链接 URL 使用英文 slug。
 *
 * 键（tag/category 名称）会在运行时自动从站点数据中收集，
 * 这里只需要给想用英文 URL 的名称填上英文即可：
 *   游戏: 'game',     // 分类「游戏」的链接变成 /category/game
 *   编程: 'program',  // 标签「编程」的链接变成 /tag/program
 * 未填写的名称保持原来的中文 URL。
 * 名称里带空格的（如 "Internet Download Manager"）不用填：
 * 会自动转成小写连字符 internet-download-manager；想自定义才需要写
 * 带引号的键，例如 'Apex Legends': 'apex-legends'。
 */
const USER_SLUG_MAP = {
  编程: 'program',
  教程: 'tutorial',
  备忘: 'memo',
  音乐: 'music',
  游戏: 'game',
  学习笔记: 'study-notes',
  朋友圈: 'moments',
  NFEU: 'nfeu',
  测试category: 'test-category',

  测试tag: 'test-tag',
  笔记本电脑: 'laptop',
  原创: 'original',
  ROG: 'rog',
  推荐: 'recommend',
  白嫖: 'free',
  Notion: 'notion',
  建站: 'website',
  歌词: 'lyrics',
  个人: 'personal',
  Office: 'office',
  Windows: 'windows',
  'Apex Legends': 'apex-legends',
  翻译: 'translation',
  设定集: 'lore-book',
  探索者之书: 'pathfinders-quest',
  Geebar: 'geebar',
  ilem: 'ilem',
  剪辑: 'editing',
  字幕: 'subtitles',
  台词: 'dialogue',
  高等数学: 'advanced-mathematics',
  微分方程: 'differential-equations',
  大学物理: 'college-physics',
  离散数学: 'discrete-mathematics',
  质点运动学: 'particle-kinematics',
  MARATHON: 'marathon',
  大学英语: 'college-english',
  图: 'image',
  关系: 'relationship',
  'C++': 'cpp',
  社会实践: 'social-practice',
  乐队: 'band',
  架子鼓: 'jazz-drum',
  'Internet Download Manager': 'idm',
  雨中冒险2: 'risk-of-rain-2',
  mod: 'mod',
  AI模型: 'ai-model',
  概率论: 'probability-theory',
  英语: 'english',
  排序: 'sorting',
  年度总结: 'annual-summary',
  RSS: 'rss',
  C: 'c',
  Java: 'java',
  Ubuntu: 'ubuntu',
  VMware: 'vmware',
  Linux: 'linux',
  应用统计学: 'applied-statistics',
  Python: 'python',
  算法: 'algorithm',
  机器学习: 'machine-learning',
  Shell: 'shell',
  SQL: 'sql',
  数据库: 'database'
}


/**
 * 根据站点实际的 tag/category 名称列表，合并用户映射，生成完整映射表
 * @param {string[]} names 名称列表
 * @returns {Object<string, string>}
 */
export function buildSlugMap(names = []) {
  const map = {}
  names.forEach(name => {
    map[name] = normalizeSlug(USER_SLUG_MAP[name] || name)
  })
  return map
}

/**
 * 规范化 slug：去除首尾空格，连续空格替换为连字符
 * @param {string} value
 * @returns {string}
 */
function normalizeSlug(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
}

/**
 * 名称 -> URL slug；未填映射的原样返回
 * @param {string} name
 * @param {Object<string, string>} slugMap
 * @returns {string}
 */
export function toSlug(name, slugMap) {
  const value = (slugMap && slugMap[name]) || name
  return normalizeSlug(value)
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
