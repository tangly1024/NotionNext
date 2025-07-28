# NotionNext Sitemap功能部署检查清单

## 部署前检查 (Pre-deployment Checklist)

### 🔧 环境要求
- [ ] Node.js 版本 >= 20.0.0
- [ ] npm 或 yarn 包管理器已安装
- [ ] 所有依赖包已正确安装 (`npm install`)
- [ ] TypeScript 编译无错误 (`npm run type-check`)
- [ ] ESLint 检查通过 (`npm run lint:fix`)

### 📝 配置验证
- [ ] `blog.config.js` 中的基础配置正确
  - [ ] `BLOG.LINK` 设置为正确的域名
  - [ ] `BLOG.NOTION_PAGE_ID` 配置正确
  - [ ] `BLOG.SEO_SITEMAP_ENHANCED` 根据需要设置
- [ ] 环境变量配置正确
  - [ ] `NOTION_PAGE_ID` (如果使用环境变量)
  - [ ] 其他必要的环境变量

### 🧪 测试验证
- [ ] 所有单元测试通过
  ```bash
  npm run test:unit
  ```
- [ ] 集成测试通过
  ```bash
  npm run test:integration
  ```
- [ ] Sitemap专项测试通过
  ```bash
  npm run test:sitemap
  ```
- [ ] 完整测试套件通过
  ```bash
  node scripts/run-sitemap-tests.js
  ```
- [ ] 测试覆盖率达到要求 (>80%)
  ```bash
  npm run test:coverage
  ```

### 🔍 功能验证
- [ ] 本地开发环境sitemap生成正常
  - [ ] 访问 `http://localhost:3000/sitemap.xml` 返回有效XML
  - [ ] XML格式符合sitemap标准
  - [ ] 包含预期的URL数量
  - [ ] 只包含已发布的内容
- [ ] 多语言支持正常（如果适用）
- [ ] 错误处理机制正常
- [ ] 性能监控功能正常

### 📊 性能检查
- [ ] 生成时间在可接受范围内 (<10秒)
- [ ] 内存使用合理 (<512MB)
- [ ] 缓存机制工作正常
- [ ] 大数据量测试通过（如果适用）

## 部署过程 (Deployment Process)

### 🚀 构建和部署
- [ ] 生产环境构建成功
  ```bash
  npm run build:production
  ```
- [ ] 构建产物检查
  - [ ] `.next` 目录生成正确
  - [ ] 静态资源优化完成
  - [ ] 无构建错误或警告
- [ ] 部署到目标环境
  - [ ] Vercel/Netlify/其他平台部署成功
  - [ ] 环境变量正确配置
  - [ ] 域名解析正确

### 🔧 生产环境配置
- [ ] 生产环境URL配置正确
- [ ] HTTPS证书配置正确
- [ ] CDN配置（如果使用）
- [ ] 缓存策略配置
- [ ] 监控和日志配置

## 部署后验证 (Post-deployment Verification)

### ✅ 基础功能验证
- [ ] 生产环境sitemap访问正常
  - [ ] `https://your-domain.com/sitemap.xml` 可访问
  - [ ] 返回正确的XML格式
  - [ ] HTTP状态码为200
  - [ ] 响应头设置正确
- [ ] 内容正确性验证
  - [ ] 包含所有已发布的文章
  - [ ] URL格式正确
  - [ ] 时间戳准确
  - [ ] 优先级设置合理

### 🌐 搜索引擎验证
- [ ] Google Search Console验证
  - [ ] 提交sitemap URL
  - [ ] 验证sitemap可读取
  - [ ] 检查索引状态
- [ ] Bing Webmaster Tools验证
  - [ ] 提交sitemap URL
  - [ ] 验证sitemap状态
- [ ] robots.txt 更新
  - [ ] 添加sitemap引用
  - [ ] 验证robots.txt可访问

### 📈 性能监控
- [ ] 响应时间监控
  - [ ] 首次访问时间 <5秒
  - [ ] 缓存命中时间 <1秒
