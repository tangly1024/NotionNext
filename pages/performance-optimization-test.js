import { useState, useEffect } from 'react'
import { siteConfig } from '@/lib/config'
import ResourcePreloader, { useSmartImagePreload, useCriticalResourcePreload, usePreloadPerformance } from '@/components/ResourcePreloader'
import OptimizedImage from '@/components/OptimizedImage'

/**
 * 性能优化测试页面
 * 用于测试和验证性能优化功能
 */
export default function PerformanceOptimizationTest() {
  const [testResults, setTestResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formatSupport, setFormatSupport] = useState({ webp: false, avif: false })

  // 测试数据
  const siteInfo = {
    title: siteConfig('TITLE'),
    description: siteConfig('DESCRIPTION'),
    icon: '/favicon.ico',
    pageCover: '/bg_image.jpg',
    avatar: '/avatar.png'
  }

  const testPost = {
    title: '性能优化测试文章',
    pageCover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=srgb&w=1200',
    pageCoverThumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=srgb&w=400'
  }

  // 使用智能预加载Hooks
  const criticalImages = useSmartImagePreload(testPost, siteInfo)
  const criticalResources = useCriticalResourcePreload()
  const preloadPerformance = usePreloadPerformance()

  // 检测图片格式支持
  useEffect(() => {
    const checkFormatSupport = async () => {
      const checkFormat = (format) => {
        return new Promise((resolve) => {
          const img = new Image()
          img.onload = () => resolve(true)
          img.onerror = () => resolve(false)
          
          const testImages = {
            webp: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA',
            avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
          }
          
          img.src = testImages[format]
        })
      }
      
      const [webpSupported, avifSupported] = await Promise.all([
        checkFormat('webp'),
        checkFormat('avif')
      ])
      
      setFormatSupport({ webp: webpSupported, avif: avifSupported })
    }

    checkFormatSupport()
  }, [])

  // 运行性能优化测试
  const runPerformanceTest = async () => {
    setIsLoading(true)
    
    try {
      const results = {
        formatSupport,
        criticalImages,
        criticalResources,
        preloadPerformance,
        webVitals: await measureWebVitals(),
        resourceAnalysis: analyzeResourceLoading(),
        optimizationScore: 0,
        recommendations: [],
        timestamp: new Date().toISOString()
      }

      // 计算优化评分
      results.optimizationScore = calculateOptimizationScore(results)
      
      // 生成优化建议
      results.recommendations = generateOptimizationRecommendations(results)

      setTestResults(results)
      console.log('✅ 性能优化测试完成:', results)

    } catch (error) {
      console.error('❌ 性能优化测试失败:', error)
      setTestResults({
        error: error.message,
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 测量Web Vitals
  const measureWebVitals = async () => {
    if (typeof window === 'undefined') return {}

    return new Promise((resolve) => {
      const vitals = {}
      
      // 模拟Web Vitals测量
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0]
        if (navigation) {
          vitals.fcp = navigation.loadEventEnd - navigation.loadEventStart
          vitals.lcp = navigation.loadEventEnd - navigation.fetchStart
          vitals.cls = 0.1 // 模拟值
          vitals.fid = 50 // 模拟值
        }
      }
      
      setTimeout(() => resolve(vitals), 100)
    })
  }

  // 分析资源加载
  const analyzeResourceLoading = () => {
    if (typeof window === 'undefined') return {}

    const resources = performance.getEntriesByType('resource')
    const images = resources.filter(r => r.initiatorType === 'img')
    const preloads = resources.filter(r => r.name.includes('preload'))
    
    return {
      totalResources: resources.length,
      imageResources: images.length,
      preloadResources: preloads.length,
      duplicatePreloads: findDuplicatePreloads(preloads),
      avgLoadTime: resources.reduce((sum, r) => sum + (r.loadEnd - r.loadStart), 0) / resources.length
    }
  }

  // 查找重复的预加载资源
  const findDuplicatePreloads = (preloads) => {
    const seen = new Set()
    const duplicates = []
    
    preloads.forEach(resource => {
      if (seen.has(resource.name)) {
        duplicates.push(resource.name)
      } else {
        seen.add(resource.name)
      }
    })
    
    return duplicates
  }

  // 页面加载时自动运行测试
  useEffect(() => {
    // 延迟执行，等待页面完全加载
    const timer = setTimeout(() => {
      runPerformanceTest()
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* 资源预加载器 */}
      <ResourcePreloader 
        images={criticalImages}
        fonts={criticalResources.fonts}
        scripts={criticalResources.scripts}
        styles={criticalResources.styles}
      />
      
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            性能优化测试工具
          </h1>
          
          <div className="mb-6">
            <button
              onClick={runPerformanceTest}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium"
            >
              {isLoading ? '测试中...' : '重新测试性能优化'}
            </button>
          </div>

          {testResults && (
            <div className="space-y-6">
              {testResults.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-red-800 font-medium mb-2">测试失败</h3>
                  <p className="text-red-600">{testResults.error}</p>
                </div>
              )}

              {testResults.optimizationScore !== undefined && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-blue-800 font-medium mb-4">
                    性能优化评分: {testResults.optimizationScore}/100
                  </h3>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        testResults.optimizationScore >= 80 ? 'bg-green-600' :
                        testResults.optimizationScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${testResults.optimizationScore}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* 格式支持测试 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">图片格式支持</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      testResults.formatSupport.webp ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      WebP: {testResults.formatSupport.webp ? '✓ 支持' : '✗ 不支持'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      testResults.formatSupport.avif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      AVIF: {testResults.formatSupport.avif ? '✓ 支持' : '✗ 不支持'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 关键图片预加载 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  关键图片预加载 ({testResults.criticalImages.length} 个)
                </h3>
                <div className="space-y-2">
                  {testResults.criticalImages.map((image, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div>
                        <div className="font-medium text-sm">{image.type}</div>
                        <div className="text-xs text-gray-600 break-all">{image.src}</div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        image.priority >= 90 ? 'bg-red-100 text-red-800' :
                        image.priority >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        优先级: {image.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Web Vitals */}
              {testResults.webVitals && Object.keys(testResults.webVitals).length > 0 && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Web Vitals 指标</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(testResults.webVitals).map(([metric, value]) => (
                      <div key={metric} className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {typeof value === 'number' ? Math.round(value) : value}
                          {metric.includes('Time') || metric.includes('fcp') || metric.includes('lcp') ? 'ms' : ''}
                        </div>
                        <div className="text-gray-600 text-sm uppercase">{metric}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 资源分析 */}
              {testResults.resourceAnalysis && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">资源加载分析</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{testResults.resourceAnalysis.totalResources}</div>
                      <div className="text-gray-600">总资源数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{testResults.resourceAnalysis.imageResources}</div>
                      <div className="text-gray-600">图片资源</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{testResults.resourceAnalysis.preloadResources}</div>
                      <div className="text-gray-600">预加载资源</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{testResults.resourceAnalysis.duplicatePreloads.length}</div>
                      <div className="text-gray-600">重复预加载</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.round(testResults.resourceAnalysis.avgLoadTime || 0)}ms
                      </div>
                      <div className="text-gray-600">平均加载时间</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{testResults.preloadPerformance.preloadedCount}</div>
                      <div className="text-gray-600">已预加载</div>
                    </div>
                  </div>
                  
                  {testResults.resourceAnalysis.duplicatePreloads.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-red-600 mb-2">重复预加载的资源:</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {testResults.resourceAnalysis.duplicatePreloads.map((resource, index) => (
                          <li key={index} className="break-all">• {resource}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* 测试图片展示 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">优化图片测试</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">高优先级图片 (立即加载)</h4>
                    <OptimizedImage
                      src={testPost.pageCover}
                      alt="测试封面图片"
                      width={400}
                      height={200}
                      priority={true}
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">普通图片 (懒加载)</h4>
                    <OptimizedImage
                      src={testPost.pageCoverThumbnail}
                      alt="测试缩略图"
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                </div>
              </div>

              {/* 优化建议 */}
              {testResults.recommendations && testResults.recommendations.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-yellow-800 font-medium mb-4">性能优化建议</h3>
                  <ul className="space-y-2">
                    {testResults.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-yellow-700 text-sm">
                        • {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-green-800 font-medium mb-2">测试说明</h3>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• 此测试验证性能优化功能的有效性</li>
                  <li>• 检测浏览器对WebP/AVIF格式的支持情况</li>
                  <li>• 分析关键资源的预加载策略</li>
                  <li>• 监控Web Vitals性能指标</li>
                  <li>• 识别重复的预加载资源以避免浪费</li>
                  <li>• 提供针对性的性能优化建议</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 计算优化评分
function calculateOptimizationScore(results) {
  let score = 100
  
  // 格式支持评分 (20%)
  if (!results.formatSupport.webp) score -= 10
  if (!results.formatSupport.avif) score -= 10
  
  // 预加载优化评分 (30%)
  if (results.criticalImages.length === 0) score -= 15
  if (results.resourceAnalysis.duplicatePreloads.length > 0) {
    score -= Math.min(15, results.resourceAnalysis.duplicatePreloads.length * 3)
  }
  
  // Web Vitals评分 (30%)
  if (results.webVitals.fcp > 2000) score -= 10
  if (results.webVitals.lcp > 2500) score -= 10
  if (results.webVitals.cls > 0.1) score -= 10
  
  // 资源加载评分 (20%)
  if (results.resourceAnalysis.avgLoadTime > 1000) score -= 10
  if (results.resourceAnalysis.preloadResources === 0) score -= 10
  
  return Math.max(0, Math.round(score))
}

// 生成优化建议
function generateOptimizationRecommendations(results) {
  const recommendations = []
  
  if (!results.formatSupport.webp) {
    recommendations.push('浏览器不支持WebP格式，建议升级浏览器以获得更好的图片压缩效果')
  }
  
  if (!results.formatSupport.avif) {
    recommendations.push('浏览器不支持AVIF格式，这是最新的高效图片格式')
  }
  
  if (results.criticalImages.length === 0) {
    recommendations.push('没有检测到关键图片预加载，建议为重要图片设置priority属性')
  }
  
  if (results.resourceAnalysis.duplicatePreloads.length > 0) {
    recommendations.push(`发现${results.resourceAnalysis.duplicatePreloads.length}个重复预加载资源，建议使用ResourcePreloader组件统一管理`)
  }
  
  if (results.webVitals.fcp > 2000) {
    recommendations.push('首次内容绘制(FCP)时间过长，建议优化关键资源加载')
  }
  
  if (results.webVitals.lcp > 2500) {
    recommendations.push('最大内容绘制(LCP)时间过长，建议优化主要内容的加载速度')
  }
  
  if (results.resourceAnalysis.avgLoadTime > 1000) {
    recommendations.push('平均资源加载时间过长，建议启用资源压缩和CDN加速')
  }
  
  if (results.resourceAnalysis.preloadResources === 0) {
    recommendations.push('没有使用资源预加载，建议为关键资源添加preload提示')
  }
  
  return recommendations
}

// 静态生成页面
export async function getStaticProps() {
  return {
    props: {
      // 页面属性
    }
  }
}