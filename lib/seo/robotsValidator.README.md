# Robots.txt 验证器使用文档

## 概述

Robots.txt 验证器是一个全面的 robots.txt 文件验证系统，用于确保您的 robots.txt 文件符合行业标准、搜索引擎要求和 SEO 最佳实践。

## 功能特性

- ✅ **格式验证** - 检查文件编码、语法结构和指令格式
- ✅ **内容验证** - 验证 User-agent、Allow/Disallow 规则、Sitemap 声明等
- ✅ **标准合规** - 确保符合 RFC 9309 标准
- ✅ **SEO 优化** - 提供搜索引擎优化建议
- ✅ **AI 机器人屏蔽** - 验证 AI 训练机器人的屏蔽配置
- ✅ **多种输出格式** - 支持控制台、JSON、HTML 报告
- ✅ **详细建议** - 提供可操作的改进建议

## 快速开始

### 基本使用

```javascript
import { RobotsValidator } from './lib/seo/robotsValidator.js'

// 创建验证器实例
const validator = new RobotsValidator({
  filePath: 'public/robots.txt',
  verbose: true
})

// 执行验证
const result = await validator.validate()

// 生成报告
const report = validator.generateReport()
console.log(report)
```

### 自定义配置

```javascript
const validator = new RobotsValidator({
  // 文件配置
  filePath: 'public/robots.txt',
  
  // 验证选项
  strict: true,
  checkAccessibility: true,
  validateSitemaps: true,
  checkSEO: true,
  
  // 输出配置
  outputFormat: 'json', // console, json, html
  verbose: true,
  colors: true,
  
  // 网络配置
  timeout: 10000,
  userAgent: 'MyValidator/1.0',
  
  // 报告配置
  includeRecommendations: true,
  includeSuggestions: true
})
```

## API 参考

### RobotsValidator 类

#### 构造函数选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `filePath` | string | `'public/robots.txt'` | robots.txt 文件路径 |
| `strict` | boolean | `false` | 是否启用严格模式 |
| `outputFormat` | string | `'console'` | 输出格式：console, json, html |
| `verbose` | boolean | `true` | 是否显示详细信息 |
| `colors` | boolean | `true` | 是否使用颜色输出 |
| `checkAccessibility` | boolean | `true` | 是否检查可访问性 |
| `validateSitemaps` | boolean | `true` | 是否验证 sitemap |
| `checkSEO` | boolean | `true` | 是否进行 SEO 检查 |
| `timeout` | number | `5000` | 网络请求超时时间（毫秒） |
| `userAgent` | string | `'RobotsValidator/1.0'` | 用户代理字符串 |
| `includeRecommendations` | boolean | `true` | 是否包含建议 |
| `includeSuggestions` | boolean | `true` | 是否包含改进建议 |

#### 主要方法

##### `validate()`

执行完整的验证流程。

```javascript
const result = await validator.validate()
```

**返回值**: `Promise<ValidationResult>` - 验证结果对象

##### `generateReport(result?)`

生成验证报告。

```javascript
const report = validator.generateReport()
```

**参数**:
- `result` (可选): ValidationResult 对象，如果不提供则使用最后一次验证结果

**返回值**: `string|Object` - 根据 outputFormat 返回相应格式的报告

### ValidationResult 对象

验证结果包含以下属性：

```javascript
{
  isValid: boolean,        // 是否通过验证
  score: number,           // 总分 (0-100)
  summary: {
    totalChecks: number,   // 总检查项数
    passed: number,        // 通过的检查项数
    warnings: number,      // 警告数
    errors: number         // 错误数
  },
  categories: {
    format: ValidationCategory,    // 格式验证结果
    content: ValidationCategory,   // 内容验证结果
    standards: ValidationCategory, // 标准合规结果
    seo: ValidationCategory       // SEO 优化结果
  },
  metadata: {
    validatedAt: Date,     // 验证时间
    fileSize: number       // 文件大小
  }
}
```

## 使用示例

### 示例 1: 基本验证

```javascript
import { RobotsValidator } from './lib/seo/robotsValidator.js'

async function validateRobots() {
  const validator = new RobotsValidator()
  
  try {
    const result = await validator.validate()
    
    if (result.isValid) {
      console.log('✅ robots.txt 验证通过！')
      console.log(`总分: ${result.score}/100`)
    } else {
      console.log('❌ robots.txt 验证失败')
      console.log(`错误数: ${result.summary.errors}`)
      console.log(`警告数: ${result.summary.warnings}`)
    }
    
  } catch (error) {
    console.error('验证过程中发生错误:', error.message)
  }
}

validateRobots()
```

