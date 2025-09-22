import fs from 'fs'

export function generateRedirectJson({ allPages }) {
  let uuidSlugMap = {}
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