- [ ] 错误率监控
  - [ ] 设置错误率告警
  - [ ] 监控4xx/5xx错误
- [ ] 资源使用监控
  - [ ] CPU使用率
  - [ ] 内存使用率
  - [ ] 网络带宽

### 🔍 质量检查
- [ ] XML格式验证
  - [ ] 使用在线工具验证XML格式
  - [ ] 检查字符编码
  - [ ] 验证URL转义
- [ ] SEO检查
  - [ ] URL结构优化
  - [ ] 元数据完整性
  - [ ] 重复内容检查

## 监控和维护 (Monitoring & Maintenance)

### 📊 日常监控
- [ ] 设置监控告警
  - [ ] 生成时间超时告警
  - [ ] 错误率超标告警
  - [ ] 内存使用告警
- [ ] 定期检查项目
  - [ ] 每日：sitemap可访问性
  - [ ] 每周：内容更新正确性
  - [ ] 每月：性能指标回顾

### 🔄 维护任务
- [ ] 缓存清理策略
- [ ] 日志轮转配置
- [ ] 性能优化调整
- [ ] 依赖包更新计划

## 回滚计划 (Rollback Plan)

### 🚨 紧急回滚
如果部署后发现严重问题：

- [ ] 准备回滚步骤
  1. 恢复到上一个稳定版本
  2. 验证基础功能正常
  3. 通知相关人员
- [ ] 回滚验证清单
  - [ ] sitemap可正常访问
  - [ ] 内容显示正确
  - [ ] 无错误日志
- [ ] 问题分析和修复计划

## 文档和培训 (Documentation & Training)

### 📚 文档更新
- [ ] 更新部署文档
- [ ] 更新运维手册
- [ ] 更新故障排除指南
- [ ] 更新API文档（如果适用）

### 👥 团队培训
- [ ] 开发团队培训
  - [ ] 新功能介绍
  - [ ] 配置说明
  - [ ] 调试方法
- [ ] 运维团队培训
  - [ ] 监控指标
  - [ ] 故障处理
  - [ ] 性能优化

## 验证脚本

### 自动化验证脚本

创建以下验证脚本用于部署后检查：

```bash
#!/bin/bash
# deployment-verification.sh

echo "🚀 开始部署后验证..."

# 基础可访问性检查
echo "📡 检查sitemap可访问性..."
curl -f -s "https://your-domain.com/sitemap.xml" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Sitemap可访问"
else
    echo "❌ Sitemap不可访问"
    exit 1
fi

# XML格式检查
echo "🔍 检查XML格式..."
curl -s "https://your-domain.com/sitemap.xml" | xmllint --noout -
if [ $? -eq 0 ]; then
    echo "✅ XML格式正确"
else
    echo "❌ XML格式错误"
    exit 1
fi

# 内容检查
echo "📝 检查内容数量..."
URL_COUNT=$(curl -s "https://your-domain.com/sitemap.xml" | grep -c "<loc>")
if [ $URL_COUNT -gt 0 ]; then
    echo "✅ 包含 $URL_COUNT 个URL"
else
    echo "❌ 未找到URL"
    exit 1
fi

echo "🎉 部署验证完成！"
```

### 性能验证脚本

```bash
#!/bin/bash
# performance-check.sh

echo "⚡ 开始性能检查..."

# 响应时间检查
RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' "https://your-domain.com/sitemap.xml")
echo "📊 响应时间: ${RESPONSE_TIME}s"

if (( $(echo "$RESPONSE_TIME < 5.0" | bc -l) )); then
    echo "✅ 响应时间正常"
else
    echo "⚠️ 响应时间较慢"
fi

echo "✅ 性能检查完成"
```

## 联系信息

### 技术支持
- 开发团队：[开发团队联系方式]
- 运维团队：[运维团队联系方式]
- 紧急联系：[紧急联系方式]

### 相关资源
- 项目仓库：[GitHub链接]
- 文档中心：[文档链接]
- 监控面板：[监控链接]

---

**注意**: 请根据实际部署环境调整此检查清单中的具体配置和验证步骤。