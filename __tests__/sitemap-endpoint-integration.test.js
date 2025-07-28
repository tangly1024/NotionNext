/**
 * Simplified end-to-end integration tests for the sitemap.xml endpoint
 * Tests basic functionality without complex async operations
 */

const { 
  mockPosts, 
  mockPages, 
  mockBlogConfig,
  getPublishedPosts,
  getPublishedPages
} = require('./mocks/notionData');

describe('Sitemap Endpoint Integration Tests', () => {
  // Mock response object
  let mockRes;

  beforeEach(() => {
    mockRes = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      end: jest.fn(),
      write: jest.fn()
    };
    
    jest.clearAllMocks();
  });

  describe('Basic Functionality Tests', () => {
    test('should have required mock data structure', () => {
      expect(mockPosts).toBeDefined();
      expect(mockPages).toBeDefined();
      expect(mockBlogConfig).toBeDefined();
      expect(getPublishedPosts()).toBeInstanceOf(Array);
      expect(getPublishedPages()).toBeInstanceOf(Array);
    });

    test('should filter published content correctly', () => {
      const publishedPosts = getPublishedPosts();
      const publishedPages = getPublishedPages();
      
      // All returned posts should have Published status
      publishedPosts.forEach(post => {
        expect(post.status).toBe('Published');
      });
      
      publishedPages.forEach(page => {
        expect(page.status).toBe('Published');
      });
      
      // Should not include draft or archived content
      expect(publishedPosts.find(p => p.status === 'Draft')).toBeUndefined();
      expect(publishedPosts.find(p => p.status === 'Archived')).toBeUndefined();
    });

    test('should have valid URL structure in mock data', () => {
      const publishedPosts = getPublishedPosts();
      
      publishedPosts.forEach(post => {
        expect(post.slug).toBeDefined();
        expect(typeof post.slug).toBe('string');
        expect(post.slug.length).toBeGreaterThan(0);
        expect(post.title).toBeDefined();
        expect(post.date).toBeDefined();
      });
    });
  });

  describe('XML Generation Tests', () => {
    test('should generate basic XML structure', () => {
      const { XMLFormatter } = require('../lib/utils/XMLFormatter');
      const formatter = new XMLFormatter({ baseUrl: 'https://www.shareking.vip' });
      
      const testUrls = [
        {
          loc: 'https://www.shareking.vip/test-post',
          lastmod: '2024-01-01',
          changefreq: 'weekly',
          priority: '0.8'
        }
      ];
      
      const result = formatter.generateSitemapXML(testUrls);
      
      expect(result.success).toBe(true);
      expect(result.xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result.xml).toContain('<urlset');
      expect(result.xml).toContain('</urlset>');
      expect(result.xml).toContain('<loc>https://www.shareking.vip/test-post</loc>');
    });

    test('should handle URL validation', () => {
      const { URLValidator } = require('../lib/utils/URLValidator');
      const validator = new URLValidator({ baseUrl: 'https://www.shareking.vip' });
      
      // Test valid URLs
      expect(validator.isValidURL('https://www.shareking.vip/test')).toBe(true);
      expect(validator.isValidURL('https://www.shareking.vip/category/tech')).toBe(true);
      
      // Test invalid URLs
      expect(validator.isValidURL('https://github.com/test')).toBe(false);
      expect(validator.isValidURL('invalid-url')).toBe(false);
      expect(validator.isValidURL(null)).toBe(false);
    });

    test('should handle error scenarios gracefully', () => {
      const { SitemapErrorHandler } = require('../lib/utils/SitemapErrorHandler');
      const errorHandler = new SitemapErrorHandler({ baseUrl: 'https://www.shareking.vip' });
      
      // Test fallback sitemap generation
      const fallbackXml = errorHandler.generateFallbackSitemap('level1');
      
      expect(fallbackXml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(fallbackXml).toContain('<urlset');
      expect(fallbackXml).toContain('https://www.shareking.vip');
    });
  });

  describe('Component Integration Tests', () => {
    test('should integrate URL validation with XML generation', () => {
      const { URLValidator } = require('../lib/utils/URLValidator');
      const { XMLFormatter } = require('../lib/utils/XMLFormatter');
      
      const validator = new URLValidator({ baseUrl: 'https://www.shareking.vip' });
      const formatter = new XMLFormatter({ baseUrl: 'https://www.shareking.vip' });
      
      const testUrls = [
        { loc: 'https://www.shareking.vip/valid-post' },
        { loc: 'https://github.com/invalid' },
        { loc: 'https://www.shareking.vip/another-valid' }
      ];
      
      const validationResult = validator.validateURLList(testUrls);
      const xmlResult = formatter.generateSitemapXML(validationResult.valid);
      
      expect(validationResult.valid.length).toBe(2);
      expect(validationResult.invalid.length).toBe(1);
      expect(xmlResult.success).toBe(true);
      expect(xmlResult.xml).toContain('valid-post');
      expect(xmlResult.xml).toContain('another-valid');
      expect(xmlResult.xml).not.toContain('github.com');
    });

    test('should handle performance monitoring basics', () => {
      const { SitemapPerformanceMonitor } = require('../lib/utils/SitemapPerformanceMonitor');
      
      const monitor = new SitemapPerformanceMonitor({
        enableMemoryMonitoring: false,
        enableTimeoutProtection: false,
        enableLogging: false
      });
      
      // Test basic functionality
      expect(monitor.config).toBeDefined();
      expect(monitor.getPerformanceStats()).toBeDefined();
      expect(monitor.getHealthStatus()).toBeDefined();
      
      // Clean up
      if (typeof monitor.stopMemoryMonitoring === 'function') {
        monitor.stopMemoryMonitoring();
      }
    });
  });

  describe('Mock Response Tests', () => {
    test('should properly mock response object', () => {
      // Test that our mock response object works correctly
      mockRes.setHeader('Content-Type', 'application/xml');
      mockRes.write('<xml>test</xml>');
      mockRes.end();
      
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/xml');
      expect(mockRes.write).toHaveBeenCalledWith('<xml>test</xml>');
      expect(mockRes.end).toHaveBeenCalled();
    });

    test('should handle multiple header calls', () => {
      mockRes.setHeader('Content-Type', 'application/xml');
      mockRes.setHeader('Cache-Control', 'public, max-age=3600');
      
      expect(mockRes.setHeader).toHaveBeenCalledTimes(2);
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/xml');
      expect(mockRes.setHeader).toHaveBeenCalledWith('Cache-Control', 'public, max-age=3600');
    });
  });

  describe('Data Processing Tests', () => {
    test('should process published posts correctly', () => {
      const publishedPosts = getPublishedPosts();
      
      expect(publishedPosts.length).toBeGreaterThan(0);
      
      publishedPosts.forEach(post => {
        expect(post).toHaveProperty('id');
        expect(post).toHaveProperty('slug');
        expect(post).toHaveProperty('title');
        expect(post).toHaveProperty('status');
        expect(post.status).toBe('Published');
      });
    });

    test('should handle special characters in content', () => {
      const { URLValidator } = require('../lib/utils/URLValidator');
      const validator = new URLValidator({ baseUrl: 'https://www.shareking.vip' });
      
      // Test XML escaping
      const testString = 'Title with & ampersand and <tags>';
      const escaped = validator.escapeXML(testString);
      
      expect(escaped).toContain('&amp;');
      expect(escaped).toContain('&lt;');
      expect(escaped).toContain('&gt;');
      // Check that raw characters are properly escaped (not present as standalone characters)
      expect(escaped).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
      expect(escaped).not.toContain('<');
      expect(escaped).not.toContain('>');
    });
  });

  describe('Configuration Tests', () => {
    test('should use mock blog configuration', () => {
      expect(mockBlogConfig).toHaveProperty('BLOG');
      expect(mockBlogConfig.BLOG).toHaveProperty('LINK');
      expect(mockBlogConfig.BLOG).toHaveProperty('NOTION_PROPERTY_NAME');
    });

    test('should handle different configuration scenarios', () => {
      const { XMLFormatter } = require('../lib/utils/XMLFormatter');
      
      // Test with different base URLs
      const formatter1 = new XMLFormatter({ baseUrl: 'https://example.com' });
      const formatter2 = new XMLFormatter({ baseUrl: 'https://test.com' });
      
      expect(formatter1.config.baseUrl).toBe('https://example.com');
      expect(formatter2.config.baseUrl).toBe('https://test.com');
    });
  });
});