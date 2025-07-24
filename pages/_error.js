import { useRouter } from 'next/router'
import { useEffect } from 'react'

function Error({ statusCode, hasGetInitialPropsRun, err }) {
  const router = useRouter()

  useEffect(() => {
    // 如果是419错误，尝试刷新页面
    if (statusCode === 419) {
      console.log('419 error detected, attempting to refresh...')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }, [statusCode])

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1>
        {statusCode
          ? `服务器发生了 ${statusCode} 错误`
          : '客户端发生了错误'}
      </h1>
      
      {statusCode === 419 && (
        <div>
          <p>页面已过期，正在尝试刷新...</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            手动刷新
          </button>
        </div>
      )}
      
      {statusCode !== 419 && (
        <button 
          onClick={() => router.push('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          返回首页
        </button>
      )}
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error