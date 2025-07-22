import { useState, useEffect } from 'react'
import OptimizedImage from '../OptimizedImage'
import ResourcePreloader, { SmartPreloader } from '../ResourcePreloader'
import LazySection, { LazyList } from '../LazySection'
import PerformanceMonitor from '../PerformanceMonitor'
import { 
  usePerformanceOptimization, 
  useVirtualScroll, 
  useImageLazyLoad,
  useResourcePreload 
} from '@/lib/performance/usePerformanceOptimization'

/**
 * 性能优化示例组件
 * 展示各种性能优化技术的使用方法
 */
export default function PerformanceExample() {
  const [activeTab, setActiveTab] = useState('images')
  
  // 使用性能优化Hook
  const {
    devicePerformance,
    memoryUsage,
    createDebounced,
    createThrottled,
    runWhenIdle,
    getOptimizationSuggestions,
    isLowPerformanceDevice
  } = usePerformanceOptimization({
    enableMemoryMonitoring: true,
    enablePerformanceBudget: true,
    performanceBudget: {
      fcp: 1800,
      lcp: 2500,
      fid: 100
    }
  })
  
  // 示例图片列表
  const sampleImages = [
    { src: '/images/sample1.jpg', alt: '示例图片1' },
    { src: '/images/sample2.jpg', alt: '示例图片2' },
    { src: '/images/sample3.jpg', alt: '示例图片3' },
    { src: '/images/sample4.jpg', alt: '示例图片4' },
    { src: '/images/sample5.jpg', alt: '示例图片5' }
  ]
  
  // 示例列表数据
  const sampleListData = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    title: `列表项 ${i + 1}`,
    description: `这是第 ${i + 1} 个列表项的描述内容`
  }))
  
  // 资源预加载示例
  const preloadResources = [
    { type: 'image', src: '/images/hero.jpg' },
    { type: 'script', src: '/js/analytics.js' },
    { type: 'style', src: '/css/critical.css' }
  ]
  
  const preloadStatus = useResourcePreload(preloadResources, {
    enabled: activeTab === 'preload'
  })
  
  // 防抖搜索示例
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  
  const debouncedSearch = createDebounced((term) => {
    // 模拟搜索API调用
    console.log('搜索:', term)
    setSearchResults([
      `${term} 的搜索结果 1`,
      `${term} 的搜索结果 2`,
      `${term} 的搜索结果 3`
    ])
  }, 300)
  
  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm)
    } else {
      setSearchResults([])
    }
  }, [searchTerm, debouncedSearch])
  
  // 节流滚动示例
  const throttledScrollHandler = createThrottled((e) => {
    console.log('滚动位置:', e.target.scrollTop)
  }, 100)
  
  // 空闲时执行示例
  const handleIdleTask = () => {
    runWhenIdle(() => {
      console.log('在浏览器空闲时执行的任务')
      // 执行一些非关键任务
    })
  }
  
  // 获取优化建议
  const suggestions = getOptimizationSuggestions()
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          性能优化示例
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          展示各种性能优化技术的实际应用
        </p>
      </div>
      
      {/* 设备性能信息 */}
      {devicePerformance && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            设备性能信息
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-700 dark:text-blue-300">性能等级:</span>
              <span className={`ml-2 font-medium ${
                devicePerformance.level === 'high' ? 'text-green-600' :
                devicePerformance.level === 'medium' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {devicePerformance.level}
              </span>
            </div>
            {devicePerformance.memory && (
              <div>
                <span className="text-blue-700 dark:text-blue-300">内存:</span>
                <span className="ml-2 text-blue-900 dark:text-blue-100">
                  {devicePerformance.memory}GB
                </span>
              </div>
            )}
            {devicePerformance.cores && (
              <div>
                <span className="text-blue-700 dark:text-blue-300">CPU核心:</span>
                <span className="ml-2 text-blue-900 dark:text-blue-100">
                  {devicePerformance.cores}
                </span>
              </div>
            )}
          </div>
          {isLowPerformanceDevice && (
            <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded text-yellow-800 dark:text-yellow-200 text-sm">
              检测到低性能设备，已启用性能优化模式
            </div>
          )}
        </div>
      )}
      
      {/* 优化建议 */}
      {suggestions.length > 0 && (
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
            优化建议
          </h3>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-orange-800 dark:text-orange-200">
                • {suggestion.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* 标签页导航 */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'images', label: '图片优化' },
              { id: 'lazy', label: '懒加载' },
              { id: 'virtual', label: '虚拟滚动' },
              { id: 'preload', label: '资源预加载' },
              { id: 'debounce', label: '防抖节流' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* 标签页内容 */}
      <div className="min-h-96">
        {activeTab === 'images' && <ImageOptimizationDemo images={sampleImages} />}
        {activeTab === 'lazy' && <LazyLoadingDemo />}
        {activeTab === 'virtual' && <VirtualScrollDemo data={sampleListData} />}
        {activeTab === 'preload' && <ResourcePreloadDemo status={preloadStatus} />}
        {activeTab === 'debounce' && (
          <DebounceThrottleDemo
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchResults={searchResults}
            onScroll={throttledScrollHandler}
            onIdleTask={handleIdleTask}
          />
        )}
      </div>
      
      {/* 性能监控面板 */}
      <PerformanceMonitor
        enabled={true}
        showPanel={false}
        thresholds={{
          fcp: 1800,
          lcp: 2500,
          fid: 100,
          cls: 0.1,
          ttfb: 800
        }}
      />
      
      {/* 智能预加载器 */}
      <SmartPreloader
        enableImagePreload={true}
        enableFontPreload={true}
        maxPreloadImages={5}
      />
    </div>
  )
}

/**
 * 图片优化演示组件
 */
function ImageOptimizationDemo({ images }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">图片优化演示</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        展示优化的图片组件，支持WebP/AVIF格式、懒加载、渐进式加载等功能
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div key={index} className="space-y-3">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <OptimizedImage
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
                quality={85}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {image.alt} {index === 0 && '(优先加载)'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 懒加载演示组件
 */
function LazyLoadingDemo() {
  const sections = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    title: `懒加载区域 ${i + 1}`,
    content: `这是第 ${i + 1} 个懒加载区域的内容。只有当这个区域进入视口时才会渲染。`
  }))
  
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">懒加载演示</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        以下区域只有在进入视口时才会渲染，提升页面初始加载性能
      </p>
      
      <div className="space-y-4">
        {sections.map(section => (
          <LazySection
            key={section.id}
            className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg"
            threshold={0.2}
            rootMargin="100px"
            placeholder={
              <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              </div>
            }
            onIntersect={() => console.log(`区域 ${section.id + 1} 进入视口`)}
          >
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {section.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              {section.content}
            </p>
          </LazySection>
        ))}
      </div>
    </div>
  )
}

/**
 * 虚拟滚动演示组件
 */
function VirtualScrollDemo({ data }) {
  const {
    scrollTop,
    isScrolling,
    visibleRange,
    handleScroll,
    totalHeight,
    offsetY
  } = useVirtualScroll({
    itemHeight: 60,
    containerHeight: 400,
    items: data,
    overscan: 5
  })
  
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">虚拟滚动演示</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        虚拟滚动技术，只渲染可见区域的项目，支持大量数据的高性能滚动
      </p>
      
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        总项目数: {data.length} | 
        可见范围: {visibleRange.startIndex} - {visibleRange.endIndex} | 
        滚动状态: {isScrolling ? '滚动中' : '静止'}
      </div>
      
      <div
        className="h-96 overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg"
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleRange.visibleItems.map((item, index) => (
              <div
                key={item.id}
                className="h-15 p-4 border-b border-gray-100 dark:border-gray-800 flex items-center"
              >
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 资源预加载演示组件
 */
function ResourcePreloadDemo({ status }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">资源预加载演示</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        预加载关键资源，提升用户体验
      </p>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            预加载状态
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">状态:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {status.loading ? '加载中...' : '完成'}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">进度:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {status.progress}%
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">已加载:</span>
              <span className="ml-2 text-green-600">
                {status.loaded.length} 个资源
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">失败:</span>
              <span className="ml-2 text-red-600">
                {status.failed.length} 个资源
              </span>
            </div>
          </div>
          
          {status.progress > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${status.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * 防抖节流演示组件
 */
function DebounceThrottleDemo({ 
  searchTerm, 
  setSearchTerm, 
  searchResults, 
  onScroll, 
  onIdleTask 
}) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">防抖节流演示</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        展示防抖搜索、节流滚动和空闲时执行任务的功能
      </p>
      
      <div className="space-y-6">
        {/* 防抖搜索 */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            防抖搜索 (300ms延迟)
          </h4>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="输入搜索关键词..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          {searchResults.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                搜索结果:
              </h5>
              <ul className="space-y-1">
                {searchResults.map((result, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* 节流滚动 */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            节流滚动 (100ms间隔)
          </h4>
          <div
            className="h-32 overflow-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            onScroll={onScroll}
          >
            <div className="h-96 flex items-center justify-center text-gray-600 dark:text-gray-400">
              滚动这个区域查看控制台输出 (节流处理)
              <br />
              <br />
              这里有很多内容...
              <br />
              继续滚动...
              <br />
              <br />
              更多内容...
            </div>
          </div>
        </div>
        
        {/* 空闲时执行 */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            空闲时执行任务
          </h4>
          <button
            onClick={onIdleTask}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            在浏览器空闲时执行任务
          </button>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            点击按钮后查看控制台输出，任务会在浏览器空闲时执行
          </p>
        </div>
      </div>
    </div>
  )
}