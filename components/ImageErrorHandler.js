import { useState, useEffect } from 'react'
import { isNotionImageUrl, convertToProxyUrl } from '@/lib/utils/imageProxy'

/**
 * 图片错误处理组件
 * 专门处理Notion图片419错误和其他图片加载问题
 */
export default function ImageErrorHandler({ 
  src, 
  alt = '', 
  className = '',
  style = {},
  onRetrySuccess,
  onRetryFailed,
  maxRetries = 3,
  retryDelay = 1000,
  showRetryButton = true,
  fallbackSrc,
  ...props 
}) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [isClient, setIsClient] = useState(false)

  // 客户端检测
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 重置状态当src改变时
  useEffect(() => {
    setCurrentSrc(src)
    setIsLoading(true)
    setHasError(false)
    setRetryCount(0)
    setErrorMessage('')
  }, [src])

  // 处理图片加载成功
  const handleImageLoad = () => {
    setIsLoading(false)
    setHasError(false)
    setErrorMessage('')
    
    if (onRetrySuccess && retryCount > 0) {
      onRetrySuccess(currentSrc, retryCount)
    }
  }

  // 处理图片加载错误
  const handleImageError = async (event) => {
    console.warn(`Image loading failed (attempt ${retryCount + 1}):`, currentSrc)
    
    setIsLoading(false)
    
    // 如果还有重试次数
    if (retryCount < maxRetries) {
      await retryLoadImage()
    } else {
      // 重试次数用完，显示错误状态
      setHasError(true)
      setErrorMessage('图片加载失败')
      
      if (onRetryFailed) {
        onRetryFailed(currentSrc, retryCount)
      }
      
      // 尝试使用备用图片
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc)
        setRetryCount(0) // 重置重试计数
        setIsLoading(true)
        setHasError(false)
      }
    }
  }

  // 重试加载图片
  const retryLoadImage = async () => {
    const newRetryCount = retryCount + 1
    setRetryCount(newRetryCount)
    setIsLoading(true)
    setHasError(false)
    
    // 延迟重试
    if (retryDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, retryDelay))
    }
    
    let newSrc = src
    
    // 如果是Notion图片，尝试不同的策略
    if (isNotionImageUrl(src)) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      
      if (newRetryCount === 1) {
        // 第一次重试：使用代理
        newSrc = convertToProxyUrl(src)
        console.log('Retrying with proxy URL:', newSrc)
      } else if (newRetryCount === 2) {
        // 第二次重试：添加时间戳强制刷新
        const separator = src.includes('?') ? '&' : '?'
        newSrc = `${src}${separator}_t=${Date.now()}`
        console.log('Retrying with timestamp:', newSrc)
      } else {
        // 第三次重试：再次使用代理但添加时间戳
        const proxySrc = convertToProxyUrl(src)
        const separator = proxySrc.includes('?') ? '&' : '?'
        newSrc = `${proxySrc}${separator}_t=${Date.now()}`
        console.log('Final retry with proxy + timestamp:', newSrc)
      }
    } else {
      // 非Notion图片，添加时间戳重试
      const separator = src.includes('?') ? '&' : '?'
      newSrc = `${src}${separator}_t=${Date.now()}`
    }
    
    setCurrentSrc(newSrc)
  }

  // 手动重试
  const handleManualRetry = () => {
    setRetryCount(0)
    setCurrentSrc(src)
    setIsLoading(true)
    setHasError(false)
    setErrorMessage('')
  }

  // 如果没有src，不渲染
  if (!src) {
    return null
  }

  return (
    <div className={`image-error-handler ${className}`} style={style}>
      {/* 主图片 */}
      {!hasError && (
        <img
          src={currentSrc}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            display: isLoading ? 'none' : 'block',
            maxWidth: '100%',
            height: 'auto'
          }}
          {...props}
        />
      )}
      
      {/* 加载状态 */}
      {isLoading && !hasError && (
        <div className="image-loading-placeholder">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
          {retryCount > 0 && (
            <p className="retry-info">重试中 ({retryCount}/{maxRetries})</p>
          )}
        </div>
      )}
      
      {/* 错误状态 */}
      {hasError && (
        <div className="image-error-placeholder">
          <div className="error-icon">⚠️</div>
          <p className="error-message">{errorMessage}</p>
          <p className="error-details">
            {isNotionImageUrl(src) 
              ? '图片链接可能已过期，请刷新页面' 
              : '图片加载失败，请检查网络连接'
            }
          </p>
          
          {showRetryButton && (
            <button 
              onClick={handleManualRetry}
              className="retry-button"
            >
              重新加载
            </button>
          )}
          
          {isNotionImageUrl(src) && (
            <button 
              onClick={() => window.location.reload()}
              className="refresh-button"
            >
              刷新页面
            </button>
          )}
        </div>
      )}
      
      <style jsx>{`
        .image-error-handler {
          position: relative;
          display: inline-block;
          min-height: 100px;
          min-width: 200px;
        }
        
        .image-loading-placeholder,
        .image-error-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background-color: #f9fafb;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          text-align: center;
          min-height: 100px;
        }
        
        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }
        
        .error-icon {
          font-size: 32px;
          margin-bottom: 10px;
        }
        
        .error-message {
          font-weight: 600;
          color: #dc2626;
          margin: 5px 0;
        }
        
        .error-details {
          font-size: 14px;
          color: #6b7280;
          margin: 5px 0 15px 0;
        }
        
        .retry-info {
          font-size: 12px;
          color: #6b7280;
          margin-top: 5px;
        }
        
        .retry-button,
        .refresh-button {
          padding: 8px 16px;
          margin: 5px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }
        
        .retry-button:hover,
        .refresh-button:hover {
          background-color: #2563eb;
        }
        
        .refresh-button {
          background-color: #10b981;
        }
        
        .refresh-button:hover {
          background-color: #059669;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

/**
 * 简化版图片错误处理Hook
 * 可以在其他组件中使用
 */
export function useImageErrorHandler(src, options = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onRetrySuccess,
    onRetryFailed
  } = options
  
  const [currentSrc, setCurrentSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const handleImageLoad = () => {
    setIsLoading(false)
    setHasError(false)
    
    if (onRetrySuccess && retryCount > 0) {
      onRetrySuccess(currentSrc, retryCount)
    }
  }

  const handleImageError = async () => {
    setIsLoading(false)
    
    if (retryCount < maxRetries) {
      const newRetryCount = retryCount + 1
      setRetryCount(newRetryCount)
      setIsLoading(true)
      
      if (retryDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      }
      
      // 重试逻辑
      let newSrc = src
      if (isNotionImageUrl(src)) {
        newSrc = convertToProxyUrl(src)
      } else {
        const separator = src.includes('?') ? '&' : '?'
        newSrc = `${src}${separator}_t=${Date.now()}`
      }
      
      setCurrentSrc(newSrc)
    } else {
      setHasError(true)
      if (onRetryFailed) {
        onRetryFailed(currentSrc, retryCount)
      }
    }
  }

  const retry = () => {
    setRetryCount(0)
    setCurrentSrc(src)
    setIsLoading(true)
    setHasError(false)
  }

  return {
    currentSrc,
    isLoading,
    hasError,
    retryCount,
    handleImageLoad,
    handleImageError,
    retry
  }
}