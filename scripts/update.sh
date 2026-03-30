#!/bin/bash

# NotionNext 更新脚本
# 功能: 从上游仓库同步更新到本地 deploy 分支
# 适用: Vercel 部署场景

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印函数
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查前置条件
check_prerequisites() {
    print_info "检查前置条件..."
    
    # 检查是否在git仓库中
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "当前目录不是git仓库"
        exit 1
    fi
    
    # 检查是否有未提交的更改
    if ! git diff-index --quiet HEAD --; then
        print_warning "检测到未提交的更改"
        echo "请选择操作："
        echo "1) 暂存更改并继续"
        echo "2) 退出脚本"
        read -p "请输入选项 (1/2): " choice
        
        if [ "$choice" = "1" ]; then
            git stash push -m "auto-update-stash-$(date +%Y%m%d-%H%M%S)"
            print_success "更改已暂存"
            STASHED=true
        else
            print_info "更新已取消"
            exit 0
        fi
    fi
    
    # 检查upstream远程仓库是否存在
    if ! git remote | grep -q "^upstream$"; then
        print_warning "未找到upstream远程仓库，正在添加..."
        git remote add upstream https://github.com/tangly1024/NotionNext.git
        print_success "upstream远程仓库已添加"
    fi
    
    print_success "前置条件检查通过"
}

# 备份重要配置文件
backup_configs() {
    print_info "备份重要配置文件..."
    
    BACKUP_DIR="backup/$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # 备份文件列表
    FILES_TO_BACKUP=(
        "blog.config.js"
        "public/avatar.png"
        "public/favicon.ico"
        "public/favicon.svg"
        "public/ads.txt"
        "pages/_app.js"
        ".env.local"
    )
    
    for file in "${FILES_TO_BACKUP[@]}"; do
        if [ -f "$file" ]; then
            cp "$file" "$BACKUP_DIR/" 2>/dev/null || true
            print_info "已备份: $file"
        fi
    done
    
    print_success "配置文件备份完成: $BACKUP_DIR"
}

# 更新main分支
update_main_branch() {
    print_info "更新 main 分支..."
    
    # 记录当前分支
    CURRENT_BRANCH=$(git branch --show-current)
    
    # 切换到main分支
    git checkout main
    
    # 同步远程 main 分支
    print_info "同步远程 main 分支..."
    git pull origin main || {
        print_warning "远程同步失败，可能是首次推送"
    }
    
    # 获取上游最新代码
    print_info "获取上游最新代码..."
    git fetch upstream
    
    # 合并上游更新
    print_info "合并上游更新..."
    git merge upstream/main --no-edit
    
    # 推送到origin
    print_info "推送到远程仓库..."
    git push origin main
    
    print_success "main 分支更新完成"
}

# 合并到deploy分支
merge_to_deploy() {
    print_info "切换到 deploy 分支..."
    git checkout deploy
    
    print_info "同步远程 deploy 分支..."
    git pull origin deploy || {
        print_warning "远程同步失败，可能是首次推送或有冲突"
        print_info "尝试继续执行..."
    }
    
    # 获取版本号信息（优先使用 tag，否则使用 commit）
    OLD_VERSION=$(git describe --tags --always HEAD 2>/dev/null)
    NEW_VERSION=$(git describe --tags --always main 2>/dev/null)
    
    print_info "开始合并 main 分支的更新..."
    
    # 构建提交信息
    if [ "$OLD_VERSION" != "$NEW_VERSION" ]; then
        MERGE_MSG="merge: 同步上游更新 ($OLD_VERSION → $NEW_VERSION)

- 合并最新功能和修复
- 保留个性化配置"
    else
        MERGE_MSG="merge: 同步上游更新

- 合并最新功能和修复
- 保留个性化配置"
    fi
    
    # 尝试自动合并
    if git merge main -m "$MERGE_MSG" 2>/dev/null; then
        print_success "合并成功，无冲突"
        return 0
    else
        print_warning "检测到合并冲突，需要手动解决"
        return 1
    fi
}

