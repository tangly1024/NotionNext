#!/usr/bin/env node

/**
 * 部署前检查脚本
 * 确保所有SEO优化功能在生产环境中正常工作
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 开始部署前检查...\n')

// 检查关键文件是否存在
const criticalFiles = [
  'components/SEOEnhanced.js',
  'components/DynamicMetaTags.js',
  'components/OptimizedImage.js',
  'components/ResourcePreloader.js',
  'components/WebVitalsMonitor.js',
  'components/SEOQualityEnhancer.js',
  'lib/seo/seoFixManager.js',
  'lib/seo/seoUtils.js',
  'pages/seo-comprehensive-test.js'
]

console.log('📁 检查关键文件...')
let missingFiles = []

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - 文件缺失`)
    missingFiles.push(file)
  }
})

if (missingFiles.length > 0) {
  console.log(`\n❌ 发现 ${missingFiles.length} 个缺失文件，请检查后重新部署`)
  process.exit(1)
}

// 检查配置文件
console.log('\n⚙️ 检查配置文件...')

// 检查next.config.js
if (fs.existsSync('next.config.js')) {
  const nextConfig = fs.readFileSync('next.config.js', 'utf8')
  
  if (nextConfig.includes('headers:')) {
    console.log('✅ next.config.js - 安全头配置存在')
  } else {
    console.log('⚠️ next.config.js - 缺少安全头配置')
  }
  
  if (nextConfig.includes('images:')) {
    console.log('✅ next.config.js - 图片优化配置存在')
  } else {
    console.log('⚠️ next.config.js - 缺少图片优化配置')
  }
} else {
  console.log('❌ next.config.js - 配置文件缺失')
}

// 检查package.json依赖
console.log('\n📦 检查依赖包...')
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))

const requiredDeps = [
  'next',
  'react',
  'react-dom'
]

requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`✅ ${dep} - ${packageJson.dependencies[dep]}`)
  } else {
    console.log(`❌ ${dep} - 依赖缺失`)
  }
})

// 生成部署配置建议
console.log('\n🚀 生成部署配置建议...')

const deployConfig = {
  environment: 'production',
  node_version: '18.x',
  build_command: 'npm run build',
  output_directory: '.next',
  environment_variables: {
    'NODE_ENV': 'production',
    'NEXT_PUBLIC_SITE_URL': 'https://yourdomain.com',
    'SEO_DEBUG_MODE': 'false'
  },
  headers: [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        }
      ]
    }
  ]
}

fs.writeFileSync('deploy-config.json', JSON.stringify(deployConfig, null, 2))
console.log('✅ 部署配置已生成: deploy-config.json')

console.log('\n🎉 部署前检查完成！')
console.log('\n📋 部署建议:')
console.log('1. 确保环境变量正确设置')
console.log('2. 在生产环境中禁用调试模式')
console.log('3. 配置适当的CSP策略')
console.log('4. 启用HTTPS和安全头')
console.log('5. 配置CDN和缓存策略')