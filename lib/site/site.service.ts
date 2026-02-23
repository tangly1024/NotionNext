import { fetchSiteFromNotion } from '@/lib/site/adapters/notion/notion.adapter'
import { handleDataBeforeReturn } from '@/lib/site/processors/page.processor'
import { EmptyData } from '@/lib/site/processors/empty.processor'
import type { FetchSiteParams, SiteData } from './site.types'

export async function fetchSite(
    params: FetchSiteParams
): Promise<SiteData> {
    const { pageId } = params
    if (!pageId) return EmptyData(pageId)

    try {
        const siteData = await fetchSiteFromNotion(params)
        return handleDataBeforeReturn(siteData)
    } catch (e) {
        console.error('[site] fetch failed', e)
        return EmptyData(pageId)
    }
}
