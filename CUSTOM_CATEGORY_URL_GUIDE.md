# 自定义分类URL映射功能使用指南

## 🎯 功能概述

这个功能允许你将中文分类名映射为英文URL路径，实现更SEO友好的URL结构。

### 效果对比

**修改前:**
- 文章URL: `www.shareking.vip/article/qiwushi`
- 分类URL: `www.shareking.vip/category/影视资源`

**修改后:**
- 文章URL: `www.shareking.vip/movie/qiwushi`
- 分类URL: `www.shareking.vip/category/movie`

## 🔧 配置方法

### 1. 基本配置

在 `blog.config.js` 文件中找到 `CATEGORY_URL_MAPPING` 配置：

```javascript
CATEGORY_URL_MAPPING: {
  '影视资源': 'movie',
  '软件资源': 'software', 
  '教程资源': 'tutorials',
  '游戏资源': 'games',
  '书籍资源': 'books'
}
```

### 2. 添加新的分类映射

```javascript
CATEGORY_URL_MAPPING: {
  '影视资源': 'movie',
  '软件资源': 'software', 
  '教程资源': 'tutorials',
  '游戏资源': 'games',
  '书籍资源': 'books',
  // 添加新的映射
  '音乐资源': 'music',
  '设计资源': 'design'
}
```

### 3. 启用/禁用功能

```javascript
CUSTOM_CATEGORY_MAPPING: true, // 启用自定义分类URL映射
```

## 📁 创建的文件

### 核心文件
- `lib/utils/categoryMapping.js` - 分类映射核心逻辑
- `lib/utils/urlGenerator.js` - URL生成工具
- `lib/utils/sitemapGenerator.js` - Sitemap生成工具

### 修改的文件
- `pages/[prefix]/[slug]/index.js` - 文章页面路由
- `pages/category/[category]/index.js` - 分类页面路由
- `blog.config.js` - 添加配置选项

### 测试文件
- `pages/test-custom-category-urls.js` - 功能测试页面

## 🚀 使用方法

### 1. 文章URL生成

```javascript
import { generatePostUrl, generatePostPath } from '@/lib/utils/urlGenerator'

const post = {
  title: '七武士',
  category: '影视资源',
  slug: 'qiwushi'
}

const fullUrl = generatePostUrl(post)
// 结果: https://www.shareking.vip/movie/qiwushi

const relativePath = generatePostPath(post)
// 结果: /movie/qiwushi
```

### 2. 分类URL生成

```javascript
import { generateCategoryUrl, generateCategoryPath } from '@/lib/utils/urlGenerator'

const categoryUrl = generateCategoryUrl('影视资源')
// 结果: https://www.shareking.vip/category/movie

const categoryPath = generateCategoryPath('影视资源')
// 结果: /category/movie
```

### 3. URL解析

```javascript
import { parseUrlPath } from '@/lib/utils/urlGenerator'

const parsed = parseUrlPath('/movie/qiwushi')
// 结果: {
//   type: 'post',
//   prefix: 'movie',
//   slug: 'qiwushi',
//   isCustomCategory: true
// }
```

## 🔍 路由工作原理

### 文章页面路由 (`pages/[prefix]/[slug]/index.js`)

1. **路径生成**: 为每个有分类的文章生成自定义路径
2. **内容获取**: 根据分类和slug查找对应文章
3. **向后兼容**: 保持原有的 `article/slug` 格式仍然可用

### 分类页面路由 (`pages/category/[category]/index.js`)

1. **路径支持**: 同时支持中文和英文分类路径
2. **内容过滤**: 根据实际分类名过滤文章
3. **SEO优化**: 英文路径更利于搜索引擎收录

## 📊 SEO优势

### 1. 搜索引擎友好
- ✅ 英文URL更容易被搜索引擎理解
- ✅ 避免中文URL编码问题
- ✅ 提升国际化SEO效果

### 2. 用户体验
- ✅ URL更简洁易记
- ✅ 分享时URL更美观
- ✅ 符合国际化标准

### 3. 技术优势
- ✅ 减少URL编码问题
- ✅ 提升页面加载速度
- ✅ 更好的缓存效果

## 🧪 测试功能

访问测试页面验证功能：
```
http://localhost:3000/test-custom-category-urls
```

测试内容包括：
- 分类映射测试
- 文章URL生成测试
- 分类URL生成测试
- URL解析测试

## 🔧 高级配置

### 1. 动态配置

可以通过环境变量动态配置：

```bash
# .env.local
NEXT_PUBLIC_CUSTOM_CATEGORY_MAPPING=true
```

### 2. 自定义映射逻辑

如果需要更复杂的映射逻辑，可以修改 `lib/utils/categoryMapping.js`：

```javascript
export function getCategoryUrlPath(chineseCategory) {
  // 自定义映射逻辑
  const mapping = getCategoryMappingConfig()
  
  // 添加自定义处理
  if (chineseCategory.includes('专业')) {
    return 'professional-' + (mapping[chineseCategory] || chineseCategory)
  }
  
  return mapping[chineseCategory] || chineseCategory
}
```

### 3. 批量URL更新

如果需要批量更新现有文章的URL，可以创建迁移脚本：

```javascript
// scripts/migrate-urls.js
import { generatePostPath } from '@/lib/utils/urlGenerator'

function migrateUrls(posts) {
  return posts.map(post => ({
    ...post,
    newUrl: generatePostPath(post),
    oldUrl: `/article/${post.slug}`
  }))
}
```

## 🚨 注意事项

### 1. 向后兼容
- 原有的URL格式仍然可用
- 不会破坏现有的链接
- 搜索引擎索引不会丢失

### 2. 缓存清理
修改配置后需要：
- 重启开发服务器
- 清理构建缓存
- 重新生成静态页面

### 3. Sitemap更新
- 自动生成包含新URL格式的sitemap
- 保持SEO优化效果
- 支持多种URL格式

## 🔄 迁移步骤

### 1. 备份现有配置
```bash
cp blog.config.js blog.config.js.backup
```

### 2. 更新配置
按照上述配置方法更新 `blog.config.js`

### 3. 测试功能
访问测试页面验证功能正常

### 4. 部署更新
```bash
npm run build
npm run start
```

### 5. 验证效果
- 检查新URL是否正常工作
- 验证SEO效果
- 确认原有链接仍然可用

## 📞 技术支持

如果遇到问题：
1. 检查配置是否正确
2. 查看测试页面的结果
3. 检查浏览器控制台错误
4. 验证文章分类名是否匹配

## 🎉 总结

这个功能为你的网站提供了：
- ✅ SEO友好的英文URL
- ✅ 更好的用户体验
- ✅ 国际化支持
- ✅ 向后兼容性
- ✅ 灵活的配置选项

现在你可以享受更专业、更SEO友好的URL结构了！