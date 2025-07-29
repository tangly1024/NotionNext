# Robots.txt 验证器快速开始指南

## 安装和设置

### 1. 确保依赖已安装

验证器已集成到 NotionNext 项目中，无需额外安装。

### 2. 检查 robots.txt 文件

确保您的 `public/robots.txt` 文件存在：

```
public/
  └── robots.txt
```

## 基本使用

### 1. 命令行验证

最简单的验证方式：

```bash
npm run validate:robots
```

### 2. 详细输出

查看详细的验证信息：

```bash
npm run validate:robots:verbose
```

### 3. 严格模式

启用更严格的验证规则：

```bash
npm run validate:robots:strict
```

### 4. 生成报告

生成 JSON 格式的验证报告：

```bash
npm run validate:robots:report
```

生成 HTML 格式的验证报告：

```bash
npm run validate:robots:html
```

## 编程方式使用

### 基本验证

```javascript
import { RobotsValidator } from './lib/seo/robotsValidator.js'

const validator = new RobotsValidator()
const result = await validator.validate()

if (result.isValid) {
  console.log('✅ 验证通过！')
} else {
  console.log('❌ 验证失败')
  console.log(`错误: ${result.summary.errors}`)
  console.log(`警告: ${result.summary.warnings}`)
}
```

### 自定义配置

```javascript
const validator = new RobotsValidator({
  filePath: 'public/robots.txt',
  strict: true,
  verbose: true,
  timeout: 10000
})

const result = await validator.validate()
const report = validator.generateReport()
console.log(report)
```

## 常见验证场景

### 1. 基本 robots.txt 文件

```
User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /

Sitemap: https://example.com/sitemap.xml
```

### 2. AI 机器人屏蔽

```
# 屏蔽 AI 训练机器人
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

# 允许搜索引擎
User-agent: *
Disallow: /admin/
Allow: /

Sitemap: https://example.com/sitemap.xml
```

### 3. 搜索引擎特定规则

```
# Google
User-agent: Googlebot
Disallow: /private/
Crawl-delay: 1

# Bing
User-agent: Bingbot
Disallow: /private/
Crawl-delay: 2

# 其他机器人
User-agent: *
Disallow: /admin/
Disallow: /private/

Sitemap: https://example.com/sitemap.xml
Host: example.com
```

## 集成到构建流程

### 1. 构建前验证

在 `package.json` 中添加：

```json
{
  "scripts": {
    "prebuild": "npm run validate:robots",
    "build": "next build"
  }
}
```

### 2. 部署前检查

```json
{
  "scripts": {
    "predeploy": "npm run validate:robots:strict",
    "deploy": "your-deploy-command"
  }
}
```

## 验证结果解读

### 验证状态

- ✅ **通过**: 所有检查都成功
- ❌ **失败**: 存在错误需要修复
- ⚠️ **警告**: 有改进建议但不影响基本功能

### 分数说明

- **90-100**: 优秀，符合所有最佳实践
- **70-89**: 良好，有少量改进空间
- **50-69**: 一般，需要一些优化
- **0-49**: 较差，需要重要修复

### 检查类别

1. **格式验证**: 文件编码、语法结构
2. **内容验证**: User-agent、规则、Sitemap 声明
3. **标准合规**: RFC 9309 标准符合性
4. **SEO 优化**: 搜索引擎优化建议

## 常见问题快速解决

### 问题 1: 文件不存在
```bash
# 创建基本的 robots.txt 文件
echo "User-agent: *
Disallow: /admin/
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml" > public/robots.txt
```

### 问题 2: 编码问题
确保文件使用 UTF-8 编码保存，不包含 BOM。

### 问题 3: Sitemap 不可访问
检查 sitemap URL 是否正确，文件是否存在。

### 问题 4: AI 机器人未屏蔽
添加常见 AI 机器人的屏蔽规则：

```
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /
```

## 示例和模板

### 运行示例

```bash
# 基本验证示例
npm run examples:basic

# 集成示例
npm run examples:integration
```

### 使用配置文件

创建 `robots-validator.config.js`：

```javascript
export default {
  filePath: 'public/robots.txt',
  strict: false,
  verbose: true,
  checkAccessibility: true,
  validateSitemaps: true,
  timeout: 5000
}
```

然后使用：

```bash
node scripts/validate-robots.js --config robots-validator.config.js
```

## 下一步

- 查看 [完整文档](lib/seo/robotsValidator.README.md)
- 阅读 [故障排除指南](docs/TROUBLESHOOTING.md)
- 运行示例了解更多用法
- 集成到您的 CI/CD 流程

## 获取帮助

如果遇到问题：

1. 查看 [故障排除指南](docs/TROUBLESHOOTING.md)
2. 运行 `npm run validate:robots:verbose` 获取详细信息
3. 检查 GitHub Issues
4. 提交新的 Issue

---

*开始使用 Robots.txt 验证器，确保您的网站 SEO 配置正确！*