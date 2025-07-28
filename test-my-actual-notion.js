// 简化的Notion数据库测试脚本
const https = require('https');

async function testNotionDatabase() {
  const pageId = '228747250b4d8098bf03c04a1acd31a9';
  
  console.log('🔍 正在测试您的实际Notion数据库...');
  console.log(`📍 数据库ID: ${pageId}`);
  console.log('🌐 数据库URL: https://tide-erica-ab7.notion.site/228747250b4d8098bf03c04a1acd31a9\n');
  
  try {
    // 测试基本连接
    const testUrl = `https://tide-erica-ab7.notion.site/${pageId}`;
    
    const response = await new Promise((resolve, reject) => {
      https.get(testUrl, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, data }));
      }).on('error', reject);
    });
    
    console.log(`📡 HTTP状态码: ${response.statusCode}`);
    
    if (response.statusCode === 200) {
      console.log('✅ Notion页面可以访问！');
      console.log('📄 页面内容长度:', response.data.length, '字符');
      
      // 检查页面是否包含数据库内容
      if (response.data.includes('notion-database') || response.data.includes('table')) {
        console.log('✅ 检测到数据库结构');
      } else {
        console.log('⚠️  可能不是数据库页面或页面为空');
      }
      
    } else if (response.statusCode === 301 || response.statusCode === 302) {
      console.log('🔄 页面被重定向，这通常是正常的');
    } else {
      console.log('❌ 页面访问异常');
    }
    
  } catch (error) {
    console.error('❌ 连接测试失败:', error.message);
  }
  
  console.log('\n📋 下一步建议:');
  console.log('1. 确保您的Notion数据库是公开的或已正确分享');
  console.log('2. 检查数据库中是否有文章，且状态为"Published"');
  console.log('3. 确保数据库包含必要字段：Title, Status, Slug, Date');
  console.log('4. 运行完整的sitemap测试');
  
  console.log('\n🔧 如果页面可以访问，请运行以下命令测试sitemap:');
  console.log('   npm run test:sitemap');
  console.log('   node scripts/run-sitemap-tests.js');
}

testNotionDatabase();