#!/usr/bin/env node

/**
 * 格式验证器功能测试脚本
 * 
 * 演示格式验证器和指令语法验证器的功能
 * 
 * @author NotionNext
 * @version 1.0.0
 */

import { RobotsValidator } from '../lib/seo/robotsValidator.js'
import fs from 'fs'

/**
 * 测试不同类型的robots.txt文件
 */
async function testFormatValidator() {
  console.log('🧪 格式验证器功能测试\n')
  
  // 测试用例
  const testCases = [
    {
      name: '完美的robots.txt',
      content: `User-agent: *
Allow: /

User-agent: Googlebot
Disallow: /admin/
Crawl-delay: 1

Sitemap: https://example.com/sitemap.xml
Host: example.com`
    },
    {
      name: '有格式问题的robots.txt',
      content: `User_agent: *
Allow:
Disallow: admin
Crawl-delay: -1
Sitemap: example.com/sitemap.xml
Host: https://example.com
Unknown-directive: value`
    },
    {
      name: '空文件',
      content: ''
    },
    {
      name: '只有注释的文件',
      content: `# This is a comment
# Another comment
# No actual directives`
    },
    {
      name: '包含特殊字符的文件',
      content: `User-agent: *
Disallow: /admin"test/
User-agent: Bot<script>
Crawl-delay: abc
Visit-time: 2500-1700`
    }
  ]
  
  for (const testCase of testCases) {
    console.log(`\n${'='.repeat(50)}`)
    console.log(`📋 测试: ${testCase.name}`)
    console.log(`${'='.repeat(50)}`)
    
    // 创建临时文件
    const tempFile = `temp-${Date.now()}.txt`
    fs.writeFileSync(tempFile, testCase.content)
    
    try {
      // 创建验证器并验证
      const validator = new RobotsValidator({ 
        filePath: tempFile,
        verbose: false 
      })
      
      const result = await validator.validate()
      
      // 显示结果摘要
      console.log(`\n📊 验证结果:`)
      console.log(`   状态: ${result.isValid ? '✅ 通过' : '❌ 失败'}`)
      console.log(`   分数: ${result.score}/100`)
      console.log(`   统计: ${result.summary.passed} 通过, ${result.summary.warnings} 警告, ${result.summary.errors} 错误`)
      
      // 显示格式验证详情
      const formatCategory = result.categories.format
      if (formatCategory && formatCategory.checks.length > 0) {
        console.log(`\n📝 格式验证详情:`)
        
        const errors = formatCategory.getErrors()
        const warnings = formatCategory.getWarnings()
        const passed = formatCategory.getPassed()
        
        if (errors.length > 0) {
          console.log(`\n   ❌ 错误 (${errors.length}):`)
          errors.slice(0, 3).forEach(error => {
            console.log(`      • ${error.message}`)
            if (error.suggestion) {
              console.log(`        💡 ${error.suggestion}`)
            }
          })
          if (errors.length > 3) {
            console.log(`      ... 还有 ${errors.length - 3} 个错误`)
          }
        }
        
        if (warnings.length > 0) {
          console.log(`\n   ⚠️  警告 (${warnings.length}):`)
          warnings.slice(0, 3).forEach(warning => {
            console.log(`      • ${warning.message}`)
            if (warning.suggestion) {
              console.log(`        💡 ${warning.suggestion}`)
            }
          })
          if (warnings.length > 3) {
            console.log(`      ... 还有 ${warnings.length - 3} 个警告`)
          }
        }
        
        if (passed.length > 0) {
          console.log(`\n   ✅ 通过 (${passed.length}):`)
          passed.slice(0, 3).forEach(check => {
            console.log(`      • ${check.message}`)
          })
          if (passed.length > 3) {
            console.log(`      ... 还有 ${passed.length - 3} 个通过项`)
          }
        }
      }
      
    } catch (error) {
      console.error(`❌ 测试失败: ${error.message}`)
    } finally {
      // 清理临时文件
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile)
      }
    }
  }
  
  console.log(`\n${'='.repeat(50)}`)
  console.log('🎉 格式验证器测试完成!')
  console.log(`${'='.repeat(50)}`)
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  testFormatValidator().catch(console.error)
}

export { testFormatValidator }