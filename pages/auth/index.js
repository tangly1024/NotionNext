// pages/sitemap.xml.js
import { getGlobalData } from '@/lib/db/getSiteData'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Slug from '../[prefix]'

/**
 * 根据notion的slug访问页面
 * 解析二级目录 /article/about
 * @param {*} props
 * @returns
 */
const UI = props => {
  const { redirect_pathname, redirect_query } = props
  const router = useRouter()
  useEffect(() => {
    router?.push({ pathname: redirect_pathname, query: redirect_query })
  }, [])
  return <Slug {...props} />
}

/**
 * 服务端接收参数处理
 * @param {*} ctx
 * @returns
 */
export const getServerSideProps = async ctx => {
  const from = `auth`
  const props = await getGlobalData({ from })
  delete props.allPages
  const code = ctx.query.code

  let params = null
  if (code) {
    params = await fetchToken(code)
  }

  // 授权成功的划保存下用户的workspace信息
  if (params?.status === 200) {
    console.log('请求成功', params)
    props.redirect_query = {
      ...params.data,
      msg: '成功了' + JSON.stringify(params.data)
    }
    console.log('用户信息', JSON.stringify(params.data))
  } else if (!params) {
    console.log('请求异常', params)
    props.redirect_query = { msg: '无效请求' }
  } else {
    console.log('请求失败', params)
    props.redirect_query = { msg: params.statusText }
  }

  props.redirect_pathname = '/auth/result'

  return {
    props
  }
}

const fetchToken = async code => {
  if (!code) {
    return '无效请求'
  }
  console.log('Auth', code)
  const clientId = process.env.OAUTH_CLIENT_ID
  const clientSecret = process.env.OAUTH_CLIENT_SECRET
  const redirectUri = process.env.OAUTH_REDIRECT_URI

  // encode in base 64
  const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  try {
    console.log(
      `请求Code换取Token ${clientId}:${clientSecret} -- ${redirectUri}`
    )
    const response = await axios.post(
      'https://api.notion.com/v1/oauth/token',
      {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Basic ${encoded}`
        }
      }
    )

    console.log('Token response', response.data)
    return response
  } catch (error) {
    console.error('Error fetching token', error)
  }
}

export default UI
