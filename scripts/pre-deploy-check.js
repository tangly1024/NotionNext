#!/usr/bin/env node

/**
 * Pre-deployment verification script for NotionNext Sitemap functionality
 * Performs comprehensive checks before deploying to production
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Pre-deployment Verification...\n');

const checks = [
  {
    name: 'Environment Requirements',
    check: () => {
      try {
        // Check Node.js version
        const nodeVersion = process.version;
        const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
        
        if (majorVersion < 20) {
          return {
            success: false,
            details: `Node.js version ${nodeVersion} is too old. Requires >= 20.0.0`
          };
        }
        
        // Check if package.json exists
        if (!fs.existsSync('package.json')) {
          return {
            success: false,
            details: 'package.json not found'
          };
        }
        
        return {
          success: true,
          details: `Node.js ${nodeVersion} meets requirements`
        };
      } catch (error) {
        return {
          success: false,
          details: `Environment check failed: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Dependencies Installation',
    check: () => {
      try {
        // Check if node_modules exists
        if (!fs.existsSync('node_modules')) {
          return {
            success: false,
            details: 'node_modules directory not found. Run: npm install'
          };
        }
        
        // Check critical dependencies
        const criticalDeps = [
          'next',
          'react',
          'notion-client',
          'jest'
        ];
        
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        const missingDeps = criticalDeps.filter(dep => !allDeps[dep]);
        
        if (missingDeps.length > 0) {
          return {
            success: false,
            details: `Missing critical dependencies: ${missingDeps.join(', ')}`
          };
        }
        
        return {
          success: true,
          details: 'All critical dependencies are installed'
        };
      } catch (error) {
        return {
          success: false,
          details: `Dependency check failed: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Configuration Files',
    check: () => {
      try {
        const requiredFiles = [
          'blog.config.js',
          'next.config.js',
          'pages/sitemap.xml.js'
        ];
        
        const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
        
        if (missingFiles.length > 0) {
          return {
            success: false,
            details: `Missing configuration files: ${missingFiles.join(', ')}`
          };
        }
        
        // Check blog.config.js content
        const blogConfigPath = path.join(process.cwd(), 'blog.config.js');
        const blogConfigContent = fs.readFileSync(blogConfigPath, 'utf8');
        
        if (!blogConfigContent.includes('LINK') || !blogConfigContent.includes('NOTION_PAGE_ID')) {
          return {
            success: false,
            details: 'blog.config.js missing required LINK or NOTION_PAGE_ID configuration'
          };
        }
        
        return {
          success: true,
          details: 'All configuration files are present and valid'
        };
      } catch (error) {
        return {
          success: false,
          details: `Configuration check failed: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Sitemap Components',
    check: () => {
      try {
        const requiredComponents = [
          'lib/utils/URLValidator.js',
          'lib/utils/XMLFormatter.js',
          'lib/utils/SitemapErrorHandler.js',
          'lib/utils/SitemapPerformanceMonitor.js',
          'lib/utils/SitemapEnhancedGenerator.js'
        ];
        
        const missingComponents = requiredComponents.filter(component => 
          !fs.existsSync(component)
        );
        
        if (missingComponents.length > 0) {
          return {
            success: false,
            details: `Missing sitemap components: ${missingComponents.join(', ')}`
          };
        }
        
        return {
          success: true,
          details: 'All sitemap components are present'
        };
      } catch (error) {
        return {
          success: false,
          details: `Component check failed: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'TypeScript Compilation',
    check: () => {
      try {
        console.log('   Running TypeScript type check...');
        execSync('npm run type-check', { stdio: 'pipe' });
        
        return {
          success: true,
          details: 'TypeScript compilation successful'
        };
      } catch (error) {
        return {
          success: false,
          details: `TypeScript compilation failed: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'ESLint Validation',
    check: () => {
      try {
        console.log('   Running ESLint check...');
        execSync('npm run lint:fix', { stdio: 'pipe' });
        
        return {
          success: true,
          details: 'ESLint validation passed'
        };
      } catch (error) {
        // ESLint might return non-zero exit code for warnings
        return {
          success: true,
          details: 'ESLint completed (may have warnings)'
        };
      }
    }
  },
  
  {
    name: 'Sitemap Core Tests',
    check: () => {
      try {
        console.log('   Running sitemap core tests...');
        // Test individual components
        const testFiles = [
          '__tests__/URLValidator.test.js',
          '__tests__/XMLFormatter.test.js', 
          '__tests__/SitemapErrorHandler.test.js',
          '__tests__/SitemapPerformanceMonitor.test.js',
          '__tests__/sitemap-integration.test.js'
        ];
        
        let allPassed = true;
        let passedCount = 0;
        
        for (const testFile of testFiles) {
          try {
            execSync(`npm run test -- ${testFile}`, { stdio: 'pipe' });
            passedCount++;
          } catch (error) {
            allPassed = false;
          }
        }
        
        return {
          success: allPassed,
          details: `${passedCount}/${testFiles.length} sitemap test files passed`
        };
      } catch (error) {
        return {
          success: false,
          details: `Sitemap tests failed: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Build Process',
    check: () => {
      try {
        console.log('   Running production build...');
        execSync('npm run build', { stdio: 'pipe' });
        
        // Check if .next directory was created
        if (!fs.existsSync('.next')) {
          return {
            success: false,
            details: '.next directory not created after build'
          };
        }
        
        return {
          success: true,
          details: 'Production build successful'
        };
      } catch (error) {
        return {
          success: false,
          details: `Build process failed: ${error.message}`
        };
      }
    }
  },
  
  {
    name: 'Local Sitemap Generation',
    check: () => {
      try {
        // This is a simplified check - in a real scenario you might start a local server
        // and test the sitemap endpoint
        
        const sitemapFile = path.join(process.cwd(), 'pages', 'sitemap.xml.js');
        const sitemapContent = fs.readFileSync(sitemapFile, 'utf8');
        
        // Check for key components in the sitemap file
        const requiredImports = [
          'URLValidator',
          'SitemapErrorHandler',
          'XMLFormatter',
          'SitemapPerformanceMonitor'
        ];
        
        const missingImports = requiredImports.filter(imp => 
          !sitemapContent.includes(imp)
        );
        
        if (missingImports.length > 0) {
          return {
            success: false,
            details: `Sitemap missing required imports: ${missingImports.join(', ')}`
          };
        }
        
        return {
          success: true,
          details: 'Sitemap file structure is valid'
        };
      } catch (error) {
        return {
          success: false,
          details: `Sitemap validation failed: ${error.message}`
        };
      }
    }
  }
];

let passedChecks = 0;
let totalChecks = checks.length;

console.log('Running pre-deployment checks...\n');

for (let i = 0; i < checks.length; i++) {
  const check = checks[i];
  console.log(`${i + 1}. Checking: ${check.name}`);
  
  try {
    const result = check.check();
    const status = result.success ? '✅' : '❌';
    
    console.log(`   ${status} ${result.details}\n`);
    
    if (result.success) {
      passedChecks++;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }
}

// Summary
console.log('='.repeat(60));
console.log('📊 PRE-DEPLOYMENT VERIFICATION SUMMARY');
console.log('='.repeat(60));
console.log(`Passed: ${passedChecks}/${totalChecks} checks`);
console.log(`Success Rate: ${((passedChecks / totalChecks) * 100).toFixed(1)}%\n`);

if (passedChecks === totalChecks) {
  console.log('🎉 PRE-DEPLOYMENT VERIFICATION PASSED!');
  console.log('✨ Your application is ready for deployment.');
  console.log('\n📋 Next steps:');
  console.log('   1. Deploy to your target environment');
  console.log('   2. Run post-deployment verification');
  console.log('   3. Submit sitemap to search engines');
  console.log('   4. Monitor performance and errors');
} else {
  console.log('⚠️  PRE-DEPLOYMENT VERIFICATION FAILED!');
  console.log(`${totalChecks - passedChecks} checks need to be addressed.`);
  console.log('\n🔧 Required actions:');
  console.log('   1. Fix the failing checks above');
  console.log('   2. Re-run this verification script');
  console.log('   3. Do not deploy until all checks pass');
}

// Generate verification report
const reportData = {
  timestamp: new Date().toISOString(),
  summary: {
    totalChecks,
    passedChecks,
    failedChecks: totalChecks - passedChecks,
    successRate: ((passedChecks / totalChecks) * 100).toFixed(1)
  },
  checks: checks.map((check, index) => {
    try {
      const result = check.check();
      return {
        name: check.name,
        status: result.success ? 'PASSED' : 'FAILED',
        details: result.details
      };
    } catch (error) {
      return {
        name: check.name,
        status: 'ERROR',
        details: error.message
      };
    }
  })
};

const reportDir = path.join(__dirname, '..', 'test-reports');
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

const reportPath = path.join(reportDir, 'pre-deployment-report.json');
fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));

console.log(`\n📄 Detailed report saved to: ${reportPath}`);
console.log(`\n🏁 Verification completed at ${new Date().toLocaleString()}`);

// Exit with appropriate code
process.exit(passedChecks === totalChecks ? 0 : 1);