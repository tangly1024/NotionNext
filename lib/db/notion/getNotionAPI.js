import { NotionAPI as NotionLibrary } from 'notion-client'
import BLOG from '@/blog.config'
import path from 'path'
import { RateLimiter } from './RateLimiter'

// 限流配置，打包编译阶段避免接口频繁，限制频率
const useRateLimiter = process.env.BUILD_MODE || process.env.EXPORT
const lockFilePath = path.resolve(process.cwd(), '.notion-api-lock')
const rateLimiter = new RateLimiter(200, lockFilePath)
const syncRecordEndpointMode = BLOG.NOTION_SYNC_RECORD_ENDPOINT_MODE || 'auto'
const notionApiBaseUrl =
  (BLOG.API_BASE_URL || 'https://www.notion.so/api/v3').trim()

const globalStore = { notion: null, inflight: new Map() }

async function fetchWithSyncRecordFallback(input, init) {
  const request = new Request(input, init)
  const requestUrl = request.url.toString()
  const isLegacyEndpoint = requestUrl.includes('/api/v3/syncRecordValues')
  const isMainEndpoint = requestUrl.includes('/api/v3/syncRecordValuesMain')

  if (!isLegacyEndpoint && !isMainEndpoint) {
    return fetch(request)
  }

  const mainUrl = requestUrl.replace(
    '/api/v3/syncRecordValues',
    '/api/v3/syncRecordValuesMain'
  )
  const legacyUrl = requestUrl.replace(
    '/api/v3/syncRecordValuesMain',
    '/api/v3/syncRecordValues'
  )

  const tryRequest = (url) => fetch(new Request(url, request.clone()))

  if (syncRecordEndpointMode === 'main') {
    return tryRequest(mainUrl)
  }

  if (syncRecordEndpointMode === 'legacy') {
    return tryRequest(legacyUrl)
  }

  // auto 模式下默认优先 main；若 404 则回退到 legacy
  const mainResponse = await tryRequest(mainUrl)
  if (mainResponse.status !== 404) {
    return mainResponse
  }

  return tryRequest(legacyUrl)
}

function getRawNotion() {
  if (!globalStore.notion) {
    globalStore.notion = new NotionLibrary({
      apiBaseUrl: notionApiBaseUrl,
      activeUser: BLOG.NOTION_ACTIVE_USER || null,
      authToken: BLOG.NOTION_TOKEN_V2 || null,
      userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      kyOptions: {
        mode: 'cors',
        fetch: fetchWithSyncRecordFallback
      }
    })
  }
  return globalStore.notion
}

function callNotion(methodName, ...args) {
  const notion = getRawNotion()
  const original = notion[methodName]
  if (typeof original !== 'function') throw new Error(`${methodName} is not a function`)

  const key = `${methodName}-${JSON.stringify(args)}`

  if (globalStore.inflight.has(key)) return globalStore.inflight.get(key)

  const execute = () => original.apply(notion, args)
  const promise = useRateLimiter
    ? rateLimiter.enqueue(key, execute)
    : execute()

  globalStore.inflight.set(key, promise)
  promise.finally(() => globalStore.inflight.delete(key))
  return promise
}

export const notionAPI = {
  getPage: (...args) => callNotion('getPage', ...args),
  getBlocks: (...args) => callNotion('getBlocks', ...args),
  getUsers: (...args) => callNotion('getUsers', ...args),
  __call: callNotion
}

export default notionAPI
