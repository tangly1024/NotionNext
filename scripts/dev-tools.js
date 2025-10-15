#!/usr/bin/env node

/**
 * 开发工具脚本
 * 提供各种开发辅助功能
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function runCommand(command, description) {
  log(`\n🔧 ${description}...`, 'blue')
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' })
    log(`✅ ${description} 完成`, 'green')
    return { success: true, output }
  } catch (error) {
    log(`❌ ${description} 失败`, 'red')
    if (error.stdout) console.log(error.stdout)
    if (error.stderr) console.error(error.stderr)
    return { success: false, error: error.message }
  }
}

/**
 * 初始化开发环境
 */
function initDev() {
  log('🚀 初始化开发环境', 'magenta')
  
  // 检查Node.js版本
  const nodeVersion = process.version
  log(`Node.js 版本: ${nodeVersion}`, 'cyan')
  
  // 检查npm版本
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim()
    log(`npm 版本: ${npmVersion}`, 'cyan')
  } catch (error) {
    log('npm 未安装', 'red')
    return
  }
  
  // 安装依赖
  runCommand('npm install', '安装依赖')
  
  // 检查环境变量
  checkEnvFile()
  
  // 运行质量检查
  runCommand('npm run quality', '代码质量检查')
  
  log('\n🎉 开发环境初始化完成！', 'green')
  log('💡 运行 npm run dev 开始开发', 'cyan')
}

/**
 * 检查环境变量文件
 */
function checkEnvFile() {
  log('\n📋 检查环境变量配置...', 'blue')
  
  const envExample = path.join(process.cwd(), '.env.example')
  const envLocal = path.join(process.cwd(), '.env.local')
  
  if (!fs.existsSync(envExample)) {
    log('⚠️  .env.example 文件不存在', 'yellow')
    return
  }
  
  if (!fs.existsSync(envLocal)) {
    log('⚠️  .env.local 文件不存在，正在创建...', 'yellow')
    try {
      fs.copyFileSync(envExample, envLocal)
      log('✅ 已创建 .env.local 文件，请配置必要的环境变量', 'green')
    } catch (error) {
      log('❌ 创建 .env.local 文件失败', 'red')
    }
  } else {
    log('✅ .env.local 文件存在', 'green')
  }
  
  // 检查必要的环境变量
  const requiredVars = ['NOTION_PAGE_ID']
  const envContent = fs.readFileSync(envLocal, 'utf8')
  
  const missingVars = requiredVars.filter(varName => {
    const regex = new RegExp(`^${varName}=.+`, 'm')
    return !regex.test(envContent)
  })
  
  if (missingVars.length > 0) {
    log(`⚠️  缺少必要的环境变量: ${missingVars.join(', ')}`, 'yellow')
    log('请在 .env.local 文件中配置这些变量', 'yellow')
  } else {
    log('✅ 所有必要的环境变量都已配置', 'green')
  }
}

/**
 * 清理项目
 */
function clean() {
  log('🧹 清理项目文件...', 'magenta')
  
  const dirsToClean = ['.next', 'out', 'node_modules/.cache', 'coverage', '.nyc_output']
  
  dirsToClean.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir)
    if (fs.existsSync(fullPath)) {
      runCommand(`rm -rf ${fullPath}`, `清理 ${dir}`)
    } else {
      log(`📁 ${dir} 不存在，跳过`, 'cyan')
    }
  })
  
  log('✅ 项目清理完成', 'green')
}

/**
 * 生成组件模板
 */
function generateComponent(componentName) {
  if (!componentName) {
    log('❌ 请提供组件名称', 'red')
    log('用法: npm run dev-tools generate:component MyComponent', 'cyan')
    return
  }
  
  log(`🎨 生成组件: ${componentName}`, 'magenta')
  
  const componentDir = path.join(process.cwd(), 'components', componentName)
  const componentFile = path.join(componentDir, 'index.js')
  const styleFile = path.join(componentDir, 'style.module.css')
  
  // 创建组件目录
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true })
  }
  
  // 生成组件文件
  const componentTemplate = `import styles from './style.module.css'

/**
 * ${componentName} 组件
 * @param {object} props 组件属性
 * @returns {JSX.Element}
 */
const ${componentName} = ({ children, className = '', ...props }) => {
  return (
    <div className={\`\${styles.container} \${className}\`} {...props}>
      {children}
    </div>
  )
}

export default ${componentName}
`
  
  // 生成样式文件
  const styleTemplate = `.container {
  /* ${componentName} 样式 */
}
`
  
  fs.writeFileSync(componentFile, componentTemplate)
  fs.writeFileSync(styleFile, styleTemplate)
  
  log(`✅ 组件 ${componentName} 生成完成`, 'green')
  log(`📁 位置: ${componentDir}`, 'cyan')
}

