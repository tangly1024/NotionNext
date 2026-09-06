# 全站功能与配置索引（4.10.2）

配置源文件：`blog.config.js` 聚合 `conf/*.config.js`。环境变量多为 `NEXT_PUBLIC_<键名>`（服务端专用键无此前缀，见各文件注释）。

## 站点基础（blog.config.js）

| 键 / 变量 | 说明 |
| --- | --- |
| `THEME` | 主题 ID = `themes/` 下文件夹名 |
| `LANG` | 默认语言 `zh-CN`、`en-US` 等 |
| `AUTHOR` / `BIO` / `LINK` | 作者、简介、站点 URL（影响分享、RSS、Sitemap） |
| `KEYWORDS` | SEO 关键词 |
| `APPEARANCE` | `light` / `dark` / `auto` |
| `APPEARANCE_DARK_TIME` | 自动夜间时段，如 `[18, 6]` |
| `NEXT_REVALIDATE_SECOND` | ISR 缓存秒数，越大越省 Vercel 额度 |
| `PSEUDO_STATIC` | URL 以 `.html` 结尾 |
| `ENABLE_RSS` | RSS 生成 |
| `RSS_FULL_CONTENT` | RSS 是否包含文章全文；默认 `true`，设为 `false` 时仅返回文章摘要 |
| `CUSTOM_MENU` | 使用 Menu/SubMenu 导航 |
| `CAN_COPY` | 是否允许复制正文；文章可用 `CAN_COPY` 或 `ext.CAN_COPY` 单独覆盖 |
| `GREETING_WORDS` | 欢迎语打字（部分主题） |
| `LAYOUT_SIDEBAR_REVERSE` | 侧栏左右反转（hexo/next 等） |
| `PWA_ENABLE` | 开启 Android Chrome PWA 安装入口 |
| `PWA_THEME_COLOR` | 配置 PWA 安装入口启用后的主题色 |
| `PWA_NAME` / `PWA_SHORT_NAME` / `PWA_ICON` | PWA 名称和页面图标（apple-touch-icon）；`PWA_ICON` 不控制 manifest 安装图标 |
| `PWA_ICON_192` / `PWA_ICON_512` | 可选覆盖 manifest 192×192 / 512×512 普通图标；须提供真实尺寸资源 |
| `PWA_ICON_192_MASKABLE` / `PWA_ICON_512_MASKABLE` | 可选覆盖 manifest maskable 图标；资源应留有安全边距 |
| `UUID_REDIRECT` | UUID 重定向到 slug |
| `CUSTOM_EXTERNAL_JS` / `CSS` | 外链脚本样式 |
| `BEI_AN` / `BEI_AN_GONGAN` | 备案号 |

## 文章与列表（conf/post.config.js）

| 键 | 说明 |
| --- | --- |
| `POST_URL_PREFIX` | 文章路径前缀，支持 `%year%/%month%/%day%`，空为 `/slug` |
| `POST_SCHEDULE_PUBLISH` | 按发布时间定时发布 |
| `POST_LIST_STYLE` | `page` 分页 / `scroll` 滚动加载 |
| `POST_LIST_PREVIEW` | 列表是否显示预览 |
| `POSTS_PER_PAGE` | 每页篇数 |
| `POSTS_SORT_BY` | `notion` 或 `date` |
| `POST_RECOMMEND_COUNT` | 文末推荐数量 |
| `POST_SHARE_BAR_ENABLE` | 底部分享条 |
| `POSTS_SHARE_SERVICES` | 分享渠道列表 |
| `ARTICLE_EXPIRATION_*` | 文章过期提示（HEO 等主题） |
| `TAG_SORT_BY_COUNT` | 标签按文章数排序 |
| `INNER_PAGE_URL_PARENT_PATH` / `NEXT_PUBLIC_INNER_PAGE_URL_PARENT_PATH` | 未收录内嵌子页面 URL 跟随父级文章路径（4.10.10+） |

## Notion（conf/notion.config.js）

见 [notion-4x.md](./notion-4x.md)。

## 置顶（conf/top-tag.config.js）

