import { useState, useEffect } from 'react'
import { siteConfig } from '@/lib/config'
import { detectSEOIssues, autoFixSEOIssues } from '@/lib/seo/seoFixManager'
import { optimizePagePerformance } from '@/lib/seo/performanceOptimizer'
import { useWebVitals, WebVitalsDashboard } from '@/components/WebVitalsMonitor'
import OptimizedImage from '@/components/OptimizedImage'
import ResourcePreloader from '@/components/ResourcePreloader'
import SEOEnhanced from '@/components/SEOEnhanced'

/**
 * SEO综合测试页面
 * 验证所有SEO修复方案的效果
 */
export default function SEOComprehensiveTest() {
    const [testResults, setTestResults] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [performanceResults, setPerformanceResults] = useState(null)

    // 使用Web Vitals监控
    const { metrics, grade, isLoading: vitalsLoading, WebVitalsMonitor } = useWebVitals({
        enableReporting: false,
        enableConsoleLog: true
    })

    // 测试数据
    const testPageData = {
        title: 'SEO综合测试页面 - NotionNext博客系统',
        description: '这是一个用于测试SEO优化功能的综合测试页面，包含图片ALT属性、结构化数据、Meta标签优化等功能验证。',
        keywords: 'SEO测试, 图片优化, 结构化数据, 性能优化, NotionNext',
        content: `
      # SEO综合测试页面
      
      这个页面用于测试所有SEO优化功能的效果。
      
      ## 图片测试
      
      以下图片用于测试ALT属性自动生成和图片SEO优化：
      
      ![](https://example.com/test-image-1.jpg)
      ![测试图片](https://example.com/test-image-2.png)
      ![Lazy loaded image](https://example.com/test-image-3.webp)
      
      ## 内容结构测试
      
      ### 子标题1
      这是一段测试内容，用于验证内容分析功能。包含关键词：SEO优化、性能监控、图片优化。
      
      ### 子标题2
      更多测试内容，用于验证关键词密度分析和内容质量评估功能。
      
      ## 性能测试
      
      这个页面包含多种资源类型，用于测试性能优化功能。
    `,
        type: 'Post',
        category: 'SEO测试',
        tags: ['SEO', '测试', '优化', '性能'],
        images: [
            {
                src: 'https://example.com/test-image-1.jpg',
                alt: '',
                title: '',
                isAboveFold: true
            },
            {
                src: 'https://example.com/test-image-2.png',
                alt: '测试图片',
                title: '测试图片标题'
            },
            {
                src: 'https://example.com/test-image-3.webp',
                alt: 'Lazy loaded image',
                title: ''
            },
            {
                src: 'https://example.com/hero-banner.jpg',
                alt: '',
                title: '',
                isAboveFold: true
            }
        ],
        breadcrumbs: [
            { name: '首页', url: '/' },
            { name: 'SEO测试', url: '/seo-test' },
            { name: '综合测试', url: '/seo-comprehensive-test' }
        ],
        siteInfo: {
            title: siteConfig('TITLE'),
            description: siteConfig('DESCRIPTION'),
            author: siteConfig('AUTHOR'),
            icon: siteConfig('AVATAR')
        }
    }

    // 运行综合SEO测试
    const runComprehensiveTest = async () => {
        setIsLoading(true)
        try {
            console.log('🚀 开始SEO综合测试...')

            // 1. SEO问题检测和修复
            console.log('1️⃣ 检测SEO问题...')
            const detectionResult = await detectSEOIssues(testPageData, {
                checkImages: true,
                checkStructuredData: true,
                checkMetaTags: true,
                checkContent: true,
                checkPerformance: true
            })

            console.log('2️⃣ 自动修复SEO问题...')
            const fixResult = await autoFixSEOIssues(
                testPageData,
                [...detectionResult.issues, ...detectionResult.warnings],
                {
                    fixImages: true,
                    fixMetaTags: true,
                    fixStructuredData: true,
                    fixContent: true
                }
            )

            // 3. 性能优化测试
            console.log('3️⃣ 运行性能优化...')
            const performanceResult = await optimizePagePerformance({
                images: testPageData.images,
                isFirstPage: true,
                resources: [
                    { url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', context: { type: 'font' } },
                    { url: '/css/custom.css', context: { type: 'style' } }
                ]
            })

            setPerformanceResults(performanceResult)

            // 4. 重新检测修复后的问题
            console.log('4️⃣ 验证修复效果...')
            const reDetectionResult = await detectSEOIssues(fixResult.updatedPageData, {
                checkImages: true,
                checkStructuredData: true,
                checkMetaTags: true,
                checkContent: true,
                checkPerformance: true
            })

            // 5. 生成综合报告
            const comprehensiveReport = {
                timestamp: new Date().toISOString(),
                originalIssues: detectionResult.issues.length + detectionResult.warnings.length,
                fixedIssues: fixResult.fixed.length,
                remainingIssues: reDetectionResult.issues.length + reDetectionResult.warnings.length,
                scoreImprovement: reDetectionResult.score - detectionResult.score,
                originalScore: detectionResult.score,
                finalScore: reDetectionResult.score,
                performanceOptimizations: performanceResult.optimizations?.length || 0,
                categories: {
                    images: {
                        original: detectionResult.issues.filter(i => i.type.includes('alt') || i.type.includes('image')).length,
                        fixed: fixResult.fixed.filter(f => f.issue.includes('alt') || f.issue.includes('image')).length
                    },
                    structuredData: {
                        original: detectionResult.issues.filter(i => i.type.includes('structured')).length,
                        fixed: fixResult.fixed.filter(f => f.issue.includes('structured')).length
                    },
                    metaTags: {
                        original: detectionResult.issues.filter(i => i.type.includes('title') || i.type.includes('description') || i.type.includes('keywords')).length,
                        fixed: fixResult.fixed.filter(f => f.issue.includes('title') || f.issue.includes('description') || f.issue.includes('keywords')).length
                    },
                    performance: {
                        optimizations: performanceResult.optimizations?.length || 0,
                        formatSupport: performanceResult.stats?.formatSupport || {}
                    }
                }
            }

            setTestResults({
                original: detectionResult,
                fixed: fixResult,
                reDetection: reDetectionResult,
                performance: performanceResult,
                report: comprehensiveReport
            })

            console.log('✅ SEO综合测试完成！')
            console.log('📊 测试报告:', comprehensiveReport)

        } catch (error) {
            console.error('❌ SEO综合测试失败:', error)
            setTestResults({
                error: error.message
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* SEO增强组件 */}
            <SEOEnhanced
                post={testPageData}
                siteInfo={testPageData.siteInfo}
                enableStructuredData={true}
                enableAnalytics={true}
            />

            {/* 资源预加载 */}
            <ResourcePreloader
                images={testPageData.images}
                enableDNSPrefetch={true}
                enablePreconnect={true}
            />

            {/* Web Vitals监控 */}
            <WebVitalsMonitor />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">
                            SEO综合测试工具
                        </h1>

                        <div className="mb-6">
                            <button
                                onClick={runComprehensiveTest}
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium mr-4"
                            >
                                {isLoading ? '测试中...' : '开始综合测试'}
                            </button>

                            <div className="mt-4 text-sm text-gray-600">
                                <p>此测试将验证以下SEO优化功能：</p>
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>图片ALT属性自动生成和优化</li>
                                    <li>结构化数据生成和验证</li>
                                    <li>Meta标签优化</li>
                                    <li>性能优化（图片预加载、格式检测等）</li>
                                    <li>内容分析和SEO建议</li>
                                    <li>Core Web Vitals监控</li>
                                </ul>
                            </div>
                        </div>

                        {/* Web Vitals仪表板 */}
                        {!vitalsLoading && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-4">实时性能监控</h2>
                                <WebVitalsDashboard metrics={metrics} grade={grade} />
                            </div>
                        )}

                        {/* 测试图片展示 */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4">图片优化测试</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {testPageData.images.map((image, index) => (
                                    <div key={index} className="border rounded-lg p-4">
                                        <OptimizedImage
                                            src={image.src}
                                            alt={image.alt}
                                            width={300}
                                            height={200}
                                            className="w-full h-48 object-cover rounded"
                                            priority={image.isAboveFold}
                                        />
                                        <div className="mt-2 text-sm">
                                            <p><strong>原始ALT:</strong> "{image.alt || '(空)'}"</p>
                                            <p><strong>优先级:</strong> {image.isAboveFold ? '高' : '普通'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* 测试结果显示 */}
                        {testResults && (
                            <div className="space-y-6">
                                {testResults.error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <h3 className="text-red-800 font-medium mb-2">测试失败</h3>
                                        <p className="text-red-600">{testResults.error}</p>
                                    </div>
                                )}

                                {testResults.report && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                        <h3 className="text-green-800 font-medium mb-4">综合测试报告</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                            <div className="bg-white p-4 rounded-lg border">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {testResults.report.originalScore}→{testResults.report.finalScore}
                                                </div>
                                                <div className="text-sm text-gray-600">SEO评分</div>
                                                <div className="text-xs text-green-600">
                                                    +{testResults.report.scoreImprovement}分提升
                                                </div>
                                            </div>

                                            <div className="bg-white p-4 rounded-lg border">
                                                <div className="text-2xl font-bold text-green-600">
                                                    {testResults.report.fixedIssues}
                                                </div>
                                                <div className="text-sm text-gray-600">已修复问题</div>
                                                <div className="text-xs text-gray-500">
                                                    共{testResults.report.originalIssues}个问题
                                                </div>
                                            </div>

                                            <div className="bg-white p-4 rounded-lg border">
                                                <div className="text-2xl font-bold text-orange-600">
                                                    {testResults.report.remainingIssues}
                                                </div>
                                                <div className="text-sm text-gray-600">剩余问题</div>
                                                <div className="text-xs text-gray-500">需手动处理</div>
                                            </div>

                                            <div className="bg-white p-4 rounded-lg border">
                                                <div className="text-2xl font-bold text-purple-600">
                                                    {testResults.report.performanceOptimizations}
                                                </div>
                                                <div className="text-sm text-gray-600">性能优化</div>
                                                <div className="text-xs text-gray-500">项优化完成</div>
                                            </div>
                                        </div>

                                        {/* 分类详情 */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="bg-white p-4 rounded-lg border">
                                                <h4 className="font-medium text-gray-800 mb-2">图片优化</h4>
                                                <div className="text-sm space-y-1">
                                                    <div>原始问题: {testResults.report.categories.images.original}</div>
                                                    <div className="text-green-600">已修复: {testResults.report.categories.images.fixed}</div>
                                                </div>
                                            </div>

                                            <div className="bg-white p-4 rounded-lg border">
                                                <h4 className="font-medium text-gray-800 mb-2">结构化数据</h4>
                                                <div className="text-sm space-y-1">
                                                    <div>原始问题: {testResults.report.categories.structuredData.original}</div>
                                                    <div className="text-green-600">已修复: {testResults.report.categories.structuredData.fixed}</div>
                                                </div>
                                            </div>

                                            <div className="bg-white p-4 rounded-lg border">
                                                <h4 className="font-medium text-gray-800 mb-2">Meta标签</h4>
                                                <div className="text-sm space-y-1">
                                                    <div>原始问题: {testResults.report.categories.metaTags.original}</div>
                                                    <div className="text-green-600">已修复: {testResults.report.categories.metaTags.fixed}</div>
                                                </div>
                                            </div>

                                            <div className="bg-white p-4 rounded-lg border">
                                                <h4 className="font-medium text-gray-800 mb-2">性能优化</h4>
                                                <div className="text-sm space-y-1">
                                                    <div>优化项: {testResults.report.categories.performance.optimizations}</div>
                                                    <div className="text-blue-600">
                                                        AVIF: {testResults.report.categories.performance.formatSupport.avif ? '✓' : '✗'}
                                                        WebP: {testResults.report.categories.performance.formatSupport.webp ? '✓' : '✗'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 性能优化结果 */}
                                {performanceResults && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h3 className="text-blue-800 font-medium mb-4">性能优化结果</h3>

                                        {performanceResults.success ? (
                                            <div className="space-y-3">
                                                {performanceResults.optimizations.map((opt, index) => (
                                                    <div key={index} className="bg-white p-3 rounded border">
                                                        <div className="font-medium text-gray-800">{opt.type}</div>
                                                        <div className="text-sm text-gray-600">{opt.message}</div>
                                                        {opt.result && (
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {JSON.stringify(opt.result)}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                {performanceResults.stats && (
                                                    <div className="bg-white p-3 rounded border">
                                                        <div className="font-medium text-gray-800">预加载统计</div>
                                                        <div className="text-sm text-gray-600">
                                                            已预加载: {performanceResults.stats.preload.preloadedCount} |
                                                            队列中: {performanceResults.stats.preload.queueLength} |
                                                            进行中: {performanceResults.stats.preload.currentPreloads}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-red-600">
                                                性能优化失败: {performanceResults.error}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 详细调试信息 */}
                                <details className="bg-gray-100 rounded-lg p-4">
                                    <summary className="cursor-pointer font-medium text-gray-800">
                                        查看详细测试数据
                                    </summary>
                                    <pre className="mt-4 text-xs bg-white p-4 rounded border overflow-auto max-h-96">
                                        {JSON.stringify(testResults, null, 2)}
                                    </pre>
                                </details>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

// 静态生成页面
export async function getStaticProps() {
    return {
        props: {
            // 页面属性
        }
    }
}