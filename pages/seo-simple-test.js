import { useState } from 'react'

/**
 * 简化的SEO测试页面
 * 用于诊断按钮点击问题
 */
export default function SEOSimpleTest() {
  const [testResults, setTestResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // 简单的测试函数
  const runSimpleTest = async () => {
    console.log('🚀 简单测试按钮被点击！')
    setIsLoading(true)
    
    try {
      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setTestResults({
        message: '测试成功！按钮点击正常工作',
        timestamp: new Date().toISOString()
      })
      
      console.log('✅ 简单测试完成')
    } catch (error) {
      console.error('❌ 简单测试失败:', error)
      setTestResults({
        error: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            SEO简单测试工具
          </h1>
          
          <div className="mb-6">
            <button
              onClick={runSimpleTest}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium"
            >
              {isLoading ? '测试中...' : '开始简单测试'}
            </button>
          </div>

          {/* 测试结果显示 */}
          {testResults && (
            <div className="mt-6">
              {testResults.error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-red-800 font-medium mb-2">测试失败</h3>
                  <p className="text-red-600">{testResults.error}</p>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-green-800 font-medium mb-2">测试成功</h3>
                  <p className="text-green-600">{testResults.message}</p>
                  <p className="text-sm text-gray-500 mt-2">时间: {testResults.timestamp}</p>
                </div>
              )}
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
    props: {}
  }
}