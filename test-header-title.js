// 测试Header组件标题显示逻辑

// 模拟不同的路由和props情况
const testCases = [
  {
    name: '两级文章页面 (/article/example-6) - 应该显示文章标题',
    router: { route: '/[prefix]/[slug]' },
    props: { post: { title: '🎬《七武士》高清完整版资源' } },
    expected: '🎬《七武士》高清完整版资源'
  },
  {
    name: '单级文章页面 (/about) - 应该显示文章标题',
    router: { route: '/[prefix]' },
    props: { post: { title: '关于我们' } },
    expected: '关于我们'
  },
  {
    name: '首页 - 应该显示网站标题和描述',
    router: { route: '/' },
    props: {},
    expected: '分享之王 | 一个专注于分享高价值资源的网站'
  },
  {
    name: '分类页面 - 应该显示网站标题和描述',
    router: { route: '/category/[category]' },
    props: {},
    expected: '分享之王 | 一个专注于分享高价值资源的网站'
  },
  {
    name: '没有post数据的页面 - 应该显示网站标题和描述',
    router: { route: '/[prefix]/[slug]' },
    props: {},
    expected: '分享之王 | 一个专注于分享高价值资源的网站'
  }
]

// 模拟siteConfig函数
const siteConfig = (key) => {
  const config = {
    'AUTHOR': '分享之王',
    'TITLE': '分享之王',
    'BIO': '一个专注于分享高价值资源的网站'
  }
  return config[key]
}

// 测试逻辑
testCases.forEach(testCase => {
  const { router, props } = testCase
  
  // 模拟Header组件中的逻辑
  const shouldShowPostTitle = props.post?.title && (router.route === '/[prefix]/[slug]' || router.route === '/[prefix]')
  
  let result
  if (shouldShowPostTitle) {
    result = props.post.title
  } else {
    result = `${siteConfig('AUTHOR') || siteConfig('TITLE')} | ${siteConfig('BIO')}`
  }
  
  console.log(`${testCase.name}:`)
  console.log(`  预期: ${testCase.expected}`)
  console.log(`  实际: ${result}`)
  console.log(`  结果: ${result === testCase.expected ? '✅ 通过' : '❌ 失败'}`)
  console.log('')
})