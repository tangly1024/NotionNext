import { useState, useEffect } from 'react'
import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'

export default function TestUrlMapping() {
  const { locale } = useGlobal()
  const [testResults, setTestResults] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [testCategory, setTestCategory] = useState('知行合一')
  const [mappedCategory, setMappedCategory] = useState('')
  const [cacheMessage, setCacheMessage] = useState('')

  useEffect(() => {
    fetch('/api/debug-config')
      .then(response => response.json())
      .then(data => {
        setTestResults(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Failed to fetch config:', error)
        setIsLoading(false)
        setTestResults({ error: error.message })
      })
  }, [])

  const handleTestMapping = () => {
    if (!testCategory) return

    const mapping = testResults?.config?.POST_URL_PREFIX_MAPPING_CATEGORY || {}
    setMappedCategory(mapping[testCategory] || '未找到映射')
  }

  const handleClearCache = async () => {
    setCacheMessage('正在清除缓存...')
    try {
      const response = await fetch('/api/clear-cache')
      const data = await response.json()
      setCacheMessage(data.message)

      // Reload the config after clearing cache
      setIsLoading(true)
      const configResponse = await fetch('/api/debug-config')
      const configData = await configResponse.json()
      setTestResults(configData)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to clear cache:', error)
      setCacheMessage('清除缓存失败: ' + error.message)
    }
  }

  if (isLoading) {
    return <div className='p-10'>正在加载配置...</div>
  }

  return (
    <div className='p-10'>
      <h1 className='text-3xl font-bold mb-6'>URL 映射测试工具</h1>

      <div className='mb-4'>
        <button
          onClick={handleClearCache}
          className='p-2 bg-red-500 text-white rounded mb-2'>
          清除缓存
        </button>
        {cacheMessage && (
          <div className='mt-2 p-2 bg-yellow-100 rounded'>{cacheMessage}</div>
        )}
      </div>

      <div className='mb-8 p-4 border rounded bg-gray-50'>
        <h2 className='text-xl font-bold mb-2'>当前配置</h2>
        <div className='mb-4'>
          <strong>POST_URL_PREFIX:</strong>{' '}
          {testResults?.config?.POST_URL_PREFIX || '未设置'}
        </div>

        <div className='mb-4'>
          <strong>POST_URL_PREFIX_MAPPING_CATEGORY:</strong>
          <pre className='mt-2 p-2 bg-gray-100 rounded overflow-auto'>
            {JSON.stringify(
              testResults?.config?.POST_URL_PREFIX_MAPPING_CATEGORY || {},
              null,
              2
            )}
          </pre>
        </div>

        <div>
          <strong>样本文章分类映射:</strong>
          <pre className='mt-2 p-2 bg-gray-100 rounded overflow-auto'>
            {JSON.stringify(
              testResults?.config?.sampleCategoryMappings || {},
              null,
              2
            )}
          </pre>
        </div>
      </div>

      <div className='mb-8 p-4 border rounded bg-gray-50'>
        <h2 className='text-xl font-bold mb-2'>测试分类映射</h2>
        <div className='flex items-center mb-4'>
          <input
            type='text'
            value={testCategory}
            onChange={e => setTestCategory(e.target.value)}
            placeholder='输入分类名称'
            className='p-2 border rounded mr-4'
          />
          <button
            onClick={handleTestMapping}
            className='p-2 bg-blue-500 text-white rounded'>
            测试映射
          </button>
        </div>
        {mappedCategory && (
          <div className='mt-2'>
            <strong>映射结果:</strong> {mappedCategory}
          </div>
        )}
      </div>

      <div className='mb-8 p-4 border rounded bg-gray-50'>
        <h2 className='text-xl font-bold mb-2'>配置说明</h2>
        <p className='mb-2'>要使用分类名映射功能，需要确保:</p>
        <ol className='list-decimal pl-6'>
          <li className='mb-1'>
            在Notion配置中将 <code>POST_URL_PREFIX</code> 设置为{' '}
            <code>%category%</code>
          </li>
          <li className='mb-1'>
            在Notion配置中添加 <code>POST_URL_PREFIX_MAPPING_CATEGORY</code>{' '}
            对象，格式如:{' '}
            <code>{JSON.stringify({ 知行合一: 'learning' })}</code>
          </li>
          <li className='mb-1'>确保文章有正确的分类（Category）属性</li>
          <li className='mb-1'>刷新或重新部署站点以清除缓存</li>
        </ol>
      </div>
    </div>
  )
}
