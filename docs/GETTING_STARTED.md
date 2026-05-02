# 快速上手（新开发者）

[English](./GETTING_STARTED.en.md)

## 1. 环境要求

- Node.js >= 20
- Yarn（项目默认使用 Yarn）
- Git

## 2. 初始化项目

```bash
yarn
cp .env.example .env.local
```

在 `.env.local` 至少配置：

- `NOTION_PAGE_ID`

然后启动：

```bash
yarn dev
```

## 3. 推荐本地检查命令

```bash
yarn lint
yarn type-check
yarn test
```

## 4. 你应该先读什么

1. [架构总览](./ARCHITECTURE.md)
2. [目录与模块说明](./PROJECT_STRUCTURE.md)
3. [配置体系说明](./CONFIGURATION.md)
4. [提交与 PR 规范](./CONTRIBUTION_WORKFLOW.md)

## 5. 首次贡献建议

- 优先挑选小范围问题（单文件或单模块）
- 不要在一个 PR 混入多类改动（功能 + 依赖升级 + 个人配置）
- 提交前确保能通过本地 lint/test