### 示例 2: 生成 JSON 报告

```javascript
import fs from 'fs'
import { RobotsValidator } from './lib/seo/robotsValidator.js'

async function generateJSONReport() {
  const validator = new RobotsValidator({
    outputFormat: 'json',
    verbose: false
  })
  
  const result = await validator.validate()
  const jsonReport = validator.generateReport()
  
  // 保存报告到文件
  fs.writeFileSync('robots-validation-report.json', JSON.stringify(jsonReport, null, 2))
  console.log('JSON 报告已保存到 robots-validation-report.json')
}

generateJSONReport()
```

### 示例 3: 生成 HTML 报告

```javascript
import fs from 'fs'
import { RobotsValidator } from './lib/seo/robotsValidator.js'

async function generateHTMLReport() {
  const validator = new RobotsValidator({
    outputFormat: 'html'
  })
  
  const result = await validator.validate()
  const htmlReport = validator.generateReport()
  
  // 保存 HTML 报告
  fs.writeFileSync('robots-validation-report.html', htmlReport)
  console.log('HTML 报告已保存到 robots-validation-report.html')
}

generateHTMLReport()
```

### 示例 4: 自定义验证规则

```javascript
import { RobotsValidator } from './lib/seo/robotsValidator.js'

async function customValidation() {
  const validator = new RobotsValidator({
    strict: true,
    allowedUserAgents: ['Googlebot', 'Bingbot'],
    blockedUserAgents: ['BadBot'],
    requiredSitemaps: ['https://example.com/sitemap.xml'],
    timeout: 10000
  })
  
  const result = await validator.validate()
  
  // 检查特定类别的结果
  const formatResult = result.categories.format
  const contentResult = result.categories.content
  const seoResult = result.categories.seo
  
  console.log(`格式验证: ${formatResult.passed ? '通过' : '失败'} (${formatResult.score}/100)`)
  console.log(`内容验证: ${contentResult.passed ? '通过' : '失败'} (${contentResult.score}/100)`)
  console.log(`SEO 优化: ${seoResult.passed ? '通过' : '失败'} (${seoResult.score}/100)`)
}

customValidation()
```

### 示例 5: 批量验证多个文件

```javascript
import { RobotsValidator } from './lib/seo/robotsValidator.js'

async function batchValidation() {
  const files = [
    'public/robots.txt',
    'staging/robots.txt',
    'production/robots.txt'
  ]
  
  const results = []
  
  for (const filePath of files) {
    console.log(`\n验证文件: ${filePath}`)
    
    const validator = new RobotsValidator({
      filePath,
      verbose: false
    })
    
    try {
      const result = await validator.validate()
      results.push({
        file: filePath,
        valid: result.isValid,
        score: result.score,
        errors: result.summary.errors,
        warnings: result.summary.warnings
      })
      
      console.log(`${result.isValid ? '✅' : '❌'} ${filePath}: ${result.score}/100`)
      
    } catch (error) {
      console.log(`❌ ${filePath}: 验证失败 - ${error.message}`)
      results.push({
        file: filePath,
        valid: false,
        error: error.message
      })
    }
  }
  
  // 输出汇总
  console.log('\n=== 批量验证汇总 ===')
  results.forEach(result => {
    if (result.error) {
      console.log(`❌ ${result.file}: 错误 - ${result.error}`)
    } else {
      console.log(`${result.valid ? '✅' : '❌'} ${result.file}: ${result.score}/100 (${result.errors} 错误, ${result.warnings} 警告)`)
    }
  })
}

batchValidation()
```

## 集成到现有项目

### 与 Next.js 集成

```javascript
// scripts/validate-robots.js
import { RobotsValidator } from '../lib/seo/robotsValidator.js'

async function validateRobotsForNextJS() {
  const validator = new RobotsValidator({
    filePath: 'public/robots.txt',
    outputFormat: 'console',
    verbose: true
  })
  
  const result = await validator.validate()
  
  if (!result.isValid) {
    console.error('❌ robots.txt 验证失败，构建中止')
    process.exit(1)
  }
  
  console.log('✅ robots.txt 验证通过')
}

validateRobotsForNextJS()
```

在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "validate-robots": "node scripts/validate-robots.js",
    "prebuild": "npm run validate-robots"
  }
}
```

### 与 CI/CD 集成

```yaml
# .github/workflows/validate-robots.yml
name: Validate Robots.txt

on:
  push:
    paths:
      - 'public/robots.txt'
  pull_request:
    paths:
      - 'public/robots.txt'