# 处理冲突
handle_conflicts() {
    print_info "分析冲突文件..."
    
    # 获取冲突文件列表
    CONFLICTS=$(git diff --name-only --diff-filter=U)
    
    if [ -z "$CONFLICTS" ]; then
        print_success "没有冲突文件"
        return 0
    fi
    
    echo "冲突文件列表："
    echo "$CONFLICTS"
    echo ""
    
    # 安全地处理部分文件
    for file in $CONFLICTS; do
        case "$file" in
            "yarn.lock"|"package-lock.json")
                print_info "接受上游版本: $file"
                git checkout --theirs "$file"
                git add "$file"
                ;;
            "public/avatar.png"|"public/favicon.ico"|"public/favicon.svg"|"public/ads.txt")
                print_info "保留个人版本: $file"
                git checkout --ours "$file"
                git add "$file"
                ;;
            "blog.config.js")
                print_warning "需要手动合并: $file"
                print_info "请保留您的个人配置，同时合并新增的配置项"
                ;;
            *)
                print_warning "需要手动检查: $file"
                ;;
        esac
    done
    
    # 检查是否还有未解决的冲突
    REMAINING_CONFLICTS=$(git diff --name-only --diff-filter=U)
    
    if [ -n "$REMAINING_CONFLICTS" ]; then
        print_warning "以下文件需要手动解决冲突："
        echo "$REMAINING_CONFLICTS"
        echo ""
        echo "请手动解决冲突后执行："
        echo "  git add ."
        echo "  git commit"
        echo "  git push origin deploy"
        return 1
    else
        print_success "安全冲突已解决"
        
        # 获取版本号信息（优先使用 tag，否则使用 commit）
        OLD_VERSION=$(git describe --tags --always HEAD~1 2>/dev/null)
        NEW_VERSION=$(git describe --tags --always HEAD 2>/dev/null)
        
        if [ "$OLD_VERSION" != "$NEW_VERSION" ]; then
            COMMIT_MSG="merge: 同步上游更新 ($OLD_VERSION → $NEW_VERSION)

- 同步最新功能和修复
- 保留个性化配置
- 解决了依赖文件和静态资源的冲突"
        else
            COMMIT_MSG="merge: 同步上游更新

- 同步最新功能和修复
- 保留个性化配置
- 解决了依赖文件和静态资源的冲突"
        fi
        
        git commit -m "$COMMIT_MSG"
        return 0
    fi
}

# 更新依赖
update_dependencies() {
    print_info "更新项目依赖..."
    
    # 清理旧的依赖
    if [ -d "node_modules" ]; then
        print_info "清理旧的 node_modules..."
        rm -rf node_modules
    fi
    
    # 重新安装依赖
    print_info "使用 yarn 安装依赖..."
    yarn install
    
    print_success "依赖更新完成"
}

# 运行测试
run_tests() {
    print_info "运行测试..."
    
    # 检查是否有测试脚本
    if yarn run | grep -q "test"; then
        yarn test || {
            print_warning "测试失败，但继续执行"
        }
    else
        print_info "未找到测试脚本，跳过测试"
    fi
    
    # 尝试本地构建
    print_info "尝试本地构建..."
    if yarn run | grep -q "build"; then
        yarn build || {
            print_error "构建失败！请检查错误信息"
            return 1
        }
        print_success "本地构建成功"
    fi
    
    return 0
}

# 完成更新
finish_update() {
    print_info "推送更新到远程仓库..."
    git push origin deploy
    
    # 恢复暂存的更改
    if [ "$STASHED" = true ]; then
        print_info "恢复暂存的更改..."
        git stash pop || {
            print_warning "无法自动恢复暂存，请手动执行: git stash pop"
        }
    fi
}

# 主函数
main() {
    echo "======================================="
    echo "   NotionNext 更新脚本"
    echo "======================================="
    echo ""
    
    # 执行更新流程
    check_prerequisites
    backup_configs
    update_main_branch
    
    if merge_to_deploy; then
        update_dependencies
        
        if run_tests; then
            finish_update
            
            print_success "🎉 更新完成！"
            echo ""
            echo "下一步操作："
            echo "1. 访问 http://localhost:3000 测试本地环境"
            echo "2. 检查 Vercel 部署状态"
            echo "3. 如有问题，可查看备份: backup/"
        else
            print_error "测试或构建失败，请检查问题后重试"
            exit 1
        fi
    else
        if handle_conflicts; then
            update_dependencies
            finish_update
            print_success "🎉 更新完成（自动解决了冲突）"
        else
            print_warning "请手动解决剩余的冲突"
            exit 1
        fi
    fi
}

# 执行主函数
main