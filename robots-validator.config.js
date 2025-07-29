/**
 * Robots.txt 验证器配置文件
 * 
 * 此文件包含验证器的默认配置选项
 * 可以根据项目需求进行自定义
 * 
 * @author NotionNext
 * @version 1.0.0
 */

export default {
  // 基本配置
  filePath: 'public/robots.txt',
  strict: false,
  
  // 验证选项
  checkAccessibility: true,
  validateSitemaps: true,
  checkSEO: true,
  
  // 输出配置
  outputFormat: 'console', // console, json, html
  verbose: true,
  colors: true,
  
  // 网络配置
  timeout: 5000, // 毫秒
  userAgent: 'RobotsValidator/1.0',
  
  // 规则配置
  allowedUserAgents: [
    'Googlebot',
    'Bingbot',
    'Slurp',
    'DuckDuckBot',
    'Baiduspider',
    'YandexBot',
    'facebookexternalhit'
  ],
  
  blockedUserAgents: [
    'BadBot',
    'SpamBot',
    'MaliciousBot'
  ],
  
  requiredSitemaps: [
    // 'https://example.com/sitemap.xml',
    // 'https://example.com/sitemap-images.xml'
  ],
  
  // 报告配置
  reportPath: './reports',
  includeRecommendations: true,
  includeSuggestions: true,
  
  // AI 机器人配置
  aiProtection: {
    enabled: true,
    blockHighRisk: true,
    allowLowRisk: false,
    customBots: {
      // 自定义 AI 机器人配置
      // 'custom-ai-bot': {
      //   name: 'Custom AI Bot',
      //   company: 'Custom Company',
      //   riskLevel: 'medium',
      //   blockRecommended: true
      // }
    }
  },
  
  // 格式验证配置
  format: {
    enforceUTF8: true,
    allowBOM: false,
    normalizeLineEndings: true,
    maxFileSize: 500 * 1024, // 500KB
    maxLines: 1000
  },
  
  // 内容验证配置
  content: {
    requireUserAgent: true,
    requireRules: true,
    allowWildcardUserAgent: true,
    validatePaths: true,
    checkPathSyntax: true
  },
  
  // SEO 配置
  seo: {
    checkCrawlDelay: true,
    maxCrawlDelay: 86400, // 24小时（秒）
    recommendSitemap: true,
    checkHostDirective: true,
    validateSearchEngineRules: true
  },
  
  // 标准合规配置
  standards: {
    enforceRFC9309: true,
    allowDeprecatedDirectives: false,
    checkDirectiveOrder: false,
    validateSyntax: true
  },
  
  // 环境特定配置
  environments: {
    development: {
      strict: false,
      checkAccessibility: false,
      validateSitemaps: false,
      verbose: true
    },
    
    staging: {
      strict: true,
      checkAccessibility: true,
      validateSitemaps: true,
      verbose: true
    },
    
    production: {
      strict: true,
      checkAccessibility: true,
      validateSitemaps: true,
      verbose: false,
      timeout: 10000
    }
  },
  
  // 自定义规则
  customRules: [
    // 示例自定义规则
    // {
    //   name: 'require-sitemap',
    //   description: '要求包含 sitemap 声明',
    //   validate: (content) => {
    //     return content.toLowerCase().includes('sitemap:')
    //   },
    //   severity: 'warning',
    //   message: '建议添加 sitemap 声明'
    // }
  ],
  
  // 忽略规则
  ignoreRules: [
    // 'missing-user-agent',
    // 'empty-disallow'
  ],
  
  // 通知配置
  notifications: {
    enabled: false,
    webhook: null,
    email: null,
    slack: null
  }
}