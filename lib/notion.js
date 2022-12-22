import { NotionAPI } from 'notion-client'
export { getAllTags } from './notion/getAllTags'
export { getPostBlocks } from './notion/getPostBlocks'

export const notion = new NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL
})

export async function search(params) {
  return notion.search(params)
}
