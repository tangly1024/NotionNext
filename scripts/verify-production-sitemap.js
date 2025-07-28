#!/usr/bin/env node

/**
 * Production sitemap verification script
 * Verifies sitemap functionality in production environment
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  // Default domain - should be overridden by command line argument
  domain: process.argv[2] || 'https://www.shareking.vip',
  timeout: 10000,
  userAgent: 'NotionNext-SitemapVerifier/1.0'
};

console.log('🌐 Starting Production Sitemap Verification...\n');
console.log(`🎯 Target Domain: ${config.domain}\n`);

const checks = [
  {
    name: 'Sitemap Accessibility',
    check: async () => {
      const sitemapUrl = `${config.domain}/sitemap.xml`;
      
      try {
        const response = await fetchUrl(sitemapUrl);
        
        if (response.statusCode !== 200) {
          return {
            success: false,
            details: `HTTP ${response.statusCode}: ${response.statusMessage}`
          };
        }
        
        return {
          success: true,
          details: `Sitemap accessible (${response.data.length} bytes)`
        };
      } catch (error) {
        return {
          success: false,
          details: `Failed to fetch sitemap: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'XML Format Validation',
    check: async () => {
      const sitemapUrl = `${config.domain}/sitemap.xml`;
      
      try {
        const response = await fetchUrl(sitemapUrl);
        const xmlData = response.data;
        
        // Basic XML structure checks
        if (!xmlData.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
          return {
            success: false,
            details: 'Missing XML declaration'
          };
        }
        
        if (!xmlData.includes('<urlset')) {
          return {
            success: false,
            details: 'Missing urlset element'
          };
        }
        
        if (!xmlData.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
          return {
            success: false,
            details: 'Missing or incorrect namespace'
          };
        }
        
        if (!xmlData.includes('</urlset>')) {
          return {
            success: false,
            details: 'Missing closing urlset tag'
          };
        }
        
        return {
          success: true,
          details: 'XML format is valid'
        };
      } catch (error) {
        return {
          success: false,
          details: `XML validation failed: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Content Analysis',
    check: async () => {
      const sitemapUrl = `${config.domain}/sitemap.xml`;
      
      try {
        const response = await fetchUrl(sitemapUrl);
        const xmlData = response.data;
        
        // Count URLs
        const urlMatches = xmlData.match(/<loc>/g);
        const urlCount = urlMatches ? urlMatches.length : 0;
        
        if (urlCount === 0) {
          return {
            success: false,
            details: 'No URLs found in sitemap'
          };
        }
        
        // Check for required elements
        const hasLastmod = xmlData.includes('<lastmod>');
        const hasChangefreq = xmlData.includes('<changefreq>');
        const hasPriority = xmlData.includes('<priority>');
        
        const details = [
          `${urlCount} URLs found`,
          hasLastmod ? '✓ lastmod' : '✗ lastmod',
          hasChangefreq ? '✓ changefreq' : '✗ changefreq',
          hasPriority ? '✓ priority' : '✗ priority'
        ].join(', ');
        
        return {
          success: urlCount > 0,
          details
        };
      } catch (error) {
        return {
          success: false,
          details: `Content analysis failed: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'URL Validation',
    check: async () => {
      const sitemapUrl = `${config.domain}/sitemap.xml`;
      
      try {
        const response = await fetchUrl(sitemapUrl);
        const xmlData = response.data;
        
        // Extract URLs
        const urlRegex = /<loc>(.*?)<\/loc>/g;
        const urls = [];
        let match;
        
        while ((match = urlRegex.exec(xmlData)) !== null) {
          urls.push(match[1]);
        }
        
        if (urls.length === 0) {
          return {
            success: false,
            details: 'No URLs found to validate'
          };
        }
        
        // Validate URL format
        const invalidUrls = [];
        const domainUrls = [];
        
        for (const url of urls) {
          try {
            const parsedUrl = new URL(url);
            
            // Check if URL belongs to the same domain
            if (parsedUrl.origin === new URL(config.domain).origin) {
              domainUrls.push(url);
            } else {
              invalidUrls.push(`${url} (wrong domain)`);
            }
          } catch (error) {
            invalidUrls.push(`${url} (invalid format)`);
          }
        }
        
        const validCount = domainUrls.length;
        const invalidCount = invalidUrls.length;
        
        return {
          success: invalidCount === 0,
          details: `${validCount} valid URLs, ${invalidCount} invalid URLs`
        };
      } catch (error) {
        return {
          success: false,
          details: `URL validation failed: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Response Headers',
    check: async () => {
      const sitemapUrl = `${config.domain}/sitemap.xml`;
      
      try {
        const response = await fetchUrl(sitemapUrl, { includeHeaders: true });
        const headers = response.headers;
        
        const checks = [];
        
        // Content-Type check
        const contentType = headers['content-type'] || '';
        if (contentType.includes('xml')) {
          checks.push('✓ Content-Type: XML');
        } else {
          checks.push(`✗ Content-Type: ${contentType}`);
        }
        
        // Cache headers
        const cacheControl = headers['cache-control'] || '';
        if (cacheControl) {
          checks.push(`✓ Cache-Control: ${cacheControl}`);
        } else {
          checks.push('✗ No Cache-Control header');
        }
        
        // Last-Modified
        const lastModified = headers['last-modified'] || '';
        if (lastModified) {
          checks.push(`✓ Last-Modified: ${lastModified}`);
        } else {
          checks.push('✗ No Last-Modified header');
        }
        
        return {
          success: contentType.includes('xml'),
          details: checks.join(', ')
        };
      } catch (error) {
        return {
          success: false,
          details: `Header check failed: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Performance Test',
    check: async () => {
      const sitemapUrl = `${config.domain}/sitemap.xml`;
      
      try {
        const startTime = Date.now();
        const response = await fetchUrl(sitemapUrl);
        const endTime = Date.now();
        
        const responseTime = endTime - startTime;
        const sizeKB = (response.data.length / 1024).toFixed(2);
        
        const isPerformant = responseTime < 5000; // 5 seconds
        
        return {
          success: isPerformant,
          details: `Response time: ${responseTime}ms, Size: ${sizeKB}KB`
        };
      } catch (error) {
        return {
          success: false,
          details: `Performance test failed: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Enhanced Sitemap Check',
    check: async () => {
      const enhancedUrls = [
        `${config.domain}/sitemap-posts.xml`,
        `${config.domain}/sitemap-pages.xml`,
        `${config.domain}/sitemap-index.xml`
      ];
      
      const results = [];
      
      for (const url of enhancedUrls) {
        try {
          const response = await fetchUrl(url);
          if (response.statusCode === 200) {
            results.push(`✓ ${url.split('/').pop()}`);
          } else {
            results.push(`✗ ${url.split('/').pop()} (${response.statusCode})`);
          }
        } catch (error) {
          results.push(`✗ ${url.split('/').pop()} (error)`);
        }
      }
      
      const successCount = results.filter(r => r.startsWith('✓')).length;
      
      return {
        success: true, // Enhanced sitemaps are optional
        details: `Enhanced sitemaps: ${results.join(', ')}`
      };
    }
  },
  
  {
    name: 'robots.txt Integration',
    check: async () => {
      const robotsUrl = `${config.domain}/robots.txt`;
      
      try {
        const response = await fetchUrl(robotsUrl);
        
        if (response.statusCode !== 200) {
          return {
            success: false,
            details: `robots.txt not accessible (HTTP ${response.statusCode})`
          };
        }
        
        const robotsContent = response.data.toLowerCase();
        const hasSitemapReference = robotsContent.includes('sitemap:');
        
        return {
          success: hasSitemapReference,
          details: hasSitemapReference 
            ? 'robots.txt contains sitemap reference'
            : 'robots.txt missing sitemap reference'
        };
      } catch (error) {
        return {
          success: false,
          details: `robots.txt check failed: ${error.message}`
        };
      }
    }
  }
];

// Helper function to fetch URL
function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': config.userAgent
      },
      timeout: config.timeout
    };
    
    const req = client.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: options.includeHeaders ? res.headers : undefined,
          data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

// Run all checks
async function runChecks() {
  let passedChecks = 0;
  const totalChecks = checks.length;
  const results = [];
  
  console.log('Running production verification checks...\n');
  
  for (let i = 0; i < checks.length; i++) {
    const check = checks[i];
    console.log(`${i + 1}. Checking: ${check.name}`);
    
    try {
      const result = await check.check();
      const status = result.success ? '✅' : '❌';
      
      console.log(`   ${status} ${result.details}\n`);
      
      results.push({
        name: check.name,
        success: result.success,
        details: result.details
      });
      
      if (result.success) {
        passedChecks++;
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
      results.push({
        name: check.name,
        success: false,
        details: `Error: ${error.message}`
      });
    }
  }
  
  // Summary
  console.log('='.repeat(60));
  console.log('📊 PRODUCTION VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Domain: ${config.domain}`);
  console.log(`Passed: ${passedChecks}/${totalChecks} checks`);
  console.log(`Success Rate: ${((passedChecks / totalChecks) * 100).toFixed(1)}%\n`);
  
  if (passedChecks === totalChecks) {
    console.log('🎉 PRODUCTION VERIFICATION PASSED!');
    console.log('✨ Your sitemap is working correctly in production.');
    console.log('\n📋 Next steps:');
    console.log('   1. Submit sitemap to Google Search Console');
    console.log('   2. Submit sitemap to Bing Webmaster Tools');
    console.log('   3. Monitor sitemap performance and indexing');
  } else {
    console.log('⚠️  PRODUCTION VERIFICATION FAILED!');
    console.log(`${totalChecks - passedChecks} checks failed.`);
    console.log('\n🔧 Required actions:');
    console.log('   1. Review and fix the failing checks above');
    console.log('   2. Re-run this verification script');
    console.log('   3. Monitor application logs for errors');
  }
  
  // Generate report
  const reportData = {
    timestamp: new Date().toISOString(),
    domain: config.domain,
    summary: {
      totalChecks,
      passedChecks,
      failedChecks: totalChecks - passedChecks,
      successRate: ((passedChecks / totalChecks) * 100).toFixed(1)
    },
    results
  };
  
  const reportDir = path.join(__dirname, '..', 'test-reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const reportPath = path.join(reportDir, 'production-verification-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  console.log(`\n🏁 Verification completed at ${new Date().toLocaleString()}`);
  
  return passedChecks === totalChecks;
}

// Usage information
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node scripts/verify-production-sitemap.js [domain]');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/verify-production-sitemap.js https://example.com');
  console.log('  node scripts/verify-production-sitemap.js https://www.shareking.vip');
  console.log('');
  console.log('If no domain is provided, defaults to https://www.shareking.vip');
  process.exit(0);
}

// Run the verification
runChecks()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Verification failed with error:', error.message);
    process.exit(1);
  });