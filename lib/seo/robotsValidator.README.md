# Robots.txt 验证器

一个全面的 robots.txt 验证系统，用于确保 NotionNext 项目的 robots.txt 文件符合 RFC 9309 标准、搜索引擎要求和 SEO 最佳实践。

## 功能特性

- ✅ **格式验证** - 检查文件格式、编码、语法结构
- ✅ **内容验证** - 验证指令内容、URL 格式、路径规则
- ✅ **标准合规** - 检查 RFC 9309 标准合规性
- ✅ **SEO 优化** - 检查 SEO 最佳实践和搜索引擎特定规则
- ✅ **多格式报告** - 支持控制台、JSON、HTML 格式输出
- ✅ **CLI 工具** - 命令行界面，支持 CI/CD 集成
- ✅ **可配置** - 灵活的配置选项和规则引擎

## 快速开始

### 使用 npm 脚本

```bash
# 基本验证
npm run validate:robots

# JSON 格式输出
npm run validate:robots:json

# 严格模式
npm run validate:robots:strict
```

### 使用 CLI 工具

```bash
# 基本验证
node scripts/validate-robots.js

# 指定文件
node scripts/validate-robots.js --file custom-robots.txt

# JSON 输出
node scripts/validate-robots.js --format json

# 静默模式
node scripts/validate-robots.js --quiet

# 查看帮助
node scripts/validate-robots.js --help
```

### 编程接口

```javascript
import { RobotsValidator } from './lib/seo/robotsValidator.js'

// 创建验证器实例
const validator = new RobotsValidator({
  filePath: 'public/robots.txt',
  outputFormat: 'json',
  strict: false
})

// 执行验证
const result = await validator.validate()

// 生成报告
const report = validator.generateReport(result)
console.log(report)
```

## 配置选项

### 基本配置

- `filePath` - robots.txt 文件路径（默认：'public/robots.txt'）
- `strict` - 严格模式（默认：false）
- `outputFormat` - 输出格式：'console', 'json', 'html'（默认：'console'）
- `verbose` - 详细输出（默认：true）

### 验证选项

- `checkAccessibility` - 检查 URL 可访问性（默认：true）
- `validateSitemaps` - 验证 sitemap 文件（默认：true）
- `checkSEO` - SEO 检查（默认：true）

### 网络配置

- `timeout` - 网络请求超时时间（默认：5000ms）
- `userAgent` - 用户代理字符串（默认：'RobotsValidator/1.0'）

## 验证类别

### 1. 格式验证
- 文件编码检查（UTF-8）
- 行结束符验证
- 语法结构检查
- 指令格式验证

### 2. 内容验证
- User-agent 指令验证
- Allow/Disallow 规则检查
- Sitemap URL 验证
- Host 声明检查

### 3. 标准合规
- RFC 9309 合规性检查
- 指令优先级验证
- 规则冲突检测

### 4. SEO 优化
- 搜索引擎特定规则
- AI 机器人屏蔽检查
- 重要路径可访问性

## 报告格式

### 控制台报告
```
============================================================
🤖 ROBOTS.TXT 验证报告
============================================================
✅ 验证状态: 通过
📊 总分: 85/100
📈 统计: 8 通过, 2 警告, 0 错误

✅ 格式验证 (100/100)
  ✓ 文件存在性检查: robots.txt 文件存在且不为空
  ✓ User-agent 指令检查: 找到 User-agent 指令
  ✓ 访问规则检查: 找到访问控制规则
============================================================
```

### JSON 报告
```json
{
  "timestamp": "2025-07-28T14:54:23.314Z",
  "validator": "RobotsValidator",
  "version": "1.0.0",
  "result": {
    "isValid": true,
    "score": 85,
    "summary": {
      "totalChecks": 10,
      "passed": 8,
      "warnings": 2,
      "errors": 0
    },
    "categories": { ... },
    "recommendations": [ ... ],
    "metadata": { ... }
  }
}
```

## 数据模型

### ValidationResult
验证结果的主要数据结构，包含：
- `isValid` - 验证是否通过
- `score` - 总分（0-100）
- `summary` - 统计摘要
- `categories` - 各验证类别结果
- `recommendations` - 改进建议
- `metadata` - 元数据信息

### ValidationCategory
验证类别，包含：
- `name` - 类别名称
- `passed` - 是否通过
- `score` - 类别分数
- `checks` - 检查项列表

### ValidationCheck
单个验证检查，包含：
- `id` - 检查ID
- `name` - 检查名称
- `status` - 状态：'pass', 'warning', 'error'
- `message` - 检查消息
- `suggestion` - 修复建议
- `severity` - 严重程度

## CI/CD 集成

### GitHub Actions 示例

```yaml
name: Validate Robots.txt
on: [push, pull_request]

jobs:
  validate-robots:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm install
      - run: npm run validate:robots
```

### 退出代码
- `0` - 验证通过
- `1` - 验证失败或发生错误

## 扩展性

### 自定义验证规则
```javascript
// 将在后续任务中实现
class CustomValidator {
  validate(content, context) {
    // 自定义验证逻辑
  }
}

validator.addPlugin(new CustomValidator())
```

### 规则配置
```javascript
const validator = new RobotsValidator({
  rules: {
    'require-host': { enabled: true, severity: 'warning' },
    'https-sitemaps': { enabled: true, severity: 'error' },
    'block-ai-bots': { enabled: true, severity: 'info' }
  }
})
```

## 开发状态

当前实现了核心验证器架构和基础功能：

- ✅ 核心验证器类 `RobotsValidator`
- ✅ 数据模型类（ValidationResult, ValidationCategory, ValidationCheck, Recommendation）
- ✅ 基础配置管理和选项处理
- ✅ 验证流程框架和错误处理机制
- ✅ 多格式报告生成（控制台、JSON、HTML）
- ✅ CLI 工具和 npm 脚本集成
- ✅ 完整的单元测试套件

### 后续任务
- 🔄 格式验证器实现
- 🔄 内容验证器实现
- 🔄 标准合规验证器实现
- 🔄 SEO 优化验证器实现
- 🔄 高级功能和性能优化

## 许可证

MIT License - 详见 LICENSE 文件

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**NotionNext Robots.txt Validator v1.0.0**