import {
  getDataFromCache,
  getOrSetDataWithCache,
  setDataToCache

} from '@/lib/cache/cache_manager'
import { deepClone, delay } from '../../utils'
import notionAPI from '@/lib/db/notion/getNotionAPI'
import { getBlockValue } from 'notion-utils'
import pLimit from 'p-limit'
import { normalizeNotionBlockType } from '@/lib/utils/notion.util'
import { normalizeExternalMediaBlock } from '@/lib/db/notion/normalizeExternalMediaBlock'
import { convertFileCdnUrl } from '@/lib/db/notion/convertFileCdnUrl'

// ⚠️ 全局限流器（非常关键）
const limit = pLimit(15)

// ⚠️ 每个请求之间的间隔（防 burst）
const REQUEST_INTERVAL = 50 // ms
const HTML_ARTIFACT_MAX_BYTES = 512 * 1024
const NOTION_TABS_BLOCK_TYPES = new Set(['tab', 'tabs'])
// 需检测过期签名的block类型（image块除外：其URL由 mapImgUrl 还原为 attachment: 稳定标识）
const FILE_BLOCK_TYPES = ['pdf', 'audio', 'video', 'file', 'page']

/**
 * 获取文章内容块
 * @param {string} id
 * @param {*} from
 */
export function normalizePageBlockCacheVersion(cacheVersion) {
  if (cacheVersion == null || cacheVersion === '') {
    return ''
  }

  if (cacheVersion instanceof Date) {
    const time = cacheVersion.getTime()
    return Number.isFinite(time) ? String(time) : ''
  }

  if (typeof cacheVersion === 'number') {
    return Number.isFinite(cacheVersion) ? String(cacheVersion) : ''
  }

  const raw = String(cacheVersion).trim()
  if (!raw) {
    return ''
  }

  const parsed = Date.parse(raw)
  if (Number.isFinite(parsed)) {
    return String(parsed)
  }

  return raw.replace(/[^a-z0-9_.:-]/gi, '_')
}

export function getPageBlockCacheKey(id, cacheVersion) {
  const normalizedVersion = normalizePageBlockCacheVersion(cacheVersion)
  return normalizedVersion
    ? `page_block_${id}_${normalizedVersion}`
    : `page_block_${id}`
}

/**
 * @param {string} id
 * @param {string | undefined} from
 * @param {{ cacheVersion?: string | number | Date }} options
 */
export async function fetchNotionPageBlocks(id, from = undefined, options = {}) {
  const cacheKey = getPageBlockCacheKey(id, options?.cacheVersion)

  const pageBlock = await getOrSetDataWithCache(
    cacheKey,
    () => limit(() => getPageWithRetry(id, from, 3, cacheKey))
  )

  if (!pageBlock) {
    console.warn('[getPage] empty pageBlock:', id)
    return null
  }

  if (hasExpiredSignedUrls(pageBlock)) {
    await refreshSignedUrls(pageBlock, cacheKey)
  }
  preferStablePdfSignedUrls(pageBlock)

  return pageBlock
}

export function hasExpiredSignedUrls(recordMap, bufferMs = 10 * 60 * 1000) {
  const now = Date.now()
  const isExpiring = url => {
    if (typeof url !== 'string') return false
    try {
      const expires = Number(new URL(url).searchParams.get('expirationTimestamp'))
      return Number.isFinite(expires) && expires <= now + bufferMs
    } catch {
      return false
    }
  }

  // 检测notion-client / refreshSignedUrls 写入 recordMap.signed_urls 的签名URL
  if (Object.values(recordMap?.signed_urls || {}).some(url => isExpiring(url))) {
    return true
  }

  // 新API下签名直链可能内嵌于 block 的 source/page_cover 而非 signed_urls，
  //    不检测则过期后永不触发续签
  return Object.values(recordMap?.block || {}).some(entry => {
    const block = getBlockValue(entry)
    if (!block || !FILE_BLOCK_TYPES.includes(block.type)) {
      return false
    }
    const source =
      block.type === 'page'
        ? block.format?.page_cover
        : block.properties?.source?.[0]?.[0] || block.file?.url
    return isExpiring(source)
  })
}

