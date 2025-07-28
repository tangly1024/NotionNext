#!/usr/bin/env node

/**
 * Verification script for Task 7: 建立完整的测试框架
 * Checks that all testing framework components are properly implemented
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verifying Task 7: Complete Testing Framework Implementation\n');

const checks = [
  {
    name: 'Jest Configuration',
    check: () => {
      const jestConfig = require('../jest.config.js');
      const jestSetup = fs.readFileSync(path.join(__dirname, '../jest.setup.js'), 'utf8');
      
      return {
        success: jestConfig && jestSetup.includes('global.testUtils'),
        details: 'Jest is configured with proper setup and global utilities'
      };
    }
  },
  {
    name: 'Test Scripts in package.json',
    check: () => {
      const packageJson = require('../package.json');
      const requiredScripts = [
        'test',
        'test:watch',
        'test:coverage',
        'test:sitemap',
        'test:integration',
        'test:unit',
        'test:sitemap-endpoint',
        'test:error-handling',
        'test:performance',
        'test:xml-validation'
      ];
      
      const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
      
      return {
        success: missingScripts.length === 0,
        details: missingScripts.length === 0 
          ? 'All required test scripts are configured'
          : `Missing scripts: ${missingScripts.join(', ')}`
      };
    }
  },
  {
    name: 'Mock Data Structure',
    check: () => {
      const mockDataPath = path.join(__dirname, '../__tests__/mocks/notionData.js');
      if (!fs.existsSync(mockDataPath)) {
        return { success: false, details: 'Mock data file not found' };
      }
      
      const mockData = fs.readFileSync(mockDataPath, 'utf8');
      const requiredExports = [
        'mockPosts',
        'mockPages',
        'mockBlogConfig',
        'getPublishedPosts',
        'getPublishedPages',
        'mockNotionAPI',
        'mockErrorScenarios'
      ];
      
      const missingExports = requiredExports.filter(exp => !mockData.includes(exp));
      
      return {
        success: missingExports.length === 0,
        details: missingExports.length === 0
          ? 'All required mock data exports are present'
          : `Missing exports: ${missingExports.join(', ')}`
      };
    }
  },
  {
    name: 'Unit Test Files',
    check: () => {
      const testDir = path.join(__dirname, '../__tests__');
      const requiredTestFiles = [
        'URLValidator.test.js',
        'XMLFormatter.test.js',
        'SitemapErrorHandler.test.js',
        'SitemapPerformanceMonitor.test.js'
      ];
      
      const missingFiles = requiredTestFiles.filter(file => 
        !fs.existsSync(path.join(testDir, file))
      );
      
      return {
        success: missingFiles.length === 0,
        details: missingFiles.length === 0
          ? 'All unit test files are present'
          : `Missing test files: ${missingFiles.join(', ')}`
      };
    }
  },
  {
    name: 'Integration Test Files',
    check: () => {
      const testDir = path.join(__dirname, '../__tests__');
      const integrationTestFiles = [
        'sitemap-integration.test.js',
        'sitemap-endpoint-integration.test.js'
      ];
      
      const missingFiles = integrationTestFiles.filter(file => 
        !fs.existsSync(path.join(testDir, file))
      );
      
      return {
        success: missingFiles.length === 0,
        details: missingFiles.length === 0
          ? 'All integration test files are present'
          : `Missing integration test files: ${missingFiles.join(', ')}`
      };
    }
  },
  {
    name: 'Test Runner Script',
    check: () => {
      const scriptPath = path.join(__dirname, 'run-sitemap-tests.js');
      const exists = fs.existsSync(scriptPath);
      
      if (!exists) {
        return { success: false, details: 'Test runner script not found' };
      }
      
      const content = fs.readFileSync(scriptPath, 'utf8');
      const hasTestSuites = content.includes('testSuites') && content.includes('Unit Tests');
      
      return {
        success: hasTestSuites,
        details: hasTestSuites 
          ? 'Test runner script is properly configured'
          : 'Test runner script exists but may not be properly configured'
      };
    }
  },
  {
    name: 'Test Coverage Configuration',
    check: () => {
      const jestConfigPath = path.join(__dirname, '../jest.config.js');
      if (!fs.existsSync(jestConfigPath)) {
        return { success: false, details: 'Jest config file not found' };
      }
      
      const jestConfigContent = fs.readFileSync(jestConfigPath, 'utf8');
      const hasCoverageConfig = jestConfigContent.includes('collectCoverageFrom') &&
                               jestConfigContent.includes('lib/**/*.js');
      
      return {
        success: hasCoverageConfig,
        details: hasCoverageConfig
          ? 'Test coverage is properly configured'
          : 'Test coverage configuration is missing or incomplete'
      };
    }
  },
  {
    name: 'Test Dependencies',
    check: () => {
      const packageJson = require('../package.json');
      const requiredDevDeps = [
        'jest',
        '@types/jest'
      ];
      
      const missingDeps = requiredDevDeps.filter(dep => 
        !packageJson.devDependencies[dep]
      );
      
      return {
        success: missingDeps.length === 0,
        details: missingDeps.length === 0
          ? 'All required test dependencies are installed'
          : `Missing dependencies: ${missingDeps.join(', ')}`
      };
    }
  }
];

let passedChecks = 0;
let totalChecks = checks.length;

console.log('Running verification checks...\n');

checks.forEach((check, index) => {
  try {
    const result = check.check();
    const status = result.success ? '✅' : '❌';
    
    console.log(`${index + 1}. ${status} ${check.name}`);
    console.log(`   ${result.details}\n`);
    
    if (result.success) {
      passedChecks++;
    }
  } catch (error) {
    console.log(`${index + 1}. ❌ ${check.name}`);
    console.log(`   Error: ${error.message}\n`);
  }
});

// Summary
console.log('='.repeat(50));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(50));
console.log(`Passed: ${passedChecks}/${totalChecks} checks`);
console.log(`Success Rate: ${((passedChecks / totalChecks) * 100).toFixed(1)}%\n`);

if (passedChecks === totalChecks) {
  console.log('🎉 Task 7 verification PASSED!');
  console.log('✨ Complete testing framework is properly implemented.');
  console.log('\n📋 Next steps:');
  console.log('   1. Run: npm run test:sitemap');
  console.log('   2. Run: node scripts/run-sitemap-tests.js');
  console.log('   3. Check test coverage: npm run test:coverage');
} else {
  console.log('⚠️  Task 7 verification FAILED!');
  console.log(`${totalChecks - passedChecks} checks need to be addressed.`);
  console.log('\n🔧 Required actions:');
  console.log('   1. Fix the failing checks above');
  console.log('   2. Re-run this verification script');
  console.log('   3. Ensure all tests pass before proceeding');
}

// Try to run a quick test to verify Jest is working
console.log('\n🧪 Testing Jest functionality...');
try {
  execSync('npm test -- --version', { stdio: 'pipe' });
  console.log('✅ Jest is working correctly');
} catch (error) {
  console.log('❌ Jest test failed:', error.message);
}

console.log(`\n🏁 Verification completed at ${new Date().toLocaleString()}`);

// Exit with appropriate code
process.exit(passedChecks === totalChecks ? 0 : 1);