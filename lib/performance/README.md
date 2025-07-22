# 性能优化组件和工具

本文档介绍了NotionNext的性能优化功能，包括图片优化、懒加载、性能监控等多个方面。

## 功能概览

### 核心组件

1. **OptimizedImage** - 优化的图片组件
2. **PerformanceMonitor** - 性能监控组件
3. **ResourcePreloader** - 资源预加载组件
4. **LazySection** - 懒加载内容区域组件

### 工具库

1. **performanceUtils.js** - 性能优化工具函数
2. **usePerformanceOptimization.js** - 性能优化Hooks

## 详细功能介绍

### OptimizedImage 组件

优化的图片组件，支持多种现代图片优化技术：

#### 主要特性

- **格式优化** - 自动支持WebP/AVIF格式
- **懒加载** - 基于Intersection Observer的智能懒加载
- **响应式** - 根据屏幕尺寸自动调整图片大小
- **渐进式加载** - 支持模糊占位符和渐进式显示
- **错误处理** - 自动降级到备用图片
- **性能监控** - 集成加载性能监控

#### 使用示例

```jsx
import OptimizedImage from '@/components/OptimizedImage'

function MyComponent() {
  return (
    <OptimizedImage
      src="https://example.com/image.jpg"
      alt="示例图片"
      width={800}
      height={600}
      quality={85}
      placeholder="blur"
      priority={false}
      className="rounded-lg"
    />
  )
}
```

#### 配置选项

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| src | string | - | 图片地址 |
| alt | string | '' | 图片描述 |
| width | number | - | 图片宽度 |
| height | number | - | 图片高度 |
| quality | number | 75 | 图片质量(1-100) |
| placeholder | string | 'blur' | 占位符类型 |
| priority | boolean | false | 是否优先加载 |
| fallbackSrc | string | - | 备用图片地址 |

### PerformanceMonitor 组件

性能监控组件，自动监控页面性能指标：

#### 监控指标

- **Core Web Vitals**
  - LCP (Largest Contentful Paint) - 最大内容绘制
  - FID (First Input Delay) - 首次输入延迟
  - CLS (Cumulative Layout Shift) - 累积布局偏移

- **加载性能**
  - 页面加载时间
  - DOM内容加载时间
  - 首字节时间 (TTFB)

#### 使用示例

```jsx
import PerformanceMonitor from '@/components/PerformanceMonitor'

function App() {
  return (
    <div>
      {/* 页面内容 */}
      <PerformanceMonitor />
    </div>
  )
}
```

#### 配置选项

在 `blog.config.js` 中配置：

```javascript
SEO_ENABLE_PERFORMANCE_MONITOR: true, // 启用性能监控
SEO_PERFORMANCE_REPORT_URL: 'https://api.example.com/metrics', // 数据上报URL
```

### ResourcePreloader 组件

资源预加载组件，提前加载关键资源：

#### 预加载类型

- **字体预加载** - 预加载Web字体
- **CSS预加载** - 预加载关键样式
- **图片预加载** - 预加载重要图片
- **DNS预解析** - 预解析外部域名
- **预连接** - 预连接到关键服务

#### 使用示例

```jsx
import ResourcePreloader from '@/components/ResourcePreloader'

function Layout() {
  const preloadResources = [
    {
      href: '/fonts/custom-font.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous'
    },
    {
      href: '/images/hero-bg.jpg',
      as: 'image',
      type: 'image/jpeg'
    }
  ]

  return (
    <div>
      <ResourcePreloader preloadResources={preloadResources} />
      {/* 页面内容 */}
    </div>
  )
}
```

### LazySection 组件

懒加载内容区域组件，延迟加载非关键内容：

#### 主要特性

- **视口检测** - 基于Intersection Observer
- **占位符支持** - 自定义加载占位符
- **回调支持** - 可见时触发回调
- **一次性加载** - 支持只触发一次的懒加载

#### 使用示例

```jsx
import LazySection from '@/components/LazySection'

function MyPage() {
  return (
    <div>
      {/* 关键内容 */}
      <div>重要内容，立即加载</div>
      
      {/* 懒加载内容 */}
      <LazySection
        rootMargin="100px"
        onVisible={() => console.log('内容已可见')}
        placeholder={<div>加载中...</div>}
      >
        <div>这部分内容只有在进入视口时才会渲染</div>
      </LazySection>
    </div>
  )
}
```

## 性能优化Hooks

### usePerformanceOptimization

综合性能优化Hook，提供网络适配、设备检测等功能：

```jsx
import { usePerformanceOptimization } from '@/lib/performance/usePerformanceOptimization'

function MyComponent() {
  const {
    networkInfo,
    devicePerformance,
    webVitals,
    isSlowNetwork,
    loadingStrategy,
    renderingStrategy,
    imageOptimization
  } = usePerformanceOptimization()

  return (
    <div>
      {isSlowNetwork ? (
        <div>简化版内容</div>
      ) : (
        <div>完整版内容</div>
      )}
    </div>
  )
}
```

### useLazyLoading

懒加载Hook，用于自定义懒加载逻辑：

