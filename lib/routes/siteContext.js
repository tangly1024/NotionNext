import fs from 'fs'
import path from 'path'

const SITE_CONTEXT_KEYS = [
  'siteInfo',
  'allPages',
  'allNavPages',
  'latestPosts',
  'customMenu',
  'customNav',
  'notice',
  'categoryOptions',
  'tagOptions',
  'postCount',
  'NOTION_CONFIG'
]

export function buildRouteSiteContext(props = {}) {
  const context = {}

  for (const key of SITE_CONTEXT_KEYS) {
    if (props[key] !== undefined) {
      context[key] = props[key]
    }
  }

  return context
}

export function generateSiteContextJson({ props, locale }) {
  const localeKey = locale || 'zh-CN'
  const filePath = path.join(process.cwd(), 'public', `site-context.${localeKey}.json`)

  try {
    fs.writeFileSync(filePath, JSON.stringify(buildRouteSiteContext(props)))
  } catch (error) {
    console.warn('无法写入站点上下文文件', error)
  }
}

export function readSiteContext(locale) {
  const localeKey = locale || 'zh-CN'
  const filePath = path.join(process.cwd(), 'public', `site-context.${localeKey}.json`)

  try {
    if (!fs.existsSync(filePath)) {
      return null
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    console.warn('读取站点上下文失败', error)
    return null
  }
}
