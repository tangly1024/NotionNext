# 搜索引擎提交功能文档

## 概述

搜索引擎提交功能是NotionNext博客系统的SEO优化功能之一，提供自动化的sitemap提交、URL索引请求和搜索引擎验证管理。

## 功能特性

### 支持的搜索引擎

- **Google** - Google Search Console
- **Bing** - Bing Webmaster Tools  
- **百度** - 百度搜索资源平台
- **Yandex** - Yandex Webmaster (可选)

### 核心功能

1. **自动Sitemap提交** - 定期提交sitemap到各搜索引擎
2. **URL索引请求** - 单个或批量URL的索引请求
3. **配额管理** - 监控和管理API调用配额
4. **验证码管理** - 管理搜索引擎验证文件和标签
5. **提交历史** - 记录所有提交历史和结果
6. **自动调度** - 监控内容变化，自动提交新内容

## 安装配置

### 1. 环境变量配置

在`.env.local`文件中添加以下配置：

```bash
# Google Indexing API
GOOGLE_INDEXING_API_KEY=your_google_api_key

# Bing Webmaster API  
BING_WEBMASTER_API_KEY=your_bing_api_key

# 百度推送Token
BAIDU_PUSH_TOKEN=your_baidu_token

# 自动提交配置
NEXT_PUBLIC_SEO_AUTO_SUBMISSION=true
NEXT_PUBLIC_SEO_SUBMISSION_INTERVAL=24
```

### 2. 获取API密钥

#### Google Indexing API
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Indexing API
4. 创建服务账号并下载JSON密钥文件
5. 在Search Console中添加服务账号为所有者