jobs:
  validate:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Validate robots.txt
      run: |
        node -e "
        import('./lib/seo/robotsValidator.js').then(async ({ RobotsValidator }) => {
          const validator = new RobotsValidator({
            filePath: 'public/robots.txt',
            outputFormat: 'json'
          });
          
          const result = await validator.validate();
          
          if (!result.isValid) {
            console.error('robots.txt validation failed');
            process.exit(1);
          }
          
          console.log('robots.txt validation passed');
        });
        "
```

### 与 Express.js 集成

```javascript
// routes/admin.js
import express from 'express'
import { RobotsValidator } from '../lib/seo/robotsValidator.js'

const router = express.Router()

router.get('/validate-robots', async (req, res) => {
  try {
    const validator = new RobotsValidator({
      filePath: 'public/robots.txt',
      outputFormat: 'json'
    })
    
    const result = await validator.validate()
    const report = validator.generateReport()
    
    res.json({
      success: true,
      validation: report
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

export default router
```

## CLI 工具使用

### 创建 CLI 脚本

```javascript
#!/usr/bin/env node
// bin/validate-robots.js

import { program } from 'commander'
import { RobotsValidator } from '../lib/seo/robotsValidator.js'

program
  .version('1.0.0')
  .description('Robots.txt 验证工具')
  .option('-f, --file <path>', 'robots.txt 文件路径', 'public/robots.txt')
  .option('-o, --output <format>', '输出格式 (console|json|html)', 'console')
  .option('-v, --verbose', '显示详细信息', false)
  .option('-s, --strict', '启用严格模式', false)
  .option('--no-colors', '禁用颜色输出')
  .option('--timeout <ms>', '网络请求超时时间', '5000')

program.parse()

const options = program.opts()

async function main() {
  try {
    const validator = new RobotsValidator({
      filePath: options.file,
      outputFormat: options.output,
      verbose: options.verbose,
      strict: options.strict,
      colors: options.colors,
      timeout: parseInt(options.timeout)
    })
    
    console.log(`🤖 验证文件: ${options.file}`)
    
    const result = await validator.validate()
    const report = validator.generateReport()
    
    if (options.output === 'console') {
      console.log(report)
    } else {
      console.log(JSON.stringify(report, null, 2))
    }
    
    // 设置退出代码
    process.exit(result.isValid ? 0 : 1)
    
  } catch (error) {
    console.error('❌ 验证失败:', error.message)
    process.exit(1)
  }
}

main()
```

### CLI 使用示例

```bash
# 基本验证
node bin/validate-robots.js

# 指定文件路径
node bin/validate-robots.js -f /path/to/robots.txt

# 生成 JSON 报告
node bin/validate-robots.js -o json > report.json

# 生成 HTML 报告
node bin/validate-robots.js -o html > report.html

# 启用严格模式和详细输出
node bin/validate-robots.js -s -v

# 自定义超时时间
node bin/validate-robots.js --timeout 10000
```

## 配置文件支持

### 创建配置文件

```javascript
// robots-validator.config.js
export default {
  // 基本配置
  filePath: 'public/robots.txt',
  strict: false,
  
  // 验证选项
  checkAccessibility: true,
  validateSitemaps: true,
  checkSEO: true,
  
  // 输出配置
  outputFormat: 'console',
  verbose: true,
  colors: true,
  
  // 网络配置
  timeout: 5000,
  userAgent: 'RobotsValidator/1.0',
  
  // 规则配置
  allowedUserAgents: [
    'Googlebot',
    'Bingbot',
    'Slurp',
    'DuckDuckBot'
  ],
  
  blockedUserAgents: [
    'BadBot',
    'SpamBot'
  ],
  
  requiredSitemaps: [
    'https://example.com/sitemap.xml',
    'https://example.com/sitemap-images.xml'
  ],
  
  // 报告配置
  reportPath: './reports',
  includeRecommendations: true,
  includeSuggestions: true,
  
  // AI 机器人配置
  aiProtection: {
    enabled: true,
    blockHighRisk: true,
    allowLowRisk: false
  }
}
```

### 使用配置文件

```javascript
import config from './robots-validator.config.js'
import { RobotsValidator } from './lib/seo/robotsValidator.js'

const validator = new RobotsValidator(config)
const result = await validator.validate()
```

## 故障排除

### 常见问题

#### 1. 文件不存在错误

```
错误: robots.txt 文件不存在: /path/to/robots.txt
```

**解决方案**:
- 检查文件路径是否正确
- 确保文件存在且有读取权限
- 使用绝对路径或相对于当前工作目录的路径

#### 2. 网络超时错误

```
错误: 网络请求超时
```

**解决方案**:
- 增加超时时间设置
- 检查网络连接
- 验证 sitemap URL 是否可访问

```javascript
const validator = new RobotsValidator({
  timeout: 10000 // 增加到 10 秒
})
```

#### 3. 编码问题

```
警告: 文件编码不是 UTF-8
```

**解决方案**:
- 将文件转换为 UTF-8 编码
- 检查文件是否包含 BOM 标记

#### 4. 权限错误

```
错误: 无法读取文件，权限被拒绝
```

**解决方案**:
- 检查文件读取权限
- 在 Unix 系统上使用 `chmod 644 robots.txt`

### 调试技巧

#### 启用详细输出

```javascript
const validator = new RobotsValidator({
  verbose: true,
  colors: true
})
```

#### 使用严格模式

```javascript
const validator = new RobotsValidator({
  strict: true // 启用更严格的验证规则
})
```

#### 检查特定类别

```javascript
const result = await validator.validate()

// 只检查格式问题
const formatIssues = result.categories.format.checks.filter(
  check => check.status !== 'pass'
)

console.log('格式问题:', formatIssues)
```

## 最佳实践

### 1. 定期验证

建议在以下情况下验证 robots.txt：
- 网站内容结构变更时
- 添加新的 sitemap 时
- 修改爬虫访问规则时
- 部署前的自动化检查

### 2. 版本控制

将 robots.txt 纳入版本控制，并在 CI/CD 流程中添加验证步骤。

### 3. 监控和报告

定期生成验证报告，监控 robots.txt 的健康状况。

```javascript
// 定期验证脚本
import cron from 'node-cron'
import { RobotsValidator } from './lib/seo/robotsValidator.js'

// 每天凌晨 2 点执行验证
cron.schedule('0 2 * * *', async () => {
  const validator = new RobotsValidator({
    outputFormat: 'json'
  })
  
  const result = await validator.validate()
  
  if (!result.isValid) {
    // 发送告警通知
    console.error('robots.txt 验证失败，需要检查')
  }
})
```

### 4. 环境特定配置

为不同环境使用不同的验证配置：

```javascript
const config = {
  development: {
    strict: false,
    checkAccessibility: false
  },
  production: {
    strict: true,
    checkAccessibility: true,
    validateSitemaps: true
  }
}

const validator = new RobotsValidator(config[process.env.NODE_ENV])
```

## 扩展和自定义

### 自定义验证规则

```javascript
import { RobotsValidator } from './lib/seo/robotsValidator.js'

class CustomRobotsValidator extends RobotsValidator {
  async _runCustomValidation(content) {
    // 添加自定义验证逻辑
    const customChecks = []
    
    // 示例：检查是否包含特定的用户代理
    if (!content.includes('MyCustomBot')) {
      customChecks.push({
        id: 'missing-custom-bot',
        name: '自定义机器人检查',
        status: 'warning',
        message: '未找到 MyCustomBot 的配置',
        suggestion: '添加 MyCustomBot 的访问规则'
      })
    }
    
    return customChecks
  }
}
```

### 插件系统

```javascript
// 创建插件
const myPlugin = {
  name: 'MyCustomPlugin',
  validate: async (content, options) => {
    // 插件验证逻辑
    return []
  }
}

// 使用插件
const validator = new RobotsValidator({
  plugins: [myPlugin]
})
```

## 性能优化

### 缓存验证结果

```javascript
import { RobotsValidator } from './lib/seo/robotsValidator.js'

class CachedRobotsValidator extends RobotsValidator {
  constructor(options) {
    super(options)
    this.cache = new Map()
  }
  
  async validate() {
    const fileStats = fs.statSync(this.options.filePath)
    const cacheKey = `${this.options.filePath}-${fileStats.mtime.getTime()}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }
    
    const result = await super.validate()
    this.cache.set(cacheKey, result)
    
    return result
  }
}
```

### 并行验证

```javascript
async function parallelValidation(files) {
  const promises = files.map(filePath => {
    const validator = new RobotsValidator({ filePath })
    return validator.validate()
  })
  
  const results = await Promise.all(promises)
  return results
}
```

## 更新日志

### v1.0.0
- 初始版本发布
- 支持基本的格式和内容验证
- 提供控制台、JSON、HTML 输出格式
- 包含 AI 机器人屏蔽验证
- 支持 RFC 9309 标准检查

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个验证器。

## 支持

如果您在使用过程中遇到问题，请：

1. 查看本文档的故障排除部分
2. 检查 GitHub Issues
3. 提交新的 Issue 描述问题

---

*最后更新: 2024年*