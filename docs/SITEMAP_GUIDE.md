# NotionNext 动态Sitemap功能使用指南

## 概述

NotionNext的动态Sitemap功能为您的博客网站自动生成符合搜索引擎标准的XML sitemap文件。该功能支持多语言、错误处理、性能监控和智能缓存，确保您的网站内容能够被搜索引擎正确索引。

## 功能特性

### 🚀 核心功能
- **动态内容过滤**: 自动过滤已发布的文章和页面
- **多语言支持**: 支持多语言站点的locale前缀
- **智能缓存**: 可配置的缓存策略，平衡性能和数据新鲜度
- **错误处理**: 完善的错误处理和降级机制
- **性能监控**: 实时监控生成时间和内存使用

### 🔧 高级功能
- **增强版Sitemap**: 支持sitemap索引和分类sitemap
- **XML验证**: 确保生成的XML符合sitemap标准
- **URL验证**: 自动验证和清理URL格式
- **响应优化**: 优化的HTTP响应头和缓存策略

## 配置说明

### 基础配置

在 `blog.config.js` 中配置以下选项：

```javascript
// blog.config.js
const BLOG = {
  // 基础URL配置
  LINK: 'https://your-domain.com',
  
  // Notion页面ID（支持多站点）
  NOTION_PAGE_ID: 'your-notion-page-id',
  
  // 启用增强版sitemap
  SEO_SITEMAP_ENHANCED: true,
  
  // 其他SEO相关配置...
}
```

### 高级配置

#### 性能监控配置

```javascript
// 在 pages/sitemap.xml.js 中自定义性能监控
const performanceMonitor = new SitemapPerformanceMonitor({
  maxGenerationTime: 10000,        // 最大生成时间（毫秒）
  maxMemoryUsage: 512 * 1024 * 1024, // 最大内存使用（字节）
  enableCache: true,               // 启用缓存
  cacheMaxAge: 3600 * 1000,       // 缓存有效期（毫秒）
  enableMonitoring: true,          // 启用监控
  enableTimeoutProtection: true    // 启用超时保护
})
```

#### XML格式化配置

```javascript
const xmlFormatter = new XMLFormatter({
  baseUrl: 'https://your-domain.com',
  maxUrls: 50000,                  // 单个sitemap最大URL数量
  enableValidation: true,          // 启用XML验证
  prettyPrint: false              // 是否格式化输出
})
```

#### URL验证配置

```javascript
const urlValidator = new URLValidator({
  baseUrl: 'https://your-domain.com',
  blacklistedDomains: [           // 黑名单域名
    'github.com',
    'example.com'
  ],
  maxUrlLength: 2048              // 最大URL长度
})
```

## 使用方法

### 访问Sitemap

您的sitemap将在以下URL可用：
- 主sitemap: `https://your-domain.com/sitemap.xml`
- 增强版sitemap（如果启用）:
  - `https://your-domain.com/sitemap-posts.xml`
  - `https://your-domain.com/sitemap-pages.xml`
  - `https://your-domain.com/sitemap-index.xml`

### 多语言支持

对于多语言站点，配置多个Notion页面ID：

```javascript
// blog.config.js
const BLOG = {
  NOTION_PAGE_ID: 'zh-page-id,en-page-id,ja-page-id',
  // ...
}
```

sitemap将自动为每种语言生成相应的URL。

### 搜索引擎提交

将sitemap提交给主要搜索引擎：

