import axios from 'axios'

// 定义内容项的接口
interface ContentItem {
  type: string
  content: string
}

// 定义Notion块的接口
interface NotionBlock {
  object: string
  type: string
  [key: string]: unknown
}

// 发送 Notion API 请求
async function postNotion(
  properties: Record<string, unknown>,
  databaseId: string,
  listContentMain: ContentItem[],
  token: string
): Promise<{ status: number; data: Record<string, unknown> }> {
  const url = 'https://api.notion.com/v1/pages'

  const children = listContentMain
    .map((contentMain: ContentItem): NotionBlock | null => {
      if (contentMain.type === 'paragraph') {
        return {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              { type: 'text', text: { content: contentMain.content } }
            ]
          }
        }
      } else if (['file', 'image'].includes(contentMain.type)) {
        return {
          object: 'block',
          type: contentMain.type,
          [contentMain.type]: {
            type: 'external',
            external: { url: contentMain.content }
          }
        }
      }
      return null
    })
    .filter(Boolean)

  const payload = {
    parent: { database_id: databaseId },
    properties,
    children
  }

  const headers = {
    accept: 'application/json',
    'Notion-Version': '2022-06-28',
    'content-type': 'application/json',
    Authorization: `Bearer ${token}`
  }

  try {
    const response = await axios.post(url, payload, { headers })
    return response
  } catch (error) {
    console.error('写入Notion异常', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Error posting to Notion: ${errorMessage}`)
  }
}

// 定义响应结果的接口
interface NotionResponse {
  status: number
  data: Record<string, unknown>
}

// 处理响应结果
function responseResult(response: NotionResponse): void {
  if (response.status === 200) {
    console.log('成功...')
    console.log(response.data)
  } else {
    console.log('失败...')
    console.log(response.data)
  }
}

// 定义用户属性的接口
interface UserProperties {
  id: string
  avatar: string
  name: string
  mail: string
  lastLoginTime: string
  token: string
}

// 准备属性字段
function notionProperty(
  id: string,
  avatar: string,
  name: string,
  mail: string,
  lastLoginTime: string,
  token: string
): Record<string, unknown> {
  return {
    id: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: id,
            link: null
          }
        }
      ]
    },
    avatar: {
      files: [
        {
          name: 'Project Alpha blueprint',
          external: {
            url: avatar
          }
        }
      ]
    },
    name: {
      title: [
        {
          text: {
            content: name
          }
        }
      ]
    },
    mail: {
      email: mail
    },
    last_login_time: {
      date: {
        start: lastLoginTime
      }
    },
    token: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: token,
            link: null
          }
        }
      ]
    }
  }
}
