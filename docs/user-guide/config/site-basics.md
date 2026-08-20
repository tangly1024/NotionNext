# 基础信息
> 迁移自：[基础信息](https://docs.tangly1024.com/article/notion-next-guide)
> 发布日期：2023-2-10
> 最后编辑：2024-10-30
> 原栏目：🛠 站点配置
> 标签：NotionNext
> 摘要：介绍NotionNext的所有功能和常见问题说明

## 前言

::: tip 提示
本文将介绍如何配置一些基本的站点信息；例如作者名以及网站URL等。
:::

::: tip 提示
阅读本文前，请先确保已经部署好您的NotionNext站点，若您还没有自己的站点，请访问教程部署自己的站点: [/user-guide/intro](/user-guide/intro)
:::


## 配置说明


### 1. 站点信息

网站的社交地址，站点域名，作者信息，以及默认主题在站点的配置文件 [blog.config.js ](https://github.com/notionnext-org/NotionNext/blob/fd29df3b26211aad04a9e6462cae038d7006e826/blog.config.js#L20-L34)中可以找到，您可以在配置文件中修改配置。

```JavaScript
AUTHOR: process.env.NEXT_PUBLIC_AUTHOR || 'NotionNext', // 您的昵称 例如 tangly1024
BIO: process.env.NEXT_PUBLIC_BIO || '一个普通的干饭人🍚', // 作者简介
LINK: process.env.NEXT_PUBLIC_LINK || '/user-guide/intro', // 网站地址
KEYWORDS: process.env.NEXT_PUBLIC_KEYWORD || 'Notion, 博客', // 网站关键词 英文逗号隔开
SINCE: process.env.NEXT_SINCE || 2021, // 建站年份
```

::: tip 提示
关于如何修改配置，请访问上一篇《[配置入门](/user-guide/config-site)》教程了解其他修改配置的方法。
:::

在配置文件中，添加了社交链接的地址后，将在Hexo、Next主题下显示一排联系方式按钮。

```JavaScript
// 社交链接，不需要可留空白，例如 CONTACT_WEIBO:''
CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '', // 邮箱地址 例如mail@tangly1024.com
CONTACT_WEIBO: process.env.NEXT_PUBLIC_CONTACT_WEIBO || '', // 你的微博个人主页
CONTACT_TWITTER: process.env.NEXT_PUBLIC_CONTACT_TWITTER || '', // 你的twitter个人主页
CONTACT_GITHUB: process.env.NEXT_PUBLIC_CONTACT_GITHUB || '', // 你的github个人主页 例如 https://github.com/tangly1024
CONTACT_TELEGRAM: process.env.NEXT_PUBLIC_CONTACT_TELEGRAM || '', // 你的telegram 地址 例如 https://t.me/tangly_1024
CONTACT_LINKEDIN: process.env.NEXT_PUBLIC_CONTACT_LINKEDIN || '', // 你的linkedIn 首页
CONTACT_INSTAGRAM: process.env.NEXT_PUBLIC_CONTACT_INSTAGRAM || '', // 您的instagram地址
CONTACT_BILIBILI: process.env.NEXT_PUBLIC_CONTACT_BILIBILI || '', // B站主页
CONTACT_YOUTUBE: process.env.NEXT_PUBLIC_CONTACT_YOUTUBE || '', // Youtube主页
```

在图中，我添加了github、telegram、邮件这三种联系方式，最后一个是rss的订阅图标 , 如果设置了 CONTACT_BILIBILI，则会在此处多出一个B站的图标链接

![Untitled](/legacy/14e6e6a034876e68.png)


#### 分享功能

文章底部的分享条，需要配置您的站点地址，否则分享的路径都是默认地址，除此之外，LINK这个配置还用于feed订阅、sitemap站点地图生成的功能。

```JavaScript
LINK: process.env.NEXT_PUBLIC_LINK || '/user-guide/intro', // 网站地址
```

![Untitled](/legacy/476ef048a1f71931.png)


#### 自定义社交图标按钮

hexo主题的图标按钮在[此处修改](https://github.com/notionnext-org/NotionNext/blob/main/themes/hexo/components/SocialButton.js),

例如github的图标是： `fab fa-github` ，可访问[fontawesome获取](https://fontawesome.com/search?o=r&m=free)其他图标

```JavaScript
return &lt;div className='w-full justify-center flex-wrap flex'&gt;
    &lt;div className='space-x-3 text-xl text-gray-600 dark:text-gray-300 '&gt;
      {BLOG.CONTACT_GITHUB && &lt;a target='_blank' rel='noreferrer' title={'github'} href={BLOG.CONTACT_GITHUB} &gt;
        &lt;i className='transform hover:scale-125 duration-150 fab fa-github dark:hover:text-indigo-400 hover:text-indigo-600'/&gt;
      &lt;/a&gt;}
      {BLOG.CONTACT_TWITTER && &lt;a target='_blank' rel='noreferrer' title={'twitter'} href={BLOG.CONTACT_TWITTER} &gt;
        &lt;i className='transform hover:scale-125 duration-150 fab fa-twitter dark:hover:text-indigo-400 hover:text-indigo-600'/&gt;
      &lt;/a&gt;}
      {BLOG.CONTACT_TELEGRAM && &lt;a target='_blank' rel='noreferrer' href={BLOG.CONTACT_TELEGRAM} title={'telegram'} &gt;
        &lt;i className='transform hover:scale-125 duration-150 fab fa-telegram dark:hover:text-indigo-400 hover:text-indigo-600'/&gt;
      &lt;/a&gt;}
      {BLOG.CONTACT_LINKEDIN && &lt;a target='_blank' rel='noreferrer' href={BLOG.CONTACT_LINKEDIN} title={'linkIn'} &gt;
        &lt;i className='transform hover:scale-125 duration-150 fab fa-linkedin dark:hover:text-indigo-400 hover:text-indigo-600'/&gt;
      &lt;/a&gt;}
      {BLOG.CONTACT_WEIBO && &lt;a target='_blank' rel='noreferrer' title={'weibo'} href={BLOG.CONTACT_WEIBO} &gt;
        &lt;i className='transform hover:scale-125 duration-150 fab fa-weibo dark:hover:text-indigo-400 hover:text-indigo-600'/&gt;
      &lt;/a&gt;}
      {BLOG.CONTACT_INSTAGRAM && &lt;a target='_blank' rel='noreferrer' title={'instagram'} href={BLOG.CONTACT_INSTAGRAM} &gt;
        &lt;i className='transform hover:scale-125 duration-150 fab fa-instagram dark:hover:text-indigo-400 hover:text-indigo-600'/&gt;
      &lt;/a&gt;}
      {BLOG.CONTACT_EMAIL && &lt;a target='_blank' rel='noreferrer' title={'email'} href={`mailto:${BLOG.CONTACT_EMAIL}`} &gt;
        &lt;i className='transform hover:scale-125 duration-150 fas fa-envelope dark:hover:text-indigo-400 hover:text-indigo-600'/&gt;
      &lt;/a&gt;}
      {BLOG.ENABLE_RSS && &lt;a target='_blank' rel='noreferrer' title={'RSS'} href={'/feed'} &gt;
        &lt;i className='transform hover:scale-125 duration-150 fas fa-rss dark:hover:text-indigo-400 hover:text-indigo-600'/&gt;
      &lt;/a&gt;}
    &lt;/div&gt;
  &lt;/div&gt;
```


#### 站点多语言

修改blog.config.js 的 LANG 即可切换站点的默认语言，

```JavaScript
LANG: 'zh-CN', // e.g 'zh-CN','en-US'  see /lib/lang.js for more.
```

::: tip 提示
目前已支持的语言有 en-US、zh-CN、zh-HK、zh-TW、fr-FR、tr-TR、ja-JP；您也可以随时向项目发起PR、提交或完善更多的语言翻译。
您也可以直接在站点链接后拼接语言参数，在线体验多语言：
例如： [https://preview.tangly1024.com/?lang=en-US](https://preview.tangly1024.com/?lang=en-US)
:::


#### 浏览器站点图标

要修改站点在浏览器中的图标，替换 `/public` 文件夹里的  `favicon.ico` 文件即可。

![Untitled](/legacy/70cb442041bca1b8.png)
![Untitled](/legacy/98ee5763e2255880.png)

<details>
<summary>❓如何制作您的icon（点击展开说明）</summary>

[favicon制作](https://tool.lu/favicon/)

favicon在线制作,icon制作,网站图标,网站图标制作,ico图标制作
使用上方的在线工具，上传图片，即可生成 ICO文件，您可以自行选择满意的分辨率，我这里选的是48x48：
![Untitled](/legacy/5f22d262cf0ac60f.png)
下载后，请将ico重命名为`favicon.ico`

</details>

<details>
<summary>❓如何在Github中替换文件 (点击展开说明)</summary>

  1. 在项目中点击public目录
![Untitled](/legacy/911efecc29ff8950.png)
  1. 在public目录中点击右上角 Add file ,再在下拉框中选择 Upload files
![Untitled](/legacy/2a8c17fffffea819.png)
  1. 在上传页面中点击choose your files 上传您的图标
![Untitled](/legacy/046d39aa2b5868a2.png)
::: warning 注意
请先将文件重命名为`favicon.ico`
![Untitled](/legacy/377bc212bc6fe1e3.png)
**✅** 最后点击` Commit changes `提交这次上传。
:::

</details>


### 4. 自定义样式、自定义脚本

您可以自行决定站点的样式和执行的脚本，NotionNext支持两种方式引入您的css 和 js ：

- 方法一：外部文件引入
[blog.config.js](https://github.com/notionnext-org/NotionNext/blob/main/blog.config.js#L34-L35) 中 配置:`CUSTOM_EXTERNAL_JS `和`CUSTOM_EXTERNAL_CSS `即可
```Bash
// 自定义外部脚本，外部样式
CUSTOM_EXTERNAL_JS: [''], // e.g. ['http://xx.com/script.js','http://xx.com/script.js']
CUSTOM_EXTERNAL_CSS: [''], // e.g. ['http://xx.com/style.css','http://xx.com/style.css']
```

- 方法二：内部自定义
  - [/public/css/custom.css](https://github.com/notionnext-org/NotionNext/blob/main/public/css/custom.css) 文件可以直接自定义样式。
  - [/public/js/custom.js](https://github.com/notionnext-org/NotionNext/blob/main/public/js/custom.js) 文件中编写脚本将被自动引入页面。
  - 每个主题的自定义css文件，例如 /public/css/theme-hexo.css

::: info 问题
若引入js和css不能满足您的需求？试试参考《[NotionNext二次开发手册](/user-guide/development/getting-started)》进行自定义开发。
:::


### 5. 文章路径

Notion中支持添加 `Post`和 `Page`两种类型文章，其中 Post 类型的文章将被显示在博客列表中。

文章的访问地址默认是 `http://[域名]/article/[slug]` ， slug值默认为页面的ID，可以在notion中手动指定。

如果您不希望文章中间有 article ，可以再 配置文件中修改POST_URL_PREFIX的值，

```JavaScript
POST_URL_PREFIX: process.env.NEXT_PUBLIC_POST_URL_PREFIX || 'article', // POST类型文章的默认路径前缀，例如默认POST类型的路径是  /article/[slug]
```

::: tip 提示
示例：

  - 如果值为`空`，则文章路径为 `http://[域名]/[slug]`
```JavaScript
POST_URL_PREFIX: '',
```
  - 如果为`post`，则文章路径为 `http://[域名]/post/[slug]`
```JavaScript
POST_URL_PREFIX: 'post',
```
:::


### 6. Notion字段名自定义

可以让你的Notion模板变成中文的表头和中文的下拉框。

```JavaScript
// 自定义配置notion数据库字段名
NOTION_PROPERTY_NAME: {
  password: process.env.NEXT_PUBLIC_NOTION_PROPERTY_PASSWORD || 'password',
  type: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE || 'type', // 文章类型，
  type_post: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_POST || 'Post', // 当type文章类型与此值相同时，为博文。
  type_page: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_PAGE || 'Page', // 当type文章类型与此值相同时，为单页。
  type_notice: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_NOTICE || 'Notice', // 当type文章类型与此值相同时，为公告。
  title: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TITLE || 'title', // 文章标题
  status: process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS || 'status',
  status_publish: process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS_PUBLISH || 'Published', // 当status状态值与此相同时为发布，可以为中文
  status_invisible: process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS_INVISIBLE || 'Invisible', // 当status状态值与此相同时为隐藏发布，可以为中文 ， 除此之外其他页面状态不会显示在博客上
  summary: process.env.NEXT_PUBLIC_NOTION_PROPERTY_SUMMARY || 'summary',
  slug: process.env.NEXT_PUBLIC_NOTION_PROPERTY_SLUG || 'slug',
  category: process.env.NEXT_PUBLIC_NOTION_PROPERTY_CATEGORY || 'category',
  date: process.env.NEXT_PUBLIC_NOTION_PROPERTY_DATE || 'date',
  tags: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TAGS || 'tags',
  icon: process.env.NEXT_PUBLIC_NOTION_PROPERTY_ICON || 'icon'
},
```


### 7. 自定义菜单（二级菜单）

在V3.13.0版本起，所有版本支持自定义菜单，效果如下：

![Untitled](/legacy/42a7b429ece3fac3.png)
![Untitled](/legacy/3dcebd91bf05a17a.png)

请访问以下链接获取配置帮助：

[NotionNext二级菜单使用说明 | TANGLY’s BLOG](/user-guide/menu-secondary)

NotionNext 3.13.0上线，支持更灵活的菜单配置


### 8. 伪静态

::: tip 提示
网站使用NextJS开发，用户访问到的页面**本身就是静态页面**。
:::

NotionNext会将页面缓存一定的`时间`，超过此时间后，NotionNext会从Notion同步最新的文章内容。`缓存时间`通过修改`NEXT_REVALIDATE_SECOND` 配置。

另外，将 `PSEUDO_STATIC` 的值修改为 true后，页面的地址最后会以.html结尾，看上去会更像一个静态页面。

```JavaScript
PSEUDO_STATIC: false, // 伪静态路径，开启后所有文章URL都以 .html 结尾。
NEXT_REVALIDATE_SECOND: process.env.NEXT_PUBLIC_REVALIDATE_SECOND || 5, // 更新内容缓存间隔 单位(秒)；即每个页面有5秒的纯静态期、此期间无论多少次访问都不会抓取notion数据；调大该值有助于节省Vercel资源、同时提升访问速率，但也会使文章更新有延迟。
```


### 9. 其它样式

<details>
<summary>备案: 域名备案、公安备案</summary>

推荐在Notion_Config中添加配置：
```YAML
BEI_AN: process.env.NEXT_PUBLIC_BEI_AN || '', // 备案号 闽ICP备XXXXXXX
BEI_AN_GONGAN: '' , // 添加公安备案 京公网安备 xxxxx号
```
公安备案样式如下；
![image.png](/legacy/ee4f784543d7254b.png)

</details>

<details>
<summary>博客列表展现形式</summary>

您可以选择，使用按钮分页，还是滚动鼠标无限加载分页；
设置每页展示的文章数量。
设置在列表页是否展示文章内容，还是只是展示标题和摘要。
```JavaScript
POST_LIST_STYLE: 'page', // ['page','scroll'] 文章列表样式:页码分页、单页滚动加载
POST_LIST_PREVIEW: process.env.NEXT_PUBLIC_POST_PREVIEW || 'false', //  是否在列表加载文章预览
POSTS_PER_PAGE: 12, // post counts per page
```

</details>

<details>
<summary>博客列表排序</summary>

```JavaScript
POSTS_SORT_BY: 'notion', // 排序方式 'date'按时间,'notion'由notion控制
```

</details>

<details>
<summary>代码渲染样式</summary>

```JavaScript
// PrismJs 代码相关
PRISM_JS_AUTO_LOADER: 'https://npm.elemecdn.com/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js',
PRISM_JS_PATH: 'https://npm.elemecdn.com/prismjs@1.29.0/components/',
PRISM_THEME_PATH: 'https://npm.elemecdn.com/prism-themes/themes/prism-a11y-dark.min.css', // 代码样式主题 更多参考 https://github.com/PrismJS/prism-themes
CODE_MAC_BAR: true, // 代码左上角显示mac的红黄绿图标
CODE_LINE_NUMBERS: process.env.NEXT_PUBLIC_CODE_LINE_NUMBERS || 'false', // 是否显示行号
```
修改 PRISM_THEME_PATH 参数 可以更换主题风格，可以访问[prism-themes](https://github.com/PrismJS/prism-themes)主页获取可选的主题。
修改 CODE_MAC_BAR 参数可以控制代码左上角是否显示 红黄绿三个图标，模仿mac的样式。
修改CODE_LINE_NUMBERS值为true，则代码最左侧将显示行号。（显示行号后代码将禁用横向滚动）
![Untitled](/legacy/a81b21150381dc24.png)

</details>

<details>
<summary>左右布局颠倒</summary>

hexo主题下默认排版是：文章显示在左，站点信息显示在右，通过修改 `LAYOUT_SIDEBAR_REVERSE` 为true，将排版调整为 文章显示在右，站点信息显示在左
```JavaScript
// 侧栏布局 是否反转(左变右,右变左) 已支持主题: hexo next medium fukasawa example
LAYOUT_SIDEBAR_REVERSE: false,
```

</details>

<details>
<summary>鼠标点击特效</summary>

```JavaScript
// 鼠标点击烟花特效
FIREWORKS: process.env.NEXT_PUBLIC_FIREWORKS || false, // 开关
// 烟花色彩，感谢 https://github.com/Vixcity 提交的色彩
FIREWORKS_COLOR: ['255, 20, 97', '24, 255, 146', '90, 135, 255', '251, 243, 140'],
```

</details>

<details>
<summary>动态背景特效</summary>

```JavaScript
// 樱花飘落特效
SAKURA: process.env.NEXT_PUBLIC_SAKURA || false, // 开关

// 漂浮线段特效
NEST: process.env.NEXT_PUBLIC_NEST || false, // 开关

// 动态彩带特效
FLUTTERINGRIBBON: process.env.NEXT_PUBLIC_FLUTTERINGRIBBON || false, // 开关
// 静态彩带特效
RIBBON: process.env.NEXT_PUBLIC_RIBBON || false, // 开关

// 星空雨特效 黑夜模式才会生效
STARRY_SKY: process.env.NEXT_PUBLIC_STARRY_SKY || false, // 开关
```

</details>


## Notion隐私安全

您共享的Notion页，他人只有查看权限，除非你手动开启编辑和评论的权限。

另外，若您不希望别人访问到你的源Notion页面，可选择关闭Noton页面共享，然后通过Notion的[access_token](https://github.com/notionnext-org/NotionNext/issues/116#issuecomment-1081260413)进行数据访问。

![Untitled](/legacy/e39a99d8b73be154.png)

## 原文链接

https://docs.tangly1024.com/article/notion-next-guide
