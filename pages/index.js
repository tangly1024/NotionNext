import BLOG from '@/blog.config'
import { convertVal, siteConfig } from '@/lib/config'
import { fetchGlobalAllData, getPostBlocks } from '@/lib/db/SiteDataApi'
import { generateRobotsTxt } from '@/lib/utils/robots.txt'
import { generateRss } from '@/lib/utils/rss'
import { generateSitemapXml } from '@/lib/utils/sitemap.xml'
import { DynamicLayout } from '@/themes/theme'
import { generateRedirectJson } from '@/lib/utils/redirect'
import { checkDataFromAlgolia } from '@/lib/plugins/algolia'
import { getPageContentText } from '@/lib/db/notion/getPageContentText'
import { getReadmeMarkdown, renderMarkdownToHtml } from '@/lib/db/notion/notionBlocksToHtml'
import { getDataFromCache, setDataToCache } from '@/lib/cache/cache_manager'
import CLAUDE_CONFIG from '@/themes/claude/config'
import {
  buildContributionPostSnapshot,
  filterContributionEventsUntilYesterday,
  getContributionEventsFromLocalCache,
  isContributionStoreEnabled,
  listContributionEvents,
  setContributionEventsToLocalCache,
  shouldRefreshContributionDailyCache,
  syncContributionSnapshots
} from '@/lib/server/claude/contributionStore'
import md5 from 'js-md5'

const normalizeSlugToken = value => {
  if (!value || typeof value !== 'string') return ''
  return value
    .toLowerCase()
    .split('?')[0]
    .split('#')[0]
    .replace(/^\/+|\/+$/g, '')
    .replace(/\.html$/i, '')
}

const isReadmePage = page => {
  if (!page || !['Published', 'Invisible'].includes(page.status)) return false
  return normalizeSlugToken(page.slug) === 'readme.md'
}

const normalizeId = value => (value || '').toString().replace(/-/g, '').toLowerCase()
const buildHrefFromSlug = slug => {
  if (!slug || typeof slug !== 'string') return ''
  if (/^https?:\/\//i.test(slug)) return slug
  return slug.startsWith('/') ? slug : `/${slug}`
}
const toBoolean = value => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true'
  return Boolean(value)
}

const getServerConfigValue = (key, defaultVal = null, mergedConfig = {}) => {
  if (!key) return defaultVal
  const hasVal = value => value !== undefined && value !== null

  const mergedValue = mergedConfig?.[key]
  if (hasVal(mergedValue)) return convertVal(mergedValue)

  const blogValue = BLOG?.[key]
  if (hasVal(blogValue)) return convertVal(blogValue)

  return defaultVal
}

/**
 * 仅基于正文内容区块生成指纹：
 * - 从 page.content 出发遍历正文树
 * - 使用正文 block 的 type / last_edited_time / 子结构顺序
 * - 不使用 page properties，避免“仅改属性也触发重渲染”
 */
const getReadmeBodyFingerprint = (pageId, blockMap) => {
  const blocks = blockMap?.block || {}
  if (!Object.keys(blocks).length) return ''

  const normalizedPageId = normalizeId(pageId)
  const pageBlock = Object.values(blocks).find(item => {
    const value = item?.value
    return value?.type === 'page' && normalizeId(value.id) === normalizedPageId
  })?.value

  const rootContent = pageBlock?.content || []
  if (!rootContent.length) return ''

  const tokens = []
  const visited = new Set()

  const walk = blockId => {
    if (!blockId || visited.has(blockId)) return
    visited.add(blockId)

    const value = blocks[blockId]?.value
    if (!value) return

    const editedTime = value.last_edited_time || 0
    const blockType = value.type || 'unknown'
    const childIds = Array.isArray(value.content) ? value.content : []

    tokens.push(`${blockId}:${blockType}:${editedTime}:${childIds.length}`)
    childIds.forEach(childId => walk(childId))
  }

  rootContent.forEach(blockId => walk(blockId))
  return md5(tokens.join('|'))
}

/**
 * 首页布局
 * @param {*} props
 * @returns
 */
const Index = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutIndex' {...props} />
}

/**
 * SSG 获取数据
 * @returns
 */
