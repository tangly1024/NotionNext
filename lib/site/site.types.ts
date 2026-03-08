export interface FetchSiteParams {
  pageId: string
  from?: string
  locale?: string
}

export interface SiteInfo {
  title: string
  description: string
  pageCover: string
  icon: string
  link: string
}

export type PageStatus = 'Published' | 'Invisible'
export type PageType = 'Post' | 'Page' | 'Notice' | 'Menu' | 'SubMenu'

export interface PageDate {
  start_date?: string
  start_time?: string
  end_date?: string
  end_time?: string
  time_zone?: string
  lastEditedDay?: string
}

export interface TagItem {
  name: string
}

export interface BasePage {
  id?: string
  title: string
  slug: string
  type: PageType
  status: PageStatus
  summary?: string
  category?: string
  tags?: string[]
  tagItems?: TagItem[]
  date?: PageDate
  publishDate?: number
  lastEditedDate?: number
  pageCoverThumbnail?: string
  pageIcon?: string
  href?: string
  ext?: Record<string, any>
}

export interface NavPage {
  id?: string
  title: string
  slug: string
  summary?: string
  category?: string
  tags?: string[]
  pageCoverThumbnail?: string
  pageIcon?: string
  href?: string
  publishDate?: number
  lastEditedDate?: number
  ext?: Record<string, any>
}

export interface MenuItem {
  name: string
  icon?: string | null
  href?: string
  target?: string
  show: boolean
  subMenus?: MenuItem[]
}

export interface SiteData {
  NOTION_CONFIG: Record<string, any>

  siteInfo: SiteInfo
  notice: BasePage | null

  allPages: BasePage[]
  allNavPages: NavPage[]
  latestPosts: BasePage[]

  categoryOptions: any[]
  tagOptions: any[]

  customNav: MenuItem[]
  customMenu: MenuItem[]

  postCount: number

  // 以下字段仅服务端使用
  block?: any
  schema?: any
  rawMetadata?: any
  pageIds?: string[]
}
