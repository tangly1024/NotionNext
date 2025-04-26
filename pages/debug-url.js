import { useState, useEffect } from 'react'
import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'

export default function DebugUrl() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setPosts(data.posts || [])
      } catch (e) {
        console.error('Error fetching posts:', e)
        setError(e.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (isLoading) {
    return <div className="p-10">正在加载文章数据...</div>
  }

  if (error) {
    return <div className="p-10 text-red-500">加载出错: {error}</div>
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">URL 调试工具</h1>
      
      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-bold mb-2">当前配置</h2>
        <div className="mb-4">
          <strong>POST_URL_PREFIX:</strong> {siteConfig('POST_URL_PREFIX')}
        </div>
        <div className="mb-4">
          <strong>POST_URL_PREFIX_MAPPING_CATEGORY:</strong>
          <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
            {JSON.stringify(siteConfig('POST_URL_PREFIX_MAPPING_CATEGORY'), null, 2)}
          </pre>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">文章URL分析</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">标题</th>
              <th className="py-2 px-4 border">分类</th>
              <th className="py-2 px-4 border">原始Slug</th>
              <th className="py-2 px-4 border">最终URL</th>
              <th className="py-2 px-4 border">映射后分类</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => {
              const category = Array.isArray(post.category) 
                ? post.category[0] 
                : post.category;
              
              const mappedCategory = siteConfig('POST_URL_PREFIX_MAPPING_CATEGORY')[category] || '未映射';
              
              return (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="py-2 px-4 border">{post.title}</td>
                  <td className="py-2 px-4 border">{category}</td>
                  <td className="py-2 px-4 border">{post.id}</td>
                  <td className="py-2 px-4 border">{post.slug}</td>
                  <td className="py-2 px-4 border">{mappedCategory}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
