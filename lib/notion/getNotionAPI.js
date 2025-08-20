import { NotionAPI as NotionLibrary } from 'notion-client'
import BLOG from '@/blog.config'

const notionAPI = getNotionAPI()

function getNotionAPI() {
  return new NotionLibrary({
    activeUser: BLOG.NOTION_ACTIVE_USER || null,
    authToken: BLOG.NOTION_TOKEN_V2 || null,
    userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    kyOptions: { 
      // 全局 Ky 配置
      hooks: {
        beforeRequest: [
          (request) => {
            const url = request.url.toString()
            if (url.includes('/api/v3/syncRecordValues')) {
              return new Request(
                url.replace('/api/v3/syncRecordValues', '/api/v3/syncRecordValuesMain'),
                request
              )
            }
            return request
          }
        ]
      }
    }
  })
}

export default notionAPI
