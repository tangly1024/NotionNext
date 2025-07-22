import React from 'react'
import Head from 'next/head'
import WebVitalsDashboard from '../../components/admin/WebVitalsDashboard'

/**
 * Web Vitals管理仪表板页面
 * 为管理员提供详细的性能监控界面
 */
export default function WebVitalsDashboardPage() {
  return (
    <>
      <Head>
        <title>Web Vitals 监控仪表板 - NotionNext Admin</title>
        <meta name="description" content="Core Web Vitals性能监控仪表板，实时查看网站性能指标和优化建议。" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto py-8 px-4">
          <WebVitalsDashboard 
            autoStart={true}
            showRecommendations={true}
            refreshInterval={3000}
          />
        </div>
      </div>
    </>
  )
}

// 静态生成页面
export async function getStaticProps() {
  return {
    props: {},
    revalidate: 300 // 5分钟重新验证
  }
}