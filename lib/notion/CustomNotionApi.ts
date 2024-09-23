const axios = require('axios')

// 发送 Notion API 请求
async function postNotion(
  properties: any,
  databaseId: string,
  listContentMain: any[],
  token: string
) {
  const url = 'https://api.notion.com/v1/pages'

  const children = listContentMain
    .map(contentMain => {
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
  } catch (error: any) {
    console.error('写入Notion异常', error)
    throw new Error(`Error posting to Notion: ${error.message}`)
  }
}

// 处理响应结果
function responseResult(response: { status: number; data: any }) {
  if (response.status === 200) {
    console.log('成功...')
    console.log(response.data)
  } else {
    console.log('失败...')
    console.log(response.data)
  }
}

// 准备属性字段
function notionProperty(
  id: any,
  avatar: any,
  name: any,
  mail: any,
  lastLoginTime: any,
  token: any
) {
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