| 键 | 说明 |
| --- | --- |
| `TOP_TAG` | 全局置顶标签名，多置顶时按更新时间排序 |

## 评论（conf/comment.config.js）

可同时启用多个，评论区 Tab 切换。详见 [comments/overview.md](../comments/overview.md)。

| 系列键前缀 | 插件 |
| --- | --- |
| `COMMENT_TWIKOO_*` / `NEXT_PUBLIC_COMMENT_ENV_ID` | Twikoo |
| `COMMENT_WALINE_*` / `NEXT_PUBLIC_WALINE_*` | Waline（Notion Config 可用 `WALINE_*` 别名，4.9+） |
| `COMMENT_VALINE_*` / `NEXT_PUBLIC_VALINE_*` | Valine |
| `COMMENT_GISCUS_*` | Giscus |
| `COMMENT_UTTERRANCES_REPO` | Utterances |
| `COMMENT_CUSDIS_*` | Cusdis |
| `COMMENT_GITALK_*` | Gitalk |
| `COMMENT_ARTALK_*` | Artalk |
| `COMMENT_WEBMENTION_*` | Webmention |
| `COMMENT_HIDE_SINGLE_TAB` | 仅一种评论时隐藏 Tab |

## 统计（conf/analytics.config.js）

| 键 | 说明 |
| --- | --- |
| `ANALYTICS_GOOGLE_ID` | GA4 |
| `ANALYTICS_BAIDU_ID` | 百度统计 |
| `ANALYTICS_CNZZ_ID` | 友盟/CNZZ |
| `ANALYTICS_51LA_ID` / `ANALYTICS_51LA_CK` | 51LA |
| `ANALYTICS_ACKEE_*` | 自托管 Ackee |
| `UMAMI_HOST` / `UMAMI_ID` | Umami |
| `CLARITY_ID` | Microsoft Clarity |
| `ANALYTICS_VERCEL` | Vercel Analytics |
| `ANALYTICS_BUSUANZI_ENABLE` | 不蒜子阅读量 |
| `MATOMO_*` | Matomo |
| `SEO_GOOGLE_SITE_VERIFICATION` / `SEO_BAIDU_*` | 站长验证 |

## 挂件与聊天（conf/widget.config.js）

| 键 | 说明 |
| --- | --- |
| `THEME_SWITCH` | 在线切换主题面板 |
| `MUSIC_PLAYER_*` | APlayer / Meting，见 [plugins/music-player.md](../plugins/music-player.md) |
| `WIDGET_PET` / `WIDGET_PET_LINK` | Live2D 宠物 |
| `CHATBASE_ID` | Chatbase |
| `AI_CHAT_*` | OpenAI 兼容 AI 助手，支持 DeepSeek 等模型服务 |
| `WEB_WHIZ_*` | Webwhiz 机器人 |
| `DIFY_CHATBOT_*` | Dify 嵌入 |
| `FACEBOOK_PAGE_*` | Facebook Page / Messenger |
| `SPOILER_TEXT_TAG` | 剧透隐藏标签，如 `[sp]文字[sp]` |

## 动效（conf/animation.config.js）

| 键 | 说明 |
| --- | --- |
| `FIREWORKS` | 点击烟花 |
| `MOUSE_FOLLOW` | 鼠标跟随粒子 |
| `SAKURA` / `NEST` / `RIBBON` / `FLUTTERINGRIBBON` | 樱花、线段、彩带 |
| `STARRY_SKY` | 星空（暗色） |
| `ANIMATE_CSS_URL` | Animate.css |

## 图片（conf/image.config.js）

| 键 | 说明 |
| --- | --- |
| `IMAGE_COMPRESS_WIDTH` | 列表/正文压缩宽度 |
| `IMAGE_ZOOM_IN_WIDTH` | 点击放大宽度 |
| `RANDOM_IMAGE_URL` | 随机图 API |
| `RANDOM_IMAGE_REPLACE_TEXT` | 替换 URL 关键字（如 `images.unsplash.com`） |
| `IMG_SHADOW` | 图片阴影 |
| `NOTION_HOST` | Notion 图床域名（反向代理用） |

