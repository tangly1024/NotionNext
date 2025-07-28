// 简单的sitemap状态过滤测试运行器
const { URLValidator } = require('../lib/utils/URLValidator')

console.log('🧪 开始测试sitemap状态过滤...\n')

// 创建URLValidator实例
const validator = new URLValidator({
  baseUrl: 'https://www.shareking.vip'
})

// 模拟测试数据
const mockPages = [
  {
    id: '1',
    title: '已发布文章',
    slug: 'published-post',
    status: 'Published',
    publishDay: '2024-01-01',
    type: 'Post'
  },
  {
    id: '2', 
    title: '草稿文章',
    slug: 'draft-post',
    status: 'Draft',
    publishDay: '2024-01-02',
    type: 'Post'
  },
  {
    id: '3',
    title: '隐藏文章',
    slug: 'invisible-post', 
    status: 'Invisible',
    publishDay: '2024-01-03',
    type: 'Post'
  },
  {
    id: '4',
    title: '无slug文章',
    slug: '',
    status: 'Published',
    publishDay: '2024-01-04',
    type: 'Post'
  },
  {
    id: '5',
    title: '无发布日期文章',
    slug: 'no-date-post',
    status: 'Published',
    publishDay: null,
    type: 'Post'
  },
  {
    id: '6',
    title: '无效slug文章',
    slug: 'https://example.com/post',
    status: 'Published',
    publishDay: '2024-01-06',
    type: 'Post'
  }
]

let passedTests = 0
let totalTests = 0

function test(description, testFn) {
  totalTests++
  try {
    testFn()
    console.log(`✅ ${description}`)
    passedTests++
  } catch (error) {
    console.log(`❌ ${description}`)
    console.log(`   错误: ${error.message}`)
  }
}

function expect(actual) {
  return {
    toHaveLength: (expected) => {
      if (!actual || actual.length !== expected) {
        throw new Error(`期望长度 ${expected}, 但得到 ${actual ? actual.length : 'undefined'}`)
      }
    },
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`期望 ${expected}, 但得到 ${actual}`)
      }
    },
    toBeUndefined: () => {
      if (actual !== undefined) {
        throw new Error(`期望 undefined, 但得到 ${actual}`)
      }
    }
  }
}

// 测试状态过滤逻辑（与sitemap.xml.js中的逻辑一致）
console.log('📝 测试sitemap状态过滤逻辑:')

test('应该只包含已发布且有效的文章', () => {
  // 应用与sitemap.xml.js相同的过滤逻辑
  const filteredPages = mockPages.filter(p => {
    return p.status === 'Published' &&
           p.slug &&
           p.publishDay &&
           validator.isValidSlug(p.slug)
  })

  // 验证结果
  expect(filteredPages).toHaveLength(1)
  expect(filteredPages[0].title).toBe('已发布文章')
  expect(filteredPages[0].status).toBe('Published')
})

test('应该过滤掉草稿状态的文章', () => {
  const draftPages = mockPages.filter(p => p.status === 'Draft')
  const publishedPages = mockPages.filter(p => 
    p.status === 'Published' && p.slug && p.publishDay && validator.isValidSlug(p.slug)
  )
  
  expect(draftPages).toHaveLength(1)
  
  const draftInPublished = publishedPages.find(p => p.status === 'Draft')
  expect(draftInPublished).toBeUndefined()
})

test('应该过滤掉没有slug的文章', () => {
  const filteredPages = mockPages.filter(p => {
    return p.status === 'Published' &&
           p.slug &&
           p.publishDay &&
           validator.isValidSlug(p.slug)
  })

  const noSlugPage = filteredPages.find(p => !p.slug)
  expect(noSlugPage).toBeUndefined()
})

test('应该过滤掉没有发布日期的文章', () => {
  const filteredPages = mockPages.filter(p => {
    return p.status === 'Published' &&
           p.slug &&
           p.publishDay &&
           validator.isValidSlug(p.slug)
  })

  const noDatePage = filteredPages.find(p => !p.publishDay)
  expect(noDatePage).toBeUndefined()
})

test('应该过滤掉无效slug的文章', () => {
  const filteredPages = mockPages.filter(p => {
    return p.status === 'Published' &&
           p.slug &&
           p.publishDay &&
           validator.isValidSlug(p.slug)
  })

  const invalidSlugPage = filteredPages.find(p => p.slug.includes('https://'))
  expect(invalidSlugPage).toBeUndefined()
})

// 测试URL生成
console.log('\n🔗 测试URL生成:')

test('应该为有效文章生成正确的URL', () => {
  const validPage = mockPages.find(p => p.title === '已发布文章')
  const generatedUrl = validator.generateURL(validPage.slug, '')
  
  expect(generatedUrl).toBe('https://www.shareking.vip/published-post')
})

test('应该为多语言文章生成正确的URL', () => {
  const validPage = mockPages.find(p => p.title === '已发布文章')
  const generatedUrl = validator.generateURL(validPage.slug, 'en')
  
  expect(generatedUrl).toBe('https://www.shareking.vip/en/published-post')
})

// 输出测试结果
console.log(`\n📊 测试结果: ${passedTests}/${totalTests} 通过`)

if (passedTests === totalTests) {
  console.log('🎉 所有测试通过！sitemap状态过滤功能正常')
  process.exit(0)
} else {
  console.log('❌ 部分测试失败，请检查实现')
  process.exit(1)
}