async function refreshSignedUrls(recordMap, cacheKey) {
  const files = getNotionFileInstances(recordMap)
  if (!files.length) return

  try {
    const { signedUrls } = await notionAPI.getSignedFileUrls(files)
    if (!signedUrls?.length) return

    recordMap.signed_urls = recordMap.signed_urls || {}
    files.forEach((file, index) => {
      const signedUrl = signedUrls[index]
      if (!signedUrl) return
      const { id } = file.permissionRecord
      recordMap.signed_urls[id] = signedUrl

      // source 为 file.notion.* 签名直链时同步写回新签名，避免每次渲染重复续签
      const block = getBlockValue(recordMap?.block?.[id])
      const current =
        block?.type === 'page'
          ? block?.format?.page_cover
          : block?.properties?.source?.[0]?.[0]
      if (
        typeof current === 'string' &&
        /^https?:\/\/file\.notion\.(?:com|so)\//.test(current)
      ) {
        if (block.type === 'page') {
          if (block.format) block.format.page_cover = signedUrl
        } else if (block.properties?.source?.[0]) {
          block.properties.source[0][0] = signedUrl
        }
      }
    })
    await setDataToCache(cacheKey, recordMap, null)
  } catch (err) {
    console.warn('[Notion signed URLs] refresh failed:', err)
  }
}

function getNotionFileInstances(recordMap) {
  return Object.values(recordMap?.block || {}).flatMap(entry => {
    const block = getBlockValue(entry)
    if (!block || !['pdf', 'audio', 'image', 'video', 'file', 'page'].includes(block.type)) {
      return []
    }

    const source =
      block.type === 'page'
        ? block.format?.page_cover
        : block.properties?.source?.[0]?.[0]
    const url = getNotionFileSource(source)

    return url
      ? [{
          permissionRecord: {
            table: 'block',
            id: block.id
          },
          url
        }]
      : []
  })
}

function getNotionFileSource(source) {
  if (!source) return null

  if (source.includes('notion.so/signed/')) {
    try {
      return decodeURIComponent(new URL(source).pathname.replace(/^\/signed\//, ''))
    } catch {
      return source
    }
  }

  // 新CDN签名直链先还原为 attachment: 再请求续签
  const attachmentUrl = convertFileCdnUrl(source)
  if (attachmentUrl) return attachmentUrl

  return (
    isNotionHostedFileUrl(source) ||
    source.includes('attachment:')
  )
    ? source
    : null
}

function isNotionHostedFileUrl(source) {
  try {
    const hostname = new URL(source).hostname
    return (
      hostname === 'secure.notion-static.com' ||
      // 【新增】新CDN签名直链域名，纳入续签范围（getSignedFileUrls 可为其签发新签名）
      hostname === 'file.notion.com' ||
      hostname === 'file.notion.so' ||
      /^prod-files-secure(?:-[a-z0-9]+)?\.s3[.-]/.test(hostname)
    )
  } catch {
    return false
  }
}

export function preferStablePdfSignedUrls(recordMap) {
  Object.values(recordMap?.block || {}).forEach(entry => {
    const block = getBlockValue(entry)
    const source = block?.properties?.source?.[0]?.[0]
    if (block?.type !== 'pdf' || !source) return

    recordMap.signed_urls = recordMap.signed_urls || {}
    recordMap.signed_urls[block.id] = source.includes('notion.so/signed/')
      ? source
      : `https://notion.so/signed/${encodeURIComponent(source)}?table=block&id=${block.id}`
  })
}

/**
 * 调用接口，失败会重试
 * @param {*} id
 * @param {*} retryAttempts
 */
export async function getPageWithRetry(
  id,
  from,
  retryAttempts = 3,
  cacheKey = getPageBlockCacheKey(id)
) {
  if (!retryAttempts || retryAttempts <= 0) {
    console.error('[请求失败]:', `from:${from}`, `id:${id}`)
    return null
  }

  console.log(
    '[API-->>请求]',
    `from:${from}`,
    `id:${id}`,
    retryAttempts < 3 ? `剩余重试次数:${retryAttempts}` : ''
  )

  try {
    const start = Date.now()
    const pageData = await notionAPI.getPage(id)
    await addHtmlArtifactSignedUrls(pageData)
    const end = Date.now()
    console.log('[API<<--响应]', `耗时:${end - start}ms - from:${from}`)
    return pageData
  } catch (e) {
    console.warn('[API<<--异常]:', e)

    // 不再全局延迟 1000ms，而是通过 limit 控制并发
    const pageBlock = await getDataFromCache(cacheKey)
    if (pageBlock) {
      return pageBlock
    }

    return getPageWithRetry(id, from, retryAttempts - 1, cacheKey)
  }
}

async function addHtmlArtifactSignedUrls(recordMap) {
  if (!recordMap?.block) return

  const files = Object.values(recordMap.block)
    .map(getBlockValue)
    .filter(block => {
      const source = block?.properties?.source?.[0]?.[0]
      return (
        block?.type === 'embed' &&
        block?.format?.embed_variant === 'html_artifact' &&
        source?.includes('attachment:') &&
        !recordMap.signed_urls?.[block.id]
      )
    })
    .map(block => ({
      block,
      permissionRecord: {
        table: 'block',
        id: block.id
      },
      url: block.properties.source[0][0]
    }))

  if (!files.length) return

  try {
    const { signedUrls } = await notionAPI.getSignedFileUrls(
      files.map(({ block, ...file }) => file)
    )
    if (!signedUrls?.length) return

    recordMap.signed_urls = recordMap.signed_urls || {}
    await Promise.all(files.map(async (file, index) => {
      const signedUrl = signedUrls[index]
      if (!signedUrl) return

      recordMap.signed_urls[file.permissionRecord.id] = signedUrl
      const html = await fetchHtmlArtifactContent(signedUrl)
      if (html) {
        file.block.format = file.block.format || {}
        file.block.format.html_artifact_content = html
      }
    }))
  } catch (err) {
    console.warn('[Notion HTML artifact] getSignedFileUrls failed:', err)
  }
}

async function fetchHtmlArtifactContent(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) return null

    const length = Number(response.headers.get('content-length'))
    if (Number.isFinite(length) && length > HTML_ARTIFACT_MAX_BYTES) {
      console.warn('[Notion HTML artifact] skipped large file:', length)
      return null
    }

    const html = await response.text()
    return html.length <= HTML_ARTIFACT_MAX_BYTES ? html : null
  } catch (err) {
    console.warn('[Notion HTML artifact] fetch failed:', err)
    return null
  }
}