## 代码块（conf/code.config.js）

| 键 | 说明 |
| --- | --- |
| `PRISM_THEME_*` | 高亮主题、深浅切换 |
| `CODE_MAC_BAR` | Mac 窗口三色点 |
| `CODE_LINE_NUMBERS` | 行号 |
| `CODE_COLLAPSE` | 折叠长代码，桌面端支持侧栏预览 |
| `MERMAID_CDN` | Mermaid 图表 |

## 广告（conf/ad.config.js）

| 键 | 说明 |
| --- | --- |
| `ADSENSE_GOOGLE_*` | Google AdSense 各广告位 |
| `AD_WWADS_*` | 万维广告 |

## 扩展插件（conf/plugin.config.js）

| 键 | 说明 |
| --- | --- |
| `ALGOLIA_*` | 全文搜索，见 [config/algolia.md](../config/algolia.md) |
| `AI_SUMMARY_*` | AI 文章摘要 API |
| `TianliGPT_*` | 天翼 GPT 摘要 |
| `MAILCHIMP_*` | 邮件订阅，见 [plugins/mailchimp.md](../plugins/mailchimp.md) |

## 公众号导流（conf/techgrow.config.js）

| 键 | 说明 |
| --- | --- |
| `TECH_GROW_*` | TechGrow 阅读全文/验证码导流 |

## 性能（conf/performance.config.js）

懒加载、预取、Web Vitals、压缩等；生产环境一般由 Next/Vercel 与 `ENABLE_CACHE` 协同。

### 构建 / 导出专用环境变量

仅 `yarn build`、`yarn export`（`BUILD_MODE` / `EXPORT`）时生效，完整说明见 **[部署 · 构建性能调优](../deploy/build-tuning.md)**：

| 环境变量 | 默认 | 说明 |
| --- | --- | --- |
| `BUILD_PREFETCH_ENABLED` | 开启 | `false` 关闭全量 block 预热 |
| `BUILD_PREFETCH_CONCURRENCY` | `8` | 预热并发 |
| `NOTION_BUILD_RATE_MAX_PER_MINUTE` | `50` | 构建期 Notion 每分钟请求上限 |
| `NOTION_BUILD_RATE_MIN_INTERVAL_MS` | `300` | 构建期请求最小间隔（ms） |
| `STATIC_PAGE_GENERATION_TIMEOUT` | `300` | 单页 SSG 超时（秒） |

## 缓存与调试（conf/dev.config.js）

| 键 | 说明 |
| --- | --- |
| `REDIS_URL` | Redis 缓存 |
| `ENABLE_CACHE` | 文件/内存缓存 |
| `ENABLE_FILE_CACHE` | 文件缓存 |
| `DEBUG` | 调试按钮 |

## 联系方式（conf/contact.config.js）

`CONTACT_EMAIL`、`CONTACT_GITHUB`、`CONTACT_TWITTER` 等配置用于在主题的个人资料区或侧栏显示站长联系方式。

| 配置键 | 环境变量 | 说明                                                                |
| --- | --- |-------------------------------------------------------------------|
| `CONTACT_ORCID` | `NEXT_PUBLIC_CONTACT_ORCID` | ORCID 主页完整 URL，例如 `https://orcid.org/1234-1234-1234-1234`。留空时不显示。 |

支持读取 Notion Config 中的同名键 `CONTACT_ORCID`，配置优先级为 Notion Config、环境变量、本地配置文件。

## 右键菜单（conf/right-click-menu.js）

`CUSTOM_RIGHT_CLICK_CONTEXT_MENU`：自定义浏览器右键菜单项。

## 路由布局（conf/layout-map.config.js）

为特定路由指定不同 Layout（高级）。

## 主题专属配置

各主题 `themes/<id>/config.js` 中的 `THEME_*` 键，**仅在该主题生效**。全表见 [themes/THEMES_CATALOG.md](../themes/THEMES_CATALOG.md)。

## 在线预览

[https://preview.tangly1024.com/?theme=<主题id>](https://preview.tangly1024.com/)
