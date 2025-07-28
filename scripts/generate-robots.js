#!/usr/bin/env node

/**
 * Generate correct robots.txt file
 * Fixes protocol and Host declaration issues
 */

const fs = require('fs');
const path = require('path');

// Read configuration from blog.config.js
const BLOG = require('../blog.config.js');

function generateCorrectRobotsTxt() {
  const baseUrl = BLOG.LINK || 'https://www.shareking.vip';
  const author = BLOG.AUTHOR || '分享之王';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Extract domain without protocol for Host declaration
  const domain = baseUrl.replace('https://', '').replace('http://', '');
  
  let content = `# Robots.txt for ${baseUrl}
# Generated on ${currentDate}
# Author: ${author}

# Allow all web crawlers to access all content
User-agent: *
Allow: /

# Disallow access to admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /_next/
Disallow: /static/

# Disallow access to search result pages to prevent duplicate content
Disallow: /search?*
Disallow: /search/*

# Allow access to important directories
Allow: /images/
Allow: /css/
Allow: /js/
Allow: /fonts/

# Specific rules for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Crawl-delay: 2

User-agent: YandexBot
Allow: /
Crawl-delay: 1

# Block problematic and AI training bots
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MajesticSEO
Disallow: /

# Block AI training bots
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: meta-externalagent
Disallow: /

# Host declaration (domain only, no protocol)
Host: ${domain}

# Sitemap locations
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-images.xml
Sitemap: ${baseUrl}/sitemap-pages.xml
Sitemap: ${baseUrl}/sitemap-posts.xml`;

  // Add enhanced sitemap files if enabled
  if (BLOG.SEO_SITEMAP_ENHANCED) {
    content += `
Sitemap: ${baseUrl}/sitemap-categories.xml
Sitemap: ${baseUrl}/sitemap-tags.xml
Sitemap: ${baseUrl}/sitemap-index.xml`;
  }

  content += `

# Additional information
# For questions about this robots.txt, contact: ${author}@${domain}
`;

  return content;
}

function validateRobotsTxt(content) {
  const issues = [];
  
  // Check for correct Host format (should not include protocol)
  const hostMatch = content.match(/Host:\s*(.+)/);
  if (hostMatch) {
    const hostValue = hostMatch[1].trim();
    if (hostValue.includes('http://') || hostValue.includes('https://')) {
      issues.push('Host declaration should not include protocol (http:// or https://)');
    }
  }
  
  // Check for HTTPS in sitemap URLs
  const sitemapMatches = content.match(/Sitemap:\s*(.+)/g);
  if (sitemapMatches) {
    sitemapMatches.forEach(match => {
      if (match.includes('http://')) {
        issues.push('Sitemap URLs should use HTTPS, not HTTP');
      }
    });
  }
  
  // Check basic structure
  if (!content.includes('User-agent:')) {
    issues.push('Missing User-agent directive');
  }
  
  if (!content.includes('Sitemap:')) {
    issues.push('Missing Sitemap directive');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

function main() {
  console.log('🤖 Generating correct robots.txt...\n');
  
  try {
    // Generate new robots.txt content
    const newContent = generateCorrectRobotsTxt();
    
    // Validate the content
    const validation = validateRobotsTxt(newContent);
    
    if (!validation.isValid) {
      console.log('❌ Validation failed:');
      validation.issues.forEach(issue => {
        console.log(`   - ${issue}`);
      });
      return;
    }
    
    // Write to public/robots.txt
    const publicDir = path.join(__dirname, '..', 'public');
    const robotsPath = path.join(publicDir, 'robots.txt');
    
    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(robotsPath, newContent);
    
    console.log('✅ robots.txt generated successfully!');
    console.log(`📍 Location: ${robotsPath}`);
    
    // Show key information
    const baseUrl = BLOG.LINK || 'https://www.shareking.vip';
    const domain = baseUrl.replace('https://', '').replace('http://', '');
    
    console.log('\n📋 Key Information:');
    console.log(`   🌐 Base URL: ${baseUrl}`);
    console.log(`   🏠 Host: ${domain}`);
    console.log(`   📄 Main Sitemap: ${baseUrl}/sitemap.xml`);
    
    // Count sitemaps
    const sitemapCount = (newContent.match(/Sitemap:/g) || []).length;
    console.log(`   📊 Total Sitemaps: ${sitemapCount}`);
    
    // Show file stats
    const stats = fs.statSync(robotsPath);
    console.log(`   📏 File Size: ${stats.size} bytes`);
    
    console.log('\n🔍 Validation Results:');
    console.log('   ✅ Host declaration format: Correct (no protocol)');
    console.log('   ✅ Sitemap URLs: Using HTTPS');
    console.log('   ✅ Basic structure: Valid');
    
    console.log('\n🚀 Next Steps:');
    console.log('   1. Deploy your site to update the robots.txt');
    console.log('   2. Verify at: https://www.shareking.vip/robots.txt');
    console.log('   3. Test with Google Search Console');
    
  } catch (error) {
    console.error('❌ Error generating robots.txt:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateCorrectRobotsTxt, validateRobotsTxt };