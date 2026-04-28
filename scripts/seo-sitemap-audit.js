#!/usr/bin/env node

/**
 * Deployment-oriented sitemap audit for CharliiAI.
 *
 * What it checks:
 * 1. Fetch live sitemap.xml
 * 2. Extract article slugs
 * 3. Flag suspicious slug patterns
 * 4. Verify a subset of suspicious pages by checking canonical targets
 *
 * Usage:
 *   node scripts/seo-sitemap-audit.js
 *   node scripts/seo-sitemap-audit.js https://www.charliiai.com
 */

const https = require('https')

const DEFAULT_SITE = 'https://www.charliiai.com'
const UUID_LIKE_SLUG =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const NOTION_ID_LIKE_SLUG = /^[0-9a-z]{32}$/i
const KNOWN_BROKEN_SLUGS = new Set(['article/mi-gpt', 'article/pygwalker'])

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        let data = ''
        res.on('data', chunk => {
          data += chunk
        })
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode} for ${url}`))
            return
          }
          resolve(data)
        })
      })
      .on('error', reject)
  })
}

function normalizeBaseUrl(value) {
  return String(value || DEFAULT_SITE).replace(/\/+$/g, '')
}

function normalizeSlug(slug) {
  return typeof slug === 'string' ? slug.trim().replace(/^\/+|\/+$/g, '') : ''
}

function extractArticleSlugs(sitemapXml, baseUrl) {
  const escapedBase = baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(
    `<loc>${escapedBase}/(article/[^<]+?)/?</loc>`,
    'gi'
  )

  return [...sitemapXml.matchAll(regex)].map(match => normalizeSlug(match[1]))
}

function classifySlug(slug) {
  const normalizedSlug = normalizeSlug(slug).toLowerCase()
  const tail = normalizedSlug.split('/').pop() || ''

  if (KNOWN_BROKEN_SLUGS.has(normalizedSlug)) {
    return 'known-broken'
  }

  if (UUID_LIKE_SLUG.test(tail)) {
    return 'uuid-like'
  }

  if (NOTION_ID_LIKE_SLUG.test(tail)) {
    return 'notion-id-like'
  }

  return 'ok'
}

function extractCanonical(html) {
  const match = html.match(
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i
  )
  return match ? match[1].trim() : ''
}

async function auditCanonical(baseUrl, slug) {
  const pageUrl = `${baseUrl}/${slug}`

  try {
    const html = await fetchText(pageUrl)
    const canonical = extractCanonical(html)
    return {
      slug,
      pageUrl,
      canonical,
      redirectsToHome:
        canonical === `${baseUrl}/` || canonical === `${baseUrl}` || !canonical
    }
  } catch (error) {
    return {
      slug,
      pageUrl,
      canonical: '',
      redirectsToHome: false,
      error: error.message
    }
  }
}

function printSection(title, items) {
  console.log(`\n${title}`)
  if (!items.length) {
    console.log('  none')
    return
  }

  items.forEach(item => {
    console.log(`  - ${item}`)
  })
}

async function main() {
  const baseUrl = normalizeBaseUrl(process.argv[2] || DEFAULT_SITE)
  const sitemapUrl = `${baseUrl}/sitemap.xml`

  console.log(`Auditing sitemap: ${sitemapUrl}`)
  const sitemapXml = await fetchText(sitemapUrl)
  const articleSlugs = extractArticleSlugs(sitemapXml, baseUrl)

  const classified = articleSlugs.map(slug => ({
    slug,
    reason: classifySlug(slug)
  }))

  const suspicious = classified.filter(item => item.reason !== 'ok')
  const uuidLike = suspicious
    .filter(item => item.reason === 'uuid-like')
    .map(item => item.slug)
  const notionLike = suspicious
    .filter(item => item.reason === 'notion-id-like')
    .map(item => item.slug)
  const knownBroken = suspicious
    .filter(item => item.reason === 'known-broken')
    .map(item => item.slug)

  printSection('Suspicious UUID-like slugs', uuidLike)
  printSection('Suspicious Notion-ID-like slugs', notionLike)
  printSection('Known broken slugs', knownBroken)

  const canonicalChecks = []
  for (const slug of [...knownBroken, ...uuidLike.slice(0, 5), ...notionLike.slice(0, 5)]) {
    canonicalChecks.push(await auditCanonical(baseUrl, slug))
  }

  console.log('\nCanonical audit')
  if (!canonicalChecks.length) {
    console.log('  none')
  } else {
    canonicalChecks.forEach(result => {
      const status = result.error
        ? `error: ${result.error}`
        : result.redirectsToHome
          ? 'canonical-home'
          : 'canonical-ok'
      console.log(`  - ${result.slug} -> ${status}${result.canonical ? ` -> ${result.canonical}` : ''}`)
    })
  }

  console.log('\nSummary')
  console.log(`  - article urls in sitemap: ${articleSlugs.length}`)
  console.log(`  - suspicious uuid-like: ${uuidLike.length}`)
  console.log(`  - suspicious notion-id-like: ${notionLike.length}`)
  console.log(`  - known broken slug hits: ${knownBroken.length}`)
}

main().catch(error => {
  console.error(`Audit failed: ${error.message}`)
  process.exit(1)
})
