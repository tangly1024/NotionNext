# Robots.txt 验证器故障排除指南

## 概述

本指南帮助您解决使用 Robots.txt 验证器时可能遇到的常见问题。

## 常见问题

### 1. 文件相关问题

#### 问题：文件不存在错误
```
错误: robots.txt 文件不存在: /path/to/robots.txt
```

**可能原因：**
- 文件路径不正确
- 文件不存在
- 权限问题

**解决方案：**
1. 检查文件路径是否正确
2. 确保文件存在
3. 使用绝对路径或相对于当前工作目录的路径
4. 检查文件权限

```javascript
// 正确的文件路径示例
const validator = new RobotsValidator({
  filePath: 'public/robots.txt' // 相对路径
})

// 或使用绝对路径
const validator = new RobotsValidator({
  filePath: '/absolute/path/to/robots.txt'
})
```

#### 问题：权限被拒绝
```
错误: 无法读取文件，权限被拒绝
```

**解决方案：**
- 在 Unix 系统上：`chmod 644 robots.txt`
- 在 Windows 上：检查文件属性，确保有读取权限
- 确保运行验证器的用户有文件读取权限

#### 问题：文件编码问题
```
警告: 文件编码不是 UTF-8
```

**解决方案：**
1. 将文件转换为 UTF-8 编码
2. 移除 BOM 标记（如果存在）
3. 使用支持 UTF-8 的编辑器重新保存文件

### 2. 网络相关问题

#### 问题：网络请求超时
```
错误: 网络请求超时
```

**可能原因：**
- 网络连接问题
- Sitemap URL 不可访问
- 超时时间设置过短

**解决方案：**
1. 检查网络连接
2. 验证 sitemap URL 是否可访问
3. 增加超时时间设置

```javascript
const validator = new RobotsValidator({
  timeout: 10000 // 增加到 10 秒
})
```

#### 问题：Sitemap 不可访问
```
错误: Sitemap URL 返回 404 错误
```

**解决方案：**
1. 检查 sitemap URL 是否正确
2. 确保 sitemap 文件存在
3. 检查服务器配置
4. 验证 URL 格式

### 3. 验证相关问题

#### 问题：验证失败但不知道原因
```
❌ robots.txt 验证失败
```

**解决方案：**
1. 启用详细输出模式
2. 检查具体的错误信息
3. 使用严格模式获取更多信息

```javascript
const validator = new RobotsValidator({
  verbose: true,
  strict: true
})

const result = await validator.validate()
console.log('详细结果:', result)
```

#### 问题：AI 机器人检测不准确
```
警告: 未检测到 AI 机器人配置
```

**解决方案：**
1. 检查 User-agent 名称的大小写
2. 确保使用正确的机器人名称
3. 查看支持的 AI 机器人列表

```javascript
// 检查支持的 AI 机器人
const validator = new RobotsValidator()
const supportedBots = validator.getSupportedAIBots()
console.log('支持的 AI 机器人:', Object.keys(supportedBots))
```

### 4. 性能问题

#### 问题：验证速度慢
```
验证过程耗时过长
```

**解决方案：**
1. 禁用不必要的检查
2. 减少网络请求
3. 使用缓存

```javascript
const validator = new RobotsValidator({
  checkAccessibility: false, // 禁用可访问性检查
  validateSitemaps: false,   // 禁用 sitemap 验证
  verbose: false             // 禁用详细输出
})
```

#### 问题：内存使用过高
```
内存不足错误
```

**解决方案：**
1. 处理大文件时分批验证
2. 限制并发数量
3. 及时释放资源

### 5. 集成问题

#### 问题：CI/CD 中验证失败
```
CI 流程中验证器报错
```

**解决方案：**
1. 检查 CI 环境中的文件路径
2. 确保依赖已正确安装
3. 使用适当的退出代码

```javascript
// CI/CD 友好的配置
const validator = new RobotsValidator({
  filePath: process.env.ROBOTS_PATH || 'public/robots.txt',
  strict: process.env.NODE_ENV === 'production',
  verbose: false
})

try {
  const result = await validator.validate()
  process.exit(result.isValid ? 0 : 1)
} catch (error) {
  console.error('验证失败:', error.message)
  process.exit(1)
}
```

#### 问题：Next.js 集成问题
```
构建时验证器无法找到文件
```

