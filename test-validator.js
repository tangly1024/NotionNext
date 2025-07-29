import { RobotsValidator } from './lib/seo/robotsValidator.js'

async function test() {
  try {
    console.log('🔍 测试 RobotsValidator...')
    const validator = new RobotsValidator({
      filePath: 'public/robots.txt',
      verbose: true
    })
    
    console.log('✅ 验证器创建成功')
    
    const result = await validator.validate()
    console.log('✅ 验证完成')
    console.log('结果:', result)
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message)
    console.error(error.stack)
  }
}

test()