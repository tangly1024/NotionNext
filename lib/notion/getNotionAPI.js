import { NotionAPI as NotionLibrary } from 'notion-client'
import BLOG from '@/blog.config'

const notionAPI = getNotionAPI()

function getNotionAPI() {
  return new NotionLibrary({
    apiBaseUrl: BLOG.API_BASE_URL || 'https://www.notion.so/api/v3', // https://[xxxxx].notion.site/api/v3
    activeUser: BLOG.NOTION_ACTIVE_USER || null,
    authToken: BLOG.NOTION_TOKEN_V2 || null,
    userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    kyOptions: { 
      mode:'cors',
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
