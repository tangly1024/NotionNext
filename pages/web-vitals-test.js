import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { getWebVitalsSnapshot } from '../lib/performance/webVitals'

/**
 * Web Vitals测试页面
 * 用于测试和演示Core Web Vitals监控功能
 */
export default function WebVitalsTestPage() {
  const [vitals, setVitals] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 监听Web Vitals事件
    const handleWebVital = (event) => {
      const { name, value, rating } = event.detail
      setVitals(prev => ({
        ...prev,
        [name]: { value, rating, timestamp: Date.now() }
      }))
    }

    window.addEventListener('web-vital', handleWebVital)

    // 定期获取快照
    const interval = setInterval(() => {
      const snapshot = getWebVitalsSnapshot()
      if (snapshot) {
        setVitals(snapshot.coreWebVitals || {})
        setIsLoading(false)
      }
    }, 2000)

    // 5秒后停止加载状态
    const loadingTimer = setTimeout(() => setIsLoading(false), 5000)

    return () => {
      window.removeEventListener('web-vital', handleWebVital)
      clearInterval(interval)
      clearTimeout(loadingTimer)
    }
  }, [])

  // 触发布局偏移的测试函数
  const triggerLayoutShift = () => {
    const testDiv = document.createElement('div')
    testDiv.style.height = '100px'
    testDiv.style.backgroundColor = '#f0f0f0'
    testDiv.style.margin = '10px 0'
    testDiv.textContent = '这是一个测试布局偏移的元素'
    document.querySelector('.test-content').prepend(testDiv)
    
    setTimeout(() => {
      testDiv.remove()
    }, 2000)
  }

  // 触发长任务的测试函数
  const triggerLongTask = () => {
    const start = Date.now()
    // 模拟长任务（阻塞主线程）
    while (Date.now() - start < 100) {
      // 空循环
    }
    alert('长任务执行完成！这可能会影响FID指标。')
  }

  return (
    <>
      <Head>
        <title>Core Web Vitals 监控测试 - NotionNext</title>
        <meta name="description" content="测试和演示Core Web Vitals监控功能，包括FCP、LCP、FID、CLS等性能指标的实时监控。" />
        <meta name="keywords" content="Web Vitals, 性能监控, FCP, LCP, FID, CLS, 性能优化" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Core Web Vitals 监控测试
            </h1>

            {/* 监控状态 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">监控状态</h2>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                <span className="text-green-600 font-medium">Web Vitals 监控已启用</span>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                页面加载后会自动开始收集性能指标数据
              </p>
            </div>

            {/* Core Web Vitals 指标展示 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                name="FCP"
                title="首次内容绘制"
                value={vitals.FCP?.value}
                rating={vitals.FCP?.rating}
                unit="ms"
                isLoading={isLoading}
              />
              <MetricCard
                name="LCP"
                title="最大内容绘制"
                value={vitals.LCP?.value}
                rating={vitals.LCP?.rating}
                unit="ms"
                isLoading={isLoading}
              />
              <MetricCard
                name="FID"
                title="首次输入延迟"
                value={vitals.FID?.value}
                rating={vitals.FID?.rating}
                unit="ms"
                isLoading={isLoading}
              />
              <MetricCard
                name="CLS"
                title="累积布局偏移"
                value={vitals.CLS?.value}
                rating={vitals.CLS?.rating}
                unit=""
                precision={3}
                isLoading={isLoading}
              />
            </div>

            {/* 测试工具 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">性能测试工具</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={triggerLayoutShift}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
                >
                  触发布局偏移 (CLS)
                </button>
                <button
                  onClick={triggerLongTask}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  触发长任务 (FID)
                </button>
              </div>
              <p className="text-gray-600 text-sm mt-4">
                点击按钮可以人为触发性能问题，观察指标变化
              </p>
            </div>

            {/* 测试内容区域 */}
            <div className="test-content bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">测试内容区域</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  这是一个用于测试Web Vitals监控功能的页面。页面包含了各种元素来触发不同的性能指标：
                </p>
                
                {/* 大图片用于测试LCP */}
                <div className="my-6">
                  <img
                    src="https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Large+Content+Image"
                    alt="大内容图片"
                    className="w-full h-64 object-cover rounded-lg"
                    loading="lazy"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    这张大图片可能会成为LCP元素
                  </p>
                </div>

                {/* 交互元素用于测试FID */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">交互测试</h3>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors">
                      按钮 1
                    </button>
                    <button className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded transition-colors">
                      按钮 2
                    </button>
                    <button className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded transition-colors">
                      按钮 3
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    点击这些按钮可以测试首次输入延迟 (FID)
                  </p>
                </div>

                {/* 更多内容 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">更多测试内容</h3>
                  <p className="text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p className="text-gray-700">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                    eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                    sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              </div>
            </div>

            {/* 说明信息 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                关于 Core Web Vitals
              </h3>
              <div className="text-blue-800 text-sm space-y-2">
                <p><strong>FCP (First Contentful Paint):</strong> 页面开始加载到任何内容渲染的时间</p>
                <p><strong>LCP (Largest Contentful Paint):</strong> 页面主要内容完成渲染的时间</p>
                <p><strong>FID (First Input Delay):</strong> 用户首次交互到浏览器响应的时间</p>
                <p><strong>CLS (Cumulative Layout Shift):</strong> 页面加载期间布局稳定性的度量</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * 指标卡片组件
 */
function MetricCard({ name, title, value, rating, unit, precision = 0, isLoading }) {
  const formatValue = (val) => {
    if (val === undefined || val === null) return '--'
    return precision > 0 ? val.toFixed(precision) : Math.round(val)
  }

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'good': return 'border-green-500 bg-green-50'
      case 'needs-improvement': return 'border-yellow-500 bg-yellow-50'
      case 'poor': return 'border-red-500 bg-red-50'
      default: return 'border-gray-300 bg-gray-50'
    }
  }

  const getRatingText = (rating) => {
    switch (rating) {
      case 'good': return '良好'
      case 'needs-improvement': return '待改进'
      case 'poor': return '较差'
      default: return '等待中'
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${getRatingColor(rating)}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-600">{name}</h4>
        {!isLoading && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            rating === 'good' ? 'bg-green-100 text-green-800' :
            rating === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800' :
            rating === 'poor' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {getRatingText(rating)}
          </span>
        )}
      </div>
      
      <div className="mb-2">
        <div className="text-2xl font-bold text-gray-900">
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
          ) : (
            `${formatValue(value)}${unit}`
          )}
        </div>
        <div className="text-sm font-medium text-gray-700">{title}</div>
      </div>
    </div>
  )
}

// 静态生成页面
export async function getStaticProps() {
  return {
    props: {},
    revalidate: 3600
  }
}