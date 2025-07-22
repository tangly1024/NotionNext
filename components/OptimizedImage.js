import { siteConfig } from '@/lib/config'
import { generateImageAlt } from '@/lib/seo/imageSEO'
import Head from 'next/head'
import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * 增强版图片懒加载组件
 * 支持WebP/AVIF格式、更好的占位符、性能优化等
 */
export default function OptimizedImage({
  priority = false,
  id,
  src,
  alt,
  placeholderSrc,
  className = '',
  width,
  height,
  title,
  onLoad,
  onClick,
  style,
  quality = 75,
  sizes,
  blurDataURL,
  placeholder = 'blur',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  ...props
}) {
  const maxWidth = siteConfig('IMAGE_COMPRESS_WIDTH', 1200)
  const defaultPlaceholderSrc = siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')
  const imageRef = useRef(null)
  const [currentSrc, setCurrentSrc] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [supportedFormats, setSupportedFormats] = useState({
    avif: false,
    webp: false
  })

  // 检测浏览器支持的图片格式
  useEffect(() => {
    const checkFormatSupport = async () => {
      const formats = { avif: false, webp: false }
      
      // 检测AVIF支持
      try {
        const avifCanvas = document.createElement('canvas')
        avifCanvas.width = 1
        avifCanvas.height = 1
        const avifSupported = avifCanvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
        formats.avif = avifSupported
      } catch (e) {
        formats.avif = false
      }

      // 检测WebP支持
      try {
        const webpCanvas = document.createElement('canvas')
        webpCanvas.width = 1
        webpCanvas.height = 1
        const webpSupported = webpCanvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
        formats.webp = webpSupported
      } catch (e) {
        formats.webp = false
      }

      setSupportedFormats(formats)
    }

    checkFormatSupport()
  }, [])

  // 生成优化后的图片URL
  const getOptimizedImageUrl = useCallback((originalSrc, targetWidth, format = null) => {
    if (!originalSrc) return null

    // 如果是外部URL，尝试添加格式参数
    if (originalSrc.startsWith('http')) {
      let optimizedUrl = originalSrc
      
      // 调整尺寸
      const screenWidth = (typeof window !== 'undefined' && window?.screen?.width) || maxWidth
      const finalWidth = Math.min(targetWidth || screenWidth, maxWidth)
      
      // 正则表达式，用于匹配 URL 中的 width/w 参数
      const widthRegex = /width=\d+/
      const wRegex = /w=\d+/
      
      optimizedUrl = optimizedUrl
        .replace(widthRegex, `width=${finalWidth}`)
        .replace(wRegex, `w=${finalWidth}`)
      
      // 如果URL中没有width参数，尝试添加
      if (!widthRegex.test(optimizedUrl) && !wRegex.test(optimizedUrl)) {
        const separator = optimizedUrl.includes('?') ? '&' : '?'
        optimizedUrl += `${separator}w=${finalWidth}`
      }
      
      // 添加质量参数
      if (quality && quality !== 75) {
        const separator = optimizedUrl.includes('?') ? '&' : '?'
        optimizedUrl += `${separator}q=${quality}`
      }
      
      // 添加格式参数
      if (format && (format === 'webp' || format === 'avif')) {
        const separator = optimizedUrl.includes('?') ? '&' : '?'
        optimizedUrl += `${separator}fm=${format}`
      }
      
      return optimizedUrl
    }
    
    return originalSrc
  }, [maxWidth, quality])

  // 获取最佳图片源
  const getBestImageSrc = useCallback(() => {
    if (!src) return null

    // 优先使用AVIF，其次WebP，最后原格式
    if (supportedFormats.avif) {
      return getOptimizedImageUrl(src, width, 'avif')
    } else if (supportedFormats.webp) {
      return getOptimizedImageUrl(src, width, 'webp')
    } else {
      return getOptimizedImageUrl(src, width)
    }
  }, [src, width, supportedFormats, getOptimizedImageUrl])

  // 生成占位符
  const getPlaceholderSrc = useCallback(() => {
    if (placeholderSrc) return placeholderSrc
    if (blurDataURL) return blurDataURL
    if (defaultPlaceholderSrc) return defaultPlaceholderSrc
    
    // 生成低质量占位符
    if (src) {
      return getOptimizedImageUrl(src, 40, 'webp') // 40px宽度的模糊占位符
    }
    
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+'
  }, [placeholderSrc, blurDataURL, defaultPlaceholderSrc, src, getOptimizedImageUrl])

  // 图片加载成功回调
  const handleImageLoaded = useCallback(() => {
    setIsLoaded(true)
    setIsError(false)
    
    if (typeof onLoad === 'function') {
      onLoad()
    }
    
    // 移除占位符类名
    if (imageRef.current) {
      imageRef.current.classList.remove('lazy-image-placeholder')
      imageRef.current.classList.add('lazy-image-loaded')
    }
  }, [onLoad])

  // 图片加载失败回调
  const handleImageError = useCallback(() => {
    setIsError(true)
    
    if (imageRef.current) {
      // 尝试加载备用图片
      const fallbackSrc = getPlaceholderSrc()
      if (imageRef.current.src !== fallbackSrc) {
        imageRef.current.src = fallbackSrc
      }
      
      imageRef.current.classList.remove('lazy-image-placeholder')
      imageRef.current.classList.add('lazy-image-error')
    }
  }, [getPlaceholderSrc])

  // 懒加载逻辑
  useEffect(() => {
    if (!src || priority) {
      // 如果是优先加载或没有src，直接设置图片
      const bestSrc = getBestImageSrc()
      setCurrentSrc(bestSrc)
      return
    }

    // 设置初始占位符
    setCurrentSrc(getPlaceholderSrc())

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const bestSrc = getBestImageSrc()
            
            // 预加载图片
            const img = new Image()
            img.src = bestSrc
            img.onload = () => {
              setCurrentSrc(bestSrc)
              handleImageLoaded()
            }
            img.onerror = handleImageError

            observer.unobserve(entry.target)
          }
        })
      },
      { 
        rootMargin: '50px 0px', // 提前50px开始加载
        threshold: 0.1 // 10%可见时开始加载
      }
    )

    if (imageRef.current) {
      observer.observe(imageRef.current)
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current)
      }
    }
  }, [src, priority, getBestImageSrc, getPlaceholderSrc, handleImageLoaded, handleImageError])

  // 自动生成alt属性（如果没有提供）
  const [generatedAlt, setGeneratedAlt] = useState('')
  
  useEffect(() => {
    if (!alt && src && siteConfig('SEO_AUTO_GENERATE_ALT', true)) {
      generateImageAlt(src, {
        title: typeof document !== 'undefined' ? document.title : '',
        url: typeof window !== 'undefined' ? window.location.href : ''
      }).then(setGeneratedAlt).catch(() => setGeneratedAlt(''))
    }
  }, [alt, src])

  // 构建图片属性
  const finalAlt = alt || generatedAlt || ''
  const imgProps = {
    ref: imageRef,
    src: currentSrc || getPlaceholderSrc(),
    'data-src': src, // 存储原始图片地址
    alt: finalAlt,
    className: `${className} ${!isLoaded ? 'lazy-image-placeholder' : 'lazy-image-loaded'} ${isError ? 'lazy-image-error' : ''}`.trim(),
    style: {
      transition: 'opacity 0.3s ease-in-out, filter 0.3s ease-in-out',
      filter: !isLoaded && !isError ? 'blur(5px)' : 'none',
      opacity: !isLoaded && !isError ? 0.7 : 1,
      ...style
    },
    loading: priority ? 'eager' : loading,
    decoding,
    onLoad: handleImageLoaded,
    onError: handleImageError,
    onClick,
    ...props
  }

  // 添加可选属性
  if (id) imgProps.id = id
  if (title) imgProps.title = title
  if (width) imgProps.width = width
  if (height) imgProps.height = height
  if (sizes) imgProps.sizes = sizes
  if (fetchPriority) imgProps.fetchPriority = fetchPriority

  if (!src) {
    return null
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...imgProps} />
      
      {/* 预加载关键图片 */}
      {priority && (
        <Head>
          <link 
            rel="preload" 
            as="image" 
            href={getBestImageSrc()} 
            imageSizes={sizes}
            imageSrcSet={generateSrcSet(src, supportedFormats)}
          />
        </Head>
      )}
      
      {/* 添加样式 */}
      <style jsx>{`
        .lazy-image-placeholder {
          background-color: #f3f4f6;
          background-image: linear-gradient(45deg, #f9fafb 25%, transparent 25%), 
                            linear-gradient(-45deg, #f9fafb 25%, transparent 25%), 
                            linear-gradient(45deg, transparent 75%, #f9fafb 75%), 
                            linear-gradient(-45deg, transparent 75%, #f9fafb 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          animation: loading 1.5s ease-in-out infinite;
        }
        
        .lazy-image-loaded {
          background: none;
          animation: none;
        }
        
        .lazy-image-error {
          background-color: #fee2e2;
          background-image: none;
          animation: none;
        }
        
        @keyframes loading {
          0% { background-position: 0 0, 0 10px, 10px -10px, -10px 0px; }
          100% { background-position: 20px 20px, 20px 30px, 30px 10px, 10px 20px; }
        }
      `}</style>
    </>
  )
}

/**
 * 生成响应式图片srcset
 */
function generateSrcSet(src, supportedFormats) {
  if (!src) return ''
  
  const widths = [320, 640, 768, 1024, 1280, 1920]
  const format = supportedFormats.avif ? 'avif' : supportedFormats.webp ? 'webp' : null
  
  return widths.map(width => {
    let url = src
    
    // 调整URL参数
    const widthRegex = /width=\d+/
    const wRegex = /w=\d+/
    
    url = url.replace(widthRegex, `width=${width}`).replace(wRegex, `w=${width}`)
    
    // 如果URL中没有width参数，尝试添加
    if (!widthRegex.test(url) && !wRegex.test(url)) {
      const separator = url.includes('?') ? '&' : '?'
      url += `${separator}w=${width}`
    }
    
    // 添加格式参数
    if (format) {
      const separator = url.includes('?') ? '&' : '?'
      url += `${separator}fm=${format}`
    }
    
    return `${url} ${width}w`
  }).join(', ')
}