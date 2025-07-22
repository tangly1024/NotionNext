import BLOG from '@/blog.config'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

/**
 * 优化的图片组件
 * 支持WebP/AVIF格式、懒加载、渐进式加载、响应式尺寸
 * @param {Object} props 组件属性
 * @returns {JSX.Element} 图片组件
 */
export default function OptimizedImage(props) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [imgSrc, setImgSrc] = useState(props.src || '')
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef(null)
  
  const {
    src,
    alt = '',
    width,
    height,
    fill = props.fill || props.layout === 'fill',
    sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    priority = false,
    quality = 75,
    placeholder = 'blur',
    blurDataURL = props.blurDataURL || props.blurredDataURL,
    className = '',
    style = {},
    onLoad,
    onError,
    objectFit = 'cover',
    objectPosition = 'center',
    eager = false,
    loading = 'lazy',
    decoding = 'async',
    fetchPriority = priority ? 'high' : 'auto',
    fallbackSrc = '/images/placeholder.jpg'
  } = props
  
  // 是否开启了图片优化
  const enableImageOptimization = BLOG.NEXT_DISABLE_IMAGE_OPTIMIZATION === false
  
  // 是否是外部图片
  const isExternal = src?.startsWith('http') || src?.startsWith('data:')
  
  // 生成默认的模糊占位符
  const generateBlurDataURL = (w = 10, h = 10) => {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#f3f4f6'
    ctx.fillRect(0, 0, w, h)
    return canvas.toDataURL()
  }
  
  // 图片加载成功处理
  const handleLoad = (e) => {
    setIsLoaded(true)
    onLoad?.(e)
  }
  
  // 图片加载错误处理
  const handleError = (e) => {
    setHasError(true)
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
      setHasError(false)
    }
    onError?.(e)
  }
  
  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imgRef.current || priority || eager) {
      setIsIntersecting(true)
      return
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    )
    
    observer.observe(imgRef.current)
    
    return () => observer.disconnect()
  }, [priority, eager])
  
  // 如果没有src，返回占位符
  if (!src) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-600 ${className}`}
        style={{ width, height, ...style }}
      >
        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    )
  }
  
  // 构建样式
  const imageStyle = {
    objectFit,
    objectPosition,
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0.8,
    ...style
  }
  
  const containerStyle = {
    position: fill ? 'relative' : 'static',
    width: fill ? '100%' : width,
    height: fill ? '100%' : height,
    overflow: 'hidden'
  }
  
  // 如果使用Next.js图片优化且不是外部图片
  if (enableImageOptimization && !isExternal) {
    const imageProps = {
      src: imgSrc,
      alt,
      className: `${className} ${isLoaded ? 'opacity-100' : 'opacity-80'}`,
      style: imageStyle,
      onLoad: handleLoad,
      onError: handleError,
      quality,
      priority,
      placeholder: blurDataURL ? 'blur' : 'empty',
      blurDataURL: blurDataURL || (typeof window !== 'undefined' ? generateBlurDataURL() : undefined),
      sizes,
      loading: priority ? 'eager' : loading,
      decoding
    }
    
    if (fill) {
      return (
        <div ref={imgRef} style={containerStyle}>
          <Image {...imageProps} fill />
        </div>
      )
    }
    
    return (
      <div ref={imgRef} style={containerStyle}>
        <Image {...imageProps} width={width || 400} height={height || 300} />
      </div>
    )
  }
  
  // 使用原生img标签（外部图片或禁用优化）
  const imgProps = {
    src: isIntersecting ? imgSrc : (blurDataURL || ''),
    alt,
    className: `${className} ${isLoaded ? 'opacity-100' : 'opacity-80'}`,
    style: imageStyle,
    onLoad: handleLoad,
    onError: handleError,
    loading: priority ? 'eager' : loading,
    decoding,
    fetchPriority
  }
  
  if (!fill) {
    imgProps.width = width
    imgProps.height = height
  }
  
  return (
    <div ref={imgRef} style={containerStyle}>
      <img {...imgProps} />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
    </div>
  )
}