// 测试结构化数据生成
import { generateArticleSchema } from './lib/seo/structuredData.js'

const testPost = {
  title: '测试文章',
  summary: '这是一个测试文章',
  publishDay: '2025-01-24',
  slug: 'test-article'
}

const testSiteInfo = {
  title: '分享之王',
  author: '分享之王',
  icon: '/favicon.ico'
}

const baseUrl = 'http://www.shareking.vip'

const schema = generateArticleSchema(testPost, testSiteInfo, baseUrl)
console.log('生成的结构化数据:', JSON.stringify(schema, null, 2))