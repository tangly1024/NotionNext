import { NotionAPI as NotionLibrary } from 'notion-client'
import BLOG from '@/blog.config'

const notionAPI = getNotionAPI()

function getNotionAPI() {
const notionAPI = new NotionAPI({
  activeUser: process.env.NOTION_ACTIVE_USER,
  authToken: process.env.NOTION_TOKEN_V2,
  kyOptions: {
    hooks: {
      beforeRequest: [
        (request, options) => {
          const url = request.url.toString();

          if (url.includes('/api/v3/syncRecordValues')) {
            return new Request(
              url.replace('/api/v3/syncRecordValues', '/api/v3/syncRecordValuesMain'),
              options,
            );
          }

          return request;
        },
      ],
    },
  },
});
}

export default notionAPI
