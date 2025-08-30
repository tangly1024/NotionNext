# 开发者指南

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0
- Git

### 初始化开发环境

```bash
# 克隆项目
git clone <repository-url>
cd NotionNext

# 初始化开发环境
npm run init-dev

# 启动开发服务器
npm run dev
```

## 开发工具

### 代码质量工具

```bash
# 代码格式化
npm run format

# 代码检查
npm run lint

# 类型检查
npm run type-check

# 完整质量检查
npm run quality

# 预提交检查
npm run pre-commit
```

### 开发辅助工具

```bash
# 查看所有开发工具命令
npm run dev-tools

# 清理项目文件
npm run clean

# 生成组件模板
npm run dev-tools generate:component MyComponent

# 分析包大小
npm run dev-tools analyze

# 检查依赖更新
npm run check-updates

# 生成项目文档
npm run docs
```

### Git Hooks

```bash
# 安装Git钩子
npm run setup-hooks

# 检查钩子状态
npm run check-hooks

# 移除Git钩子
npm run remove-hooks
```

## 项目结构

```
NotionNext/
├── components/          # React组件
├── pages/              # Next.js页面
├── lib/                # 工具库和配置
│   ├── config/         # 配置文件
│   ├── utils/          # 工具函数
│   ├── middleware/     # 中间件
│   └── cache/          # 缓存相关
├── themes/             # 主题文件
├── conf/               # 配置文件
├── scripts/            # 构建和开发脚本
├── types/              # TypeScript类型定义
├── .vscode/            # VSCode配置
└── docs/               # 项目文档
```

## 编码规范

### 代码风格

- 使用 Prettier 进行代码格式化
- 使用 ESLint 进行代码检查
- 使用 TypeScript 进行类型检查
- 遵循 React Hooks 最佳实践

### 命名规范

- **组件**: PascalCase (例: `LazyImage`)
- **文件**: kebab-case (例: `lazy-image.js`)
- **变量/函数**: camelCase (例: `getUserData`)
- **常量**: UPPER_SNAKE_CASE (例: `API_BASE_URL`)

### 提交规范

使用 Conventional Commits 规范:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**类型 (type):**
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建工具或辅助工具的变动
- `perf`: 性能优化
- `ci`: CI配置文件和脚本的变动
- `build`: 影响构建系统或外部依赖的更改
- `revert`: 回滚之前的提交

**示例:**
```
feat(auth): add user authentication
fix(ui): resolve button alignment issue
docs: update installation guide
```

## 开发流程

### 1. 创建功能分支

```bash
git checkout -b feature/your-feature-name
```

### 2. 开发和测试

```bash
# 启动开发服务器
npm run dev

# 运行代码质量检查
npm run quality

# 运行测试
npm test
```

### 3. 提交代码

```bash
# 添加文件
git add .

# 提交（会自动运行pre-commit钩子）
git commit -m "feat: add new feature"
```

### 4. 推送代码

```bash
# 推送（会自动运行pre-push钩子）
git push origin feature/your-feature-name
```

## 调试指南

### VSCode调试

项目已配置VSCode调试环境，支持以下调试模式:

- **Next.js: debug server-side** - 调试服务端代码
- **Next.js: debug client-side** - 调试客户端代码
- **Next.js: debug full stack** - 全栈调试
- **Jest: debug tests** - 调试测试

### 浏览器调试

```bash
# 启动调试模式
npm run dev

# 在浏览器中打开开发者工具
# 访问 http://localhost:3000
```

### 性能分析

```bash
# 分析包大小
npm run bundle-report

# 生成性能报告
npm run analyze
```

## 环境变量

### 必需的环境变量

- `NOTION_PAGE_ID`: Notion页面ID

### 可选的环境变量

- `NEXT_PUBLIC_TITLE`: 网站标题
- `NEXT_PUBLIC_DESCRIPTION`: 网站描述
- `NEXT_PUBLIC_AUTHOR`: 作者名称
- `NEXT_PUBLIC_LINK`: 网站链接

### 环境变量验证

```bash
# 验证环境变量配置
npm run quality
```

## 常见问题

### 1. 依赖安装失败

```bash
# 清理缓存
npm run clean
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 2. 构建失败

```bash
# 检查代码质量
npm run quality

# 清理并重新构建
npm run clean
npm run build
```

### 3. 类型错误

```bash
# 运行类型检查
npm run type-check

# 查看详细错误信息
npx tsc --noEmit --pretty
```

### 4. ESLint错误

```bash
# 自动修复ESLint错误
npm run lint:fix

# 查看所有ESLint规则
npx eslint --print-config .
```

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

### Pull Request 要求

- 代码通过所有质量检查
- 包含适当的测试
- 更新相关文档
- 遵循提交规范

## 资源链接

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://reactjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Notion API 文档](https://developers.notion.com/)

## 获取帮助

- 查看项目文档: `npm run docs`
- 检查开发工具: `npm run dev-tools`
- 提交 Issue 或 Pull Request
