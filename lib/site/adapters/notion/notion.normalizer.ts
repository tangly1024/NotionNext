import { idToUuid } from 'notion-utils'
import type { SiteData } from '../../site.types'

export function normalizeNotionSite(
  recordMap: any,
  sitePageId: string,
  from?: string
): SiteData {
  sitePageId = idToUuid(sitePageId)

  // ⬇️ 原 convertNotionToSiteData 内容迁到这里
  // normalize metadata / collection / schema / pages
  // return SiteData（未清洗版）

  return {
    NOTION_CONFIG: {},
    siteInfo: {} as any,
    notice: null,
    allPages: [],
    allNavPages: [],
    latestPosts: [],
    categoryOptions: [],
    tagOptions: [],
    customNav: [],
    customMenu: [],
    postCount: 0,
    block: recordMap?.block,
    schema: {},
    rawMetadata: {}
  }
}
