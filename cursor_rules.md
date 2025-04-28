# NotionNext-Blog Cursor IDE 规范指南

## 代码风格规范

1. **命名规范**

   - 组件名采用 PascalCase（首字母大写）
   - 函数名、变量名采用 camelCase（小驼峰）
   - 常量使用全大写下划线分隔（如 `NEXT_PUBLIC_THEME`）
   - CSS 类名使用 kebab-case 或 Tailwind 原子类

2. **文件组织**

   - 每个主题模块保持在对应 `/themes/{themeName}` 目录下
   - 公共组件放置在 `/components` 目录下
   - 页面路由放置在 `/pages` 目录下
   - 核心功能放置在 `/lib` 目录下

3. **导入顺序**
   - React/Next.js 内置模块
   - 第三方库/依赖
   - 本地组件
   - 本地工具/配置
   - CSS/样式导入

## 开发原则

### SOLID 原则应用

1. **单一职责原则 (SRP)**

   - 组件只负责单一功能
   - 例如：`PostHeader` 组件只负责文章头部的渲染

2. **开放封闭原则 (OCP)**

   - 组件设计时考虑扩展性，减少修改
   - 使用主题配置而非硬编码样式

3. **里氏替换原则 (LSP)**

   - 子组件可以替换父组件而不影响功能
   - 主题间组件保持接口一致性

4. **接口隔离原则 (ISP)**

   - 组件间通过明确的 props 接口通信
   - 避免传递整个 context 或大型对象

5. **依赖倒置原则 (DIP)**
   - 高层模块不应依赖低层模块
   - 使用 Context、Hooks 实现依赖注入

### DRY 原则

1. 抽取重复代码为独立函数或组件
2. 使用 `blog.config.js` 集中管理配置
3. 共享样式通过 Tailwind 组件或 CSS 变量实现

### KISS 原则

1. 函数保持简单，单一功能且易于理解
2. 避免过度优化和复杂算法
3. 使用直观的命名，避免缩写或特殊符号

### YAGNI 原则

1. 只实现当前需要的功能
2. 不提前实现可能需要的特性
3. 按需引入第三方依赖

### 安全最佳实践

1. 遵循 OWASP 安全指南
2. 所有用户输入进行验证和转义
3. 使用 CSP 保护网站免受 XSS 攻击
4. 实现适当的认证和授权机制

## 主题开发指南

1. **主题结构规范**

   - 使用 `themes/{themeName}/index.js` 作为主题入口
   - 将主题组件放在 `themes/{themeName}/components/` 目录下
   - 主题配置放在 `themes/{themeName}/config.js` 中

2. **样式处理**

   - 使用 Tailwind CSS 类优先
   - 避免行内样式
   - 主题特定样式使用 CSS Modules 或 styled-jsx

3. **响应式设计**
   - 使用 Tailwind 断点（如 sm, md, lg, xl）实现响应式
   - 移动优先设计，默认为移动端样式

## 性能优化规范

1. **代码拆分**

   - 大型组件使用动态导入 `dynamic()`
   - 按路由拆分代码包

2. **图片优化**

   - 使用 Next.js 的 `next/image` 组件
   - 提供合适的图片尺寸和格式
   - 添加 placeholder 和 lazy loading

3. **组件优化**
   - 使用 React.memo 优化纯组件
   - 使用 useMemo 和 useCallback 缓存计算结果和函数
   - 避免不必要的渲染

## Notion 集成规范

1. **数据获取**

   - 使用 `/lib/notion/` 中的方法获取数据
   - 实现适当的缓存策略减少 API 请求
   - 错误处理和边界情况考虑

2. **内容渲染**
   - 使用 `NotionPage` 组件渲染 Notion 内容
   - 自定义渲染使用 `mapPageUrl` 和 `components` props

## Git 提交规范

1. **提交信息格式**

   - 类型(范围): 描述
   - 类型：feat, fix, docs, style, refactor, test, chore
   - 范围：影响的模块或文件
   - 描述：简洁明了的变更说明

2. **分支策略**
   - main/master: 生产环境分支
   - develop: 开发环境分支
   - feature/\*: 功能开发分支
   - fix/\*: 修复分支

## 测试规范

1. **组件测试**

   - 使用 React Testing Library 测试组件
   - 关注用户交互而非实现细节
   - 测试文件与被测试组件放在同一目录

2. **端到端测试**
   - 使用 Cypress 或 Playwright 进行端到端测试
   - 覆盖关键用户流程
   - 自动化测试集成到 CI/CD 流程

## 文档规范

1. **代码注释**

   - 复杂逻辑需添加解释性注释
   - 组件 props 使用 JSDoc 文档
   - API 函数添加参数和返回值说明

2. **README 和文档**
   - 新功能或组件需更新相关文档
   - 遵循文档结构一致性
   - 提供示例代码和用法说明

## 多语言开发规范

1. **文本管理**

   - 所有文本使用 `/lib/lang/` 中的语言文件
   - 避免硬编码文本字符串
   - 使用 `useGlobal().locale` 获取当前语言环境

2. **国际化考虑**
   - 考虑文本长度变化对布局的影响
   - 日期和数字格式化使用 Intl API
   - 支持 RTL 语言的样式调整
