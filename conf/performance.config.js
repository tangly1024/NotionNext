/**
 * 性能优化配置
 */
module.exports = {
  // 预加载配置
  PRELOAD_CRITICAL_RESOURCES: process.env.NEXT_PUBLIC_PRELOAD_CRITICAL_RESOURCES || true,
  
  // 懒加载配置
  LAZY_LOAD_IMAGES: process.env.NEXT_PUBLIC_LAZY_LOAD_IMAGES || true,
  LAZY_LOAD_THRESHOLD: process.env.NEXT_PUBLIC_LAZY_LOAD_THRESHOLD || '200px',
  
  // 代码分割配置
  ENABLE_CODE_SPLITTING: process.env.NEXT_PUBLIC_ENABLE_CODE_SPLITTING || true,
  CHUNK_SIZE_LIMIT: process.env.NEXT_PUBLIC_CHUNK_SIZE_LIMIT || 244000, // 244KB
  
  // 缓存配置
  BROWSER_CACHE_TTL: process.env.NEXT_PUBLIC_BROWSER_CACHE_TTL || 86400, // 24小时
  CDN_CACHE_TTL: process.env.NEXT_PUBLIC_CDN_CACHE_TTL || 604800, // 7天
  
  // 压缩配置
  ENABLE_GZIP: process.env.NEXT_PUBLIC_ENABLE_GZIP || true,
  ENABLE_BROTLI: process.env.NEXT_PUBLIC_ENABLE_BROTLI || true,
  
  // 字体优化
  FONT_DISPLAY: process.env.NEXT_PUBLIC_FONT_DISPLAY || 'swap',
  PRELOAD_FONTS: process.env.NEXT_PUBLIC_PRELOAD_FONTS || true,
  
  // 第三方脚本优化
  DEFER_THIRD_PARTY_SCRIPTS: process.env.NEXT_PUBLIC_DEFER_THIRD_PARTY_SCRIPTS || true,
  
  // 图片优化
  WEBP_SUPPORT: process.env.NEXT_PUBLIC_WEBP_SUPPORT || true,
  AVIF_SUPPORT: process.env.NEXT_PUBLIC_AVIF_SUPPORT || true,
  
  // 预取配置
  PREFETCH_LINKS: process.env.NEXT_PUBLIC_PREFETCH_LINKS || true,
  PREFETCH_IMAGES: process.env.NEXT_PUBLIC_PREFETCH_IMAGES || false,
  
  // 性能监控
  ENABLE_WEB_VITALS: process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS || true,
  PERFORMANCE_BUDGET: {
    FCP: 1800, // First Contentful Paint (ms)
    LCP: 2500, // Largest Contentful Paint (ms)
    FID: 100,  // First Input Delay (ms)
    CLS: 0.1   // Cumulative Layout Shift
  }
}
