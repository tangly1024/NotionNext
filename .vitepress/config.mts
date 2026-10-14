import { defineConfig } from 'vitepress'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { getThemeSidebarItems } from '../scripts/lib/builtin-themes.mjs'

const themeDocLinks = getThemeSidebarItems()
const projectRoot = fileURLToPath(new URL('../', import.meta.url))

const giscusEnabled = process.env.VITE_GISCUS_ENABLED !== 'false'
const giscusRepoId = process.env.VITE_GISCUS_REPO_ID || ''
const giscusCategoryId = process.env.VITE_GISCUS_CATEGORY_ID || ''

/**
 * 在线站发布用户教程、开发文档与社区文档。
 * 根目录 README 仍作为 GitHub 目录说明，不进入 VitePress。
 */
const hiddenPublicDocPaths = ['user-guide/deploy/cloudflare-pages-docs.md']
const srcExclude = [
  '**/README.md',
  '**/README.en.md',
  ...hiddenPublicDocPaths.map((path) => `**/${path}`)
]

function getMarkdownTitle(filePath: string) {
  const content = readFileSync(filePath, 'utf8')
  const title = content.match(/^#\s+(.+)$/m)?.[1]?.trim()
  return title || filePath.split(/[\\/]/).pop()?.replace(/\.md$/, '') || filePath
}

function getLastUpdatedAt(filePath: string) {
  try {
    const timestamp = execFileSync('git', ['log', '-1', '--format=%ct', '--', filePath], {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()

    if (timestamp) {
      return Number(timestamp) * 1000
    }
  } catch {
    // Fall back to filesystem time when git history is unavailable in a deploy checkout.
  }

  return statSync(filePath).mtimeMs
}

function toDocLink(repoPath: string) {
  let link = `/${repoPath.replace(/^docs\//, '').replace(/\.md$/, '')}`

  if (link.endsWith('/index')) {
    link = link.slice(0, -'/index'.length) || '/'
  }

  return link
}

function getUpdatedDocs() {
  const trackedDocs = execFileSync('git', ['ls-files', 'docs'], {
    cwd: projectRoot,
    encoding: 'utf8'
  })
    .split(/\r?\n/)
    .filter((repoPath) => {
      return (
        repoPath.endsWith('.md') &&
        !repoPath.endsWith('/README.md') &&
        !repoPath.endsWith('/README.en.md') &&
        !repoPath.includes('/public/') &&
        !hiddenPublicDocPaths.includes(repoPath.replace(/^docs\//, ''))
      )
    })

  return trackedDocs
    .map((repoPath) => {
      const filePath = fileURLToPath(new URL(`../${repoPath}`, import.meta.url))

      if (!existsSync(filePath)) {
        return null
      }

      return {
        link: toDocLink(repoPath),
        title: getMarkdownTitle(filePath),
        updatedAt: Math.floor(getLastUpdatedAt(filePath)),
        isIndex: repoPath.endsWith('/index.md')
      }
    })
    .filter(
      (item): item is { link: string; title: string; updatedAt: number; isIndex: boolean } =>
        Boolean(item)
    )
    .sort((a, b) => b.updatedAt - a.updatedAt)
}

const updatedDocs = getUpdatedDocs()
const recentUpdatedDocs = updatedDocs.filter((doc) => !doc.isIndex).slice(0, 5)

export default defineConfig({
  title: 'NotionNext 使用说明',
  description: 'NotionNext 部署、配置、主题与 Notion 教程',
  lang: 'zh-CN',
  srcDir: 'docs',
  srcExclude,
  cleanUrls: true,
  lastUpdated: true,
  vite: {
    css: {
      postcss: {
        plugins: []
      }
    }
  },
  ignoreDeadLinks: [/^https?:\/\//],
  head: [
    ['link', { rel: 'icon', href: '/brand/notionnext-logo.png', type: 'image/png' }],
    ['link', { rel: 'apple-touch-icon', href: '/brand/notionnext-logo.png' }]
  ],
  transformHtml(html) {
    return html.replace(/rel="preload stylesheet"/g, 'rel="stylesheet"')
  },
  themeConfig: {
    logo: '/brand/notionnext-logo.png',
    updatedDocs,
    recentUpdatedDocs,
    nav: [
      { text: '开始搭建', link: '/user-guide/start-here', activeMatch: '/user-guide/' },
      { text: '更新日志', link: '/user-guide/changelog/latest', activeMatch: '/user-guide/changelog/' },
      { text: '主题', link: '/user-guide/themes/THEMES_CATALOG', activeMatch: '/user-guide/themes/' },
      { text: '用户作品', link: '/user-guide/showcase' },
      { text: '参考手册', link: '/user-guide/reference/features', activeMatch: '/user-guide/reference/' },
      { text: '开发文档', link: '/developer/', activeMatch: '/developer/' },
      { text: '维护策略', link: '/DOCUMENTATION_POLICY' },
      { text: '参与社区', link: '/user-guide/community-participate' },
      { text: '参与维护', link: '/user-guide/maintain-docs' },
      { text: '致谢', link: '/user-guide/acknowledgements' },
      { text: '旧版手册', link: '/user-guide/help/legacy-docs' },
      {
        text: 'GitHub',
        link: 'https://github.com/notionnext-org/NotionNext/tree/main/docs'
      }
    ],
    sidebar: {
      '/user-guide/': [
        {
          text: '快速开始',
          items: [
            { text: '从这里开始', link: '/user-guide/start-here' },
            { text: '介绍', link: '/user-guide/intro' },
            { text: '用户作品', link: '/user-guide/showcase' },
            { text: '场景模板', link: '/user-guide/templates' },
            { text: 'Vercel 部署', link: '/user-guide/deploy-vercel' },
            { text: 'Notion 数据库', link: '/user-guide/notion-database' },
            { text: '配置站点', link: '/user-guide/config-site' },
            { text: '菜单 Menu', link: '/user-guide/menu-secondary' },
            { text: '升级', link: '/user-guide/update' }
          ]
        },
        {
          text: '更新日志',
          items: [
            { text: '最新版本', link: '/user-guide/changelog/latest' },
            { text: 'V4 历史', link: '/user-guide/changelog/v4-history' },
            { text: 'V3 历史', link: '/user-guide/changelog/v3-history' },
            { text: 'V2 历史', link: '/user-guide/changelog/v2-history' },
            { text: 'V1 历史', link: '/user-guide/changelog/v1-history' }
          ]
        },
        {
          text: '参考（4.11.x）',
          items: [
            { text: '全站配置索引', link: '/user-guide/reference/features' },
            { text: 'Notion 4.x', link: '/user-guide/reference/notion-4x' }
          ]
        },
        {
          text: '部署',
          collapsed: true,
          items: [
            { text: '部署索引', link: '/user-guide/deploy/' },
            { text: 'Vercel 部署', link: '/user-guide/deploy-vercel' },
            { text: 'Vercel 域名', link: '/user-guide/deploy/vercel-domain' },
            { text: 'Vercel 加速', link: '/user-guide/deploy/vercel-accelerate' },
            { text: 'Vercel 多站点', link: '/user-guide/deploy/vercel-multi-sites' },
            { text: 'Vercel 重新部署', link: '/user-guide/deploy/vercel-redeploy' },
            { text: 'Vercel 静态导出', link: '/user-guide/deploy/vercel-static' },
            { text: 'Cloudflare 博客静态', link: '/user-guide/deploy/cloudflare-pages' },
            { text: 'Notion 图片反代', link: '/user-guide/deploy/notion-image-proxy' },
            { text: 'EdgeOne Pages', link: '/user-guide/deploy/edgeone-pages' },
            { text: '构建性能调优', link: '/user-guide/deploy/build-tuning' },
            { text: 'Netlify', link: '/user-guide/deploy/netlify' },
            { text: 'VPS', link: '/user-guide/deploy/vps' },
            { text: '4EVERLAND', link: '/user-guide/deploy/4everland' },
            { text: 'Zeabur', link: '/user-guide/deploy/zeabur' }
          ]
        },
        {
          text: 'Notion 教程',
          collapsed: true,
          items: [
            { text: 'Notion 数据库', link: '/user-guide/notion-database' },
            { text: '社区站数据库模板', link: '/user-guide/notion/community-site-template' },
            { text: '排版示例', link: '/user-guide/notion/example-article' },
            { text: '备份 Notion', link: '/user-guide/notion/notion-backup' },
            { text: 'Notion 模板', link: '/user-guide/notion/notion-template' },
            { text: 'Notion 入门', link: '/user-guide/notion/notion-tutorial' },
            { text: '快捷键', link: '/user-guide/notion/short-keys' },
            { text: '提升访问速度', link: '/user-guide/notion/faster' },
            { text: '文字添加链接', link: '/user-guide/notion/how-to-add-link-for-text-in-notion' },
            { text: '文章状态', link: '/user-guide/notion/post-status' },
            { text: '隐藏页面', link: '/user-guide/notion/notionnext-hidden-page' },
            { text: '定时发布', link: '/user-guide/notion/notionnext-scheduled-article-release' },
            { text: '视频嵌入', link: '/user-guide/notion/notionnext-video' },
            { text: '双语库翻译 CLI', link: '/user-guide/notion/bilingual-translator' }
          ]
        },
        {
          text: '配置',
          collapsed: true,
          items: [
            { text: '配置站点', link: '/user-guide/config-site' },
            { text: '基础功能', link: '/user-guide/config/site-basics' },
            { text: '内联配置', link: '/user-guide/config/notion-next-inline-config' },
            { text: '文章封面图', link: '/user-guide/config/notion-next-image-cover' },
            { text: '缓存配置', link: '/user-guide/config/cache-of-notion-next' },
            { text: 'URL 自定义', link: '/user-guide/config/url-customize' },
            { text: 'PWA 安装入口', link: '/user-guide/config/pwa-install' },
            { text: '站点公告', link: '/user-guide/config/notionnext-notice' },
            { text: '二级菜单', link: '/user-guide/menu-secondary' },
            { text: '网页字体', link: '/user-guide/config/notion-next-web-font' },
            { text: 'Font Awesome', link: '/user-guide/config/notion-next-font-awesome' },
            { text: 'Iconfont', link: '/user-guide/config/notion-next-iconfont' },
            { text: '代码样式', link: '/user-guide/config/notion-next-code-style' },
            { text: '自定义属性', link: '/user-guide/config/notion-next-custom-properties' },
            { text: '文章复制权限', link: '/user-guide/config/copy-permission' },
            { text: '文章版权声明', link: '/user-guide/config/article-copyright' },
            { text: '原创存证', link: '/user-guide/config/originality-proof' },
            { text: '多语言站点', link: '/user-guide/config/notion-next-mulity-languages' },
            { text: '多站点聚合', link: '/user-guide/config/notion-next-site-combine' },
            { text: 'API Base URL', link: '/user-guide/config/notion-next-api_base_url' },
            { text: 'GitHub 图床', link: '/user-guide/config/use-github-as-image-hosting-service' },
            { text: 'Algolia 搜索', link: '/user-guide/config/algolia' }
          ]
        },
        {
          text: `主题（${themeDocLinks.length}）`,
          collapsed: true,
          items: [
            { text: '主题目录', link: '/user-guide/themes/' },
            { text: '全览表', link: '/user-guide/themes/THEMES_CATALOG' },
            { text: '主题总览', link: '/user-guide/themes/overview' },
            { text: '主题控制台', link: '/user-guide/themes/theme-console' },
            ...themeDocLinks
          ]
        },
        {
          text: '统计',
          collapsed: true,
          items: [
            { text: '统计总览', link: '/user-guide/analytics/overview' },
            { text: 'Umami', link: '/user-guide/analytics/umami' },
            { text: 'Microsoft Clarity', link: '/user-guide/analytics/clarity' },
            { text: '51LA', link: '/user-guide/analytics/51la' },
            { text: 'Ackee', link: '/user-guide/analytics/ackee' }
          ]
        },
        {
          text: '评论插件',
          collapsed: true,
          items: [
            { text: '评论总览', link: '/user-guide/comments/overview' },
            { text: '会员与评论可选集成', link: '/developer/MEMBERSHIP_COMMENTS_ROADMAP' },
            { text: 'Cusdis', link: '/user-guide/comments/cusdis' },
            { text: 'Utterances', link: '/user-guide/comments/utterances' },
            { text: 'Giscus', link: '/user-guide/comments/giscus' },
            { text: 'Twikoo', link: '/user-guide/comments/twikoo' },
            { text: 'Artalk', link: '/user-guide/comments/artalk' },
            { text: 'Gitalk', link: '/user-guide/comments/gitalk' },
            { text: 'Valine', link: '/user-guide/comments/valine' },
            { text: 'NotionComments', link: '/user-guide/comments/notion-comments' },
            { text: 'Waline', link: '/user-guide/comments/waline' }
          ]
        },
        {
          text: '外部插件',
          collapsed: true,
          items: [
            { text: '插件总览', link: '/user-guide/plugins/overview' },
            { text: '音乐播放器', link: '/user-guide/plugins/music-player' },
            { text: 'Live2D 宠物', link: '/user-guide/plugins/notion-next-plugin-live2d' },
            { text: 'Algolia 搜索', link: '/user-guide/config/algolia' },
            { text: 'Google AdSense', link: '/user-guide/plugins/notion-next-google-adsense' },
            { text: 'Coze AI 聊天机器人', link: '/user-guide/plugins/notion-next-coze' },
            { text: 'Chatbase AI 聊天机器人', link: '/user-guide/plugins/notion-next-chat-base' },
            { text: 'Facebook 聊天插件', link: '/user-guide/plugins/notion-next-facebook-chat-plugn' },
            { text: 'SaleSmartly 聊天插件', link: '/user-guide/plugins/notion-next-salesmatly-pulgin' },
            { text: 'Tidio 聊天插件', link: '/user-guide/plugins/notion-next-tidio' },
            { text: 'Mailchimp 邮件订阅', link: '/user-guide/plugins/mailchimp' }
          ]
        },
        {
          text: '开发教程',
          collapsed: true,
          items: [
            { text: '开发入门', link: '/user-guide/development/getting-started' },
            { text: '运行原理', link: '/user-guide/development/architecture' },
            { text: '前端开发教程', link: '/user-guide/development/frontend-development-tutorial' },
            { text: '自定义样式', link: '/user-guide/development/custom-style' },
            { text: '开发自己的主题', link: '/user-guide/development/own-theme' },
            { text: '鼠标点击特效', link: '/user-guide/development/notion-next-click-effect' },
            { text: 'AI 辅助开发', link: '/user-guide/development/notion-next-develop-with-ai' },
            { text: '如何提交 PR', link: '/user-guide/development/notionnext-how-to-pr' },
            { text: 'React JSX', link: '/user-guide/development/react-jsx' },
            { text: 'Next.js', link: '/user-guide/development/nextjs' },
            { text: 'Tailwind CSS', link: '/user-guide/development/about-tailwindcss' }
          ]
        },
        {
          text: '运营教程',
          collapsed: true,
          items: [
            { text: 'SEO', link: '/user-guide/operations/seo' },
            { text: '搜索引擎收录', link: '/user-guide/operations/search-engine-index' },
            { text: '微信公众号', link: '/user-guide/operations/wechat-offical-account' }
          ]
        },
        {
          text: '帮助与维护',
          collapsed: true,
          items: [
            { text: '参与社区', link: '/user-guide/community-participate' },
            { text: '提问规范', link: '/user-guide/help/community-rules' },
            { text: '交流群', link: '/user-guide/help/community' },
            { text: '反馈', link: '/user-guide/help/feedback' },
            { text: '支持服务', link: '/user-guide/help/support' },
            { text: '支持 NotionNext', link: '/user-guide/help/support-notion-next' },
            { text: '众筹计划', link: '/user-guide/help/crowdfunding' },
            { text: '旧版手册入口', link: '/user-guide/help/legacy-docs' },
            { text: '参与维护（在线站）', link: '/user-guide/maintain-docs' },
            { text: '致谢', link: '/user-guide/acknowledgements' },
            { text: '维护工作流', link: '/user-guide/MAINTENANCE_WORKFLOW' },
            { text: '迁移索引', link: '/user-guide/ARTICLE_INDEX' }
          ]
        },
      ],
      '/developer/': [
        {
          text: '开发入门',
          items: [
            { text: '开发文档首页', link: '/developer/' },
            { text: '快速上手', link: '/developer/GETTING_STARTED' },
            { text: '愿景与路线图', link: '/developer/VISION_ROADMAP' },
            { text: '可持续增长路线图', link: '/developer/GROWTH_ROADMAP.zh-CN' },
            { text: '开放生态长期计划', link: '/developer/LONG_TERM_PLAN' },
            { text: '会员、权限与评论可选集成', link: '/developer/MEMBERSHIP_COMMENTS_ROADMAP' },
            { text: '架构总览', link: '/developer/ARCHITECTURE' },
            { text: '目录与模块', link: '/developer/PROJECT_STRUCTURE' },
            { text: '配置体系', link: '/developer/CONFIGURATION' },
            { text: '提交与 PR', link: '/developer/CONTRIBUTION_WORKFLOW' }
          ]
        },
        {
          text: '维护与治理',
          collapsed: true,
          items: [
            { text: '维护哲学', link: '/developer/MAINTENANCE_PHILOSOPHY.zh-CN' },
            { text: '维护者手册', link: '/developer/MAINTAINER_RUNBOOK.zh-CN' },
            { text: '版本更新说明', link: '/developer/UPDATE' },
            { text: '社区路线图', link: '/developer/COMMUNITY_SITE_ROADMAP' },
            { text: '5.0 愿景与参与方向', link: '/developer/VISION_ROADMAP' },
            { text: 'RFC', link: '/developer/rfc/' }
          ]
        },
        {
          text: '主题共建',
          collapsed: true,
          items: [
            { text: '主题开发文档首页', link: '/developer/themes/' },
            { text: '主题迁移指南', link: '/developer/THEME_MIGRATION_GUIDE.zh-CN' },
            { text: '主题控制台设计', link: '/developer/THEME_CONSOLE_DESIGN.zh-CN' },
            { text: '主题色变量计划', link: '/developer/THEME_COLOR_TOKEN_ROADMAP.zh-CN' },
            { text: 'Claude', link: '/developer/themes/CLAUDE' },
            { text: 'Endspace', link: '/developer/themes/ENDSPACE' },
            { text: 'Fuwari', link: '/developer/themes/FUWARI' },
            { text: 'Heo', link: '/developer/themes/HEO' },
            { text: 'Proxio', link: '/developer/themes/PROXIO' },
            { text: 'ThoughtLite', link: '/developer/themes/THOUGHTLITE' },
            { text: 'ThoughtLite 迁移计划', link: '/developer/themes/THOUGHTLITE_MIGRATION_PLAN.zh-CN' }
          ]
        },
        {
          text: 'English',
          collapsed: true,
          items: [
            { text: 'Getting Started', link: '/developer/GETTING_STARTED.en' },
            { text: 'Architecture', link: '/developer/ARCHITECTURE.en' },
            { text: 'Project Structure', link: '/developer/PROJECT_STRUCTURE.en' },
            { text: 'Configuration', link: '/developer/CONFIGURATION.en' },
            { text: 'Contribution Workflow', link: '/developer/CONTRIBUTION_WORKFLOW.en' },
            { text: 'Maintainer Runbook', link: '/developer/MAINTAINER_RUNBOOK.en' },
            { text: 'Maintenance Philosophy', link: '/developer/MAINTENANCE_PHILOSOPHY.en' },
            { text: 'Theme Migration Guide', link: '/developer/THEME_MIGRATION_GUIDE' },
            { text: 'Claude Theme', link: '/developer/themes/CLAUDE.en' },
            { text: 'Endspace Theme', link: '/developer/themes/ENDSPACE.en' },
            { text: 'ThoughtLite Theme', link: '/developer/themes/THOUGHTLITE.en' }
          ]
        }
      ],
      '/': [
        {
          text: '文档',
          items: [
            { text: '首页', link: '/' },
            { text: '从这里开始', link: '/user-guide/start-here' },
            { text: '使用说明', link: '/user-guide/intro' },
            { text: '开发文档', link: '/developer/' },
            { text: '参与社区', link: '/user-guide/community-participate' },
            { text: '文档维护策略', link: '/DOCUMENTATION_POLICY' },
            { text: '参与维护', link: '/user-guide/maintain-docs' },
            { text: '致谢', link: '/user-guide/acknowledgements' }
          ]
        }
      ]
    },
    editLink: {
      pattern:
        'https://github.com/notionnext-org/NotionNext/edit/main/docs/:path',
      text: '在 GitHub 上维护此页'
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/notionnext-org/NotionNext/tree/main/docs'
      }
    ],
    footer: {
      message:
        '以 GitHub 仓库为准 · <a href="https://github.com/notionnext-org/NotionNext/tree/main/docs" target="_blank" rel="noreferrer">浏览 docs 目录</a> · <a href="https://github.com/notionnext-org/NotionNext/blob/main/docs/README.md" target="_blank" rel="noreferrer">目录说明</a>',
      copyright: 'NotionNext · MIT'
    },
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '清除搜索条件',
                backButtonTitle: '关闭搜索',
                noResultsText: '未找到与',
                footer: {
                  selectText: '打开',
                  selectKeyAriaLabel: '回车键',
                  navigateText: '切换',
                  navigateUpKeyAriaLabel: '上方向键',
                  navigateDownKeyAriaLabel: '下方向键',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'Esc 键'
                }
              }
            }
          }
        },
        miniSearch: {
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
            boost: { title: 4, text: 2, titles: 2 }
          }
        }
      }
    },
    /** 文档页底 Giscus → GitHub Discussions；ID 见 giscus.app */
    giscus: {
      enabled: giscusEnabled,
      repo: 'notionnext-org/NotionNext',
      repoId: giscusRepoId,
      category: 'General',
      categoryId: giscusCategoryId,
      mapping: 'pathname',
      strict: '0',
      reactionsEnabled: '1',
      emitMetadata: '0',
      inputPosition: 'top',
      theme: 'preferred_color_scheme',
      lang: 'zh-CN'
    }
  }
})
