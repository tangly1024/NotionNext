# NotionNext-Blog 项目文件结构描述

## 根目录文件

- **blog.config.js**: 博客的主要配置文件，定义了网站的主题、语言、作者信息、站点信息等核心配置，以及引入了各个功能模块的配置。
- **next.config.js**: Next.js框架的配置文件，包含了多语言支持、图片优化、URL重写、静态导出等设置。
- **package.json**: 项目依赖管理文件，定义了项目名称、版本、依赖包及脚本命令，表明这是一个基于Next.js的Notion博客系统。
- **middleware.ts**: Next.js中间件文件，处理请求拦截和响应修改。
- **tsconfig.json**: TypeScript配置文件，定义了TypeScript编译选项和路径映射。
- **tailwind.config.js**: Tailwind CSS配置文件，用于自定义网站的样式系统。
- **next-sitemap.config.js**: 站点地图生成配置，用于SEO优化。

## 主要目录结构

### /lib 目录 - 核心功能库

- **/lib/notion/**: Notion API集成相关功能，包含获取页面数据、文章内容、分类标签等核心功能。

  - **getNotionAPI.js**: 创建Notion API客户端实例。
  - **getPostBlocks.js**: 获取文章内容块。
  - **getAllTags.js**: 获取所有标签。
  - **getAllCategories.js**: 获取所有分类。
  - **getPageProperties.js**: 处理Notion页面属性。

- **/lib/utils/**: 通用工具函数集合。
- **/lib/cache/**: 缓存相关功能，提升性能。
- **/lib/db/**: 数据库操作相关功能。
- **/lib/lang/**: 多语言支持。

### /pages 目录 - 页面路由

- **index.js**: 网站首页。
- **/pages/api/**: API路由，处理后端请求。
- **/pages/[prefix]/[slug]/**: 动态路由，用于文章页面。
- **/pages/category/**: 分类页面。
- **/pages/tag/**: 标签页面。
- **/pages/search/**: 搜索功能页面。
- **/pages/auth/**: 认证相关页面。

### /themes 目录 - 主题系统

- **/themes/heo/**: Heo主题的组件和样式。
- **/themes/magazine/**: Magazine杂志风格主题。
- **/themes/proxio/**: Proxio主题。
- **/themes/landing/**: Landing页面主题。
- **theme.js**: 主题配置和工具函数。

### /components 目录 - UI组件

- 包含各种可重用的UI组件，如导航栏、页脚、文章卡片等。

### /public 目录 - 静态资源

- **/public/images/**: 图片资源。
- **/public/css/**: 额外的CSS样式文件。
- **/public/js/**: JavaScript文件。
- **/public/rss/**: RSS订阅相关文件。

### /styles 目录 - 全局样式

- 包含全局CSS样式定义。

### /conf 目录 - 模块化配置

- 存放被blog.config.js引入的各功能模块配置，如评论、分析、图片、字体等。

## 特性和功能

1. **Notion集成**: 使用Notion作为CMS，无需额外后端。
2. **多主题支持**: 提供多种主题选择（heo、magazine、proxio、landing）。
3. **多语言支持**: 支持通过配置实现多语言内容。
4. **响应式设计**: 适配各种设备尺寸。
5. **SEO优化**: 包含sitemap、RSS等SEO工具。
6. **评论系统**: 支持多种评论插件。
7. **访问统计**: 集成多种访问统计工具。
8. **用户认证**: 提供用户登录、注册功能。

## 开发相关

- 使用Next.js框架构建，支持SSR和静态生成。
- 使用TypeScript增强代码类型安全。
- 使用Tailwind CSS进行样式开发。
- 支持开发环境热重载和生产环境优化。