/**
 * Notion页面BLOCK格式化处理
 * 1.删除冗余字段
 * 2.比如文件、视频、音频、url格式化
 * 3.代码块等元素兼容
 * @param {*} id 页面ID
 * @param {*} blockMap 页面元素
 * @param {*} slice 截取数量
 * @returns
 */
export function formatNotionBlock(block) {
  const clonedBlock = deepClone(block)
  const blocksToProcess = Object.keys(clonedBlock || {})

  for (let i = 0; i < blocksToProcess.length;) {
    const blockId = blocksToProcess[i]
    let b = clonedBlock[blockId]

    // ✅ 【新增】统一结构：兼容新版双层嵌套格式
    // 新格式: { spaceId, value: { value: { id, type }, role } }
    // 次格式: { value: { id, type }, role }
    // 旧格式: { value: { id, type } }
    if (b?.value?.value?.id) {
      // 新格式，剥掉外层，只保留真实 block value
      clonedBlock[blockId] = { value: b.value.value }
      b = clonedBlock[blockId]
    } else if (!b?.value?.id && b?.value?.role !== undefined) {
      // role:none 等无权限 block，直接跳过
      i++
      continue
    }

    // ✅ 【新增】清理 crdt 字段，react-notion-x 不认识会报 Unsupported block type
    if (b?.value) {
      delete b.value.crdt_data
      delete b.value.crdt_format_version
      b.value.type = normalizeNotionBlockType(b.value.type)
      normalizeNotionTabsBlock(b.value)
    }

    // 原有逻辑不变 ↓↓↓

    sanitizeBlockUrls(b?.value)
    normalizeExternalMediaBlock(b?.value)
    normalizeCalloutBlock(b?.value)

    if (b?.value?.type === 'sync_block') {
      const childBlockIds = []

      // Case 1: inline children (original format)
      if (Array.isArray(b.value.children) && b.value.children.length > 0) {
        b.value.children.forEach((childBlock, index) => {
          const newBlockId = `${blockId}_child_${index}`
          clonedBlock[newBlockId] = childBlock
          reparentBlock(clonedBlock[newBlockId], newBlockId, b.value.parent_id)
          childBlockIds.push(newBlockId)
        })
        replaceContentReference(clonedBlock, blockId, childBlockIds)
        delete clonedBlock[blockId]
        blocksToProcess.splice(i, 1, ...childBlockIds)
        continue
      }

      // Case 2: content array with child block IDs (some Notion API responses)
      if (Array.isArray(b.value.content) && b.value.content.length > 0) {
        b.value.content.forEach((childId, index) => {
          const childBlock = clonedBlock[childId]
          if (childBlock) {
            const newBlockId = `${blockId}_child_${index}`
            clonedBlock[newBlockId] = childBlock
            reparentBlock(clonedBlock[newBlockId], newBlockId, b.value.parent_id)
            childBlockIds.push(newBlockId)
            delete clonedBlock[childId]
          }
        })
        if (childBlockIds.length > 0) {
          replaceContentReference(clonedBlock, blockId, childBlockIds)
          delete clonedBlock[blockId]
          blocksToProcess.splice(i, 1, ...childBlockIds)
          continue
        }
      }

      // Case 3: no children or content — pass through to react-notion-x
    }

    if (b?.value?.type === 'code') {
      if (b?.value?.properties?.language?.[0][0] === 'C++') {
        b.value.properties.language[0][0] = 'cpp'
      }
      if (b?.value?.properties?.language?.[0][0] === 'C#') {
        b.value.properties.language[0][0] = 'csharp'
      }
      if (b?.value?.properties?.language?.[0][0] === 'Assembly') {
        b.value.properties.language[0][0] = 'asm6502'
      }
    }

    if (
      ['file', 'pdf', 'video', 'audio'].includes(b?.value?.type) &&
      b?.value?.properties?.source?.[0][0] &&
      (b?.value?.properties?.source?.[0][0]?.startsWith('attachment') ||
        isNotionHostedFileUrl(b?.value?.properties?.source?.[0][0]) ||
        b?.value?.properties?.source?.[0][0].indexOf('amazonaws.com') > 0)
    ) {
      const oldUrl = b?.value?.properties?.source?.[0][0]
      const newUrl = `https://notion.so/signed/${encodeURIComponent(oldUrl)}?table=block&id=${b?.value?.id}`
      b.value.properties.source[0][0] = newUrl
    }

    i++
  }

  return clonedBlock
}