**解决方案：**
1. 确保文件在 `public` 目录中
2. 检查构建脚本的执行顺序
3. 使用正确的文件路径

```json
{
  "scripts": {
    "validate-robots": "node scripts/validate-robots.js",
    "prebuild": "npm run validate-robots",
    "build": "next build"
  }
}
```

## 调试技巧

### 1. 启用详细输出

```javascript
const validator = new RobotsValidator({
  verbose: true,
  colors: true
})
```

### 2. 使用严格模式

```javascript
const validator = new RobotsValidator({
  strict: true // 启用更严格的验证规则
})
```

### 3. 检查特定类别

```javascript
const result = await validator.validate()

// 只检查格式问题
const formatIssues = result.categories.format.checks.filter(
  check => check.status !== 'pass'
)

console.log('格式问题:', formatIssues)
```

### 4. 生成详细报告

```javascript
const validator = new RobotsValidator({
  outputFormat: 'json'
})

const result = await validator.validate()
const report = validator.generateReport()

// 保存详细报告用于分析
fs.writeFileSync('debug-report.json', JSON.stringify(report, null, 2))
```

### 5. 逐步验证

```javascript
// 分步骤验证，便于定位问题
const validator = new RobotsValidator({
  checkAccessibility: false,
  validateSitemaps: false
})

// 先进行基础验证
let result = await validator.validate()
console.log('基础验证结果:', result.isValid)

// 再启用 sitemap 验证
validator.options.validateSitemaps = true
result = await validator.validate()
console.log('包含 sitemap 验证结果:', result.isValid)
```

## 日志和监控

### 1. 启用日志记录

```javascript
import fs from 'fs'

class LoggingValidator extends RobotsValidator {
  async validate() {
    const startTime = Date.now()
    
    try {
      const result = await super.validate()
      
      const logEntry = {
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
        result: {
          isValid: result.isValid,
          score: result.score,
          errors: result.summary.errors,
          warnings: result.summary.warnings
        }
      }
      
      fs.appendFileSync('validation.log', JSON.stringify(logEntry) + '\n')
      
      return result
    } catch (error) {
      const errorEntry = {
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
        error: error.message
      }
      
      fs.appendFileSync('validation.log', JSON.stringify(errorEntry) + '\n')
      throw error
    }
  }
}
```

### 2. 性能监控

```javascript
class PerformanceValidator extends RobotsValidator {
  async validate() {
    const startTime = process.hrtime.bigint()
    const startMemory = process.memoryUsage()
    
    const result = await super.validate()
    
    const endTime = process.hrtime.bigint()
    const endMemory = process.memoryUsage()
    
    const performance = {
      duration: Number(endTime - startTime) / 1000000, // 毫秒
      memoryUsed: endMemory.heapUsed - startMemory.heapUsed,
      peakMemory: endMemory.heapUsed
    }
    
    console.log('性能指标:', performance)
    
    return result
  }
}
```

## 环境特定配置

### 开发环境

```javascript
const developmentConfig = {
  strict: false,
  checkAccessibility: false,
  validateSitemaps: false,
  verbose: true,
  colors: true
}
```

### 测试环境

```javascript
const testingConfig = {
  strict: true,
  checkAccessibility: true,
  validateSitemaps: true,
  verbose: false,
  timeout: 5000
}
```

### 生产环境

```javascript
const productionConfig = {
  strict: true,
  checkAccessibility: true,
  validateSitemaps: true,
  verbose: false,
  timeout: 10000,
  colors: false
}
```

## 获取帮助

如果以上解决方案都无法解决您的问题，请：

1. 查看项目的 GitHub Issues
2. 提交新的 Issue，包含：
   - 详细的错误信息
   - 您的配置
   - 复现步骤
   - 环境信息（Node.js 版本、操作系统等）
3. 提供最小可复现示例

## 常用命令

```bash
# 基本验证
node scripts/validate-robots.js

# 详细输出
node scripts/validate-robots.js --verbose

# 严格模式
node scripts/validate-robots.js --strict

# 生成 JSON 报告
node scripts/validate-robots.js --output json --save-report report.json

# 调试模式
DEBUG=* node scripts/validate-robots.js
```

---

*如果您发现新的问题或解决方案，欢迎贡献到这个故障排除指南中。*