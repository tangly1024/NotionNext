# 架构总览

## 核心链路

NotionNext 的主流程可以简化为：

1. **数据获取层**（`lib/db/`）  
   从 Notion 拉取数据、做结构归一化、字段映射、缓存与去重。
2. **服务端数据组装层**（`lib/db/SiteDataApi.js`）  
   统一产出 `allPages` / `tagOptions` / `categoryOptions` / `siteInfo` 等。
3. **路由层**（`pages/`）  
   在 `getStaticProps/getStaticPaths` 中做页面级过滤、分页、渲染准备。
4. **主题层**（`themes/`）  
   各主题通过统一的数据契约消费 `props`，渲染不同 UI。

## 数据优先级

配置读取优先级（高 -> 低）：

1. Notion Config 表同名键
2. 环境变量（`.env.local` / 部署平台 env）
3. `blog.config.js` + `conf/*.config.js`

## 为什么强调“数据层下沉”

如果某个排序/过滤策略属于“全局业务规则”，优先放在数据层而非分散在多个页面路由中。  
好处：

- 减少改动面和重复逻辑
- 降低漏改风险（分页/分类/搜索路由容易遗漏）
- 让所有主题行为一致

## 缓存与构建相关

- 缓存模块位于 `lib/cache/`
- 构建阶段并发与预热逻辑位于 `lib/build/`
- 这些模块会影响 CI/CD 和大站点构建速度，改动时需要附带验证说明