```jsx
import { useLazyLoading } from '@/lib/performance/usePerformanceOptimization'

function LazyComponent() {
  const [ref, isVisible] = useLazyLoading({
    rootMargin: '50px',
    threshold: 0.1
  })

  return (
    <div ref={ref}>
      {isVisible ? <ExpensiveComponent /> : <Placeholder />}
    </div>
  )
}
```

### useResourcePreload

资源预加载Hook：

```jsx
import { useResourcePreload } from '@/lib/performance/usePerformanceOptimization'

function MyComponent() {
  const resources = [
    { url: '/api/data', type: 'fetch' },
    { url: '/images/bg.jpg', type: 'image' }
  ]

  const { loadedResources, isLoaded } = useResourcePreload(resources)

  return (
    <div>
      {isLoaded('/images/bg.jpg') ? (
        <img src="/images/bg.jpg" alt="背景" />
      ) : (
        <div>图片加载中...</div>
      )}
    </div>
  )
}
```

## 工具函数

### 防抖和节流

```javascript
import { debounce, throttle } from '@/lib/performance/performanceUtils'

// 防抖
const debouncedSearch = debounce((query) => {
  // 搜索逻辑
}, 300)

// 节流
const throttledScroll = throttle((event) => {
  // 滚动处理逻辑
}, 100)
```

### 网络检测

```javascript
import { getNetworkInfo, isSlowNetwork } from '@/lib/performance/performanceUtils'

const networkInfo = getNetworkInfo()
console.log('网络类型:', networkInfo.effectiveType)
console.log('是否慢速网络:', isSlowNetwork())
```

### 性能监控

```javascript
import { observeWebVitals, getPerformanceMetrics } from '@/lib/performance/performanceUtils'

// 监控Web Vitals
observeWebVitals((metric) => {
  console.log(`${metric.name}: ${metric.value} (${metric.rating})`)
})

// 获取性能指标
const metrics = getPerformanceMetrics()
console.log('页面加载时间:', metrics.loadTime)
```

## 配置选项

在 `blog.config.js` 中可以配置以下性能优化选项：

```javascript
// 性能优化配置
SEO_ENABLE_PERFORMANCE_MONITOR: false, // 启用性能监控
SEO_ENABLE_PRELOAD: true,              // 启用资源预加载
SEO_ENABLE_PREFETCH: true,             // 启用资源预取
SEO_ENABLE_PRECONNECT: true,           // 启用预连接
SEO_ENABLE_DNS_PREFETCH: true,         // 启用DNS预解析
SEO_PERFORMANCE_REPORT_URL: '',        // 性能数据上报URL
SEO_IMAGE_OPTIMIZATION_QUALITY: 75,    // 图片优化质量
SEO_ENABLE_LAZY_LOADING: true,         // 启用懒加载
SEO_ENABLE_VIRTUAL_SCROLL: false,      // 启用虚拟滚动
```

## 最佳实践

### 图片优化

1. **选择合适的格式**
   - 照片使用JPEG/WebP
   - 图标使用SVG
   - 透明图片使用PNG/WebP

2. **设置合适的质量**
   - 普通图片：75%
   - 高质量图片：85%
   - 缩略图：60%

3. **使用响应式图片**
   ```jsx
   <OptimizedImage
     src="/image.jpg"
     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
     width={800}
     height={600}
   />
   ```

### 懒加载策略

1. **关键内容优先**
   - 首屏内容立即加载
   - 非关键内容懒加载

2. **合适的触发距离**
   - 图片：50-100px
   - 内容区域：100-200px

3. **提供占位符**
   - 避免布局偏移
   - 提升用户体验

### 性能监控

1. **监控关键指标**
   - Core Web Vitals
   - 页面加载时间
   - 资源加载状态

2. **设置性能预算**
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

3. **持续优化**
   - 定期检查性能指标
   - 根据数据调整策略

## 故障排除

### 常见问题

1. **图片不显示**
   - 检查图片URL是否正确
   - 确认跨域设置
   - 验证图片格式支持

2. **懒加载不工作**
   - 检查Intersection Observer支持
   - 确认rootMargin设置
   - 验证threshold值

3. **性能监控无数据**
   - 确认浏览器支持Performance API
   - 检查配置是否启用
   - 验证网络连接

### 调试技巧

1. **使用浏览器开发者工具**
   - Network面板检查资源加载
   - Performance面板分析性能
   - Lighthouse进行性能审计

2. **启用性能监控**
   ```javascript
   SEO_ENABLE_PERFORMANCE_MONITOR: true
   ```

3. **查看控制台日志**
   - 性能指标输出
   - 错误信息提示
   - 网络状态变化

## 更新日志

### v1.0.0
- 初始版本发布
- 支持图片优化
- 支持懒加载
- 支持性能监控
- 支持资源预加载

## 贡献指南

欢迎提交Issue和Pull Request来改进性能优化功能。请确保：

1. 遵循现有代码风格
2. 添加适当的测试
3. 更新相关文档
4. 考虑向后兼容性

## 许可证

本项目采用MIT许可证。