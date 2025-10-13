/**
 * 分类名称中英文映射工具
 * 将中文分类名称转换为SEO友好的英文路径
 */

// 中英文分类映射表
const CATEGORY_MAPPING = {
  // 中文 -> 英文映射
  '干货分享': 'insights',
  '技术分享': 'tech',
  '心情随笔': 'thoughts',
  '知行合一': 'practice',
  '产品思考': 'product',
  '生活感悟': 'life',
  '学习笔记': 'notes',
  '工作总结': 'work',
  '创业经历': 'startup',
  '投资理财': 'investment',
  '读书笔记': 'reading',
  '旅行日记': 'travel',
  '健康养生': 'health',
  '美食料理': 'food',
  '摄影分享': 'photography',
  '音乐推荐': 'music',
  '电影评论': 'movies',
  '游戏体验': 'gaming',
  '科技资讯': 'technology',
  '人工智能': 'ai',
  'AI应用': 'ai-applications',
  '编程开发': 'development',
  '设计作品': 'design',
  '市场营销': 'marketing',
  '数据分析': 'analytics',
  '项目管理': 'project-management',
  '个人成长': 'personal-growth',
  '职场经验': 'career',
  '教育培训': 'education',
  '社会观察': 'society',
  '文化艺术': 'culture',
  '历史故事': 'history',
  '科学探索': 'science',
  '环保生活': 'eco-friendly',
  '运动健身': 'fitness',
  '宠物生活': 'pets',
  '家居装修': 'home',
  '时尚搭配': 'fashion',
  '情感分享': 'emotions',
  '亲子教育': 'parenting',
  '老年生活': 'senior-life',
  '青春回忆': 'youth-memories'
}

// 反向映射表（英文 -> 中文）
const REVERSE_CATEGORY_MAPPING = Object.fromEntries(
  Object.entries(CATEGORY_MAPPING).map(([chinese, english]) => [english, chinese])
)

/**
 * 将中文分类名称转换为英文路径
 * @param {string} chineseCategory 中文分类名称
 * @returns {string} 英文路径
 */
export function chineseToEnglishCategory(chineseCategory) {
  if (!chineseCategory) return ''

  // 直接查找映射表
  if (CATEGORY_MAPPING[chineseCategory]) {
    return CATEGORY_MAPPING[chineseCategory]
  }

  // 如果没有找到映射，生成英文化的slug
  return generateEnglishSlug(chineseCategory)
}

/**
 * 将英文路径转换为中文分类名称
 * @param {string} englishCategory 英文路径
 * @returns {string} 中文分类名称
 */
export function englishToChineseCategory(englishCategory) {
  if (!englishCategory) return ''

  // 查找反向映射表
  if (REVERSE_CATEGORY_MAPPING[englishCategory]) {
    return REVERSE_CATEGORY_MAPPING[englishCategory]
  }

  // 如果没有找到，可能是动态生成的slug，返回原值
  return englishCategory
}

/**
 * 生成SEO友好的英文slug
 * @param {string} text 原始文本
 * @returns {string} 英文slug
 */
function generateEnglishSlug(text) {
  // 简单的拼音转换和处理
  return text
    .toLowerCase()
    .replace(/[\u4e00-\u9fa5]/g, 'category') // 将中文字符替换为 'category'
    .replace(/[^a-z0-9]+/g, '-') // 将非字母数字字符替换为连字符
    .replace(/^-+|-+$/g, '') // 去除首尾连字符
    .replace(/-+/g, '-') // 将多个连字符合并为一个
}

/**
 * 检查是否为中文分类名称
 * @param {string} category 分类名称
 * @returns {boolean} 是否包含中文
 */
export function isChineseCategory(category) {
  return /[\u4e00-\u9fa5]/.test(category)
}

/**
 * 获取所有分类映射
 * @returns {object} 完整的映射表
 */
export function getAllCategoryMappings() {
  return { ...CATEGORY_MAPPING }
}

/**
 * 获取反向分类映射
 * @returns {object} 反向映射表
 */
export function getReverseCategoryMappings() {
  return { ...REVERSE_CATEGORY_MAPPING }
}

/**
 * 智能分类路径转换
 * 根据当前语言环境自动选择合适的分类名称
 * @param {string} category 分类名称
 * @param {string} locale 语言环境
 * @returns {string} 转换后的分类名称
 */
export function smartCategoryConvert(category, locale = 'zh-CN') {
  if (!category) return ''

  // 如果是英文环境，转换为英文
  if (locale.startsWith('en')) {
    return chineseToEnglishCategory(category)
  }

  // 如果是中文环境，保持中文或转换回中文
  if (isChineseCategory(category)) {
    return category
  } else {
    return englishToChineseCategory(category)
  }
}