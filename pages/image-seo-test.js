import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useImageSEOAnalysis } from '../components/ImageSEOOptimizer'
import OptimizedImage from '../components/OptimizedImage'

/**
 * 图片SEO测试页面
 * 用于测试和演示图片SEO优化功能
 */
export default function ImageSEOTestPage() {
  const { analyzePageImages, getImageSEOReport } = useImageSEOAnalysis()
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const runAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      const report = getImageSEOReport()
      setAnalysis(report)
      setIsAnalyzing(false)
    }, 1000)
  }

  useEffect(() => {
    // 页面加载后自动运行分析
    const timer = setTimeout(runAnalysis, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Head>
        <title>图片SEO优化测试 - NotionNext</title>
        <meta name="description" content="测试和演示图片SEO优化功能，包括自动alt属性生成、图片sitemap、性能优化等。" />
        <meta name="keywords" content="图片SEO, alt属性, 图片优化, sitemap, 性能优化" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              图片SEO优化测试
            </h1>

            {/* 分析结果面板 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">SEO分析结果</h2>
                <button
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isAnalyzing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {isAnalyzing ? '分析中...' : '重新分析'}
                </button>
              </div>

              {analysis ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {analysis.totalImages}
                    </div>
                    <div className="text-sm text-blue-800">总图片数</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {analysis.imagesWithAlt}
                    </div>
                    <div className="text-sm text-green-800">有Alt属性</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {analysis.imagesWithTitle}
                    </div>
                    <div className="text-sm text-yellow-800">有Title属性</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {analysis.score}
                    </div>
                    <div className="text-sm text-purple-800">SEO评分</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">正在分析页面图片...</p>
                </div>
              )}
            </div>

            {/* 测试图片区域 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* 优化后的图片 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-green-600">
                  ✅ 优化后的图片
                </h3>
                <div className="space-y-4">
                  <OptimizedImage
                    src="https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Optimized+Image+1"
                    alt="这是一张经过SEO优化的示例图片"
                    width={400}
                    height={300}
                    className="w-full rounded-lg"
                    priority={true}
                  />
                  <p className="text-sm text-gray-600">
                    这张图片使用了OptimizedImage组件，具有：
                  </p>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>自动生成的alt属性</li>
                    <li>WebP/AVIF格式支持</li>
                    <li>懒加载优化</li>
                    <li>响应式尺寸</li>
                    <li>预加载关键图片</li>
                  </ul>
                </div>
              </div>

              {/* 未优化的图片 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-red-600">
                  ❌ 未优化的图片
                </h3>
                <div className="space-y-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Unoptimized+Image"
                    className="w-full rounded-lg"
                  />
                  <p className="text-sm text-gray-600">
                    这张图片没有经过优化，存在以下问题：
                  </p>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    <li>缺少alt属性</li>
                    <li>没有懒加载</li>
                    <li>没有现代格式支持</li>
                    <li>没有尺寸属性</li>
                    <li>可能影响CLS指标</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 更多测试图片 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">更多测试图片</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <OptimizedImage
                  src="https://via.placeholder.com/300x200/10B981/FFFFFF?text=Image+2"
                  className="w-full rounded-lg"
                  loading="lazy"
                />
                <OptimizedImage
                  src="https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Image+3"
                  className="w-full rounded-lg"
                  loading="lazy"
                />
                <OptimizedImage
                  src="https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Image+4"
                  className="w-full rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>

            {/* SEO建议 */}
            {analysis && analysis.recommendations && analysis.recommendations.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">SEO优化建议</h3>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-l-4 ${
                        rec.priority === 'high'
                          ? 'bg-red-50 border-red-500'
                          : rec.priority === 'medium'
                          ? 'bg-yellow-50 border-yellow-500'
                          : 'bg-blue-50 border-blue-500'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{rec.message}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        优先级: {rec.priority === 'high' ? '高' : rec.priority === 'medium' ? '中' : '低'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* API测试 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">API测试</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="/api/sitemap/images"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                >
                  <div className="font-medium text-blue-900">图片Sitemap</div>
                  <div className="text-sm text-blue-700 mt-1">
                    查看自动生成的图片sitemap
                  </div>
                </a>
                <a
                  href="/api/sitemap/images?stats=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                >
                  <div className="font-medium text-green-900">图片统计</div>
                  <div className="text-sm text-green-700 mt-1">
                    查看图片SEO统计信息
                  </div>
                </a>
              </div>
            </div>

            {/* 说明信息 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                关于图片SEO优化
              </h3>
              <div className="text-blue-800 text-sm space-y-2">
                <p><strong>自动Alt属性生成:</strong> 基于文件名和上下文自动生成描述性alt属性</p>
                <p><strong>现代图片格式:</strong> 自动检测浏览器支持，优先使用WebP/AVIF格式</p>
                <p><strong>懒加载优化:</strong> 非关键图片延迟加载，提升页面性能</p>
                <p><strong>图片Sitemap:</strong> 自动生成符合Google标准的图片sitemap</p>
                <p><strong>结构化数据:</strong> 为图片添加Schema.org结构化数据</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// 静态生成页面
export async function getStaticProps() {
  return {
    props: {},
    revalidate: 3600
  }
}