/**
 * 分析包大小
 */
function analyzeBundle() {
  log('📊 分析包大小...', 'magenta')
  
  runCommand('npm run bundle-report', '生成包分析报告')
  
  log('📈 包分析完成，请查看生成的报告', 'green')
}

/**
 * 检查依赖更新
 */
function checkUpdates() {
  log('🔍 检查依赖更新...', 'magenta')
  
  runCommand('npm outdated', '检查过时的依赖')
  
  log('💡 运行 npm update 更新依赖', 'cyan')
}

/**
 * 生成文档
 */
function generateDocs() {
  log('📚 生成项目文档...', 'magenta')
  
  // 生成API文档
  const apiDocs = generateApiDocs()
  fs.writeFileSync(path.join(process.cwd(), 'docs', 'API.md'), apiDocs)
  
  // 生成组件文档
  const componentDocs = generateComponentDocs()
  fs.writeFileSync(path.join(process.cwd(), 'docs', 'COMPONENTS.md'), componentDocs)
  
  log('✅ 文档生成完成', 'green')
}

/**
 * 生成API文档
 */
function generateApiDocs() {
  return `# API 文档

## 概述
本文档描述了项目中的API接口。

## 接口列表

### GET /api/posts
获取文章列表

**参数:**
- page: 页码 (可选)
- limit: 每页数量 (可选)

**响应:**
\`\`\`json
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
\`\`\`

### GET /api/posts/[slug]
获取单篇文章

**参数:**
- slug: 文章标识符

**响应:**
\`\`\`json
{
  "success": true,
  "data": {...}
}
\`\`\`
`
}

/**
 * 生成组件文档
 */
function generateComponentDocs() {
  return `# 组件文档

## 概述
本文档描述了项目中的React组件。

## 组件列表

### LazyImage
懒加载图片组件

**Props:**
- src: 图片地址 (必需)
- alt: 图片描述 (必需)
- width: 图片宽度 (可选)
- height: 图片高度 (可选)
- priority: 是否优先加载 (可选)

**用法:**
\`\`\`jsx
<LazyImage 
  src="/image.jpg" 
  alt="描述" 
  width={300} 
  height={200} 
/>
\`\`\`

### SEO
SEO优化组件

**Props:**
- title: 页面标题 (可选)
- description: 页面描述 (可选)
- keywords: 关键词 (可选)

**用法:**
\`\`\`jsx
<SEO 
  title="页面标题" 
  description="页面描述" 
  keywords="关键词1,关键词2" 
/>
\`\`\`
`
}

/**
 * 主函数
 */
function main() {
  const command = process.argv[2]
  const arg = process.argv[3]
  
  switch (command) {
    case 'init':
      initDev()
      break
    case 'clean':
      clean()
      break
    case 'generate:component':
      generateComponent(arg)
      break
    case 'analyze':
      analyzeBundle()
      break
    case 'check-updates':
      checkUpdates()
      break
    case 'docs':
      generateDocs()
      break
    default:
      log('🛠️  NotionNext 开发工具', 'magenta')
      log('\n可用命令:', 'cyan')
      log('  init              - 初始化开发环境', 'cyan')
      log('  clean             - 清理项目文件', 'cyan')
      log('  generate:component <name> - 生成组件模板', 'cyan')
      log('  analyze           - 分析包大小', 'cyan')
      log('  check-updates     - 检查依赖更新', 'cyan')
      log('  docs              - 生成项目文档', 'cyan')
      log('\n用法: npm run dev-tools <command> [args]', 'yellow')
  }
}

// 运行主函数
if (require.main === module) {
  main()
}

module.exports = {
  initDev,
  clean,
  generateComponent,
  analyzeBundle,
  checkUpdates,
  generateDocs
}
