import axios from 'axios'
import { useEffect } from 'react'

const UI = props => {
  const { redirect_pathname, redirect_query } = props
  useEffect(() => {
    window.location.replace(
      `${redirect_pathname}?${new URLSearchParams(redirect_query).toString()}`
    )
  }, [])

  return (
    <main className='min-h-screen bg-white px-6 py-20 text-neutral-900 dark:bg-[#18171d] dark:text-white'>
      <div className='mx-auto max-w-xl rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-[#1f1d24]'>
        <div className='mb-3 text-sm uppercase tracking-[0.24em] text-neutral-500'>
          Auth Redirect
        </div>
        <h1 className='mb-4 text-3xl font-bold'>授权处理中</h1>
        <p className='text-sm leading-7 text-neutral-600 dark:text-neutral-300'>
          正在跳转到授权结果页面，请稍候。
        </p>
      </div>
    </main>
  )
}

/**
 * 服务端接收参数处理
 * @param {*} ctx
 * @returns
 */
export const getServerSideProps = async ctx => {
  const props = {}
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
