import { useState, useEffect } from 'react'
import Head from 'next/head'
import OptimizedImage from '@/components/OptimizedImage'
import ImageErrorHandler from '@/components/ImageErrorHandler'
import { scanPageImages, generateImageReport, fixPageImageUrls } from '@/lib/utils/imageUrlFixer'
import { isNotionImageUrl, convertToProxyUrl, isNotionImageExpiring } from '@/lib/utils/imageProxy'

/**
 * 测试页面：验证419错误修复效果
 */
export default function TestImage419Fix() {
  const [testResults, setTestResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [report, setReport] = useState(null)

  // 测试用的图片URL（移除了过期的Notion图片）
  const testImages = [
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&q=50&fm=webp&crop=entropy&cs=srgb&width=800&fmt=webp',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&q=50&fm=webp&crop=entropy&cs=srgb&width=800&fmt=webp',
    'https://file.notion.so/f/f/12345678-1234-1234-1234-123456789abc/test-expired-image.png?table=block&id=12345678-1234-1234-1234-123456789abc&spaceId=12345678-1234-1234-1234-123456789abc&expirationTimestamp=1000000000000&signature=test', // 已过期的测试URL（用于测试错误处理）
  ]

  // 运行图片检查测试
  const runImageTest = async () => {
    setIsLoading(true)
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      
      // 创建测试内容
      const testContent = testImages.map(url => 
        `<img src="${url}" alt="Test image" />`
      ).join('\n')

      // 扫描图片
      const scanResult = await scanPageImages(testContent, baseUrl)
      
      // 生成报告
      const imageReport = await generateImageReport(testContent, baseUrl)
      
      // 修复URL
      const fixResult = fixPageImageUrls(testContent, baseUrl, {
        forceProxy: false,
        onlyExpiring: true
      })

      setTestResults({
        scanResult,
        fixResult,
        testImages: testImages.map(url => ({
          original: url,
          isNotion: isNotionImageUrl(url),
          isExpiring: isNotionImageUrl(url) ? isNotionImageExpiring(url, 48) : false,
          proxyUrl: isNotionImageUrl(url) ? convertToProxyUrl(url) : null
        }))
      })
      
      setReport(imageReport)
    } catch (error) {
      console.error('Test failed:', error)
      setTestResults({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runImageTest()
  }, [])

  return (
    <>
      <Head>
        <title>419错误修复测试 - 图片代理测试</title>
        <meta name="description" content="测试Notion图片419错误修复功能" />
      </Head>

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>419错误修复测试页面</h1>
        <p>此页面用于测试Notion图片419错误的修复功能</p>

        {/* 控制面板 */}
        <div style={{ 
          background: '#f9fafb', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}>
          <h2>测试控制面板</h2>
          <button 
            onClick={runImageTest}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginRight: '10px'
            }}
          >
            {isLoading ? '检查中...' : '重新检查图片'}
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            刷新页面
          </button>
        </div>

        {/* 测试结果 */}
        {testResults && !testResults.error && (
          <div style={{ marginBottom: '30px' }}>
            <h2>测试结果</h2>
            
            {/* 统计信息 */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div style={{ background: '#e0f2fe', padding: '15px', borderRadius: '8px' }}>
                <h3>总图片数</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                  {testResults.scanResult.totalImages}
                </p>
              </div>
              <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '8px' }}>
                <h3>Notion图片</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                  {testResults.scanResult.notionImages}
                </p>
              </div>
              <div style={{ background: '#ffebee', padding: '15px', borderRadius: '8px' }}>
                <h3>即将过期</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                  {testResults.scanResult.expiringImages}
                </p>
              </div>
              <div style={{ background: '#f3e5f5', padding: '15px', borderRadius: '8px' }}>
                <h3>已修复</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                  {testResults.fixResult.changes}
                </p>
              </div>
            </div>

            {/* 详细信息 */}
            <details style={{ marginBottom: '20px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                查看详细测试结果
              </summary>
              <pre style={{ 
                background: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* 错误信息 */}
        {testResults?.error && (
          <div style={{ 
            background: '#fee2e2', 
            color: '#dc2626', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3>测试失败</h3>
            <p>{testResults.error}</p>
          </div>
        )}

        {/* 图片测试区域 */}
        <div style={{ marginBottom: '30px' }}>
          <h2>图片加载测试</h2>
          <p>以下图片将测试不同的加载策略：</p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {testImages.map((imageUrl, index) => (
              <div key={index} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                padding: '15px' 
              }}>
                <h3>测试图片 {index + 1}</h3>
                <p style={{ fontSize: '12px', color: '#6b7280', wordBreak: 'break-all' }}>
                  {imageUrl}
                </p>
                
                {/* 使用OptimizedImage组件 */}
                <div style={{ marginBottom: '15px' }}>
                  <h4>OptimizedImage组件</h4>
                  <OptimizedImage
                    src={imageUrl}
                    alt={`Test image ${index + 1}`}
                    width={250}
                    height={150}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
                
                {/* 使用ImageErrorHandler组件 */}
                <div>
                  <h4>ImageErrorHandler组件</h4>
                  <ImageErrorHandler
                    src={imageUrl}
                    alt={`Test image ${index + 1} with error handling`}
                    style={{ maxWidth: '100%', height: 'auto' }}
                    maxRetries={3}
                    retryDelay={1000}
                    showRetryButton={true}
                    onRetrySuccess={(src, retries) => {
                      console.log(`Image loaded successfully after ${retries} retries:`, src)
                    }}
                    onRetryFailed={(src, retries) => {
                      console.log(`Image failed to load after ${retries} retries:`, src)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API测试区域 */}
        <div style={{ marginBottom: '30px' }}>
          <h2>API代理测试</h2>
          <p>测试图片代理API的功能：</p>
          
          {testImages.filter(url => isNotionImageUrl(url)).map((imageUrl, index) => {
            const proxyUrl = convertToProxyUrl(imageUrl)
            
            return (
              <div key={index} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                padding: '15px',
                marginBottom: '15px'
              }}>
                <h3>Notion图片 {index + 1}</h3>
                
                <div style={{ marginBottom: '10px' }}>
                  <strong>原始URL:</strong>
                  <br />
                  <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                    {imageUrl}
                  </code>
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                  <strong>代理URL:</strong>
                  <br />
                  <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                    {proxyUrl}
                  </code>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => window.open(imageUrl, '_blank')}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    测试原始URL
                  </button>
                  
                  <button
                    onClick={() => window.open(proxyUrl, '_blank')}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    测试代理URL
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* 报告区域 */}
        {report && (
          <div style={{ marginBottom: '30px' }}>
            <h2>图片健康报告</h2>
            
            <div style={{ 
              background: '#f9fafb', 
              padding: '20px', 
              borderRadius: '8px' 
            }}>
              <h3>摘要</h3>
              <ul>
                <li>总图片数: {report.summary.totalImages}</li>
                <li>Notion图片: {report.summary.notionImages}</li>
                <li>健康图片: {report.summary.healthyImages}</li>
                <li>即将过期: {report.summary.expiringImages}</li>
                <li>已损坏: {report.summary.brokenImages}</li>
                <li>需要代理: {report.summary.needsProxyImages}</li>
              </ul>
              
              {report.recommendations.length > 0 && (
                <>
                  <h3>建议</h3>
                  {report.recommendations.map((rec, index) => (
                    <div key={index} style={{
                      padding: '10px',
                      marginBottom: '10px',
                      borderRadius: '4px',
                      backgroundColor: rec.type === 'error' ? '#fee2e2' : 
                                     rec.type === 'warning' ? '#fef3c7' : 
                                     rec.type === 'info' ? '#dbeafe' : '#f3f4f6'
                    }}>
                      <strong>{rec.title}</strong>
                      <p>{rec.description}</p>
                      <small>建议: {rec.action}</small>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div style={{ 
          background: '#f0f9ff', 
          padding: '20px', 
          borderRadius: '8px',
          marginTop: '30px'
        }}>
          <h2>使用说明</h2>
          <ol>
            <li><strong>图片代理API</strong>: 访问 <code>/api/image-proxy?url=图片URL</code> 来代理Notion图片</li>
            <li><strong>OptimizedImage组件</strong>: 自动检测Notion图片并在需要时使用代理</li>
            <li><strong>ImageErrorHandler组件</strong>: 提供图片加载错误处理和重试机制</li>
            <li><strong>批量修复工具</strong>: 使用 <code>imageUrlFixer</code> 工具批量修复页面中的图片链接</li>
          </ol>
          
          <h3>API端点</h3>
          <ul>
            <li><code>GET /api/image-proxy?url=&lt;图片URL&gt;</code> - 代理图片请求</li>
          </ul>
          
          <h3>工具函数</h3>
          <ul>
            <li><code>isNotionImageUrl(url)</code> - 检查是否为Notion图片URL</li>
            <li><code>convertToProxyUrl(url, baseUrl)</code> - 转换为代理URL</li>
            <li><code>scanPageImages(content, baseUrl)</code> - 扫描页面图片</li>
            <li><code>fixPageImageUrls(content, baseUrl)</code> - 修复页面图片URL</li>
          </ul>
        </div>
      </div>
    </>
  )
}