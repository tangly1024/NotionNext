import { fetchNotionRecordMap } from './notion.fetcher'
import { normalizeNotionSite } from './notion.normalizer'
import type { FetchSiteParams, SiteData } from '../../site.types'

export async function fetchSiteFromNotion(
  params: FetchSiteParams
): Promise<SiteData> {
  const recordMap = await fetchNotionRecordMap(params.pageId, params.from)
  return normalizeNotionSite(recordMap, params.pageId, params.from)
}
