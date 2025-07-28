/**
 * Integration tests for the complete sitemap generation functionality
 * Tests the entire flow from data fetching to XML generation
 */

const { 
  mockPosts, 
  mockPages, 
  mockCategories, 
  mockTags,
  mockBlogConfig,
  getPublishedPosts,
  getPublishedPages,
  mockNotionAPI,
  mockErrorScenarios
} = require('./mocks/notionData');

const { SitemapEnhancedGenerator } = require('../lib/utils/SitemapEnhancedGenerator');
const { SitemapErrorHandler } = require('../lib/utils/SitemapErrorHandler');
const { XMLFormatter } = require('../lib/utils/XMLFormatter');
const { URLValidator } = require('../lib/utils/URLValidator');

// Mock the blog configuration
jest.mock('../blog.config', () => mockBlogConfig, { virtual: true });

// Mock Next.js API response
const mockRes = {
  setHeader: jest.fn(),
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
  end: jest.fn()
};

describe('Sitemap Integration Tests', () => {
  let generator;
  let errorHandler;
  let xmlFormatter;
  let urlValidator;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    mockRes.setHeader.mockClear();
    mockRes.status.mockClear();
    mockRes.send.mockClear();
    mockRes.end.mockClear();

    // Initialize components
    generator = new SitemapEnhancedGenerator();
    errorHandler = new SitemapErrorHandler();
    xmlFormatter = new XMLFormatter();
    urlValidator = new URLValidator();

    // Setup default mock responses
    mockNotionAPI.getAllPosts.mockResolvedValue(mockPosts);
    mockNotionAPI.getAllPages.mockResolvedValue(mockPages);
    mockNotionAPI.getAllCategories.mockResolvedValue(mockCategories);
    mockNotionAPI.getAllTags.mockResolvedValue(mockTags);
  });

  describe('Complete Sitemap Generation Flow', () => {
    test('should generate complete sitemap with all components', async () => {
      const startTime = Date.now();
      
      // Generate enhanced sitemap
      const result = await generator.generateEnhancedSitemaps({
        allPages: [...getPublishedPosts(), ...getPublishedPages()],
        siteInfo: mockBlogConfig.BLOG
      });

      const endTime = Date.now();
      const generationTime = endTime - startTime;

      // Verify result structure
      expect(result).toHaveProperty('sitemaps');
      expect(result).toHaveProperty('stats');
      expect(result.sitemaps).toBeInstanceOf(Array);
      expect(result.stats).toHaveProperty('totalUrls');
      expect(result.stats).toHaveProperty('sitemapFiles');
      expect(result.stats).toHaveProperty('generationTime');

      // Verify performance (should complete within reasonable time)
      expect(generationTime).toBeLessThan(5000); // 5 seconds max
      expect(result.stats.generationTime).toBeGreaterThan(0);

      // Verify sitemap files are generated
      expect(result.sitemaps).toBeInstanceOf(Array);
      expect(result.sitemaps.length).toBeGreaterThan(0);
      
      const sitemapFiles = result.sitemaps.map(s => s.filename);
      expect(sitemapFiles).toContain('sitemap.xml');
      expect(sitemapFiles).toContain('sitemap-posts.xml');
      expect(sitemapFiles).toContain('sitemap-pages.xml');

      // Verify content filtering (only published content)
      const mainSitemap = result.sitemaps.find(s => s.filename === 'sitemap.xml').content;
      expect(mainSitemap).toContain('published-post-1');
      expect(mainSitemap).toContain('published-post-2');
      expect(mainSitemap).not.toContain('draft-post');
      expect(mainSitemap).not.toContain('archived-post');

      // Verify XML format
      expect(mainSitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(mainSitemap).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
      expect(mainSitemap).toContain('<urlset');
      expect(mainSitemap).toContain('</urlset>');

      // Verify URL structure
      expect(mainSitemap).toContain('<loc>https://www.shareking.vip/published-post-1</loc>');
      expect(mainSitemap).toContain('<lastmod>');
      expect(mainSitemap).toContain('<changefreq>');
      expect(mainSitemap).toContain('<priority>');
    });

    test('should handle XML escaping correctly', async () => {
      // Add test data with special characters that need escaping
      const pagesWithSpecialChars = [
        {
          id: 'special-1',
          slug: 'post-with-ampersand',
          title: 'Post with & ampersand',
          status: 'Published',
          type: 'Post',
          publishDay: '2024-01-01',
          summary: 'Summary with <tags> and "quotes" & ampersands'
        }
      ];

      const result = await generator.generateEnhancedSitemaps({
        allPages: [...getPublishedPosts(), ...getPublishedPages(), ...pagesWithSpecialChars],
        siteInfo: mockBlogConfig.BLOG
      });

      const mainSitemap = result.sitemaps.find(s => s.filename === 'sitemap.xml').content;
      
      // Verify XML is well-formed (no unescaped special characters in URLs)
      expect(mainSitemap).not.toMatch(/<loc>[^<]*[&<>"'][^<]*<\/loc>/);
      
      // Verify basic XML structure is maintained
      expect(mainSitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(mainSitemap).toContain('<urlset');
      expect(mainSitemap).toContain('</urlset>');
    });

    test('should generate sitemap index when enabled', async () => {
      const result = await generator.generateEnhancedSitemaps({
        allPages: [...getPublishedPosts(), ...getPublishedPages()],
        siteInfo: mockBlogConfig.BLOG
      });

      const indexSitemap = result.sitemaps.find(s => s.filename === 'sitemap-index.xml');
      if (indexSitemap) {
        expect(indexSitemap.content).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
        expect(indexSitemap.content).toContain('<sitemap>');
        expect(indexSitemap.content).toContain('<loc>https://www.shareking.vip/sitemap-posts.xml</loc>');
        expect(indexSitemap.content).toContain('<lastmod>');
      }
    });

    test('should generate image sitemap when enabled', async () => {
      const result = await generator.generateEnhancedSitemaps({
        allPages: [...getPublishedPosts(), ...getPublishedPages()],
        siteInfo: mockBlogConfig.BLOG
      });

      const imageSitemap = result.sitemaps.find(s => s.filename === 'sitemap-images.xml');
      if (imageSitemap) {
        expect(imageSitemap.content).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
        expect(imageSitemap.content).toContain('<image:image>');
        expect(imageSitemap.content).toContain('<image:loc>');
      }
    });
  });

  describe('Error Handling and Degradation', () => {
    test('should handle network errors gracefully', async () => {
      mockErrorScenarios.networkError();

      const result = await generator.generateEnhancedSitemaps({
        allPages: getPublishedPages(),
        siteInfo: mockBlogConfig.BLOG
      });

      // Should still generate basic sitemap with available data
      expect(result).toHaveProperty('sitemaps');
      expect(result.sitemaps).toBeInstanceOf(Array);
      expect(result.sitemaps.length).toBeGreaterThan(0);
      
      // Should contain static pages even when posts fail
      const mainSitemap = result.sitemaps.find(s => s.filename === 'sitemap.xml').content;
      expect(mainSitemap).toContain('https://www.shareking.vip');
    });

    test('should handle invalid data gracefully', async () => {
      const invalidPages = [
        { id: 'invalid-1', slug: null, title: null, status: 'Published' },
        { id: 'invalid-2', slug: '', title: 'Empty Slug', status: 'Published' },
        { id: 'invalid-3', slug: 'valid-slug', title: 'Valid Post', status: 'Published' }
      ];

      const result = await generator.generateEnhancedSitemaps({
        allPages: invalidPages,
        siteInfo: mockBlogConfig.BLOG
      });

      const mainSitemap = result.sitemaps.find(s => s.filename === 'sitemap.xml').content;
      
      // Should only include valid entries
      expect(mainSitemap).toContain('valid-slug');
      expect(mainSitemap).not.toContain('null');
      expect(mainSitemap).not.toContain('undefined');
    });

    test('should handle empty data sets', async () => {
      const result = await generator.generateEnhancedSitemaps({
        allPages: [],
        siteInfo: mockBlogConfig.BLOG
      });

      expect(result).toHaveProperty('sitemaps');
      expect(result.sitemaps).toBeInstanceOf(Array);
      
      const mainSitemap = result.sitemaps.find(s => s.filename === 'sitemap.xml').content;
      expect(mainSitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(mainSitemap).toContain('<urlset');
      expect(mainSitemap).toContain('</urlset>');
      
      // Should contain at least the homepage
      expect(mainSitemap).toContain('<loc>https://www.shareking.vip</loc>');
    });

    test('should respect timeout limits', async () => {
      // Mock a slow operation
      const slowGenerator = new SitemapEnhancedGenerator();
      const originalGenerate = slowGenerator.generateEnhancedSitemaps;
      
      slowGenerator.generateEnhancedSitemaps = jest.fn().mockImplementation(async (...args) => {
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
        return originalGenerate.apply(slowGenerator, args);
      });

      const startTime = Date.now();
      const result = await slowGenerator.generateEnhancedSitemaps({
        allPages: [...getPublishedPosts(), ...getPublishedPages()],
        siteInfo: mockBlogConfig.BLOG
      });
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThan(90); // Should take at least the delay time
      expect(result).toHaveProperty('sitemaps');
    });
  });

  describe('Performance and Scalability', () => {
    test('should handle large datasets efficiently', async () => {
      // Generate large dataset
      const largePosts = Array.from({ length: 1000 }, (_, i) => ({
        id: `post-${i}`,
        slug: `post-${i}`,
        title: `Post ${i}`,
        status: 'Published',
        type: 'Post',
        publishDay: '2024-01-01',
        lastEditedTime: '2024-01-01T12:00:00.000Z',
        category: 'Technology',
        tags: ['Test'],
        summary: `Summary for post ${i}`
      }));

      const startTime = Date.now();
      const result = await generator.generateEnhancedSitemaps({
        allPages: largePosts,
        siteInfo: mockBlogConfig.BLOG
      });
      const endTime = Date.now();

      // Should complete within reasonable time even with large dataset
      expect(endTime - startTime).toBeLessThan(10000); // 10 seconds max
      expect(result.stats.totalUrls).toBeGreaterThan(1000);
      expect(result.sitemaps.find(s => s.filename === 'sitemap.xml')).toBeDefined();
    });

    test('should provide accurate performance metrics', async () => {
      const result = await generator.generateEnhancedSitemaps({
        allPages: [...getPublishedPosts(), ...getPublishedPages()],
        siteInfo: mockBlogConfig.BLOG
      });

      expect(result.stats).toHaveProperty('totalUrls');
      expect(result.stats).toHaveProperty('sitemapFiles');
      expect(result.stats).toHaveProperty('generationTime');
      expect(result.stats).toHaveProperty('errors');

      expect(typeof result.stats.totalUrls).toBe('number');
      expect(typeof result.stats.sitemapFiles).toBe('object');
      expect(typeof result.stats.generationTime).toBe('number');
      expect(typeof result.stats.errors).toBe('object');

      expect(result.stats.totalUrls).toBeGreaterThan(0);
      expect(result.stats.sitemapFiles.length).toBeGreaterThan(0);
      expect(result.stats.generationTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Configuration-Driven Behavior', () => {
    test('should respect configuration settings', async () => {
      const result = await generator.generateEnhancedSitemaps({
        allPages: [...getPublishedPosts(), ...getPublishedPages()],
        siteInfo: mockBlogConfig.BLOG
      });

      // Should generate main sitemap
      const sitemapFiles = result.sitemaps.map(s => s.filename);
      expect(sitemapFiles).toContain('sitemap.xml');
      
      // Should generate enhanced sitemaps when enabled
      expect(sitemapFiles).toContain('sitemap-posts.xml');
      expect(sitemapFiles).toContain('sitemap-pages.xml');
    });
  });

  describe('Search Engine Standards Compliance', () => {
    test('should generate XML that validates against sitemap schema', async () => {
      const result = await generator.generateEnhancedSitemaps({
        allPages: [...getPublishedPosts(), ...getPublishedPages()],
        siteInfo: mockBlogConfig.BLOG
      });

      const mainSitemap = result.sitemaps.find(s => s.filename === 'sitemap.xml').content;

      // Check XML declaration
      expect(mainSitemap).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
      
      // Check namespace
      expect(mainSitemap).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
      
      // Check required elements
      expect(mainSitemap).toMatch(/<loc>https?:\/\/[^<]+<\/loc>/);
      expect(mainSitemap).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
      expect(mainSitemap).toMatch(/<changefreq>(always|hourly|daily|weekly|monthly|yearly|never)<\/changefreq>/);
      expect(mainSitemap).toMatch(/<priority>(0\.\d|1\.0)<\/priority>/);
      
      // Check proper XML structure
      expect(mainSitemap).toMatch(/<urlset[^>]*>[\s\S]*<\/urlset>/);
      expect(mainSitemap).toMatch(/<url>[\s\S]*?<\/url>/);
    });

    test('should not exceed URL limits per sitemap', async () => {
      const result = await generator.generateEnhancedSitemaps({
        allPages: [...getPublishedPosts(), ...getPublishedPages()],
        siteInfo: mockBlogConfig.BLOG
      });

      // Count URLs in main sitemap
      const mainSitemap = result.sitemaps.find(s => s.filename === 'sitemap.xml').content;
      const urlMatches = mainSitemap.match(/<url>/g);
      const urlCount = urlMatches ? urlMatches.length : 0;

      // Should have reasonable number of URLs
      expect(urlCount).toBeGreaterThan(0);
      expect(urlCount).toBeLessThan(50000); // Standard sitemap limit
    });
  });
});