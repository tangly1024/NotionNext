/**
 * 按ID兜底访问的工作区归属校验回归测试
 * 对应 Issue #4554 / PR #4555 维护者复审意见：
 * 1. 并发初始化：推导期间并发请求不能读到未完成的 null，失败不能永久缓存
 * 2. 语言前缀：`en:` 等前缀根页面 id 必须能正确推导工作区
 * 3. 多站点归属：逗号分隔的多个根页面可能属于不同工作区，都应放行
 */
jest.mock('@/blog.config', () => ({ NOTION_PAGE_ID: '' }))

jest.mock('@/lib/utils', () => ({
  checkStrIsNotionId: jest.fn(
    str => typeof str === 'string' && /^[a-zA-Z0-9]{32}$/.test(str)
  ),
  checkStrIsUuid: jest.fn(
    str =>
      typeof str === 'string' &&
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        str
      )
  )
}))

jest.mock('@/lib/utils/notion.util', () => ({
  adapterNotionBlockMap: jest.fn(raw => raw)
}))

/**
 * notion-utils 是 ESM 包，Jest 下 mock 掉；只用到 idToUuid
 */
jest.mock('notion-utils', () => ({
  idToUuid: hex => {
    const raw = String(hex).replace(/-/g, '')
    return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}-${raw.slice(20)}`
  }
}))

jest.mock('react-notion-x', () => ({}))

jest.mock('../../lib/utils/formatDate', () => jest.fn(source => String(source)))

jest.mock('../../lib/db/notion/getPostBlocks', () => ({
  fetchNotionPageBlocks: jest.fn(),
  formatNotionBlock: jest.fn(block => block)
}))

const WORKSPACE_A = 'a'.repeat(32)
const WORKSPACE_B = 'b'.repeat(32)

/** 构造一个 Notion recordMap，block 记录里带 space_id */
function buildRecordMap(pageHexId, spaceId) {
  const raw = String(pageHexId).replace(/-/g, '')
  const uuid = `${raw.slice(0, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}-${raw.slice(20)}`
  return {
    block: {
      [uuid]: {
        role: 'reader',
        value: {
          id: uuid,
          type: 'page',
          space_id: spaceId,
          created_time: 1700000000000,
          last_edited_time: 1700000000000,
          properties: { title: [['Test Page ' + raw.slice(0, 4)]] }
        }
      }
    }
  }
}

/**
 * 重置模块级缓存与 mock 后重新加载被测模块。
 * 模块级缓存（cachedBlogSpaceIds / inflight）只在模块实例里，所以每个用例都要 freshLoad。
 */
function freshLoad() {
  jest.resetModules()
  jest.resetAllMocks()
  delete process.env.NOTION_WORKSPACE_ID
  const BLOG = require('@/blog.config')
  const { fetchNotionPageBlocks } = require('../../lib/db/notion/getPostBlocks')
  const { fetchPageFromNotion } = require('../../lib/db/notion/getNotionPost')
  return { BLOG, fetchNotionPageBlocks, fetchPageFromNotion }
}

/**
 * 配置根页面与推导行为。
 * 第 1 个根页面 → WORKSPACE_A，第 2 个根页面 → WORKSPACE_B（模拟多站点分属不同工作区）。
 * 被按 ID 访问的页面（32 个 c）→ WORKSPACE_B。
 */
function setupNotion({ BLOG, fetchNotionPageBlocks, rootPageIds, rootError = false } = {}) {
  BLOG.NOTION_PAGE_ID = rootPageIds.join(',')
  const rootMaps = rootPageIds
    .map((hex, index) => buildRecordMap(hex, index === 0 ? WORKSPACE_A : WORKSPACE_B))
  fetchNotionPageBlocks.mockImplementation((id, from) => {
    if (from === 'blog-space-id') {
      if (rootError) {
        return Promise.reject(new Error('root fetch failed'))
      }
      return Promise.resolve(rootMaps.find(map => map.block[id]) || null)
    }
    return Promise.resolve(buildRecordMap(id, WORKSPACE_B))
  })
}

describe('按 ID 兜底访问的工作区归属校验', () => {
  test('拒绝非本站工作区的内容（返回 null 走 404）', async () => {
    const mod = freshLoad()
    // 根页面属于 WORKSPACE_A，被访问页面属于 WORKSPACE_B → 拒绝
    setupNotion({ BLOG: mod.BLOG, fetchNotionPageBlocks: mod.fetchNotionPageBlocks, rootPageIds: ['1'.repeat(32)] })
    await expect(mod.fetchPageFromNotion('c'.repeat(32))).resolves.toBeNull()
  })

  test('本站工作区的内容按 ID 访问正常放行', async () => {
    const mod = freshLoad()
    setupNotion({ BLOG: mod.BLOG, fetchNotionPageBlocks: mod.fetchNotionPageBlocks, rootPageIds: ['1'.repeat(32)] })
    // 页面 mock 成根页面同一工作区才能放行
    mod.fetchNotionPageBlocks.mockImplementation((id, from) => {
      if (from === 'blog-space-id') {
        return Promise.resolve(buildRecordMap('1'.repeat(32), WORKSPACE_A))
      }
      return Promise.resolve(buildRecordMap(id, WORKSPACE_A))
    })
    const result = await mod.fetchPageFromNotion('c'.repeat(32))
    expect(result).not.toBeNull()
    expect(result.id).not.toBeNull()
  })

  test('并发请求共享同一次工作区推导，不会把未完成的 null 当结果', async () => {
    const mod = freshLoad()
    setupNotion({ BLOG: mod.BLOG, fetchNotionPageBlocks: mod.fetchNotionPageBlocks, rootPageIds: ['1'.repeat(32)] })
    mod.fetchNotionPageBlocks.mockImplementation((id, from) => {
      if (from === 'blog-space-id') {
        return Promise.resolve(buildRecordMap('1'.repeat(32), WORKSPACE_A))
      }
      return Promise.resolve(buildRecordMap(id, WORKSPACE_A))
    })
    const pageId = 'c'.repeat(32)
    const [r1, r2] = await Promise.all([
      mod.fetchPageFromNotion(pageId),
      mod.fetchPageFromNotion(pageId)
    ])
    expect(r1).not.toBeNull()
    expect(r2).not.toBeNull()
    // 根页面只请求一次（共享进行中的 Promise）
    const rootCalls = mod.fetchNotionPageBlocks.mock.calls.filter(
      call => call[1] === 'blog-space-id'
    )
    expect(rootCalls).toHaveLength(1)
  })

  test('首次推导失败不永久缓存，下次调用会重试', async () => {
    const mod = freshLoad()
    setupNotion({
      BLOG: mod.BLOG,
      fetchNotionPageBlocks: mod.fetchNotionPageBlocks,
      rootPageIds: ['1'.repeat(32)],
      rootError: true
    })
    const pageId = 'c'.repeat(32)
    // 第一次：根页面失败 → 拒绝
    await expect(mod.fetchPageFromNotion(pageId)).resolves.toBeNull()
    // 第二次：恢复后应重试成功
    mod.fetchNotionPageBlocks.mockImplementation((id, from) => {
      if (from === 'blog-space-id') {
        return Promise.resolve(buildRecordMap('1'.repeat(32), WORKSPACE_A))
      }
      return Promise.resolve(buildRecordMap(id, WORKSPACE_A))
    })
    await expect(mod.fetchPageFromNotion(pageId)).resolves.not.toBeNull()
  })

  test('带语言前缀的根页面 id（en:xxx）能正确推导工作区', async () => {
    const mod = freshLoad()
    setupNotion({
      BLOG: mod.BLOG,
      fetchNotionPageBlocks: mod.fetchNotionPageBlocks,
      rootPageIds: ['en:' + '1'.repeat(32)]
    })
    mod.fetchNotionPageBlocks.mockImplementation((id, from) => {
      if (from === 'blog-space-id') {
        return Promise.resolve(buildRecordMap('1'.repeat(32), WORKSPACE_A))
      }
      return Promise.resolve(buildRecordMap(id, WORKSPACE_A))
    })
    await expect(mod.fetchPageFromNotion('c'.repeat(32))).resolves.not.toBeNull()
  })

  test('多站点分属不同工作区时都能放行', async () => {
    const mod = freshLoad()
    // 根页面1 → WORKSPACE_A，根页面2 → WORKSPACE_B；页面属于 WORKSPACE_B
    setupNotion({
      BLOG: mod.BLOG,
      fetchNotionPageBlocks: mod.fetchNotionPageBlocks,
      rootPageIds: ['1'.repeat(32), '2'.repeat(32)]
    })
    await expect(mod.fetchPageFromNotion('c'.repeat(32))).resolves.not.toBeNull()
  })

  test('配置 NOTION_WORKSPACE_ID 时直接使用环境变量，不再请求根页面', async () => {
    const mod = freshLoad()
    process.env.NOTION_WORKSPACE_ID = WORKSPACE_B
    setupNotion({ BLOG: mod.BLOG, fetchNotionPageBlocks: mod.fetchNotionPageBlocks, rootPageIds: ['1'.repeat(32)] })
    await expect(mod.fetchPageFromNotion('c'.repeat(32))).resolves.not.toBeNull()
    const rootCalls = mod.fetchNotionPageBlocks.mock.calls.filter(
      call => call[1] === 'blog-space-id'
    )
    expect(rootCalls).toHaveLength(0)
  })

  test('无法确认归属（根页面不可用）时宁可 404 也不放行', async () => {
    const mod = freshLoad()
    mod.BLOG.NOTION_PAGE_ID = 'zzz-not-an-id'
    mod.fetchNotionPageBlocks.mockResolvedValue(null)
    await expect(mod.fetchPageFromNotion('c'.repeat(32))).resolves.toBeNull()
  })

  test('运行时重试耗尽返回空数据时抛错，而不是覆盖现有 UUID 页面', async () => {
    const mod = freshLoad()
    mod.fetchNotionPageBlocks.mockResolvedValue(null)
    await expect(mod.fetchPageFromNotion('c'.repeat(32), {
      throwOnUnavailable: true
    })).rejects.toThrow('Notion page is temporarily unavailable')
    await expect(mod.fetchPageFromNotion('c'.repeat(32))).resolves.toBeNull()
  })

  test('运行时工作区暂不可用时抛错，恢复后可重试', async () => {
    const mod = freshLoad()
    setupNotion({
      BLOG: mod.BLOG,
      fetchNotionPageBlocks: mod.fetchNotionPageBlocks,
      rootPageIds: ['1'.repeat(32)],
      rootError: true
    })
    const pageId = 'c'.repeat(32)
    await expect(mod.fetchPageFromNotion(pageId, {
      throwOnUnavailable: true
    })).rejects.toThrow('Notion workspace is temporarily unavailable')
    mod.fetchNotionPageBlocks.mockImplementation(id => Promise.resolve(buildRecordMap(id, WORKSPACE_A)))
    await expect(mod.fetchPageFromNotion(pageId, {
      throwOnUnavailable: true
    })).resolves.not.toBeNull()
  })

  test('运行时确认属于其他工作区的页面仍返回不可访问', async () => {
    const mod = freshLoad()
    process.env.NOTION_WORKSPACE_ID = WORKSPACE_A
    mod.fetchNotionPageBlocks.mockResolvedValue(buildRecordMap('c'.repeat(32), WORKSPACE_B))
    await expect(mod.fetchPageFromNotion('c'.repeat(32), {
      throwOnUnavailable: true
    })).resolves.toBeNull()
  })

  test('多根页面仅部分推导成功时不会把另一站点子页当作外部页面，也不缓存部分结果', async () => {
    const mod = freshLoad()
    const rootA = '1'.repeat(32)
    const rootB = '2'.repeat(32)
    mod.BLOG.NOTION_PAGE_ID = `${rootA},${rootB}`
    mod.fetchNotionPageBlocks.mockImplementation((id, from) => {
      if (from === 'blog-space-id') {
        if (id.replaceAll('-', '') === rootB) return Promise.resolve(null)
        return Promise.resolve(buildRecordMap(id, WORKSPACE_A))
      }
      return Promise.resolve(buildRecordMap(id, WORKSPACE_B))
    })
    await expect(mod.fetchPageFromNotion('c'.repeat(32), {
      throwOnUnavailable: true
    })).rejects.toThrow('Notion workspace is temporarily unavailable')
    setupNotion({
      BLOG: mod.BLOG,
      fetchNotionPageBlocks: mod.fetchNotionPageBlocks,
      rootPageIds: [rootA, rootB]
    })
    await expect(mod.fetchPageFromNotion('c'.repeat(32), {
      throwOnUnavailable: true
    })).resolves.not.toBeNull()
  })
})