export async function getStaticProps(req) {
  const { locale } = req
  const from = 'index'
  const props = await fetchGlobalAllData({ from, locale })
  const serverThemeConfig = {
    ...CLAUDE_CONFIG,
    ...(props?.NOTION_CONFIG || {})
  }
  const POST_PREVIEW_LINES = getServerConfigValue(
    'POST_PREVIEW_LINES',
    12,
    props?.NOTION_CONFIG || {}
  )
  const allPublishedPosts = (props.allPages || []).filter(
    page => page.type === 'Post' && page.status === 'Published'
  )
  props.posts = allPublishedPosts

  // 处理分页
  if (getServerConfigValue('POST_LIST_STYLE', 'page', props?.NOTION_CONFIG || {}) === 'scroll') {
    // 滚动列表默认给前端返回所有数据
  } else if (
    getServerConfigValue('POST_LIST_STYLE', 'page', props?.NOTION_CONFIG || {}) === 'page'
  ) {
    props.posts = props.posts?.slice(
      0,
      getServerConfigValue('POSTS_PER_PAGE', 12, props?.NOTION_CONFIG || {})
    )
  }

  // 预览文章内容
  if (getServerConfigValue('POST_LIST_PREVIEW', false, props?.NOTION_CONFIG || {})) {
    for (const i in props.posts) {
      const post = props.posts[i]
      if (post.password && post.password !== '') {
        continue
      }
      post.blockMap = await getPostBlocks(post.id, 'slug', POST_PREVIEW_LINES)
    }
  }

  // Contribution 持久化同步
  props.contributionEvents = []
  const contributionPersistEnabled = toBoolean(
    getServerConfigValue('CLAUDE_CONTRIBUTION_PERSIST_ENABLED', true, serverThemeConfig)
  )
  const contributionStoreAvailable = isContributionStoreEnabled()
  const contributionEventLimit = Math.max(
    1,
    Math.min(
      100000,
      Number(getServerConfigValue('CLAUDE_CONTRIBUTION_EVENT_LIMIT', 50000, serverThemeConfig)) ||
        50000
    )
  )

  if (contributionPersistEnabled && contributionStoreAvailable) {
    const isBuildRefresh =
      process.env.BUILD_MODE === 'true' ||
      process.env.EXPORT === 'true' ||
      process.env.npm_lifecycle_event === 'build' ||
      process.env.npm_lifecycle_event === 'export'
    const forceRefresh = toBoolean(process.env.CLAUDE_CONTRIBUTION_FORCE_REFRESH)
    const shouldRefreshDaily = shouldRefreshContributionDailyCache({
      forceRefresh,
      isBuild: isBuildRefresh
    })

    const latestMetaByRepo = new Map(
      allPublishedPosts.map(post => [
        normalizeId(post?.id),
        {
          title: post?.title || '',
          href: post?.href || '',
          slug: post?.slug || ''
        }
      ])
    )
    const hydrateLatestMeta = events => {
      return (Array.isArray(events) ? events : []).map(event => {
        const repoId = normalizeId(event?.repositoryId || event?.identifier || event?.postId)
        const latestMeta = latestMetaByRepo.get(repoId)
        return {
          ...event,
          title: event?.title || latestMeta?.title || '',
          slug: event?.slug || latestMeta?.slug || '',
          href:
            event?.href ||
            latestMeta?.href ||
            buildHrefFromSlug(event?.slug || latestMeta?.slug || '')
        }
      })
    }

    let localCacheUsed = false
    if (!shouldRefreshDaily) {
      const localCachedEvents = getContributionEventsFromLocalCache({
        limit: contributionEventLimit
      })
      if (localCachedEvents !== null) {
        props.contributionEvents = hydrateLatestMeta(localCachedEvents)
        localCacheUsed = true
        console.log(
          `[Contrib] 使用本地缓存: day=${new Date().toISOString().slice(0, 10)}, totalEvents=${localCachedEvents.length}`
        )
      }
    }

    if (!localCacheUsed || shouldRefreshDaily) {
      try {
        const contributionSourcePosts = allPublishedPosts?.filter(post => !isReadmePage(post)) || []
        const snapshots = contributionSourcePosts
          .map(post => buildContributionPostSnapshot(post))
          .filter(Boolean)

        const syncResult = await syncContributionSnapshots(snapshots)
        const persistedEvents = await listContributionEvents({ limit: contributionEventLimit })
        const dailyEvents = filterContributionEventsUntilYesterday(persistedEvents)
        setContributionEventsToLocalCache(dailyEvents)
        props.contributionEvents = hydrateLatestMeta(dailyEvents)

        console.log(
          `[Contrib] 刷新并写入本地缓存: build=${isBuildRefresh}, force=${forceRefresh}, scanned=${syncResult.scanned || 0}, newEvents=${syncResult.addedEvents || 0}, totalEvents=${dailyEvents.length}`
        )
      } catch (error) {
        const staleEvents = getContributionEventsFromLocalCache({
          limit: contributionEventLimit,
          allowStale: true
        })
        if (staleEvents) {
          props.contributionEvents = hydrateLatestMeta(staleEvents)
          console.warn(
            `[Contrib] 刷新失败，回退到本地旧缓存: ${error?.message || error}`
          )
        } else {
          console.warn(`[Contrib] 持久化同步失败，回退到前端即时计算: ${error?.message || error}`)
        }
      }
    }
  } else {
    console.log(
      `[Contrib] 持久化未启用: config=${contributionPersistEnabled}, store=${contributionStoreAvailable}`
    )
  }

  // 首页 Profile 卡片使用 readme 页面内容
  const readmePage = props.allPages?.find(isReadmePage)
  if (readmePage) {
    let excerpt = ''
    let readmeHtml = ''
    let readmeHtmlSource = 'github'
    const readmeCacheEnabled = toBoolean(
      getServerConfigValue('CLAUDE_README_CACHE_ENABLED', true, serverThemeConfig)
    )

    const readmeCacheKey = `readme_render_snapshot_v2_${normalizeId(readmePage.id)}_${locale || 'default'}`
    console.log(`[README] CLAUDE_README_CACHE_ENABLED=${readmeCacheEnabled}`)
    const cachedReadme = readmeCacheEnabled
      ? await getDataFromCache(readmeCacheKey, true)
      : null
    console.log(`[README] README 快照缓存: ${cachedReadme?.readmeHtml ? '命中' : '未命中/关闭'}`)

    if (!readmePage.password) {
      // 跟随 NotionNext 默认页面缓存机制：首次返回旧缓存，后续访问拿到新版本
      const readmeBlockMap = await getPostBlocks(readmePage.id, 'slug', 24)
      const bodyFingerprint = getReadmeBodyFingerprint(readmePage.id, readmeBlockMap)
      console.log(`[README] 正文指纹: ${bodyFingerprint || 'empty'}`)

      const canUseBodyCache =
        readmeCacheEnabled &&
        cachedReadme?.readmeHtml &&
        cachedReadme.bodyFingerprint &&
        cachedReadme.bodyFingerprint === bodyFingerprint

      if (canUseBodyCache) {
        console.log('[README] 正文未变化: 使用缓存（bodyFingerprint 命中）')
        excerpt = cachedReadme.excerpt || ''
        readmeHtml = cachedReadme.readmeHtml || ''
        readmeHtmlSource = cachedReadme.readmeHtmlSource || 'github'
      } else {
        console.log('[README] 正文有变化: 重新转换 Markdown 并调用渲染 API')
        const pageBlocks = Object.values(readmeBlockMap?.block || {})
        const currentPageBlock = pageBlocks.find(item => {
          const value = item?.value
          return value?.type === 'page' && normalizeId(value.id) === normalizeId(readmePage.id)
        })?.value

        const readmePageForExtract = {
          ...readmePage,
          content: currentPageBlock?.content || readmePage.content || []
        }

        excerpt = getPageContentText(readmePageForExtract, readmeBlockMap)
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 220)

        const readmeMarkdown = getReadmeMarkdown(readmePage.id, readmeBlockMap)
        const renderResult = readmeMarkdown
          ? await renderMarkdownToHtml(readmeMarkdown, {
              useCache: readmeCacheEnabled
            })
          : { html: '', source: 'github' }

        readmeHtml = renderResult.html
        readmeHtmlSource = renderResult.source

        if (readmeCacheEnabled) {
          await setDataToCache(readmeCacheKey, {
            bodyFingerprint,
            excerpt,
            readmeHtml,
            readmeHtmlSource
          })
        }
      }
    }

    props.readmePage = {
      id: readmePage.id,
      title: readmePage.title,
      href: readmePage.href,
      slug: readmePage.slug,
      type: readmePage.type,
      status: readmePage.status,
      summary: readmePage.summary || '',
      excerpt,
      readmeHtml,
      readmeHtmlSource // 'github' | 'local'，local 时需加载 highlight.js CSS
    }
  } else {
    props.readmePage = null
  }

  // 生成robotTxt
  generateRobotsTxt(props)
  // 生成Feed订阅
  generateRss(props)
  // 生成
  generateSitemapXml(props)
  // 检查数据是否需要从algolia删除
  checkDataFromAlgolia(props)
  if (getServerConfigValue('UUID_REDIRECT', false, props?.NOTION_CONFIG || {})) {
    // 生成重定向 JSON
    generateRedirectJson(props)
  }

  // 生成全文索引 - 仅在 yarn build 时执行 && process.env.npm_lifecycle_event === 'build'

  delete props.allPages

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : getServerConfigValue(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG || {}
        )
  }
}

export default Index
