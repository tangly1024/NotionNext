/**
 * 图片ALT自动生成功能测试脚本
 */

import { generateImageAlt, optimizeImageAlts } from './imageSEO.js'

async function testImageAltGeneration() {
  console.log('🖼️  开始测试图片ALT自动生成功能...\n')

  const testCases = [
    {
      name: '用户头像',
      src: 'https://example.com/avatar-john-doe.jpg',
      context: { author: 'John Doe', title: '个人简介' },
      expected: 'profile'
    },
    {
      name: '产品图片',
      src: 'https://example.com/product-iphone-15-pro.jpg',
      context: { title: 'iPhone 15 Pro评测', category: '科技产品' },
      expected: 'iphone'
    },
    {
      name: '截图',
      src: 'https://example.com/screenshot-dashboard.png',
      context: { title: '管理后台使用指南', category: '教程' },
      expected: 'screenshot'
    },
    {
      name: '图表',
      src: 'https://example.com/chart-sales-data-2024.png',
      context: { title: '2024年销售数据分析', category: '数据分析' },
      expected: 'chart'
    },
    {
      name: 'Logo',
      src: 'https://example.com/logo-company.svg',
      context: { siteName: '我的公司', title: '关于我们' },
      expected: 'logo'
    },
    {
      name: 'Notion图片',
      src: 'https://file.notion.so/f/some-random-id.jpg',
      context: { title: 'Notion使用技巧', category: '效率工具' },
      expected: 'notion'
    }
  ]

  let passedTests = 0
  let totalTests = testCases.length

  for (const testCase of testCases) {
    try {
      console.log(`测试: ${testCase.name}`)
      console.log(`图片: ${testCase.src}`)
      console.log(`上下文: ${JSON.stringify(testCase.context)}`)
      
      const generatedAlt = await generateImageAlt(testCase.src, testCase.context)
      console.log(`生成的ALT: "${generatedAlt}"`)
      
      const passed = generatedAlt && generatedAlt.toLowerCase().includes(testCase.expected.toLowerCase())
      
      if (passed) {
        console.log('✅ 测试通过\n')
        passedTests++
      } else {
        console.log(`❌ 测试失败 (期望包含: "${testCase.expected}")\n`)
      }
    } catch (error) {
      console.log(`❌ 测试出错: ${error.message}\n`)
    }
  }

  console.log(`📊 测试结果: ${passedTests}/${totalTests} 通过`)
  console.log(`成功率: ${Math.round((passedTests / totalTests) * 100)}%`)
}

async function testContentOptimization() {
  console.log('\n📝 开始测试内容优化功能...\n')

  const testContent = `
# 我的博客文章

这是一篇关于前端开发的文章。

![](https://example.com/react-tutorial-screenshot.jpg)

React是一个流行的JavaScript库。

![](https://example.com/vue-vs-react-comparison.png)

下面是一个代码示例：

![](https://example.com/code-example.jpg)
`

  const context = {
    title: 'React vs Vue对比',
    category: '前端开发',
    tags: ['React', 'Vue', 'JavaScript'],
    author: '张三'
  }

  try {
    console.log('原始内容:')
    console.log(testContent)
    
    const optimizedContent = await optimizeImageAlts(testContent, context)
    
    console.log('\n优化后内容:')
    console.log(optimizedContent)
    
    // 检查是否所有图片都有了ALT属性
    const imageMatches = optimizedContent.match(/!\[([^\]]*)\]/g) || []
    const imagesWithAlt = imageMatches.filter(match => {
      const alt = match.match(/!\[([^\]]*)\]/)[1]
      return alt && alt.trim()
    })
    
    console.log(`\n📊 优化结果:`)
    console.log(`总图片数: ${imageMatches.length}`)
    console.log(`有ALT属性的图片: ${imagesWithAlt.length}`)
    console.log(`优化成功率: ${Math.round((imagesWithAlt.length / imageMatches.length) * 100)}%`)
    
  } catch (error) {
    console.log(`❌ 内容优化测试失败: ${error.message}`)
  }
}

async function runAllTests() {
  try {
    await testImageAltGeneration()
    await testContentOptimization()
    
    console.log('\n🎉 所有测试完成！')
    console.log('\n💡 使用建议:')
    console.log('1. 在blog.config.js中启用 SEO_AUTO_GENERATE_ALT: true')
    console.log('2. 访问 /image-alt-test 页面查看实际效果')
    console.log('3. 在Notion中插入图片时，系统会自动生成ALT属性')
    
  } catch (error) {
    console.error('测试运行失败:', error)
  }
}

// 如果直接运行此脚本
if (typeof window === 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  runAllTests()
}

export { testImageAltGeneration, testContentOptimization, runAllTests }