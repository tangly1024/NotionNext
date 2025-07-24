#!/usr/bin/env node

/**
 * 清理过期图片URL的脚本
 * 用于扫描和清理项目中的过期Notion图片链接
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// 配置
const CONFIG = {
  // 要扫描的文件扩展名
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.md', '.json', '.xml'],
  
  // 要排除的目录
  excludeDirs: ['node_modules', '.git', '.next', 'dist', 'build'],
  
  // 要扫描的根目录
  rootDir: process.cwd(),
  
  // 过期时间阈值（毫秒）
  expirationThreshold: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7天后过期
  
  // 备份目录
  backupDir: path.join(process.cwd(), '.backup-expired-images')
}

/**
 * 检查是否为Notion图片URL
 */
function isNotionImageUrl(url) {
  const notionDomains = [
    'file.notion.so',
    's3.us-west-2.amazonaws.com',
    'prod-files-secure.s3.us-west-2.amazonaws.com'
  ]
  
  try {
    const urlObj = new URL(url)
    return notionDomains.some(domain => urlObj.hostname.includes(domain))
  } catch {
    return false
  }
}

/**
 * 检查Notion图片URL是否过期
 */
function isNotionImageExpired(url) {
  if (!isNotionImageUrl(url)) return false
  
  try {
    const urlObj = new URL(url)
    const expirationParam = urlObj.searchParams.get('expirationTimestamp')
    
    if (!expirationParam) return false
    
    const expirationTime = parseInt(expirationParam)
    return expirationTime < CONFIG.expirationThreshold
  } catch {
    return false
  }
}

/**
 * 扫描文件中的图片URL
 */
