// 简单的URLValidator测试运行器
const { URLValidator } = require('../lib/utils/URLValidator')

console.log('🧪 开始测试URLValidator...\n')

// 创建测试实例
const validator = new URLValidator({
  baseUrl: 'https://www.shareking.vip'
})

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
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`期望 ${expected}, 但得到 ${actual}`)
      }
    },
    toBeNull: () => {
      if (actual !== null) {
        throw new Error(`期望 null, 但得到 ${actual}`)
      }
    },
    toHaveLength: (expected) => {
      if (!actual || actual.length !== expected) {
        throw new Error(`期望长度 ${expected}, 但得到 ${actual ? actual.length : 'undefined'}`)
      }
    },
    toHaveProperty: (prop) => {
      if (!actual || !actual.hasOwnProperty(prop)) {
        throw new Error(`期望有属性 ${prop}, 但没有找到`)
      }
    }
  }
}

// 测试 isValidSlug
console.log('📝 测试 isValidSlug:')
test('应该接受有效的slug', () => {
  expect(validator.isValidSlug('valid-post-slug')).toBe(true)
  expect(validator.isValidSlug('post123')).toBe(true)
  expect(validator.isValidSlug('category/subcategory')).toBe(true)
})

test('应该拒绝无效的slug', () => {
  expect(validator.isValidSlug(null)).toBe(false)
  expect(validator.isValidSlug('')).toBe(false)
  expect(validator.isValidSlug('https://example.com/post')).toBe(false)
  expect(validator.isValidSlug('post#fragment')).toBe(false)
  expect(validator.isValidSlug('post?query=value')).toBe(false)
})

// 测试 isValidURL
console.log('\n🔗 测试 isValidURL:')
test('应该接受有效的URL', () => {
  expect(validator.isValidURL('https://www.shareking.vip')).toBe(true)
  expect(validator.isValidURL('https://www.shareking.vip/post')).toBe(true)
  expect(validator.isValidURL('https://www.shareking.vip/category/tech')).toBe(true)
})

test('应该拒绝无效的URL', () => {
  expect(validator.isValidURL(null)).toBe(false)
  expect(validator.isValidURL('')).toBe(false)
  expect(validator.isValidURL('https://other-domain.com/post')).toBe(false)
  expect(validator.isValidURL('https://github.com/user/repo')).toBe(false)
  expect(validator.isValidURL('https://www.shareking.vip/post#fragment')).toBe(false)
})

// 测试 cleanURL
console.log('\n🧹 测试 cleanURL:')
test('应该清理和标准化URL', () => {
  expect(validator.cleanURL('  https://www.shareking.vip/post  ')).toBe('https://www.shareking.vip/post')
  expect(validator.cleanURL('https://www.shareking.vip/post#fragment')).toBe('https://www.shareking.vip/post')
  expect(validator.cleanURL('https://www.shareking.vip/post?query=value')).toBe('https://www.shareking.vip/post')
  expect(validator.cleanURL('/relative/path')).toBe('https://www.shareking.vip/relative/path')
})

test('应该对无效URL返回null', () => {
  expect(validator.cleanURL(null)).toBeNull()
  expect(validator.cleanURL('')).toBeNull()
  expect(validator.cleanURL('https://other-domain.com/post')).toBeNull()
})

// 测试 generateURL
console.log('\n🏗️ 测试 generateURL:')
test('应该生成有效的URL', () => {
  expect(validator.generateURL('test-post', '')).toBe('https://www.shareking.vip/test-post')
  expect(validator.generateURL('test-post', 'en')).toBe('https://www.shareking.vip/en/test-post')
  expect(validator.generateURL('/test-post', '/en')).toBe('https://www.shareking.vip/en/test-post')
  expect(validator.generateURL('test-post', 'zh-CN')).toBe('https://www.shareking.vip/test-post')
})

test('应该对无效slug返回null', () => {
  expect(validator.generateURL('')).toBeNull()
  expect(validator.generateURL(null)).toBeNull()
  expect(validator.generateURL('https://example.com')).toBeNull()
})

// 测试 validateURLList
console.log('\n📊 测试 validateURLList:')
test('应该正确验证URL列表', () => {
  const urls = [
    { loc: 'https://www.shareking.vip/valid-post' },
    { loc: 'https://github.com/invalid' },
    { loc: null },
    { loc: 'https://www.shareking.vip/another-valid' }
  ]
  
  const result = validator.validateURLList(urls)
  expect(result.valid).toHaveLength(2)
  expect(result.invalid).toHaveLength(2)
})

// 测试 deduplicateURLs
console.log('\n🔄 测试 deduplicateURLs:')
test('应该去除重复的URL', () => {
  const urls = [
    { loc: 'https://www.shareking.vip/post1', lastmod: '2024-01-01' },
    { loc: 'https://www.shareking.vip/post2', lastmod: '2024-01-02' },
    { loc: 'https://www.shareking.vip/post1', lastmod: '2024-01-03' }
  ]
  
  const result = validator.deduplicateURLs(urls)
  expect(result).toHaveLength(2)
  
  const post1 = result.find(url => url.loc === 'https://www.shareking.vip/post1')
  expect(post1.lastmod).toBe('2024-01-03')
})

// 测试 escapeXML
console.log('\n🔒 测试 escapeXML:')
test('应该正确转义XML特殊字符', () => {
  expect(validator.escapeXML('normal text')).toBe('normal text')
  expect(validator.escapeXML('text & more')).toBe('text &amp; more')
  expect(validator.escapeXML('text < more')).toBe('text &lt; more')
  expect(validator.escapeXML('text > more')).toBe('text &gt; more')
  expect(validator.escapeXML('text "quote"')).toBe('text &quot;quote&quot;')
  expect(validator.escapeXML("text 'quote'")).toBe('text &apos;quote&apos;')
  expect(validator.escapeXML('')).toBe('')
  expect(validator.escapeXML(null)).toBe('')
})

// 测试 getValidationStats
console.log('\n📈 测试 getValidationStats:')
test('应该返回正确的验证统计信息', () => {
  const urls = [
    { loc: 'https://www.shareking.vip/valid1' },
    { loc: 'https://www.shareking.vip/valid2' },
    { loc: 'https://github.com/invalid' },
    { loc: null }
  ]
  
  const stats = validator.getValidationStats(urls)
  expect(stats.total).toBe(4)
  expect(stats.valid).toBe(2)
  expect(stats.invalid).toBe(2)
  expect(stats.validPercentage).toBe('50.00')
  expect(stats.invalidReasons).toHaveProperty('Missing loc property')
  expect(stats.invalidReasons).toHaveProperty('Invalid URL format')
})

// 测试自定义配置
console.log('\n⚙️ 测试自定义配置:')
test('应该使用自定义配置', () => {
  const customValidator = new URLValidator({
    baseUrl: 'https://custom-domain.com',
    blacklistedDomains: ['example.com'],
    maxUrlLength: 100
  })
  
  expect(customValidator.isValidURL('https://custom-domain.com/post')).toBe(true)
  expect(customValidator.isValidURL('https://www.shareking.vip/post')).toBe(false)
  expect(customValidator.isValidURL('https://example.com/post')).toBe(false)
})

// 输出测试结果
console.log(`\n📊 测试结果: ${passedTests}/${totalTests} 通过`)

if (passedTests === totalTests) {
  console.log('🎉 所有测试通过！URLValidator功能正常')
  process.exit(0)
} else {
  console.log('❌ 部分测试失败，请检查实现')
  process.exit(1)
}