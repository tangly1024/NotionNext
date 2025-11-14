// pages/profile.js
'use client'
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { DynamicLayout } from '@/themes/theme'
import Head from 'next/head'

export default function ProfilePage() {
  const theme = siteConfig('THEME', BLOG.THEME)

  return (
    <>
      <Head>
        <title>Profile - 主题测试</title>
      </Head>
      <DynamicLayout theme={theme} layoutName="LayoutPage">
        <main style={{ padding: '50px', textAlign: 'center' }}>
          <h1>主题 + Layout 加载成功！</h1>
          <p>如果看到导航栏和侧边栏，说明一切正常。</p>
          <a href="/">← 回首页</a>
        </main>
      </DynamicLayout>
    </>
  )
}
