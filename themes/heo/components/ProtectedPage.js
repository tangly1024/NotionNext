import { useState, useEffect } from 'react'
import Header from './Header'

const ProtectedPage = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const correctPassword = 'mpc720' // 你想要设置的密码

  useEffect(() => {
    // 页面加载时锁定滚动，直到用户输入正确的密码
    if (!isAuthenticated) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isAuthenticated])

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (password === correctPassword) {
      setIsAuthenticated(true)
    } else {
      setError('密码错误，请重试')
    }
  }

  return (
    <>
      {!isAuthenticated && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="mb-4 text-xl font-bold">请输入密码</h2>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 rounded w-full mb-4"
                placeholder="输入密码"
              />
              {error && <p className="text-red-500">{error}</p>}
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                提交
              </button>
            </form>
          </div>
        </div>
      )}
      {isAuthenticated && (
        <div>
          <Header {...props} />
          {/* 你的其他页面内容 */}
        </div>
      )}
    </>
  )
}

export default ProtectedPage
