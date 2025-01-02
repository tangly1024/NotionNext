import { NotionAPI } from 'notion-client'
import BLOG from '@/blog.config'

export default function getNotionAPI() {
  return new NotionAPI({
    activeUser: BLOG.NOTION_ACTIVE_USER || null,
    authToken: BLOG.NOTION_TOKEN_V2 || null,
    userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })
}
