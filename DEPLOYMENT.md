# 部署指南

## 概述

NotionNext 支持多种部署方式，本指南将详细介绍各种部署选项和最佳实践。

## 部署前准备

### 1. 环境变量配置

创建 `.env.local` 文件并配置必要的环境变量：

```bash
# 必需配置
NOTION_PAGE_ID=your-notion-page-id

# 推荐配置
NEXT_PUBLIC_TITLE=你的博客标题
NEXT_PUBLIC_DESCRIPTION=你的博客描述
NEXT_PUBLIC_AUTHOR=作者名称
NEXT_PUBLIC_LINK=https://yourdomain.com

# 可选配置
REDIS_URL=redis://localhost:6379
NEXT_PUBLIC_ANALYTICS_GOOGLE_ID=G-XXXXXXXXXX
```

### 2. 构建测试

在部署前确保项目能够正常构建：

```bash
npm run build
npm run start
```

### 3. 质量检查

运行完整的质量检查：

```bash
npm run quality
```

## Vercel 部署（推荐）

Vercel 是 Next.js 的官方部署平台，提供最佳的性能和开发体验。

### 自动部署

1. **连接 GitHub**
   - 访问 [Vercel](https://vercel.com)
   - 使用 GitHub 账号登录
   - 导入你的 NotionNext 仓库

2. **配置环境变量**
   - 在 Vercel 项目设置中添加环境变量
   - 至少需要配置 `NOTION_PAGE_ID`

3. **部署**
   - Vercel 会自动检测 Next.js 项目
   - 每次推送到主分支都会自动部署

### 手动部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 生产部署
vercel --prod
```

### Vercel 配置文件

创建 `vercel.json` 文件进行高级配置：

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "functions": {
    "pages/api/**/*.js": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/feed",
      "destination": "/rss.xml",
      "permanent": true
    }
  ]
}
```

## Netlify 部署

### 自动部署

1. **连接仓库**
   - 访问 [Netlify](https://netlify.com)
   - 连接你的 GitHub 仓库

2. **构建设置**
   - Build command: `npm run build`
   - Publish directory: `out`
   - 环境变量: `EXPORT=true`

3. **环境变量配置**
   - 在 Netlify 设置中添加环境变量

### 手动部署

```bash
# 构建静态文件
npm run export

# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --dir=out

# 生产部署
netlify deploy --prod --dir=out
```

### Netlify 配置文件

创建 `netlify.toml` 文件：

```toml
[build]
  command = "npm run export"
  publish = "out"

[build.environment]
  EXPORT = "true"
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "/feed"
  to = "/rss.xml"
  status = 301
```

## Docker 部署

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NOTION_PAGE_ID=${NOTION_PAGE_ID}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  redis_data:
```

### 部署命令

```bash
# 构建镜像
docker build -t notionnext .

# 运行容器
docker run -p 3000:3000 -e NOTION_PAGE_ID=your-id notionnext

# 使用 Docker Compose
docker-compose up -d
```

## 静态导出部署

适用于 GitHub Pages、Cloudflare Pages 等静态托管服务。

### 构建静态文件

```bash
npm run export
```

### GitHub Pages 部署

1. **GitHub Actions 配置**

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run export
      env:
        NOTION_PAGE_ID: ${{ secrets.NOTION_PAGE_ID }}
        
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

2. **配置 Secrets**
   - 在 GitHub 仓库设置中添加 `NOTION_PAGE_ID`

## 性能优化

### 1. 缓存配置

```bash
# Redis 缓存
REDIS_URL=redis://localhost:6379

# 内存缓存
ENABLE_CACHE=true
```

### 2. CDN 配置

```bash
# 图片 CDN
NEXT_PUBLIC_IMAGE_CDN=https://cdn.example.com

# 静态资源 CDN
NEXT_PUBLIC_STATIC_CDN=https://static.example.com
```

### 3. 压缩优化

```bash
# 启用压缩
NEXT_PUBLIC_COMPRESS=true

# 图片优化
NEXT_PUBLIC_IMAGE_OPTIMIZE=true
```

## 监控和日志

### 1. 错误监控

```bash
# Sentry
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# LogRocket
NEXT_PUBLIC_LOGROCKET_ID=your-logrocket-id
```

### 2. 性能监控

```bash
# Vercel Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS=true

# Google Analytics
NEXT_PUBLIC_ANALYTICS_GOOGLE_ID=G-XXXXXXXXXX
```

## 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 清理缓存
   npm run clean
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **环境变量问题**
   ```bash
   # 检查环境变量
   npm run quality
   ```

3. **内存不足**
   ```bash
   # 增加 Node.js 内存限制
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

### 调试模式

```bash
# 启用调试
DEBUG=* npm run build

# Next.js 调试
NEXT_DEBUG=true npm run dev
```

## 安全检查清单

- [ ] 环境变量已正确配置
- [ ] 敏感信息未暴露在客户端
- [ ] HTTPS 已启用
- [ ] 安全头部已配置
- [ ] 依赖包无安全漏洞
- [ ] 访问日志已启用
- [ ] 错误监控已配置

## 备份和恢复

### 数据备份

```bash
# 备份 Notion 数据
npm run backup-notion

# 备份配置文件
tar -czf config-backup.tar.gz .env.local blog.config.js
```

### 恢复流程

1. 恢复代码仓库
2. 恢复环境变量配置
3. 重新部署应用
4. 验证功能正常

## 更新和维护

### 定期维护

```bash
# 检查依赖更新
npm run check-updates

# 更新依赖
npm update

# 安全审计
npm audit

# 性能分析
npm run analyze
```

### 版本升级

1. 备份当前版本
2. 更新代码
3. 测试新功能
4. 部署到生产环境
5. 监控运行状态
