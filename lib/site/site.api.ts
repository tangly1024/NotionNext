import type {
  SiteData,
  FetchSiteParams,
  NavPage
} from './site.types.js'

/**
 * 获取整个站点数据
 * 等价于：GET /site
 */
export interface SiteAPI {
  fetchSite(params: FetchSiteParams): Promise<SiteData>

  /**
   * 获取导航用文章列表
   * 等价于：GET /nav-pages
   */
  getNavPages(allPages: SiteData['allPages']): NavPage[]
}
