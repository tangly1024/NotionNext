import { useState, useEffect } from 'react'
import { siteConfig } from '@/lib/config'
import { 
  generateArticleSchema,
  generateWebsiteSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  validateSchema,
  validateMultipleSchemas
} from '@/lib/seo/structuredData'
import { generateImageStructuredData } from '@/lib/seo/imageSEO'

/**
 * 结构化数据测试页面
 * 用于测试和验证各种结构化数据的生成
 */
export default function StructuredDataTest() {
  const [testResults, setTestResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // 测试数据
  const siteInfo = {
    title: siteConfig('TITLE'),
    description: siteConfig('DESCRIPTION'),
    author: siteConfig('AUTHOR'),
    icon: '/favicon.ico',
    pageCover: '/bg_image.jpg'
  }

  const baseUrl = siteConfig('LINK') || 'https://example.com'

  const testPost = {
    title: '测试文章标题',
    summary: '这是一篇测试文章的摘要，用于验证结构化数据生成功能。',
    slug: 'test-article',
    publishDay: '2024-01-15',
    lastEditedDay: '2024-01-16',
    category: ['技术分享'],
    tags: ['SEO', '结构化数据', '测试'],
    pageCover: 'https://example.com/test-cover.jpg',
    wordCount: 1500,
    content: `
      这是测试文章内容。
      ![测试图片1](https://example.com/image1.jpg)
      更多内容...
      ![测试图片2](https://example.com/image2.png)
    `
  }

  const testBreadcrumbs = [
    { name: '首页', url: '/' },
    { name: '技术分享', url: '/category/tech' },
    { name: '测试文章标题', url: '/test-article' }
  ]

  const testImages = [
    {
      src: 'https://example.com/image1.jpg',
      alt: '测试图片1',
      title: '测试图片1标题',
      caption: '这是第一张测试图片',
      format: 'jpg'
    },
    {
      src: 'https://example.com/image2.png',
      alt: '测试图片2',
      title: '测试图片2标题',
      caption: '这是第二张测试图片',
      format: 'png'
    }
  ]

  // 运行结构化数据测试
  const runStructuredDataTest = async () => {
    setIsLoading(true)
    
    try {
      const results = {
        schemas: {},
        validations: {},
        timestamp: new Date().toISOString()
      }

      // 1. 测试文章结构化数据
      console.log('🔍 测试文章结构化数据...')
      const articleSchema = generateArticleSchema(testPost, siteInfo, baseUrl)
      results.schemas.article = articleSchema
      results.validations.article = validateSchema(articleSchema)

      // 2. 测试网站结构化数据
      console.log('🔍 测试网站结构化数据...')
      const websiteSchema = generateWebsiteSchema(siteInfo, baseUrl)
      results.schemas.website = websiteSchema
      results.validations.website = validateSchema(websiteSchema)

      // 3. 测试组织结构化数据
      console.log('🔍 测试组织结构化数据...')
      const organizationSchema = generateOrganizationSchema(siteInfo, baseUrl)
      results.schemas.organization = organizationSchema
      results.validations.organization = validateSchema(organizationSchema)

      // 4. 测试面包屑结构化数据
      console.log('🔍 测试面包屑结构化数据...')
      const breadcrumbSchema = generateBreadcrumbSchema(testBreadcrumbs, baseUrl)
      results.schemas.breadcrumb = breadcrumbSchema
      results.validations.breadcrumb = validateSchema(breadcrumbSchema)

      // 5. 测试图片结构化数据
      console.log('🔍 测试图片结构化数据...')
      const imageSchema = generateImageStructuredData(testImages, {
        title: testPost.title,
        author: siteInfo.author,
        publishDate: testPost.publishDay,
        category: testPost.category[0]
      })
      results.schemas.images = imageSchema
      results.validations.images = validateSchema(imageSchema)

      // 6. 批量验证
      const allSchemas = Object.values(results.schemas).filter(schema => schema !== null)
      results.batchValidation = validateMultipleSchemas(allSchemas)

      // 7. 生成测试报告
      results.summary = {
        totalSchemas: allSchemas.length,
        validSchemas: Object.values(results.validations).filter(v => v.isValid).length,
        schemasWithWarnings: Object.values(results.validations).filter(v => v.warnings && v.warnings.length > 0).length,
        totalErrors: Object.values(results.validations).reduce((sum, v) => sum + (v.errors ? v.errors.length : 0), 0),
        totalWarnings: Object.values(results.validations).reduce((sum, v) => sum + (v.warnings ? v.warnings.length : 0), 0)
      }

      setTestResults(results)
      console.log('✅ 结构化数据测试完成:', results)

    } catch (error) {
      console.error('❌ 结构化数据测试失败:', error)
      setTestResults({
        error: error.message,
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 页面加载时自动运行测试
  useEffect(() => {
    runStructuredDataTest()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            结构化数据测试工具
          </h1>
          
          <div className="mb-6">
            <button
              onClick={runStructuredDataTest}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium"
            >
              {isLoading ? '测试中...' : '重新测试结构化数据'}
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

              {testResults.summary && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-blue-800 font-medium mb-4">测试摘要</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{testResults.summary.totalSchemas}</div>
                      <div className="text-gray-600">总数量</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{testResults.summary.validSchemas}</div>
                      <div className="text-gray-600">有效</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{testResults.summary.schemasWithWarnings}</div>
                      <div className="text-gray-600">有警告</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{testResults.summary.totalErrors}</div>
                      <div className="text-gray-600">错误数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{testResults.summary.totalWarnings}</div>
                      <div className="text-gray-600">警告数</div>
                    </div>
                  </div>
                </div>
              )}

              {testResults.schemas && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-800">结构化数据测试结果</h2>
                  
                  {Object.entries(testResults.schemas).map(([type, schema]) => {
                    if (!schema) return null
                    
                    const validation = testResults.validations[type]
                    
                    return (
                      <div key={type} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-medium text-gray-900 capitalize">
                            {type} Schema ({schema['@type']})
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            validation?.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {validation?.isValid ? '✓ 有效' : '✗ 无效'}
                          </span>
                        </div>

                        {/* 验证结果 */}
                        {validation && (
                          <div className="mb-4">
                            {validation.errors && validation.errors.length > 0 && (
                              <div className="mb-2">
                                <h4 className="font-medium text-red-600 mb-1">错误:</h4>
                                <ul className="text-sm text-red-700 space-y-1">
                                  {validation.errors.map((error, index) => (
                                    <li key={index}>• {error}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {validation.warnings && validation.warnings.length > 0 && (
                              <div>
                                <h4 className="font-medium text-yellow-600 mb-1">警告:</h4>
                                <ul className="text-sm text-yellow-700 space-y-1">
                                  {validation.warnings.map((warning, index) => (
                                    <li key={index}>• {warning}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 结构化数据预览 */}
                        <details className="bg-gray-50 rounded p-3">
                          <summary className="cursor-pointer font-medium text-gray-700">
                            查看JSON-LD数据
                          </summary>
                          <pre className="mt-3 text-xs bg-white p-3 rounded border overflow-auto max-h-64">
                            {JSON.stringify(schema, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* 批量验证结果 */}
              {testResults.batchValidation && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="text-purple-800 font-medium mb-4">批量验证结果</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{testResults.batchValidation.totalCount}</div>
                      <div className="text-gray-600">总数量</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{testResults.batchValidation.validCount}</div>
                      <div className="text-gray-600">有效数量</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{testResults.batchValidation.invalidCount}</div>
                      <div className="text-gray-600">无效数量</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{testResults.batchValidation.warningCount}</div>
                      <div className="text-gray-600">警告数量</div>
                    </div>
                  </div>

                  <details className="bg-purple-100 rounded p-3">
                    <summary className="cursor-pointer font-medium text-purple-700">
                      查看详细验证结果
                    </summary>
                    <div className="mt-3 space-y-2">
                      {testResults.batchValidation.details.map((detail, index) => (
                        <div key={index} className="bg-white p-2 rounded text-sm">
                          <div className="font-medium">{detail.type} Schema</div>
                          <div className={`text-xs ${detail.isValid ? 'text-green-600' : 'text-red-600'}`}>
                            {detail.isValid ? '✓ 有效' : '✗ 无效'}
                            {detail.errors && detail.errors.length > 0 && ` (${detail.errors.length} 个错误)`}
                            {detail.warnings && detail.warnings.length > 0 && ` (${detail.warnings.length} 个警告)`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-green-800 font-medium mb-2">测试说明</h3>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• 此测试验证各种结构化数据的生成和有效性</li>
                  <li>• 包括文章、网站、组织、面包屑和图片的结构化数据</li>
                  <li>• 验证结果显示每个schema的有效性和潜在问题</li>
                  <li>• 生成的JSON-LD数据符合Schema.org标准</li>
                  <li>• 可以使用Google的结构化数据测试工具进一步验证</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
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