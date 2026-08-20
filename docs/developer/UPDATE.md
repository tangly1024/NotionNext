# NotionNext 版本更新指南

本指南帮助您安全地将博客更新到上游最新版本，同时保留所有个性化配置。

按照以下流程操作，您可以：
- ✅ 获取 NotionNext 的最新功能和修复
- ✅ 保留您的个人配置（头像、标题、域名等）
- ✅ 安全处理可能的代码冲突

> ⚠️ 本指南适用于 Vercel 部署场景，其他平台未测试。

## 分支管理策略

本策略参考 [NotionNext 官方升级教程](/user-guide/update) 中的建议，使用双分支管理模式。

### 分支说明

| 分支 | 用途 | 更新策略 | 部署状态 |
|------|------|----------|----------|
| `main` | 同步上游原始代码 | 快进合并 | 不部署 |
| `deploy` | 生产环境代码 | 合并 main + 保留个性化 | Vercel 自动部署 |
| `feature/*` | 功能开发 | 基于 deploy 创建 | 不部署 |

### 架构示意

```
GitHub Fork Repository
├── main (同步 notionnext-org/NotionNext)
├── deploy (生产分支 → Vercel)
└── feature/* (开发分支)
```

## 前置准备

### 1. 配置 Vercel 生产分支（重要）

在 Vercel 中将生产分支设置为 `deploy`：

1. 登录 [Vercel Dashboard](https://vercel.com)
2. 进入你的 NotionNext 项目
3. 点击 **Settings** → **Git**
4. 找到 **Production Branch** 设置
5. 将默认的 `main` 改为 `deploy`
6. 保存设置

> 💡 这样配置后，只有 `deploy` 分支的更新会触发生产环境部署，`main` 分支仅用于同步上游。

### 2. 配置上游仓库（仅首次）

```bash
# 添加上游仓库
git remote add upstream https://github.com/notionnext-org/NotionNext.git

# 验证配置
git remote -v
```

预期输出：
```
origin    https://github.com/[你的用户名]/NotionNext.git (fetch)
origin    https://github.com/[你的用户名]/NotionNext.git (push)
upstream  https://github.com/notionnext-org/NotionNext.git (fetch)
upstream  https://github.com/notionnext-org/NotionNext.git (push)
```

> ⚠️ 如果没有看到 upstream 行，说明上游仓库未成功添加

### 3. 识别个性化文件

更新前先了解你的个性化修改：

```bash
# 查看个性化修改文件列表
git diff --name-only main..deploy
```

常见个性化文件：
- `blog.config.js` - 博客配置
- `public/avatar.png` - 头像
- `public/favicon.ico` - 网站图标
- `pages/_app.js` - 全局脚本
- `.env.local` - 环境变量

## 标准更新流程

### 步骤 1：同步 main 分支

```bash
# 1.1 切换到 main 分支
git checkout main

# 1.2 拉取本地最新（防止多设备不同步）
git pull origin main

# 1.3 获取上游更新
git fetch upstream

# 1.4 合并上游代码
git merge upstream/main

# 1.5 推送到自己的仓库
git push origin main
```

### 步骤 2：更新 deploy 分支

```bash
# 2.1 切换到 deploy 分支
git checkout deploy

# 2.2 【重要】同步远程 deploy 分支
git pull origin deploy

# 2.3 合并 main 分支的更新
git merge main
```

### 步骤 3：处理冲突

如果出现冲突，根据文件类型处理：

| 文件类型 | 处理策略 | Git 命令 |
|----------|----------|----------|
| `yarn.lock` | 接受上游版本 | `git checkout --theirs yarn.lock` |
| `blog.config.js` | 手动合并 | 保留个人配置，添加新配置项 |
| `public/avatar.png` | 保留本地版本 | `git checkout --ours public/avatar.png` |
| `public/favicon.*` | 保留本地版本 | `git checkout --ours public/favicon.*` |

处理完成后：

```bash
# 添加已解决的文件
git add .

# 提交合并
git commit -m "merge: 同步上游更新

- 保留个性化配置
- 解决冲突文件: [文件列表]"
```

### 步骤 4：更新依赖并测试

```bash
# 4.1 清理并重新安装依赖
rm -rf node_modules
yarn install

# 4.2 本地测试
yarn dev
# 访问 http://localhost:3000 确认正常

# 4.3 构建测试
yarn build

# 4.4 推送到远程
git push origin deploy
```

## 自动化脚本

项目提供了自动化更新脚本 `scripts/update.sh`，功能包括：

- 前置条件检查
- 自动备份配置文件
- 分支同步与合并
- 安全冲突处理
- 依赖更新

### 使用方法

```bash
# 赋予执行权限（首次）
chmod +x scripts/update.sh

# 执行更新
./scripts/update.sh
```

脚本会引导你完成整个更新流程，遇到需要手动处理的情况会给出明确提示。

## 回滚操作

### 方法一：Git 回滚

```bash
# 查看提交历史
git log --oneline -10

# 回滚到指定版本
git reset --hard [commit-hash]

# 强制推送（谨慎使用）
git push origin deploy --force-with-lease
```

### 方法二：从 Vercel 恢复

如果误操作覆盖了代码，可以从 Vercel 的部署历史中恢复：

1. 登录 Vercel Dashboard
2. 进入项目 → Deployments
3. 找到正常的历史部署，点击右侧三个点
4. 选择 "View Source" 查看当时的源代码
5. 点击右上角可跳转到 GitHub 对应版本

## 故障排查

### Vercel 部署失败

**问题**：推送后 Vercel 构建失败

**解决方案**：

1. 检查 Vercel 构建日志定位具体错误
2. 如果是依赖问题：
   ```bash
   rm -rf node_modules yarn.lock
   yarn install
   git add yarn.lock
   git commit -m "fix: 重新生成 yarn.lock"
   git push
   ```
3. 如果是环境变量问题：检查 Vercel Dashboard → Settings → Environment Variables

### 大量文件冲突

**问题**：合并时出现大量冲突，难以处理

**解决方案**：

```bash
# 中止当前合并
git merge --abort

# 查看上游最近的提交
git log upstream/main --oneline -20

# 分步合并（先合并较早的提交）
git merge [earlier-commit]
# 解决冲突后继续合并下一个
```

### 本地与远程不同步

**问题**：推送时提示 rejected

**解决方案**：

```bash
# 先拉取远程更新
git pull origin deploy --rebase

# 解决可能的冲突后推送
git push origin deploy
```

## 注意事项

1. **更新频率**：建议每 1-2 周检查一次更新，重要安全更新应立即处理
2. **备份重要文件**：更新前备份 `blog.config.js` 和其他个性化配置
3. **测试验证**：更新后务必在本地测试，确认功能正常再部署
4. **记录修改**：建议维护一份个性化修改清单，便于后续更新

## 相关资源

- [NotionNext 官方仓库](https://github.com/notionnext-org/NotionNext)
- [NotionNext 文档](/user-guide/intro)
- [Vercel 文档](https://vercel.com/docs)

---

*文档版本：0.1.0 | 最后更新：2025-08-19*