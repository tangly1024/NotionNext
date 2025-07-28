#!/usr/bin/env node

/**
 * Comprehensive test runner for sitemap functionality
 * Runs all sitemap-related tests and provides detailed reporting
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Sitemap Test Suite...\n');

const testSuites = [
  {
    name: 'Unit Tests - URL Validator',
    command: 'npm run test -- __tests__/URLValidator.test.js',
    description: 'Tests URL validation and generation logic'
  },
  {
    name: 'Unit Tests - XML Formatter',
    command: 'npm run test -- __tests__/XMLFormatter.test.js',
    description: 'Tests XML generation and formatting'
  },
  {
    name: 'Unit Tests - Error Handler',
    command: 'npm run test -- __tests__/SitemapErrorHandler.test.js',
    description: 'Tests error handling and fallback mechanisms'
  },
  {
    name: 'Unit Tests - Performance Monitor',
    command: 'npm run test -- __tests__/SitemapPerformanceMonitor.test.js',
    description: 'Tests performance monitoring and optimization'
  },
  {
    name: 'Integration Tests - Sitemap Generation',
    command: 'npm run test -- __tests__/sitemap-integration.test.js',
    description: 'Tests complete sitemap generation flow'
  },
  {
    name: 'End-to-End Tests - Sitemap Endpoint',
    command: 'npm run test -- __tests__/sitemap-endpoint-integration.test.js',
    description: 'Tests the actual sitemap.xml endpoint'
  }
];

const results = [];
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

for (const suite of testSuites) {
  console.log(`\n📋 Running: ${suite.name}`);
  console.log(`   ${suite.description}`);
  console.log('   ' + '─'.repeat(50));
  
  try {
    const output = execSync(suite.command, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    // Parse Jest output for test counts
    const testMatch = output.match(/Tests:\s+(\d+)\s+passed,\s+(\d+)\s+total/);
    if (testMatch) {
      const passed = parseInt(testMatch[1]);
      const total = parseInt(testMatch[2]);
      totalTests += total;
      passedTests += passed;
      
      console.log(`   ✅ ${passed}/${total} tests passed`);
      results.push({
        suite: suite.name,
        status: 'PASSED',
        passed,
        total,
        output: output.split('\n').slice(-10).join('\n') // Last 10 lines
      });
    } else {
      console.log('   ✅ All tests passed');
      results.push({
        suite: suite.name,
        status: 'PASSED',
        passed: 'N/A',
        total: 'N/A',
        output: 'All tests passed'
      });
    }
    
  } catch (error) {
    const failed = error.stdout ? error.stdout.match(/(\d+)\s+failed/) : null;
    const failedCount = failed ? parseInt(failed[1]) : 1;
    failedTests += failedCount;
    
    console.log(`   ❌ Tests failed`);
    console.log(`   Error: ${error.message.split('\n')[0]}`);
    
    results.push({
      suite: suite.name,
      status: 'FAILED',
      error: error.message,
      output: error.stdout || error.stderr || 'No output available'
    });
  }
}

// Generate summary report
console.log('\n' + '='.repeat(60));
console.log('📊 TEST SUMMARY REPORT');
console.log('='.repeat(60));

console.log(`\n📈 Overall Statistics:`);
console.log(`   Total Test Suites: ${testSuites.length}`);
console.log(`   Passed Suites: ${results.filter(r => r.status === 'PASSED').length}`);
console.log(`   Failed Suites: ${results.filter(r => r.status === 'FAILED').length}`);

if (totalTests > 0) {
  console.log(`   Total Individual Tests: ${totalTests}`);
  console.log(`   Passed Tests: ${passedTests}`);
  console.log(`   Failed Tests: ${failedTests}`);
  console.log(`   Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
}

console.log(`\n📋 Detailed Results:`);
results.forEach((result, index) => {
  const icon = result.status === 'PASSED' ? '✅' : '❌';
  console.log(`   ${index + 1}. ${icon} ${result.suite}`);
  
  if (result.status === 'PASSED' && result.passed !== 'N/A') {
    console.log(`      Tests: ${result.passed}/${result.total} passed`);
  } else if (result.status === 'FAILED') {
    console.log(`      Error: ${result.error.split('\n')[0]}`);
  }
});

// Generate detailed report file
const reportData = {
  timestamp: new Date().toISOString(),
  summary: {
    totalSuites: testSuites.length,
    passedSuites: results.filter(r => r.status === 'PASSED').length,
    failedSuites: results.filter(r => r.status === 'FAILED').length,
    totalTests,
    passedTests,
    failedTests,
    successRate: totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 'N/A'
  },
  results
};

const reportPath = path.join(__dirname, '..', 'test-reports', 'sitemap-test-report.json');
const reportDir = path.dirname(reportPath);

if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));

console.log(`\n📄 Detailed report saved to: ${reportPath}`);

// Check for critical failures
const criticalFailures = results.filter(r => 
  r.status === 'FAILED' && 
  (r.suite.includes('Integration') || r.suite.includes('End-to-End'))
);

if (criticalFailures.length > 0) {
  console.log(`\n⚠️  CRITICAL FAILURES DETECTED:`);
  criticalFailures.forEach(failure => {
    console.log(`   - ${failure.suite}`);
  });
  console.log(`\n   These failures indicate core functionality issues that need immediate attention.`);
}

// Provide recommendations
console.log(`\n💡 Recommendations:`);
if (failedTests === 0) {
  console.log(`   🎉 All tests are passing! The sitemap functionality is working correctly.`);
  console.log(`   ✨ Consider running performance tests with larger datasets.`);
} else {
  console.log(`   🔧 Fix failing tests before deploying to production.`);
  console.log(`   📝 Review error messages in the detailed report.`);
  console.log(`   🧪 Run individual test suites for more detailed debugging.`);
}

console.log(`\n🏁 Test run completed at ${new Date().toLocaleString()}`);

// Exit with appropriate code
process.exit(failedTests > 0 ? 1 : 0);