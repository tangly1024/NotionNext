import { describe, expect, test } from 'bun:test';
import BLOG from '../blog.config';
import { checkStartWithHttp } from '../lib/utils';

// 导入要测试的函数
// 由于generateCustomizeSlug是一个内部函数，我们需要将其提取出来进行测试
// 这里我们创建一个简化版本的函数来模拟其行为

/**
 * 模拟generateCustomizeSlug函数的行为
 * @param {*} postProperties 文章属性
 * @returns {string} 生成的URL
 */
function generateCustomizeSlug(postProperties) {
  // 外链不处理
  if (checkStartWithHttp(postProperties.slug)) {
    return postProperties.slug;
  }
  
  let fullPrefix = '';
  const allSlugPatterns = ['%category%']; // 假设使用分类模式
  
  // 直接从BLOG对象中获取映射配置
  const POST_URL_PREFIX_MAPPING_CATEGORY = BLOG.POST_URL_PREFIX_MAPPING_CATEGORY || {};
  
  // 处理分类模式
  if (postProperties?.category) {
    let categoryPrefix = postProperties.category;
    
    // 检查category是否是数组，如果是，使用第一个分类
    if (Array.isArray(postProperties.category) && postProperties.category.length > 0) {
      categoryPrefix = postProperties.category[0];
    }
    
    // 允许映射分类名，通常用来将中文分类映射成英文，美化url
    if (POST_URL_PREFIX_MAPPING_CATEGORY[categoryPrefix]) {
      categoryPrefix = POST_URL_PREFIX_MAPPING_CATEGORY[categoryPrefix];
    }
    
    fullPrefix += categoryPrefix;
  }
  
  // 生成最终URL
  const finalSlug = fullPrefix
    ? `${fullPrefix}/${postProperties.slug || postProperties.id}`
    : `${postProperties.slug || postProperties.id}`;
    
  return finalSlug;
}

describe('URL映射功能测试', () => {
  test('应该正确映射中文分类为英文', () => {
    const postProperties = {
      category: '知行合一',
      slug: 'test-post'
    };
    
    const result = generateCustomizeSlug(postProperties);
    expect(result).toBe('learning/test-post');
  });
  
  test('应该正确处理数组形式的分类', () => {
    const postProperties = {
      category: ['技术分享', '其他分类'],
      slug: 'test-post'
    };
    
    const result = generateCustomizeSlug(postProperties);
    expect(result).toBe('technology/test-post');
  });
  
  test('当分类没有映射时应该使用原始分类名', () => {
    const postProperties = {
      category: '未映射分类',
      slug: 'test-post'
    };
    
    const result = generateCustomizeSlug(postProperties);
    expect(result).toBe('未映射分类/test-post');
  });
  
  test('当URL是外部链接时应该直接返回', () => {
    const postProperties = {
      category: '知行合一',
      slug: 'https://example.com'
    };
    
    const result = generateCustomizeSlug(postProperties);
    expect(result).toBe('https://example.com');
  });
  
  test('当没有slug时应该使用id', () => {
    const postProperties = {
      category: '知行合一',
      id: '12345'
    };
    
    const result = generateCustomizeSlug(postProperties);
    expect(result).toBe('learning/12345');
  });
  
  test('当没有分类时应该只返回slug', () => {
    const postProperties = {
      slug: 'test-post'
    };
    
    const result = generateCustomizeSlug(postProperties);
    expect(result).toBe('test-post');
  });
});
