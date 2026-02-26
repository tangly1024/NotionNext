/**
 * 全局类型定义
 */

// 基础类型
export type ID = string | number
export type Timestamp = string | number | Date

// 通用响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: number
}

// 分页类型
export interface PaginationParams {
  page: number
  pageSize: number
  total?: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationParams
}

// Notion 相关类型
export interface NotionPage {
  id: string
  title: string
  slug: string
  status: 'Published' | 'Draft' | 'Archived'
  type: 'Post' | 'Page' | 'Menu'
  category?: string
  tags?: string[]
  summary?: string
  date: Timestamp
  lastEditedTime: Timestamp
  cover?: string
  icon?: string
  password?: string
  content?: any[]
}

export interface NotionPost extends NotionPage {
  type: 'Post'
  category: string
  tags: string[]
  wordCount?: number
  readTime?: number
}

export interface NotionCategory {
  name: string
  count: number
  color?: string
}

export interface NotionTag {
  name: string
  count: number
  color?: string
}

// 站点配置类型
export interface SiteConfig {
  title: string
  description: string
  author: string
  lang: string
  theme: string
  domain: string
  path: string
  since: number
  analytics?: {
    provider: string
    config: Record<string, any>
  }
  comment?: {
    provider: string
    config: Record<string, any>
  }
  search?: {
    provider: string
    config: Record<string, any>
  }
}

// 主题配置类型
export interface ThemeConfig {
  name: string
  version: string
  description?: string
  author?: string
  preview?: string
  config?: Record<string, any>
}

// 用户类型
export interface User {
  id: ID
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'editor' | 'viewer'
  createdAt: Timestamp
  updatedAt: Timestamp
}

// 评论类型
export interface Comment {
  id: ID
  postId: ID
  parentId?: ID
  author: {
    name: string
    email: string
    avatar?: string
    website?: string
  }
  content: string
  status: 'approved' | 'pending' | 'spam' | 'trash'
  createdAt: Timestamp
  updatedAt: Timestamp
  replies?: Comment[]
}

// 搜索类型
export interface SearchResult {
  id: ID
  title: string
  summary: string
  url: string
  type: 'post' | 'page'
  category?: string
  tags?: string[]
  date: Timestamp
  score?: number
}

export interface SearchParams {
  keyword: string
  category?: string
  tag?: string
  type?: 'post' | 'page'
  dateRange?: {
    start: Timestamp
    end: Timestamp
  }
}

// 组件 Props 类型
export interface BaseComponentProps {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export interface LazyImageProps extends BaseComponentProps {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  priority?: boolean
  placeholder?: string
  onLoad?: () => void
  onClick?: () => void
}

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

// 性能监控类型
export interface WebVitalsMetric {
  name: 'FCP' | 'LCP' | 'FID' | 'CLS' | 'TTFB'
  value: number
  id: string
  delta: number
  entries: PerformanceEntry[]
}

export interface PerformanceBudget {
  FCP: number
  LCP: number
  FID: number
  CLS: number
}

// 错误类型
export interface ErrorInfo {
  message: string
  type: string
  statusCode: number
  stack?: string
  context?: string
  timestamp: string
  userAgent?: string
  url?: string
}

// 缓存类型
export interface CacheOptions {
  ttl?: number
  key?: string
  tags?: string[]
}

// 工具类型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// 环境变量类型
export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test'
  NEXT_PUBLIC_THEME: string
  NEXT_PUBLIC_LANG: string
  NOTION_PAGE_ID: string
  REDIS_URL?: string
  VERCEL_ENV?: string
  ANALYZE?: string
}

// 导出所有类型
// export * from './blog'
// export * from './notion'
// export * from './theme'