#### Bing Webmaster API
1. 访问 [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. 添加并验证您的网站
3. 获取API密钥

#### 百度推送Token
1. 访问 [百度搜索资源平台](https://ziyuan.baidu.com/)
2. 添加并验证您的网站
3. 在"数据引入"中获取推送接口的token

### 3. 博客配置

在`blog.config.js`中确认以下配置：

```javascript
// 搜索引擎提交配置
SEO_AUTO_SUBMISSION: process.env.NEXT_PUBLIC_SEO_AUTO_SUBMISSION || true,
SEO_SUBMISSION_INTERVAL: process.env.NEXT_PUBLIC_SEO_SUBMISSION_INTERVAL || 24,
SEO_ENABLE_GOOGLE_SUBMISSION: true,
SEO_ENABLE_BING_SUBMISSION: true,
SEO_ENABLE_BAIDU_SUBMISSION: true,
SEO_ENABLE_YANDEX_SUBMISSION: false,
```

## 使用方法

### 1. 管理界面

访问 `/admin/search-engine-submission` 进入管理界面：

- **概览** - 查看整体状态和快速操作
- **搜索引擎** - 管理各搜索引擎的启用状态
- **提交历史** - 查看详细的提交记录
- **验证管理** - 管理验证码和验证文件

### 2. API调用

#### 提交Sitemap

```javascript
// 提交到所有启用的搜索引擎
const response = await fetch('/api/seo/search-engine-submission', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'submit_sitemap'
  })
})

// 提交到指定搜索引擎
const response = await fetch('/api/seo/search-engine-submission', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'submit_sitemap',
    engineId: 'google'
  })
})
```

#### 提交单个URL

```javascript
const response = await fetch('/api/seo/search-engine-submission', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'submit_url',
    urls: ['https://example.com/new-post'],
    engineId: 'google',
    type: 'URL_UPDATED'
  })
})
```

#### 批量提交URL

```javascript
const response = await fetch('/api/seo/search-engine-submission', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'submit_batch',
    urls: [
      'https://example.com/post1',
      'https://example.com/post2',
      'https://example.com/post3'
    ],
    engineId: 'google'
  })
})
```

### 3. 程序化使用

```javascript
import searchEngineSubmission from '@/lib/seo/searchEngineSubmission'

// 配置
searchEngineSubmission.config.siteUrl = 'https://example.com'

// 提交sitemap
const result = await searchEngineSubmission.submitSitemapToAll()

// 提交单个URL
const result = await searchEngineSubmission.submitUrlForIndexing(
  'https://example.com/new-post',
  'google',
  'URL_UPDATED'
)

// 获取状态
const status = searchEngineSubmission.getEngineStatus()
```

## 自动提交调度器

### 启动调度器

```javascript
import autoSubmissionScheduler from '@/lib/seo/autoSubmissionScheduler'

// 启动自动调度器
autoSubmissionScheduler.start()

// 停止调度器
autoSubmissionScheduler.stop()

// 获取状态
const status = autoSubmissionScheduler.getQueueStatus()
```

### 配置选项

```javascript
autoSubmissionScheduler.updateConfig({
  checkInterval: 60 * 60 * 1000, // 检查间隔（毫秒）
  batchSize: 10,                 // 批处理大小
  maxRetries: 3,                 // 最大重试次数
  retryDelay: 5 * 60 * 1000,     // 重试延迟
  enableAutoSubmission: true     // 启用自动提交
})
```

## 验证文件管理

### 生成验证文件

访问以下URL生成验证文件：

```
/api/seo/verification-file?engine=google&type=html_file&code=your_code
/api/seo/verification-file?engine=bing&type=html_tag&code=your_code
/api/seo/verification-file?engine=baidu&type=dns&code=your_code
```

### 验证类型

- **html_file** - HTML验证文件
- **html_tag** - HTML meta标签
- **dns** - DNS TXT记录

## 配额限制

各搜索引擎的API配额限制：

| 搜索引擎 | 每日限制 | 每分钟限制 |
|---------|---------|-----------|
| Google  | 200     | 10        |
| Bing    | 10,000  | 100       |
| 百度    | 3,000   | 50        |
| Yandex  | 1,000   | 20        |

## 监控和调试

### 查看提交历史

```javascript
// 获取所有历史
const history = searchEngineSubmission.getSubmissionHistory()

// 获取指定搜索引擎的历史
const googleHistory = searchEngineSubmission.getSubmissionHistory('google', 50)
```

### 查看配额使用

```javascript
const status = searchEngineSubmission.getEngineStatus()
console.log(status.google.quotaUsed, status.google.quotaLimit)
```

### 调试模式

在开发环境中启用调试模式：

```javascript
// 在blog.config.js中
SEO_DEBUG_MODE: process.env.NODE_ENV === 'development'
```

## 错误处理

常见错误和解决方案：

### 1. API密钥错误
```
Error: Google Indexing API key not configured
```
**解决方案**: 检查环境变量`GOOGLE_INDEXING_API_KEY`是否正确配置

### 2. 配额超限
```
Error: Quota limit exceeded for Google
```
**解决方案**: 等待配额重置或减少提交频率

### 3. 网络错误
```
Error: Request failed: fetch failed
```
**解决方案**: 检查网络连接和API端点可用性

### 4. 验证失败
```
Error: No verification code found for google
```
**解决方案**: 在管理界面中添加相应的验证码

## 最佳实践

1. **合理设置提交频率** - 避免过于频繁的提交导致配额耗尽
2. **监控提交结果** - 定期检查提交历史和错误日志
3. **及时更新验证码** - 确保搜索引擎验证始终有效
4. **分批提交** - 对于大量URL，使用批量提交功能
5. **错误重试** - 实现适当的重试机制处理临时错误

## 测试

运行测试套件：

```bash
npm test lib/seo/__tests__/searchEngineSubmission.test.js
```

访问测试页面：
```
/search-engine-submission-test
```

## 故障排除

### 检查清单

- [ ] 环境变量是否正确配置
- [ ] API密钥是否有效
- [ ] 网站是否已在搜索引擎平台验证
- [ ] 配额是否充足
- [ ] 网络连接是否正常
- [ ] Sitemap是否可访问

### 日志查看

检查服务器日志中的相关错误信息：

```bash
# 查看提交相关日志
grep "search-engine-submission" logs/app.log

# 查看API错误
grep "API Error" logs/app.log
```

## 更新日志

### v1.0.0
- 初始版本发布
- 支持Google、Bing、百度、Yandex
- 自动提交调度器
- 管理界面
- API接口

### v1.1.0
- 添加批量提交功能
- 改进错误处理
- 增加配额监控
- 优化用户界面

## 支持

如有问题或建议，请：

1. 查看本文档的故障排除部分
2. 检查GitHub Issues
3. 提交新的Issue或Pull Request

## 许可证

本功能遵循NotionNext项目的开源许可证。