1. **Google Search Console**
   - 登录 [Google Search Console](https://search.google.com/search-console)
   - 选择您的网站属性
   - 在左侧菜单选择"站点地图"
   - 添加sitemap URL: `sitemap.xml`

2. **Bing Webmaster Tools**
   - 登录 [Bing Webmaster Tools](https://www.bing.com/webmasters)
   - 选择您的网站
   - 在"配置我的网站"下选择"站点地图"
   - 提交sitemap URL

3. **robots.txt 配置**
   ```
   # robots.txt
   User-agent: *
   Allow: /
   
   Sitemap: https://your-domain.com/sitemap.xml
   ```

## 监控和调试

### 性能监控

查看sitemap生成的性能统计：

```javascript
// 在服务器日志中查看
[Sitemap] Performance stats: {
  generationTime: 1234,
  fromCache: false,
  cacheHitRate: "75.5%",
  memoryUsage: "45.2MB"
}
```

### 健康状态检查

系统会自动监控健康状态并在出现问题时发出警告：

```javascript
[Sitemap] Performance health warning: ["High generation time", "Low success rate"]
```

### 错误处理

系统提供多级错误处理：

1. **Level 1**: 重试机制
2. **Level 2**: 使用缓存数据
3. **Level 3**: 生成基础sitemap

### 调试模式

启用详细日志记录：

```javascript
// 在 SitemapPerformanceMonitor 配置中
const monitor = new SitemapPerformanceMonitor({
  enableLogging: true,
  logLevel: 'debug'  // 'debug', 'info', 'warn', 'error'
})
```

## 测试和验证

### 运行测试

```bash
# 运行所有sitemap测试
npm run test:sitemap

# 运行完整测试套件
node scripts/run-sitemap-tests.js

# 检查测试覆盖率
npm run test:coverage
```

### XML验证

使用在线工具验证生成的sitemap：
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- [Google Search Console](https://search.google.com/search-console) 的sitemap测试功能

### 性能测试

```bash
# 运行性能测试
npm run test:performance

# 测试大数据集性能
node scripts/test-sitemap-generation.js
```

## 故障排除

### 常见问题

#### 1. Sitemap为空或缺少内容
**原因**: 内容状态过滤问题
**解决方案**: 
- 确保Notion中的文章状态为"Published"
- 检查 `blog.config.js` 中的状态配置

#### 2. 生成时间过长
**原因**: 数据量大或网络延迟
**解决方案**:
- 启用缓存机制
- 调整 `maxGenerationTime` 配置
- 检查Notion API响应时间

#### 3. 内存使用过高
**原因**: 大量数据处理
**解决方案**:
- 调整 `maxMemoryUsage` 限制
- 启用数据分页处理
- 优化数据结构

#### 4. URL格式错误
**原因**: URL验证配置问题
**解决方案**:
- 检查 `baseUrl` 配置
- 验证slug格式
- 查看URL验证日志

### 日志分析

关键日志信息：

```bash
# 成功生成
[Sitemap] Successfully processed 2/2 sites
[Sitemap] Generated XML: 150 URLs, 45678 bytes, 1234ms

# 错误处理
[Sitemap] Failed to process 1 sites: [{"siteId": "test", "error": "Network timeout"}]
[Sitemap] Filtered 5 invalid URLs

# 性能警告
[Sitemap] Performance health warning: ["High generation time"]
```

## 最佳实践

### 1. 缓存策略
- 根据内容更新频率调整缓存时间
- 在高流量时段启用缓存
- 定期清理过期缓存

### 2. 性能优化
- 监控生成时间和内存使用
- 设置合理的超时限制
- 使用增强版sitemap处理大量内容

### 3. 错误处理
- 配置多级降级策略
- 监控错误率和类型
- 定期检查系统健康状态

### 4. SEO优化
- 确保URL结构清晰
- 设置适当的优先级和更新频率
- 及时提交给搜索引擎

## 更新日志

### v2.0.0 (2024-01-28)
- 重构sitemap生成架构
- 添加性能监控和缓存机制
- 增强错误处理和降级策略
- 支持多语言和增强版sitemap
- 完善测试框架

### v1.x.x
- 基础sitemap生成功能
- 简单的错误处理

## 技术支持

如果您遇到问题或需要帮助：

1. 查看本文档的故障排除部分
2. 检查系统日志和错误信息
3. 运行测试套件验证功能
4. 在GitHub仓库提交issue

---

**注意**: 本功能需要Node.js 20+和相应的依赖包。确保您的环境满足要求。 