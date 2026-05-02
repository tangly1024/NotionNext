# 贡献指南（中文）

- [环境准备](#环境准备)
- [新建主题](#新建主题)
- [新增语言](#新增语言)
- [环境变量](#环境变量)

感谢你愿意为 NotionNext 做贡献！

## 环境准备

请按以下流程参与开发：

1. 在 GitHub 上 Fork 仓库。
2. 克隆到本地（或使用 Codespaces）。
3. 为本次任务创建独立分支。
4. 完成功能或修复并本地验证。
5. 提交并推送分支。
6. 发起 PR 到 NotionNext 的 `main` 分支。

常用命令：

- `yarn`：安装依赖
- `yarn dev`：本地开发
- `yarn build`：生产构建
- `yarn start`：生产模式运行

## 必须遵守的协作规则

1. 每个任务使用独立分支，禁止直接提交到 `main`。
2. PR 保持聚焦，避免把无关重构混在一起。
3. 不要提交个人本地文件（如 `.env.local`）。
4. 不要提交会影响他人的个性化默认配置。
5. 提交前至少执行 lint / type-check / 必要测试。

更多文档导航：

- [文档导航入口（中文）](./docs/README.md)
- [Docs Navigation (English)](./docs/README.en.md)
- [主题迁移指南（中文）](./docs/THEME_MIGRATION_GUIDE.zh-CN.md)
- [Theme Migration Guide (English)](./docs/THEME_MIGRATION_GUIDE.md)

## 新建主题

如果要贡献新主题，请以 `themes/example` 为基础复制一个新目录，目录名即主题 key。

## 新增语言

如需新增本地化语言：

1. 复制 `lib/lang/en-US.js` 并按语言代码重命名（如 `zh-CN.js`）。
2. 完成文本翻译。
3. 在 `lib/lang.js` 注册该语言。
4. 提交 PR。

## 环境变量

1. 复制 `.env.example` 为 `.env.local`。
2. 按需填写配置。
3. 不要提交 `.env.local`。

配置优先级：

1. Notion 配置表（最高）
2. 环境变量
3. `blog.config.js`（最低）
