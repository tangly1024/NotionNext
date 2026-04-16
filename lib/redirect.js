import fs from 'fs'

export function generateRedirectJson({ allPages }) {
  const uuidSlugMap = {}
  allPages.forEach(page => {
    if (page.type === 'Post' && page.status === 'Published') {
      uuidSlugMap[page.id] = page.slug
    }
  })
  try {
    fs.writeFileSync('./public/redirect.json', JSON.stringify(uuidSlugMap))
  } catch (error) {
    console.warn('无法写入文件', error)
  }
}

export function generateSlugIndexJson({ allPages, locale }) {
  const slugSet = new Set()

  allPages.forEach(page => {
    if (!page?.slug || page?.status !== 'Published') {
      return
    }

    const normalizedSlug = String(page.slug).replace(/^\/+|\/+$/g, '')
    if (!normalizedSlug) {
      return
    }

    slugSet.add(normalizedSlug.toLowerCase())
  })

  const localeKey = locale || 'zh-CN'
  try {
    fs.writeFileSync(
      `./public/slug-index.${localeKey}.json`,
      JSON.stringify(Array.from(slugSet))
    )
  } catch (error) {
    console.warn('无法写入 slug 索引文件', error)
  }
}
