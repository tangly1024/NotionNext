import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useImageSEOAnalysis } from '../components/ImageSEOOptimizer'
import OptimizedImage from '../components/OptimizedImage'
import ImageSEOOptimizer from '../components/ImageSEOOptimizer'
import { runImageSEOTestSuite, quickImageSEOCheck } from '../lib/seo/imageSEOTester'
import { getImageSEOConfig, IMAGE_SEO_PRESETS } from '../lib/seo/imageSEOConfig'

/**
 * 增强版图片SEO测试页面
 * 展示完整的图片SEO优化功能和测试套件
 */
export default function EnhancedImageSEOTestPage() {
  const { analyzePageImages, getImageSEOReport } = useImageSEOAnalysis()
  const [analysis, setAnalysis] = useState(null)
  const [testResults, setTestResults] = useState(null)
  const [quickCheck, setQuickCheck] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState('default')
  const [config, setConfig] = useState(getImageSEOConfig())

  const runAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      const report = getImageSEOReport()
      setAnalysis(report)
      
      // 运行快速检查
      const images = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.alt || '',
        title: img.title || '',
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        loading: img.loading,
        decoding: img.decoding
      }))
      
      const quickResult = quickImageSEOCheck(images)
      setQuickCheck(quickResult)
      
      setIsAnalyzing(false)
    }, 1000)
  }

  const runFullTests = async () => {
    setIsRunningTests(true)
    try {
      const images = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.alt || '',
        title: img.title || '',
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        loading: img.loading,
        decoding: img.decoding,
        format: img.src.split('.').pop()?.toLowerCase()
      }))

      const results = await runImageSEOTestSuite({
        images,
        config,
        url: window.location.href
      })
      
      setTestResults(results)
    } catch (error) {
      console.error('Test suite failed:', error)
    } finally {
      setIsRunningTests(false)
    }
  }

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset)
    if (preset === 'default') {
      setConfig(getImageSEOConfig())
    } else {
      setConfig(getImageSEOConfig(IMAGE_SEO_PRESETS[preset]))
    }
  }

  useEffect(() => {
    // 页面加载后自动运行分析
    const timer = setTimeout(runAnalysis, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Head>
        <title>增强版图片SEO优化测试 - NotionNext</title>
        <meta name="description" content="全面测试和演示图片SEO优化功能，包括智能alt属性生成、性能优化、结构化数据等。" />
        <meta name="keywords" content="图片SEO, alt属性, 图片优化, 性能优化, 结构化数据, 可访问性" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* 图片SEO自动优化器 */}
      <ImageSEOOptimizer
        enabled={true}
        autoGenerateAlt={config.altText.autoGenerate}
        addStructuredData={config.seo.enableStructuredData}
        context={{
          title: '增强版图片SEO测试',
          category: 'SEO测试',
          tags: ['图片优化', 'SEO', '性能']
        }}
        onOptimizationComplete={(result) => {
          console.log('图片优化完成:', result)
        }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              增强版图片SEO优化测试
            </h1>

            {/* 配置选择器 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">配置预设</h2>
              <div className="flex flex-wrap gap-2">
                {['default', 'strict', 'performance', 'accessibility', 'relaxed'].map(preset => (
                  <button
                    key={preset}
                    onClick={() => handlePresetChange(preset)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      selectedPreset === preset
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {preset === 'default' ? '默认' : 
                     preset === 'strict' ? '严格' :
                     preset === 'performance' ? '性能优先' :
                     preset === 'accessibility' ? '可访问性' : '宽松'}
                  </button>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>当前配置:</strong></p>
                <ul className="list-disc list-inside mt-2">
                  <li>Alt属性要求: {config.altText.required ? '必需' : '可选'} (长度: {config.altText.minLength}-{config.altText.maxLength})</li>
                  <li>文件大小限制: {Math.round(config.fileSize.maxSize / 1024)}KB</li>
                  <li>推荐格式: {config.formats.preferred.join(', ')}</li>
                  <li>懒加载: {config.performance.enableLazyLoading ? '启用' : '禁用'}</li>
                </ul>
              </div>
            </div>

            {/* 控制面板 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4">
                  <button
                    onClick={runAnalysis}
                    disabled={isAnalyzing}
                    className={`px-6 py-2 rounded-lg font-medium ${
                      isAnalyzing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    {isAnalyzing ? '分析中...' : '运行分析'}
                  </button>
                  
                  <button
                    onClick={runFullTests}
                    disabled={isRunningTests}
                    className={`px-6 py-2 rounded-lg font-medium ${
                      isRunningTests
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                  >
                    {isRunningTests ? '测试中...' : '完整测试'}
                  </button>
                </div>
                
                <div className="text-sm text-gray-600">
                  配置: {selectedPreset === 'default' ? '默认' : selectedPreset}
                </div>
              </div>
            </div>

            {/* 快速检查结果 */}
            {quickCheck && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">快速检查结果</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {quickCheck.totalImages}
                    </div>
                    <div className="text-sm text-blue-800">总图片数</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {quickCheck.issues.length}
                    </div>
                    <div className="text-sm text-red-800">问题数量</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {quickCheck.recommendations.length}
                    </div>
                    <div className="text-sm text-yellow-800">建议数量</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {quickCheck.score}
                    </div>
                    <div className="text-sm text-green-800">快速评分</div>
                  </div>
                </div>
                
                {quickCheck.issues.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-red-600 mb-2">发现的问题:</h3>
                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                      {quickCheck.issues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {quickCheck.recommendations.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-yellow-600 mb-2">优化建议:</h3>
                    <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                      {quickCheck.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* 详细分析结果 */}
            {analysis && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">详细分析结果</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

                {/* 额外统计信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">优化统计</h3>
                    <ul className="text-sm space-y-1">
                      <li>优化文件名: {analysis.imagesWithOptimizedFilename || 0}</li>
                      <li>现代格式: {analysis.imagesWithModernFormat || 0}</li>
                      <li>平均文件大小: {analysis.averageFileSize ? Math.round(analysis.averageFileSize / 1024) + 'KB' : 'N/A'}</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">分析时间</h3>
                    <p className="text-sm">{new Date(analysis.analyzedAt).toLocaleString()}</p>
                    <p className="text-sm text-gray-600">URL: {analysis.url}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 完整测试结果 */}
            {testResults && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">完整测试结果</h2>
                
                {/* 测试总结 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {testResults.summary.totalTests}
                    </div>
                    <div className="text-sm text-blue-800">总测试数</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {testResults.summary.passedTests}
                    </div>
                    <div className="text-sm text-green-800">通过测试</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {testResults.summary.failedTests}
                    </div>
                    <div className="text-sm text-red-800">失败测试</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {testResults.summary.score}
                    </div>
                    <div className="text-sm text-purple-800">总体评分</div>
                  </div>
                </div>

                {/* 详细测试结果 */}
                <div className="space-y-4">
                  {Object.entries(testResults.tests).map(([key, test]) => (
                    <div key={key} className={`p-4 rounded-lg border-l-4 ${
                      test.passed ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">
                          {test.passed ? '✅' : '❌'} {test.name}
                        </h3>
                      </div>
                      
                      {test.errors.length > 0 && (
                        <div className="mb-2">
                          <p className="text-sm font-medium text-red-600">错误:</p>
                          <ul className="text-sm text-red-700 list-disc list-inside">
                            {test.errors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {test.warnings.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-yellow-600">警告:</p>
                          <ul className="text-sm text-yellow-700 list-disc list-inside">
                            {test.warnings.map((warning, index) => (
                              <li key={index}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 测试图片展示区域 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* 优化后的图片 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-green-600">
                  ✅ 优化后的图片
                </h3>
                <div className="space-y-4">
                  <OptimizedImage
                    src="https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Optimized+Logo"
                    alt="这是一张经过SEO优化的公司标志图片"
                    width={400}
                    height={300}
                    className="w-full rounded-lg"
                    priority={true}
                  />
                  <OptimizedImage
                    src="https://via.placeholder.com/400x200/10B981/FFFFFF?text=Product+Screenshot"
                    className="w-full rounded-lg"
                    loading="lazy"
                  />
                  <OptimizedImage
                    src="https://via.placeholder.com/400x250/F59E0B/FFFFFF?text=Chart+Visualization"
                    className="w-full rounded-lg"
                    loading="lazy"
                  />
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://via.placeholder.com/400x200/DC2626/FFFFFF?text=No+Alt+Text"
                    className="w-full rounded-lg"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://via.placeholder.com/400x250/B91C1C/FFFFFF?text=No+Dimensions"
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* API测试链接 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">API测试</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <a
                  href="/api/sitemap/images?validate=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                >
                  <div className="font-medium text-purple-900">Sitemap验证</div>
                  <div className="text-sm text-purple-700 mt-1">
                    验证图片sitemap格式
                  </div>
                </a>
              </div>
            </div>

            {/* 功能说明 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                增强版图片SEO优化功能
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-800 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">智能优化</h4>
                  <ul className="space-y-1">
                    <li>• 智能Alt属性生成</li>
                    <li>• 基于上下文的描述</li>
                    <li>• 文件名优化建议</li>
                    <li>• 格式转换建议</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">性能优化</h4>
                  <ul className="space-y-1">
                    <li>• WebP/AVIF格式支持</li>
                    <li>• 智能懒加载</li>
                    <li>• 响应式图片</li>
                    <li>• 预加载关键图片</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">SEO增强</h4>
                  <ul className="space-y-1">
                    <li>• 结构化数据生成</li>
                    <li>• 图片Sitemap</li>
                    <li>• 元数据优化</li>
                    <li>• 搜索引擎友好</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">测试验证</h4>
                  <ul className="space-y-1">
                    <li>• 完整测试套件</li>
                    <li>• 性能基准测试</li>
                    <li>• 配置验证</li>
                    <li>• 详细报告生成</li>
                  </ul>
                </div>
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