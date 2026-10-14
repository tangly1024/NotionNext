import BLOG from '@/blog.config'
import { createHash } from 'crypto'

export const cacheNamespace = `notionnext:${createHash('sha256')
  .update(String(BLOG.NOTION_PAGE_ID || 'default'))
  .digest('hex')
  .slice(0, 20)}`
export const dataCachePrefix = `${cacheNamespace}:data:`
