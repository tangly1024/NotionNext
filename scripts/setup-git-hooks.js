#!/usr/bin/env node

/**
 * Git Hooks 设置脚本
 * 自动设置pre-commit和pre-push钩子
 */

const fs = require('fs')
const path = require('path')

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

/**
 * 创建pre-commit钩子
 */
function createPreCommitHook() {
  const hookContent = `#!/bin/sh
# Pre-commit hook for CharliiAI

echo "🔍 Running pre-commit checks..."

# 运行代码质量检查
npm run pre-commit

# 检查提交结果
if [ $? -ne 0 ]; then
  echo "❌ Pre-commit checks failed. Please fix the issues before committing."
  exit 1
fi

echo "✅ Pre-commit checks passed!"
exit 0
`

  return hookContent
}

/**
 * 创建pre-push钩子
 */
function createPrePushHook() {
  const hookContent = `#!/bin/sh
# Pre-push hook for CharliiAI

echo "🚀 Running pre-push checks..."

# 运行完整的质量检查
npm run quality

# 检查构建是否成功
echo "🏗️  Testing build..."
npm run build

# 检查结果
if [ $? -ne 0 ]; then
  echo "❌ Pre-push checks failed. Please fix the issues before pushing."
  exit 1
fi

echo "✅ Pre-push checks passed!"
exit 0
`

  return hookContent
}

/**
 * 创建commit-msg钩子
 */
function createCommitMsgHook() {
  const hookContent = `#!/bin/sh
# Commit message hook for CharliiAI

commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\\(.+\\))?: .{1,50}'

error_msg="❌ Invalid commit message format!

Commit message should follow the format:
<type>(<scope>): <description>

Types:
- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code
- refactor: A code change that neither fixes a bug nor adds a feature
- test: Adding missing tests or correcting existing tests
- chore: Changes to the build process or auxiliary tools
- perf: A code change that improves performance
- ci: Changes to CI configuration files and scripts
- build: Changes that affect the build system or external dependencies
- revert: Reverts a previous commit

Examples:
- feat(auth): add user authentication
- fix(ui): resolve button alignment issue
- docs: update installation guide
- style: format code with prettier
- refactor(api): simplify user service
- test: add unit tests for utils
- chore: update dependencies
"

if ! grep -qE "$commit_regex" "$1"; then
  echo "$error_msg" >&2
  exit 1
fi

echo "✅ Commit message format is valid!"
exit 0
`

  return hookContent
}

/**
 * 设置Git钩子
 */
function setupGitHooks() {
  log('🔧 设置Git钩子...', 'magenta')

  const gitDir = path.join(process.cwd(), '.git')
  const hooksDir = path.join(gitDir, 'hooks')

  // 检查是否是Git仓库
  if (!fs.existsSync(gitDir)) {
    log('❌ 当前目录不是Git仓库', 'red')
    return false
  }

  // 确保hooks目录存在
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true })
  }

  // 创建钩子文件
  const hooks = [
    { name: 'pre-commit', content: createPreCommitHook() },
    { name: 'pre-push', content: createPrePushHook() },
    { name: 'commit-msg', content: createCommitMsgHook() }
  ]

  hooks.forEach(({ name, content }) => {
    const hookPath = path.join(hooksDir, name)
    
    try {
      fs.writeFileSync(hookPath, content)
      fs.chmodSync(hookPath, '755') // 设置执行权限
      log(`✅ 创建 ${name} 钩子`, 'green')
    } catch (error) {
      log(`❌ 创建 ${name} 钩子失败: ${error.message}`, 'red')
    }
  })

  log('🎉 Git钩子设置完成！', 'green')
  log('💡 现在提交代码时会自动运行代码质量检查', 'cyan')
  
  return true
}

/**
 * 移除Git钩子
 */
function removeGitHooks() {
  log('🗑️  移除Git钩子...', 'yellow')

  const gitDir = path.join(process.cwd(), '.git')
  const hooksDir = path.join(gitDir, 'hooks')

  if (!fs.existsSync(hooksDir)) {
    log('📁 hooks目录不存在', 'cyan')
    return
  }

  const hooks = ['pre-commit', 'pre-push', 'commit-msg']

  hooks.forEach(hookName => {
    const hookPath = path.join(hooksDir, hookName)
    
    if (fs.existsSync(hookPath)) {
      try {
        fs.unlinkSync(hookPath)
        log(`✅ 移除 ${hookName} 钩子`, 'green')
      } catch (error) {
        log(`❌ 移除 ${hookName} 钩子失败: ${error.message}`, 'red')
      }
    } else {
      log(`📄 ${hookName} 钩子不存在`, 'cyan')
    }
  })

  log('✅ Git钩子移除完成', 'green')
}

/**
 * 检查Git钩子状态
 */
function checkGitHooks() {
  log('🔍 检查Git钩子状态...', 'blue')

  const gitDir = path.join(process.cwd(), '.git')
  const hooksDir = path.join(gitDir, 'hooks')

  if (!fs.existsSync(hooksDir)) {
    log('📁 hooks目录不存在', 'yellow')
    return
  }

  const hooks = ['pre-commit', 'pre-push', 'commit-msg']
  let installedCount = 0

  hooks.forEach(hookName => {
    const hookPath = path.join(hooksDir, hookName)
    
    if (fs.existsSync(hookPath)) {
      const stats = fs.statSync(hookPath)
      const isExecutable = (stats.mode & parseInt('111', 8)) !== 0
      
      if (isExecutable) {
        log(`✅ ${hookName} 钩子已安装且可执行`, 'green')
        installedCount++
      } else {
        log(`⚠️  ${hookName} 钩子已安装但不可执行`, 'yellow')
      }
    } else {
      log(`❌ ${hookName} 钩子未安装`, 'red')
    }
  })

  if (installedCount === hooks.length) {
    log('🎉 所有Git钩子都已正确安装！', 'green')
  } else {
    log(`⚠️  ${installedCount}/${hooks.length} 个钩子已安装`, 'yellow')
    log('💡 运行 npm run setup-hooks 安装所有钩子', 'cyan')
  }
}

/**
 * 主函数
 */
function main() {
  const command = process.argv[2]

  switch (command) {
    case 'install':
    case 'setup':
      setupGitHooks()
      break
    case 'remove':
    case 'uninstall':
      removeGitHooks()
      break
    case 'check':
    case 'status':
      checkGitHooks()
      break
    default:
      log('🪝 Git Hooks 管理工具', 'magenta')
      log('\n可用命令:', 'cyan')
      log('  install/setup     - 安装Git钩子', 'cyan')
      log('  remove/uninstall  - 移除Git钩子', 'cyan')
      log('  check/status      - 检查钩子状态', 'cyan')
      log('\n用法: node scripts/setup-git-hooks.js <command>', 'yellow')
  }
}

// 运行主函数
if (require.main === module) {
  main()
}

module.exports = {
  setupGitHooks,
  removeGitHooks,
  checkGitHooks
}
