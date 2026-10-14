import fs from 'fs/promises'
import path from 'path'
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { extractLangPrefix } from '@/lib/utils/pageId'

export function normalizeRevalidationPath(value) {
  if (typeof value !== 'string' || !value.trim() || value.length > 2048)
    return null
  const input = value.trim()
  if (
    /^[a-z][a-z\d+.-]*:/i.test(input) ||
    input.startsWith('//') ||
    /[\\?#\u0000-\u001f]/.test(input)
  )
    return null
  const result = input.startsWith('/') ? input : '/' + input
  let decoded
  try {
    decoded = decodeURIComponent(result)
  } catch {
    return null
  }
  if (
    /[\\?#\u0000-\u001f]/.test(decoded) ||
    decoded.includes('//') ||
    decoded.split('/').some(segment => segment === '.' || segment === '..') ||
    /^\/api(?:\/|$)/i.test(decoded)
  )
    return null
  return result.length > 1 ? result.replace(/\/+$/, '') : result
}

export async function collectRevalidationPaths() {
  const paths = new Set()
  const locales = [
    ...new Set(
      [
        BLOG.LANG,
        ...String(BLOG.NOTION_PAGE_ID || '')
          .split(',')
          .map(extractLangPrefix)
      ].filter(Boolean)
    )
  ]
  for (const locale of locales) {
    const data = await fetchGlobalAllData({
      locale,
      from: 'revalidation-paths'
    })
    // On-demand ISR resolves the internal route, so include the default locale too.
    const localePrefix = '/' + locale
    const add = value => {
      const normalized = normalizeRevalidationPath(value)
      if (normalized && !normalized.startsWith('/api/'))
        paths.add(localePrefix + (normalized === '/' ? '' : normalized) || '/')
    }
    for (const value of ['/', '/archive', '/category', '/tag', '/search'])
      add(value)
    for (const post of data.allPages || []) {
      if (!post.type?.includes('Menu')) {
        add(post.slug)
        if (post.href !== post.slug) add(post.href)
      }
    }
    const posts = (data.allPages || []).filter(
      post => post.type === 'Post' && post.status === 'Published'
    )
    const groups = new Map([['', posts.length]])
    for (const post of posts) {
      for (const [kind, values] of [
        ['tag', post.tags],
        [
          'category',
          Array.isArray(post.category) ? post.category : [post.category]
        ]
      ]) {
        for (const name of new Set(Array.isArray(values) ? values : [])) {
          if (typeof name !== 'string' || !name.trim()) continue
          const slug = `${kind}/${encodeURIComponent(name)}`
          groups.set(slug, (groups.get(slug) || 0) + 1)
        }
      }
    }
    const pageSize = Math.max(
      1,
      Math.floor(
        Number(siteConfig('POSTS_PER_PAGE', 12, data.NOTION_CONFIG))
      ) || 12
    )
    const paginated =
      siteConfig('POST_LIST_STYLE', 'page', data.NOTION_CONFIG) === 'page'
    for (const [slug, count] of groups) {
      if (slug) add(slug)
      if (paginated) {
        for (let page = 2; page <= Math.ceil(count / pageSize); page++) {
          add(`${slug ? slug + '/' : ''}page/${page}`)
        }
      }
    }
  }
  // Include previously built routes, including removed slugs and built search pages.
  try {
    const manifest = JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), '.next', 'prerender-manifest.json'),
        'utf8'
      )
    )
    for (const route of Object.keys(manifest.routes || {})) {
      if (!/\/(?:404|500)$/.test(route) && normalizeRevalidationPath(route))
        paths.add(route)
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  return [...paths].sort()
}

export async function revalidatePaths(
  res,
  paths,
  concurrency = 3,
  deadline = Infinity
) {
  const locales = new Set(
    [
      BLOG.LANG,
      ...String(BLOG.NOTION_PAGE_ID || '')
        .split(',')
        .map(extractLangPrefix)
    ].filter(Boolean)
  )
  let next = 0
  const results = new Array(paths.length)
  await Promise.all(
    Array.from({ length: Math.min(concurrency, paths.length) }, async () => {
      while (next < paths.length && Date.now() < deadline) {
        const index = next++
        try {
          const route = paths[index]
          const internalPath =
            BLOG.LANG && !locales.has(route.split('/')[1])
              ? `/${BLOG.LANG}${route === '/' ? '' : route}`
              : route
          await res.revalidate(internalPath)
          results[index] = { path: paths[index], revalidated: true }
        } catch (error) {
          console.error(
            '[Revalidation] Page regeneration failed',
            paths[index],
            error instanceof Error ? error.name : 'Error'
          )
          results[index] = {
            path: paths[index],
            revalidated: false,
            error: 'Page regeneration failed'
          }
        }
      }
    })
  )
  return results.filter(Boolean)
}
