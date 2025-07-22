import { useState, useEffect, useRef } from 'react'

/**
 * 懒加载内容区域组件
 * 当内容进入视口时才渲染，提升页面性能
 * @param {Object} props 组件属性
 * @returns {JSX.Element} 懒加载区域组件
 */
export default function LazySection({
  children,
  className = '',
  style = {},
  threshold = 0.1,
  rootMargin = '50px',
  fallback = null,
  placeholder = null,
  once = true,
  disabled = false,
  onIntersect,
  onLeave,
  ...props
}) {
  const [isIntersecting, setIsIntersecting] = useState(disabled)
  const [hasIntersected, setHasIntersected] = useState(disabled)
  const elementRef = useRef(null)
  const observerRef = useRef(null)
  
  useEffect(() => {
    if (disabled) return
    
    const element = elementRef.current
    if (!element) return
    
    // 创建 Intersection Observer
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting
        
        setIsIntersecting(isVisible)
        
        if (isVisible) {
          setHasIntersected(true)
          onIntersect?.(entry)
          
          // 如果只需要触发一次，断开观察
          if (once) {
            observerRef.current?.disconnect()
          }
        } else if (!once) {
          onLeave?.(entry)
        }
      },
      {
        threshold,
        rootMargin
      }
    )
    
    observerRef.current.observe(element)
    
    return () => {
      observerRef.current?.disconnect()
    }
  }, [threshold, rootMargin, once, disabled, onIntersect, onLeave])
  
  // 渲染内容
  const shouldRender = disabled || (once ? hasIntersected : isIntersecting)
  
  return (
    <div
      ref={elementRef}
      className={className}
      style={style}
      {...props}
    >
      {shouldRender ? children : (placeholder || fallback)}
    </div>
  )
}

/**
 * 懒加载组件的高阶组件版本
 * @param {React.Component} Component 要包装的组件
 * @param {Object} options 配置选项
 * @returns {React.Component} 包装后的组件
 */
export function withLazyLoading(Component, options = {}) {
  const LazyComponent = (props) => {
    return (
      <LazySection {...options}>
        <Component {...props} />
      </LazySection>
    )
  }
  
  LazyComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`
  
  return LazyComponent
}

/**
 * 懒加载列表组件
 * 适用于长列表的分批渲染
 * @param {Object} props 组件属性
 * @returns {JSX.Element} 懒加载列表组件
 */
export function LazyList({
  items = [],
  renderItem,
  batchSize = 10,
  className = '',
  itemClassName = '',
  loadingComponent = null,
  threshold = 0.5,
  rootMargin = '100px'
}) {
  const [visibleCount, setVisibleCount] = useState(batchSize)
  const [isLoading, setIsLoading] = useState(false)
  const loadMoreRef = useRef(null)
  
  const visibleItems = items.slice(0, visibleCount)
  const hasMore = visibleCount < items.length
  
  useEffect(() => {
    if (!hasMore || !loadMoreRef.current) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          setIsLoading(true)
          
          // 模拟异步加载
          setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + batchSize, items.length))
            setIsLoading(false)
          }, 100)
        }
      },
      {
        threshold,
        rootMargin
      }
    )
    
    observer.observe(loadMoreRef.current)
    
    return () => observer.disconnect()
  }, [hasMore, isLoading, batchSize, items.length, threshold, rootMargin])
  
  return (
    <div className={className}>
      {visibleItems.map((item, index) => (
        <div key={index} className={itemClassName}>
          {renderItem(item, index)}
        </div>
      ))}
      
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {isLoading ? (
            loadingComponent || (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600 dark:text-gray-400">加载更多...</span>
              </div>
            )
          ) : (
            <div className="w-full h-4"></div>
          )}
        </div>
      )}
    </div>
  )
}