import { describe, expect, test } from 'bun:test';
import BLOG from '../blog.config';
import { generateCustomizeSlug } from '../lib/notion/getPageProperties';

describe('URL映射集成测试', () => {
  test('应该正确映射中文分类为英文', () => {
    const postProperties = {
      category: '知行合一',
      slug: 'test-post'
    };
    
    // 模拟NOTION_CONFIG
    const NOTION_CONFIG = {
      POST_URL_PREFIX: '%category%'
    };
    
    const result = generateCustomizeSlug(postProperties, NOTION_CONFIG);
    expect(result).toBe('learning/test-post');
  });
  
  test('应该正确处理数组形式的分类', () => {
    const postProperties = {
      category: ['技术分享', '其他分类'],
      slug: 'test-post'
    };
    
    // 模拟NOTION_CONFIG
    const NOTION_CONFIG = {
      POST_URL_PREFIX: '%category%'
    };
    
    const result = generateCustomizeSlug(postProperties, NOTION_CONFIG);
    expect(result).toBe('technology/test-post');
  });
  
  test('当分类没有映射时应该使用原始分类名', () => {
    const postProperties = {
      category: '未映射分类',
      slug: 'test-post'
    };
    
    // 模拟NOTION_CONFIG
    const NOTION_CONFIG = {
      POST_URL_PREFIX: '%category%'
    };
    
    const result = generateCustomizeSlug(postProperties, NOTION_CONFIG);
    expect(result).toBe('未映射分类/test-post');
  });
  
  test('当URL是外部链接时应该直接返回', () => {
    const postProperties = {
      category: '知行合一',
      slug: 'https://example.com'
    };
    
    // 模拟NOTION_CONFIG
    const NOTION_CONFIG = {
      POST_URL_PREFIX: '%category%'
    };
    
    const result = generateCustomizeSlug(postProperties, NOTION_CONFIG);
    expect(result).toBe('https://example.com');
  });
  
  test('当没有slug时应该使用id', () => {
    const postProperties = {
      category: '知行合一',
      id: '12345'
    };
    
    // 模拟NOTION_CONFIG
    const NOTION_CONFIG = {
      POST_URL_PREFIX: '%category%'
    };
    
    const result = generateCustomizeSlug(postProperties, NOTION_CONFIG);
    expect(result).toBe('learning/12345');
  });
  
  test('当没有分类时应该只返回slug', () => {
    const postProperties = {
      slug: 'test-post'
    };
    
    // 模拟NOTION_CONFIG
    const NOTION_CONFIG = {
      POST_URL_PREFIX: '%category%'
    };
    
    const result = generateCustomizeSlug(postProperties, NOTION_CONFIG);
    expect(result).toBe('test-post');
  });
  
  test('应该支持年月日格式', () => {
    const postProperties = {
      slug: 'test-post',
      publishDay: '2023-04-25'
    };
    
    // 模拟NOTION_CONFIG
    const NOTION_CONFIG = {
      POST_URL_PREFIX: '%year%/%month%/%day%'
    };
    
    const result = generateCustomizeSlug(postProperties, NOTION_CONFIG);
    expect(result).toBe('2023/04/25/test-post');
  });
  
  test('应该支持混合格式', () => {
    const postProperties = {
      category: '知行合一',
      slug: 'test-post',
      publishDay: '2023-04-25'
    };
    
    // 模拟NOTION_CONFIG
    const NOTION_CONFIG = {
      POST_URL_PREFIX: '%category%/%year%'
    };
    
    const result = generateCustomizeSlug(postProperties, NOTION_CONFIG);
    expect(result).toBe('learning/2023/test-post');
  });
});
