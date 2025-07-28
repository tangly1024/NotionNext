#!/usr/bin/env node

/**
 * Verify robots.txt file compliance and correctness
 */

const fs = require('fs');
const path = require('path');

function verifyRobotsTxt() {
  console.log('🔍 Verifying robots.txt file...\n');
  
  const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');
  
  if (!fs.existsSync(robotsPath)) {
    console.log('❌ robots.txt file not found at:', robotsPath);
    return false;
  }
  
  const content = fs.readFileSync(robotsPath, 'utf8');
  const issues = [];
  const warnings = [];
  const info = [];
  
  // Check Host declaration
  const hostMatch = content.match(/Host:\s*(.+)/);
  if (hostMatch) {
    const hostValue = hostMatch[1].trim();
    if (hostValue.includes('http://') || hostValue.includes('https://')) {
      issues.push('Host declaration should not include protocol (http:// or https://)');
    } else {
      info.push(`✅ Host declaration: ${hostValue}`);
    }
  } else {
    warnings.push('No Host declaration found');
  }
  
  // Check Sitemap URLs
  const sitemapMatches = content.match(/Sitemap:\s*(.+)/g);
  if (sitemapMatches) {
    let httpsCount = 0;
    let httpCount = 0;
    
    sitemapMatches.forEach(match => {
      const url = match.replace('Sitemap:', '').trim();
      if (url.startsWith('https://')) {
        httpsCount++;
      } else if (url.startsWith('http://')) {
        httpCount++;
        issues.push(`Sitemap URL should use HTTPS: ${url}`);
      }
    });
    
    info.push(`✅ Found ${sitemapMatches.length} sitemap declarations`);
    if (httpsCount > 0) {
      info.push(`✅ ${httpsCount} sitemaps using HTTPS`);
    }
    if (httpCount > 0) {
      issues.push(`❌ ${httpCount} sitemaps using HTTP (should be HTTPS)`);
    }
  } else {
    issues.push('No Sitemap declarations found');
  }
  
  // Check User-agent declarations
  const userAgentMatches = content.match(/User-agent:\s*(.+)/g);
  if (userAgentMatches) {
    info.push(`✅ Found ${userAgentMatches.length} User-agent declarations`);
    
    // Check for wildcard user-agent
    const hasWildcard = userAgentMatches.some(match => match.includes('*'));
    if (hasWildcard) {
      info.push('✅ Has wildcard User-agent: *');
    } else {
      warnings.push('No wildcard User-agent: * found');
    }
  } else {
    issues.push('No User-agent declarations found');
  }
  
  // Check for common crawlers
  const commonCrawlers = ['Googlebot', 'Bingbot', 'Baiduspider'];
  commonCrawlers.forEach(crawler => {
    if (content.includes(crawler)) {
      info.push(`✅ Includes rules for ${crawler}`);
    }
  });
  
  // Check for AI bot blocking
  const aiBots = ['GPTBot', 'ChatGPT-User', 'CCBot', 'Google-Extended'];
  const blockedAiBots = aiBots.filter(bot => content.includes(bot));
  if (blockedAiBots.length > 0) {
    info.push(`✅ Blocks ${blockedAiBots.length} AI training bots`);
  }
  
  // Check file size
  const stats = fs.statSync(robotsPath);
  info.push(`📏 File size: ${stats.size} bytes`);
  
  if (stats.size > 500000) { // 500KB limit
    warnings.push('File size is quite large (>500KB)');
  }
  
  // Check for syntax issues
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      // Check for valid directives
      const validDirectives = ['User-agent:', 'Disallow:', 'Allow:', 'Crawl-delay:', 'Sitemap:', 'Host:'];
      const hasValidDirective = validDirectives.some(directive => trimmed.startsWith(directive));
      
      if (!hasValidDirective && trimmed.length > 0) {
        warnings.push(`Line ${index + 1}: Unrecognized directive: ${trimmed}`);
      }
    }
  });
  
  // Display results
  console.log('📊 Verification Results:\n');
  
  if (issues.length > 0) {
    console.log('❌ Issues Found:');
    issues.forEach(issue => console.log(`   ${issue}`));
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  Warnings:');
    warnings.forEach(warning => console.log(`   ${warning}`));
    console.log('');
  }
  
  if (info.length > 0) {
    console.log('ℹ️  Information:');
    info.forEach(item => console.log(`   ${item}`));
    console.log('');
  }
  
  // Overall status
  const isValid = issues.length === 0;
  
  if (isValid) {
    console.log('🎉 robots.txt is valid and properly configured!');
    console.log('\n📋 Summary:');
    console.log(`   📍 Location: ${robotsPath}`);
    console.log(`   📏 Size: ${stats.size} bytes`);
    console.log(`   🤖 User-agents: ${userAgentMatches?.length || 0}`);
    console.log(`   🗺️  Sitemaps: ${sitemapMatches?.length || 0}`);
    console.log(`   ⚠️  Warnings: ${warnings.length}`);
    
    console.log('\n🚀 Next Steps:');
    console.log('   1. Deploy your site to make robots.txt live');
    console.log('   2. Test at: https://www.shareking.vip/robots.txt');
    console.log('   3. Validate with Google Search Console');
    console.log('   4. Check with robots.txt testing tools');
    
  } else {
    console.log('❌ robots.txt has issues that need to be fixed!');
    console.log('\n🔧 Please run the following to fix:');
    console.log('   node scripts/generate-robots.js');
  }
  
  return isValid;
}

if (require.main === module) {
  const isValid = verifyRobotsTxt();
  process.exit(isValid ? 0 : 1);
}

module.exports = { verifyRobotsTxt };