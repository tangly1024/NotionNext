# URLValidator 工具类文档

## 概述

URLValidator 是一个专门用于sitemap生成中的URL验证、清理和标准化处理的工具类。它整合了原有的分散验证逻辑，提供了统一的URL处理接口。

## 功能特性

### 1. Slug验证 (`isValidSlug`)
- 验证slug的基本格式和有效性
- 过滤包含协议、片段标识符、查询参数的无效slug
- 过滤包含特殊字符的slug
- 支持长度限制验证

### 2. URL验证 (`isValidURL`)
- 验证完整URL的格式和有效性
- 确保URL属于指定的基础域名
- 过滤黑名单域名
- 支持协议和长度验证

### 3. URL清理 (`cleanURL`)
- 自动添加协议前缀
- 移除片段标识符和查询参数
- 标准化路径分隔符
- 处理相对路径转换

### 4. URL生成 (`generateURL`)
- 根据slug和locale生成完整URL
- 支持多语言前缀处理
- 自动处理中文默认语言

### 5. 批量处理
- `validateURLList`: 批量验证URL列表
- `deduplicateURLs`: 去重URL列表
- `getValidationStats`: 获取验证统计信息

### 6. XML处理
- `escapeXML`: XML特殊字符转义

## 使用示例

```javascript
import { URLValidator } from '@/lib/utils/URLValidator'

// 创建实例
const validator = new URLValidator({
  baseUrl: 'https://www.shareking.vip',
  blacklistedDomains: ['github.com', 'example.com'],
  maxUrlLength: 2048
})

// 验证slug
const isValid = validator.isValidSlug('my-post-slug') // true

// 生成URL
const url = validator.generateURL('my-post', 'en') 
// 返回: 'https://www.shareking.vip/en/my-post'

// 清理URL
const cleanUrl = validator.cleanURL('  /my-post?param=1#section  ')
// 返回: 'https://www.shareking.vip/my-post'

// 批量验证
const urls = [
  { loc: 'https://www.shareking.vip/post1' },
  { loc: 'https://invalid-domain.com/post2' }
]
const result = validator.validateURLList(urls)
// result.valid: 有效URL数组
// result.invalid: 无效URL数组

// XML转义
const escaped = validator.escapeXML('Title & Description')
// 返回: 'Title &amp; Description'
```

## 配置选项

```javascript
const config = {
  baseUrl: 'https://www.shareking.vip',        // 基础域名
  blacklistedDomains: [                        // 黑名单域名
    'github.com',
    'tangly1024.com',
    'docs.tangly1024.com'
  ],
  maxUrlLength: 2048                           // 最大URL长度
}
```

## 在Sitemap中的集成

URLValidator已经完全集成到 `pages/sitemap.xml.js` 中：

```javascript
// 初始化验证器
const urlValidator = new URLValidator({ baseUrl })

// 过滤有效文章
allPages.filter(p => {
  return p.status === 'Published' &&
         p.slug &&
         p.publishDay &&
         urlValidator.isValidSlug(p.slug)
})

// 生成URL
const generatedUrl = urlValidator.generateURL(post.slug, locale)

// 批量验证和去重
const validationResult = urlValidator.validateURLList(allUrls)
const uniqueUrls = urlValidator.deduplicateURLs(validationResult.valid)
```

## 测试覆盖

URLValidator 包含全面的单元测试，覆盖以下场景：

### 基础功能测试
- ✅ slug验证（有效/无效场景）
- ✅ URL验证（有效/无效场景）
- ✅ URL清理和标准化
- ✅ URL生成（包括多语言）

### 批量处理测试
- ✅ URL列表验证
- ✅ URL去重处理
- ✅ 验证统计信息

### 特殊场景测试
- ✅ XML转义处理
- ✅ 自定义配置
- ✅ 边界条件处理

### 集成测试
- ✅ sitemap状态过滤
- ✅ 多语言URL生成
- ✅ 错误处理

## 运行测试

```bash
# 运行URLValidator单元测试
node scripts/test-url-validator.js

# 运行sitemap过滤集成测试
node scripts/test-sitemap-filter.js

# 验证sitemap重构
node scripts/verify-url-validator.js
```

## 性能特性

- **内存优化**: 使用Map进行去重，避免O(n²)复杂度
- **批量处理**: 支持大量URL的高效处理
- **错误容错**: 单个URL验证失败不影响整体处理
- **缓存友好**: 验证结果可用于缓存决策

## 错误处理

URLValidator 采用优雅的错误处理策略：

- 无效输入返回 `null` 或 `false`，不抛出异常
- 批量处理时分离有效和无效结果
- 提供详细的错误原因分类
- 支持验证统计信息获取

## 扩展性

URLValidator 设计为可扩展的：

- 支持自定义配置
- 可添加新的验证规则
- 支持插件式的黑名单管理
- 易于添加新的URL处理功能

## 最佳实践

1. **配置管理**: 将配置集中管理，避免硬编码
2. **批量处理**: 优先使用批量方法处理大量URL
3. **错误检查**: 始终检查返回值，处理null情况
4. **性能监控**: 使用统计信息监控验证效果
5. **测试覆盖**: 为新增功能编写对应测试用例