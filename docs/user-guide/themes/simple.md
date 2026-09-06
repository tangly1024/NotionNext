# Simple主题
> 迁移自：[Simple主题](https://docs.tangly1024.com/article/notionnext-simple)
> 发布日期：2024-3-19
> 最后编辑：2026-8-27
> 原栏目：⭐ 主题参数


## 主题预览

![Simple 主题预览](/images/themes-preview/simple.webp)

NotionNext 4.0 系列，用户首次安装的默认主题是Simple。这也是目前我主要在用的简洁主题。


## Simple 主题相关配置

配置文件在 themes/simple/config.js 中

### Simple 主题调色

Simple 支持通过语义色变量调整主色和标题色：

```js
SIMPLE_COLOR_PRIMARY: '#dd3333',
SIMPLE_COLOR_TITLE: '#276077'
```

主题工具中的调色板会展示当前值，并可直接复制配置项到 Notion Config。

```JavaScript
const CONFIG = {

  SIMPLE_LOGO_IMG: '/Logo.webp',
  SIMPLE_TOP_BAR: true, // 显示顶栏
  SIMPLE_TOP_BAR_CONTENT: process.env.NEXT_PUBLIC_THEME_SIMPLE_TOP_TIPS || '',
  SIMPLE_LOGO_DESCRIPTION: process.env.NEXT_PUBLIC_THEME_SIMPLE_LOGO_DESCRIPTION || '&lt;div&gt;编程爱好者&lt;br/&gt;/互联网从业者&lt;br/&gt;/知识分享博主&lt;/div&gt;',

  SIMPLE_AUTHOR_LINK: process.env.NEXT_PUBLIC_AUTHOR_LINK || '#',

  SIMPLE_POST_AD_ENABLE: process.env.NEXT_PUBLIC_SIMPLE_POST_AD_ENABLE || false, // 文章列表是否插入广告

  SIMPLE_COLOR_PRIMARY: '#dd3333',
  SIMPLE_COLOR_TITLE: '#276077',

  SIMPLE_POST_COVER_ENABLE: process.env.NEXT_PUBLIC_SIMPLE_POST_COVER_ENABLE || false, // 是否展示博客封面

  SIMPLE_ARTICLE_RECOMMEND_POSTS: process.env.NEXT_PUBLIC_SIMPLE_ARTICLE_RECOMMEND_POSTS || true, // 文章详情底部显示推荐

  // 菜单配置
  SIMPLE_MENU_CATEGORY: true, // 显示分类
  SIMPLE_MENU_TAG: true, // 显示标签
  SIMPLE_MENU_ARCHIVE: true, // 显示归档
  SIMPLE_MENU_SEARCH: true // 显示搜索
}
export default CONFIG
```


### 不蒜子访问统计

Simple 主题支持复用全局 `ANALYTICS_BUSUANZI_ENABLE` 配置展示不蒜子访问统计。

开启后：

- Header 显示站点访问量和访客数：`访问量 xxx · 访客数 xxx`
- Footer 显示图标形式的站点访问量和访客数
- Header 和 Footer 均使用站点级的 `site_pv` 和 `site_uv` 数据

关闭 `ANALYTICS_BUSUANZI_ENABLE` 后，Header 和 Footer 均不展示上述统计信息。

更多统计配置见 [站点统计相关](../analytics/overview.md)。


## FAQ

![Untitled](/legacy/b34bfc45d1b69f05.png)


#### 求助：

我想把主页上默认显示的自我介绍删了,找不到呀求教. 想删掉这个: 编程爱好者/互联网从业者/知识分享博主


#### 回答：

可以修改  themes/simple/config.js 的 SIMPLE_LOGO_DESCRIPTION 参数：

```JavaScript
SIMPLE_LOGO_DESCRIPTION: process.env.NEXT_PUBLIC_THEME_SIMPLE_LOGO_DESCRIPTION || '&lt;div&gt;编程爱好者&lt;br/&gt;/互联网从业者&lt;br/&gt;/知识分享博主&lt;/div&gt;',
```

目前默认是`'&lt;div&gt;编程爱好者&lt;br/&gt;/互联网从业者&lt;br/&gt;/知识分享博主&lt;/div&gt;'`

其中 `&lt;br/&gt;` 是html标记语言，表示换行，例如我可以修改成

```JavaScript
'&lt;div&gt;音乐爱好者&lt;br/&gt;/电商从业者&lt;br/&gt;/游戏区UP主&lt;/div&gt;',
```

## 原文链接

https://docs.tangly1024.com/article/notionnext-simple