function normalizeCalloutBlock(blockValue) {
  if (blockValue?.type !== 'callout') return

  const callout = blockValue.callout
  if (!callout || typeof callout !== 'object') return

  blockValue.format = blockValue.format || {}

  if (callout.color && !blockValue.format.block_color) {
    blockValue.format.block_color = callout.color
  }

  if (!blockValue.properties?.title && Array.isArray(callout.rich_text)) {
    blockValue.properties = blockValue.properties || {}
    blockValue.properties.title = normalizeRichText(callout.rich_text)
  }

  const icon = normalizeCalloutIcon(callout.icon)
  if (icon === null) {
    delete blockValue.format.page_icon
    blockValue.format.callout_no_icon = true
  } else if (icon) {
    blockValue.format.page_icon = icon
    delete blockValue.format.callout_no_icon
  }
}

function normalizeCalloutIcon(icon) {
  if (icon === null) return null
  if (!icon || typeof icon !== 'object') return undefined

  if (icon.type === 'emoji') return icon.emoji || null
  if (icon.type === 'external') return icon.external?.url || null
  if (icon.type === 'file') return icon.file?.url || null
  if (icon.type === 'custom_emoji') return icon.custom_emoji?.url || null
  if (icon.type === 'native_icon') return icon.native_icon?.name || null

  return undefined
}

function normalizeRichText(richText) {
  return richText
    .map(item => {
      const text = item?.plain_text ?? item?.text?.content ?? ''
      if (!text) return null

      const formats = []
      const annotations = item.annotations || {}
      if (annotations.bold) formats.push(['b'])
      if (annotations.italic) formats.push(['i'])
      if (annotations.strikethrough) formats.push(['s'])
      if (annotations.code) formats.push(['c'])
      if (item.href) formats.push(['a', item.href])

      return formats.length ? [text, formats] : [text]
    })
    .filter(Boolean)
}

