import { useState, useEffect } from 'react'
import Head from 'next/head'
import { 
  getCategoryUrlPath, 
  getCategoryFromUrlPath, 
  isCustomCategoryPath,
  getAllCustomCategoryPaths,
  getAllChineseCategories,
  parseCustomUrl
} from '@/lib/utils/categoryMapping'
import { 
  generatePostUrl, 
  generatePostPath,
  generateCategoryUrl,
  generateCategoryPath,
  parseUrlPath
} from '@/lib/utils/urlGenerator'

/**
 * 自定义分类URL测试页面
 */
export default function TestCustomCategoryUrls() {
  const [testResults, setTestResults] = useState([])

  useEffect(() => {
    runTests()
  }, [])

  const runTests = () => {
    const results = []

    // 测试分类映射
    const testCategories = ['影视资源', '软件资源', '教程资源', '游戏资源', '书籍资源']
    
    testCategories.forEach(category => {
      const englishPath = getCategoryUrlPath(category)
      const backToChinese = getCategoryFromUrlPath(englishPath)
      const isCustom = isCustomCategoryPath(englishPath)
      
      results.push({
        type: '分类映射测试',
        input: category,
        output: englishPath,
        reverse: backToChinese,
        isCustom: isCustom,
        success: category === backToChinese
      })
    })

    // 测试文章URL生成
    const testPosts = [
      {
        id: 'test-1',
        title: '七武士',
        category: '影视资源',
        slug: 'qiwushi'
      },
      {
        id: 'test-2', 
        title: 'Photoshop 2024',
        category: '软件资源',
        slug: 'photoshop-2024'
      },
      {
        id: 'test-3',
        title: 'React 入门教程',
        category: '教程资源',
        slug: 'react-tutorial'
      }
    ]

    testPosts.forEach(post => {
      const fullUrl = generatePostUrl(post)
      const relativePath = generatePostPath(post)
      
      results.push({
        type: '文章URL生成测试',
        input: `${post.title} (${post.category})`,
        output: relativePath,
        fullUrl: fullUrl,
        success: relativePath.includes(getCategoryUrlPath(post.category))
      })
    })

    // 测试分类URL生成
    testCategories.forEach(category => {
      const categoryUrl = generateCategoryUrl(category)
      const categoryPath = generateCategoryPath(category)
      
      results.push({
        type: '分类URL生成测试',
        input: category,
        output: categoryPath,
        fullUrl: categoryUrl,
        success: categoryPath.includes(getCategoryUrlPath(category))
      })
    })

    // 测试URL解析
    const testUrls = [
      '/movie/qiwushi',
      '/software/photoshop-2024',
      '/tutorials/react-tutorial',
      '/category/movie',
      '/category/software'
    ]

    testUrls.forEach(url => {
      const parsed = parseUrlPath(url)
      
      results.push({
        type: 'URL解析测试',
        input: url,
        output: JSON.stringify(parsed, null, 2),
        success: parsed.type !== 'other'
      })
    })

    setTestResults(results)
  }

  return (
    <>
      <Head>
        <title>自定义分类URL测试</title>
        <meta name="description" content="测试自定义分类URL映射功能" />
      </Head>

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>自定义分类URL测试</h1>
        <p>测试中文分类名到英文URL路径的映射功能</p>

        {/* 配置信息 */}
        <div style={{ 
          background: '#f9fafb', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}>
          <h2>当前配置</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h3>中文分类</h3>
              <ul>
                {getAllChineseCategories().map(category => (
                  <li key={category}>{category}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>英文路径</h3>
              <ul>
                {getAllCustomCategoryPaths().map(path => (
                  <li key={path}>{path}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 测试结果 */}
        <div style={{ marginBottom: '30px' }}>
          <h2>测试结果</h2>
          
          {['分类映射测试', '文章URL生成测试', '分类URL生成测试', 'URL解析测试'].map(testType => (
            <div key={testType} style={{ marginBottom: '30px' }}>
              <h3>{testType}</h3>
              <div style={{ 
                display: 'grid', 
                gap: '10px'
              }}>
                {testResults
                  .filter(result => result.type === testType)
                  .map((result, index) => (
                    <div 
                      key={index}
                      style={{ 
                        border: `2px solid ${result.success ? '#10b981' : '#ef4444'}`,
                        borderRadius: '8px',
                        padding: '15px',
                        backgroundColor: result.success ? '#f0fdf4' : '#fef2f2'
                      }}
                    >
                      <div style={{ marginBottom: '10px' }}>
                        <strong>输入:</strong> {result.input}
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <strong>输出:</strong> 
                        <code style={{ 
                          background: '#f3f4f6', 
                          padding: '2px 6px', 
                          borderRadius: '4px',
                          marginLeft: '8px'
                        }}>
                          {result.output}
                        </code>
                      </div>
                      {result.fullUrl && (
                        <div style={{ marginBottom: '10px' }}>
                          <strong>完整URL:</strong> 
                          <code style={{ 
                            background: '#f3f4f6', 
                            padding: '2px 6px', 
                            borderRadius: '4px',
                            marginLeft: '8px'
                          }}>
                            {result.fullUrl}
                          </code>
                        </div>
                      )}
                      {result.reverse && (
                        <div style={{ marginBottom: '10px' }}>
                          <strong>反向映射:</strong> {result.reverse}
                        </div>
                      )}
                      <div>
                        <span style={{ 
                          color: result.success ? '#10b981' : '#ef4444',
                          fontWeight: 'bold'
                        }}>
                          {result.success ? '✅ 通过' : '❌ 失败'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* 使用示例 */}
        <div style={{ 
          background: '#f0f9ff', 
          padding: '20px', 
          borderRadius: '8px',
          marginTop: '30px'
        }}>
          <h2>使用示例</h2>
          
          <h3>URL格式对比</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4>修改前</h4>
              <ul>
                <li><code>/article/qiwushi</code></li>
                <li><code>/category/影视资源</code></li>
                <li><code>/影视资源/qiwushi</code></li>
              </ul>
            </div>
            <div>
              <h4>修改后</h4>
              <ul>
                <li><code>/movie/qiwushi</code></li>
                <li><code>/category/movie</code></li>
                <li><code>/movie/qiwushi</code></li>
              </ul>
            </div>
          </div>

          <h3>配置方法</h3>
          <p>在 <code>blog.config.js</code> 中修改 <code>CATEGORY_URL_MAPPING</code> 配置：</p>
          <pre style={{ 
            background: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
{`CATEGORY_URL_MAPPING: {
  '影视资源': 'movie',
  '软件资源': 'software', 
  '教程资源': 'tutorials',
  '游戏资源': 'games',
  '书籍资源': 'books'
}`}
          </pre>

          <h3>SEO优势</h3>
          <ul>
            <li>✅ 英文URL更利于搜索引擎收录</li>
            <li>✅ URL结构更清晰易懂</li>
            <li>✅ 符合国际化标准</li>
            <li>✅ 提升用户体验</li>
          </ul>
        </div>
      </div>
    </>
  )
}