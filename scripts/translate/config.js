const path = require('path')
const fs = require('fs')

function envIds() {
  const en = process.env.NOTION_DB_EN_ID
  const zh = process.env.NOTION_DB_ZH_ID
  if (!en || !zh) {
    throw new Error('NOTION_DB_EN_ID 与 NOTION_DB_ZH_ID 均需在项目根目录 .env.local 中配置')
  }
  return { en, zh }
}

function normalize(id) {
  return String(id).replace(/-/g, '').toLowerCase()
}

function langFromDb(dbId) {
  const { en, zh } = envIds()
  const id = normalize(dbId)
  if (id === normalize(en)) return 'en-US'
  if (id === normalize(zh)) return 'zh-CN'
  return null
}

function dbForLang(lang) {
  const { en, zh } = envIds()
  if (lang === 'en-US') return en
  if (lang === 'zh-CN') return zh
  throw new Error(`不支持的语言: ${lang}`)
}

function flipLang(lang) {
  if (lang === 'zh-CN') return 'en-US'
  if (lang === 'en-US') return 'zh-CN'
  throw new Error(`不支持的语言: ${lang}`)
}

let _categoryMap = null
function categoryMap() {
  if (!_categoryMap) {
    _categoryMap = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'category-map.json'), 'utf8')
    )
  }
  return _categoryMap
}

function mapSelect(kind, value, sourceLang) {
  if (!value) return null
  const direction = sourceLang === 'en-US' ? 'en_to_zh' : 'zh_to_en'
  const m = categoryMap()[kind]?.[direction] || {}
  return m[value] || null
}

function mapMultiSelect(kind, values, sourceLang) {
  if (!Array.isArray(values)) return []
  const direction = sourceLang === 'en-US' ? 'en_to_zh' : 'zh_to_en'
  const m = categoryMap()[kind]?.[direction] || {}
  const out = []
  const dropped = []
  for (const v of values) {
    if (m[v]) out.push(m[v])
    else dropped.push(v)
  }
  return { mapped: out, dropped }
}

module.exports = {
  envIds,
  langFromDb,
  dbForLang,
  flipLang,
  mapSelect,
  mapMultiSelect
}