function replaceContentReference(blockMap, oldId, newIds) {
  Object.values(blockMap || {}).forEach(entry => {
    const block = entry?.value || entry
    if (!Array.isArray(block?.content)) return
    block.content = block.content.flatMap(id => id === oldId ? newIds : [id])
  })
}

function reparentBlock(entry, id, parentId) {
  const block = entry?.value || entry
  if (!block) return
  block.id = id
  if (parentId) block.parent_id = parentId
}

function normalizeNotionTabsBlock(block) {
  if (!block || !NOTION_TABS_BLOCK_TYPES.has(block.type)) return

  block.format = {
    ...block.format,
    embed_variant: 'notion_tabs',
    notion_next_original_type: block.type
  }
  block.type = 'embed'
}

/**
 * 根据[]ids，批量抓取blocks
 * 在获取数据库文章列表时，超过一定数量的block会被丢弃，因此根据pageId批量抓取block
 * @param {*} ids
 * @param {*} batchSize
 * @returns
 */
export const fetchInBatches = async (ids, batchSize = 30) => {
  if (!Array.isArray(ids)) {
    ids = [ids]
  }

  let fetchedBlocks = {}

  if(ids.length === 0) {
    return fetchedBlocks
  }
  
  console.log('[Batch] START total ids:', ids.length)

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize)

    console.log(`\n[Batch] processing ${i} ~ ${i + batch.length}`)

    try {
      const result = await limit(async () => {
        // 👉 控制节奏（避免突发）
        await delay(REQUEST_INTERVAL)

        console.log('[API-->>批量请求]', batch.length)

        const start = Date.now()

        const pageChunk = await notionAPI.getBlocks(batch)

        const end = Date.now()

        const blocks = pageChunk?.recordMap?.block || {}

        console.log(
          `[API<<--批量响应] size:${batch.length} 耗时:${end - start}ms blocks:${Object.keys(blocks).length}`
        )

        return blocks
      })

      // ✅ 合并结果
      fetchedBlocks = {
        ...fetchedBlocks,
        ...result
      }

    } catch (err) {
      console.warn('[Batch API异常]', err.message)
    }
  }

  return fetchedBlocks
}

/**
 * 强制修复 block 中所有可能的非法 URL 字段
 * @param {Object} blockValue - block.value
 */
function sanitizeBlockUrls(blockValue) {
  if (!blockValue || typeof blockValue !== 'object') return

  const fixUrl = (url) => {
    if (typeof url !== 'string') return url

    if (
      blockValue.type === 'embed' &&
      blockValue.format?.embed_variant === 'html_artifact' &&
      url.startsWith('attachment:')
    ) {
      return url
    }

    if (url.startsWith('/')) {
      return url
    }

    // 修复 http:xxx → http://xxx
    if (url.startsWith('http:') && !url.startsWith('http://')) {
      url = 'http://' + url.slice(5)
    } else if (url.startsWith('https:') && !url.startsWith('https://')) {
      url = 'https://' + url.slice(6)
    }

    // 再次验证是否合法，否则替换为占位图
    try {
      new URL(url)
      return url
    } catch {
      console.warn('[Sanitize URL] Invalid URL replaced:', url)
      return 'https://via.placeholder.com/1x1?text=Invalid+Image'
    }
  }

  // 1. 处理 properties.source（用于 image, embed, bookmark, file, pdf 等）
  if (
    blockValue.properties?.source?.[0]?.[0] &&
    typeof blockValue.properties.source[0][0] === 'string'
  ) {
    blockValue.properties.source[0][0] = fixUrl(blockValue.properties.source[0][0])
  }

  // 2. 处理 file.url（用于 file block）
  if (blockValue.file?.url && typeof blockValue.file.url === 'string') {
    blockValue.file.url = fixUrl(blockValue.file.url)
  }

  // 3. 处理 format.page_cover（页面封面）
  if (blockValue.format?.page_cover && typeof blockValue.format.page_cover === 'string') {
    blockValue.format.page_cover = fixUrl(blockValue.format.page_cover)
  }

  // 4. 处理其他可能的 URL 字段（可选扩展）
  // 例如：video、audio 的 source 可能也走 properties.source，已覆盖
}
