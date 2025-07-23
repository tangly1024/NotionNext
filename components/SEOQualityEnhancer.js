import Head from 'next/head'
import { useEffect } from 'react'

/**
 * SEO质量增强组件
 * 解决辅助功能、兼容性、性能和安全性问题
 */
export default function SEOQualityEnhancer({ 
  themeColor = '#000000',
  enableAccessibilityFixes = true,
  enableCompatibilityFixes = true,
  enablePerformanceOptimizations = true 
}) {

  // 修复协议相对URL问题
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 查找所有协议相对URL并修复
      const protocolRelativeLinks = document.querySelectorAll('a[href^="//"], link[href^="//"], script[src^="//"]')
      protocolRelativeLinks.forEach(element => {
        const attr = element.tagName === 'A' ? 'href' : (element.tagName === 'LINK' ? 'href' : 'src')
        const url = element.getAttribute(attr)
        if (url && url.startsWith('//')) {
          element.setAttribute(attr, `https:${url}`)
        }
      })

      // 修复缺少title属性的链接
      if (enableAccessibilityFixes) {
        const linksWithoutTitle = document.querySelectorAll('a:not([title]):not([aria-label])')
        linksWithoutTitle.forEach(link => {
          const text = link.textContent?.trim()
          const href = link.getAttribute('href')
          
          if (!text && href) {
            // 如果链接没有文本，添加aria-label
            link.setAttribute('aria-label', `链接到 ${href}`)
          } else if (text) {
            // 如果有文本但没有title，添加title
            link.setAttribute('title', text)
          }
        })

        // 修复图片alt属性
        const imagesWithoutAlt = document.querySelectorAll('img:not([alt])')
        imagesWithoutAlt.forEach(img => {
          const src = img.getAttribute('src')
          const title = img.getAttribute('title')
          img.setAttribute('alt', title || `图片: ${src?.split('/').pop() || '未命名图片'}`)
        })
      }
    }
  }, [enableAccessibilityFixes])

  return (
    <Head>
      {/* 主题颜色支持 */}
      <meta name="theme-color" content={themeColor} />
      <meta name="msapplication-TileColor" content={themeColor} />
      
      {/* 移动端优化 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* DNS预解析优化 */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* 预连接优化 */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* 兼容性和性能优化样式 */}
      <style jsx global>{`
        /* 兼容性修复 */
        * {
          /* 触摸操作兼容性 */
          -ms-touch-action: manipulation;
          touch-action: manipulation;
          
          /* 用户选择兼容性 */
          -webkit-user-select: inherit;
          -moz-user-select: inherit;
          -ms-user-select: inherit;
          user-select: inherit;
          
          /* 文本大小调整兼容性 */
          -webkit-text-size-adjust: 100%;
          -moz-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
          text-size-adjust: 100%;
        }
        
        /* 背景裁剪兼容性 */
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }
        
        /* 滚动条样式兼容性 */
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        }
        
        *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        *::-webkit-scrollbar-track {
          background: transparent;
        }
        
        *::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        
        /* 文本换行兼容性 */
        .text-wrap {
          text-wrap: wrap;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        /* 行截断兼容性 */
        .line-clamp {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-1 {
          -webkit-line-clamp: 1;
        }
        
        .line-clamp-2 {
          -webkit-line-clamp: 2;
        }
        
        .line-clamp-3 {
          -webkit-line-clamp: 3;
        }
        
        /* 用户拖拽兼容性 */
        img, video {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
        }
        
        /* 性能优化 - 减少重绘和回流 */
        .will-change-transform {
          will-change: transform;
        }
        
        .will-change-opacity {
          will-change: opacity;
        }
        
        /* 动画性能优化 */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        /* 避免在关键帧中使用会触发布局的属性 */
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        
        /* 辅助功能改进 */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        /* 焦点可见性改进 */
        .focus-visible:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        /* 高对比度模式支持 */
        @media (prefers-contrast: high) {
          * {
            border-color: ButtonText !important;
          }
        }
        
        /* 减少动画偏好支持 */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
        
        /* 深色模式优化 */
        @media (prefers-color-scheme: dark) {
          :root {
            color-scheme: dark;
          }
        }
        
        /* 打印样式优化 */
        @media print {
          * {
            background: transparent !important;
            color: black !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }
          
          a,
          a:visited {
            text-decoration: underline;
          }
          
          a[href]:after {
            content: " (" attr(href) ")";
          }
          
          abbr[title]:after {
            content: " (" attr(title) ")";
          }
          
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </Head>
  )
}

/**
 * 辅助功能增强Hook
 */
export function useAccessibilityEnhancements() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // 键盘导航增强
    const handleKeyDown = (e) => {
      // Tab键导航时显示焦点
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation')
      }
    }

    const handleMouseDown = () => {
      // 鼠标点击时隐藏焦点
      document.body.classList.remove('keyboard-navigation')
    }

    // 跳过链接功能
    const skipLink = document.createElement('a')
    skipLink.href = '#main-content'
    skipLink.textContent = '跳转到主要内容'
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50'
    document.body.insertBefore(skipLink, document.body.firstChild)

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
      if (skipLink.parentNode) {
        skipLink.parentNode.removeChild(skipLink)
      }
    }
  }, [])
}

/**
 * 性能监控Hook
 */
export function usePerformanceOptimizations() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // 图片懒加载优化
    const images = document.querySelectorAll('img[data-src]')
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.removeAttribute('data-src')
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach(img => imageObserver.observe(img))

    // 预加载关键资源
    const criticalResources = [
      '/fonts/main.woff2',
      '/css/critical.css'
    ]

    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource
      link.as = resource.endsWith('.woff2') ? 'font' : 'style'
      if (resource.endsWith('.woff2')) {
        link.crossOrigin = 'anonymous'
      }
      document.head.appendChild(link)
    })

    return () => {
      imageObserver.disconnect()
    }
  }, [])
}