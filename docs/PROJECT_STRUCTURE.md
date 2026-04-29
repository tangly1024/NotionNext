# 目录与模块说明

## 顶层目录（常用）

- `pages/`：Next.js 路由入口（SSG/ISR 的 `getStaticProps/getStaticPaths`）
- `themes/`：各主题实现（UI 与主题配置）
- `components/`：跨主题复用组件
- `lib/`：核心逻辑（数据、缓存、工具、配置读取）
- `conf/`：拆分后的配置文件（由 `blog.config.js` 聚合）
- `__tests__/`：单元测试
- `scripts/`：工程脚本（质量检查、初始化、钩子安装等）
- `.github/`：Issue/PR 模板与协作元数据

## 关键文件

- `blog.config.js`：聚合配置入口（通过 `...require('./conf/*.config')`）
- `lib/config.js`：`siteConfig()` 读取逻辑（含优先级）
- `lib/db/SiteDataApi.js`：全站数据组装核心
- `CONTRIBUTING.md`：对外贡献入口
- `docs/README.md`：文档导航入口

## 改动建议

- **全局规则改动**：优先 `lib/db/` 或 `lib/utils/`
- **主题视觉改动**：优先 `themes/<theme>/`
- **配置项新增**：优先 `conf/*.config.js`，再由 `blog.config.js` 聚合
- **避免在多个 `pages/*` 重复粘贴同一业务逻辑**