function scanFileForImages(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const imageUrls = []
    
    // 匹配各种图片URL格式
    const patterns = [
      // 直接的HTTP URL
      /https?:\/\/[^\s"'`]+\.(?:png|jpg|jpeg|gif|webp|svg|bmp|ico)/gi,
      // Notion文件URL
      /https?:\/\/file\.notion\.so\/[^\s"'`]+/gi,
      // 在字符串中的URL
      /["'`](https?:\/\/[^"'`\s]+)["'`]/gi,
      // 在配置中的URL
      /url\s*[:=]\s*["'`]([^"'`]+)["'`]/gi
    ]
    
    patterns.forEach(pattern => {
      let match
      while ((match = pattern.exec(content)) !== null) {
        const url = match[1] || match[0]
        if (url && (url.startsWith('http') || url.startsWith('https'))) {
          imageUrls.push({
            url: url.replace(/["'`]/g, ''),
            line: content.substring(0, match.index).split('\n').length,
            column: match.index - content.lastIndexOf('\n', match.index)
          })
        }
      }
    })
    
    return imageUrls
  } catch (error) {
    console.error(`Error scanning file ${filePath}:`, error.message)
    return []
  }
}

/**
 * 递归扫描目录
 */
function scanDirectory(dir, results = []) {
  try {
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        // 跳过排除的目录
        if (!CONFIG.excludeDirs.includes(item)) {
          scanDirectory(fullPath, results)
        }
      } else if (stat.isFile()) {
        // 检查文件扩展名
        const ext = path.extname(item)
        if (CONFIG.extensions.includes(ext)) {
          const images = scanFileForImages(fullPath)
          if (images.length > 0) {
            results.push({
              file: path.relative(CONFIG.rootDir, fullPath),
              images
            })
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message)
  }
  
  return results
}

/**
 * 分析扫描结果
 */
function analyzeResults(results) {
  const analysis = {
    totalFiles: results.length,
    totalImages: 0,
    notionImages: 0,
    expiredImages: 0,
    expiredFiles: [],
    expiredUrls: []
  }
  
  results.forEach(result => {
    result.images.forEach(image => {
      analysis.totalImages++
      
      if (isNotionImageUrl(image.url)) {
        analysis.notionImages++
        
        if (isNotionImageExpired(image.url)) {
          analysis.expiredImages++
          analysis.expiredUrls.push({
            file: result.file,
            url: image.url,
            line: image.line,
            column: image.column
          })
          
          if (!analysis.expiredFiles.includes(result.file)) {
            analysis.expiredFiles.push(result.file)
          }
        }
      }
    })
  })
  
  return analysis
}

/**
 * 创建备份
 */
function createBackup(filesToBackup) {
  if (filesToBackup.length === 0) return
  
  console.log('Creating backup...')
  
  if (!fs.existsSync(CONFIG.backupDir)) {
    fs.mkdirSync(CONFIG.backupDir, { recursive: true })
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupSubDir = path.join(CONFIG.backupDir, `backup-${timestamp}`)
  fs.mkdirSync(backupSubDir, { recursive: true })
  
  filesToBackup.forEach(file => {
    const srcPath = path.join(CONFIG.rootDir, file)
    const destPath = path.join(backupSubDir, file)
    const destDir = path.dirname(destPath)
    
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }
    
    fs.copyFileSync(srcPath, destPath)
  })
  
  console.log(`Backup created at: ${backupSubDir}`)
}

/**
 * 生成替换建议
 */
function generateReplacementSuggestions(expiredUrls) {
  const suggestions = []
  
  expiredUrls.forEach(item => {
    // 生成替换建议
    let suggestion = ''
    
    if (item.file.includes('config')) {
      // 配置文件建议使用base64占位图
      suggestion = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+'
    } else if (item.file.includes('test')) {
      // 测试文件建议使用Unsplash图片
      suggestion = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&q=50&fm=webp&crop=entropy&cs=srgb&width=800&fmt=webp'
    } else {
      // 其他文件建议移除或使用占位图
      suggestion = '// 建议移除此过期图片或使用新的图片URL'
    }
    
    suggestions.push({
      ...item,
      suggestion
    })
  })
  
  return suggestions
}

/**
 * 生成报告
 */
function generateReport(analysis, suggestions) {
  const report = `
# 过期图片清理报告

生成时间: ${new Date().toISOString()}

## 统计信息

- 扫描文件数: ${analysis.totalFiles}
- 总图片数: ${analysis.totalImages}
- Notion图片数: ${analysis.notionImages}
- 过期图片数: ${analysis.expiredImages}
- 受影响文件数: ${analysis.expiredFiles.length}

## 过期图片详情

${suggestions.map(item => `
### ${item.file}:${item.line}:${item.column}

**过期URL:**
\`\`\`
${item.url}
\`\`\`

**建议替换为:**
\`\`\`
${item.suggestion}
\`\`\`
`).join('\n')}

## 清理建议

1. 备份已自动创建在 \`.backup-expired-images/\` 目录
2. 手动替换上述过期URL
3. 运行测试确保功能正常
4. 提交更改

## 预防措施

1. 使用图片代理API避免直接引用Notion图片
2. 定期运行此脚本检查过期图片
3. 在CI/CD中集成图片检查
`
  
  const reportPath = path.join(CONFIG.rootDir, 'expired-images-report.md')
  fs.writeFileSync(reportPath, report)
  
  console.log(`Report generated: ${reportPath}`)
}

/**
 * 主函数
 */
function main() {
  console.log('🔍 Scanning for expired Notion images...')
  console.log(`Root directory: ${CONFIG.rootDir}`)
  console.log(`Extensions: ${CONFIG.extensions.join(', ')}`)
  console.log(`Excluding: ${CONFIG.excludeDirs.join(', ')}`)
  console.log('')
  
  // 扫描文件
  const results = scanDirectory(CONFIG.rootDir)
  
  // 分析结果
  const analysis = analyzeResults(results)
  
  console.log('📊 Scan Results:')
  console.log(`- Files scanned: ${analysis.totalFiles}`)
  console.log(`- Total images found: ${analysis.totalImages}`)
  console.log(`- Notion images: ${analysis.notionImages}`)
  console.log(`- Expired images: ${analysis.expiredImages}`)
  console.log(`- Files with expired images: ${analysis.expiredFiles.length}`)
  console.log('')
  
  if (analysis.expiredImages > 0) {
    console.log('⚠️  Found expired images!')
    
    // 创建备份
    createBackup(analysis.expiredFiles)
    
    // 生成替换建议
    const suggestions = generateReplacementSuggestions(analysis.expiredUrls)
    
    // 生成报告
    generateReport(analysis, suggestions)
    
    console.log('')
    console.log('📋 Expired images found in:')
    analysis.expiredFiles.forEach(file => {
      console.log(`  - ${file}`)
    })
    
    console.log('')
    console.log('✅ Next steps:')
    console.log('1. Review the generated report: expired-images-report.md')
    console.log('2. Replace expired URLs with suggested alternatives')
    console.log('3. Test your application')
    console.log('4. Commit the changes')
    
    process.exit(1) // 退出码1表示发现问题
  } else {
    console.log('✅ No expired images found!')
    process.exit(0)
  }
}

// 运行脚本
if (require.main === module) {
  main()
}

module.exports = {
  isNotionImageUrl,
  isNotionImageExpired,
  scanFileForImages,
  scanDirectory,
  analyzeResults
}