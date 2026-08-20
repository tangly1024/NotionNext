# Starter主题
> 迁移自：[Starter主题](https://docs.tangly1024.com/article/notionnext-starter)
> 发布日期：2024-3-4
> 最后编辑：2025-7-11
> 原栏目：⭐ 主题参数
> 摘要：如何使用Starter主题


## 主题预览

![Starter 主题预览](/images/themes-preview/starter.webp)

## **新主题 Starter**

V4.3版本中加入的免费主题：为公司、创业者、独立开发者、开源技术社区、品牌推广者设计。

一站式解决您的 品牌展示，博客新闻、产品服务宣传、团队展示、资讯订阅、用户评价、FAQ、价格展示及收费、留言反馈、会员注册登录、隐私政策、服务协议、法律声明。

您可以在这个网站上介绍您的产品、并直接挂上付款链接；产品可以是线上课程、一款APP、一个游戏等等。

![Untitled](/legacy/a05df798fa2d3896.png)

::: tip 提示
本文将介绍Starter主题的使用方式
:::


### 如何切换至Starter主题？

请先升级NotionNext至最新版，`&gt; V4.3`

然后参考《[主题功能说明-如何修改默认主题进行配置](/user-guide/themes/overview#2d5076c82d854615b995c4eee08c2182)》修改您的默认主题即可。


## 配置说明

页面上的文字\按钮 配置基本都可以在  `/themes/starter/config.js` 中找到配置； 您可以在NotionConfig中添加对应的配置，来一步步调整出您的页面。

站点支持配置的范围，按照首页的板块大致分为以下11个模块：

LOGO ， HERO，NAV、FEATURE、ABOUT、PRICING、TESTIMONIALS、TEAM、BLOG、CONTACT、FOOTERBRANDS

::: tip 提示
Starter主题需要自定配置的内容比较多，修改代码和配置环境变量会比较麻烦，您可以 借助《‣ 》来批量导入配置。
:::


### 支持Notion_Config

在目前的版本中，所有的主题配置都支持在Notion_Config中配置了。例如要修改作者成员，可以直接在Notion_config中添加如下配置


## Starter主题调色

Starter 主题默认是蓝色。现在推荐优先使用主题色变量调色，不再建议用 `GLOBAL_CSS` 覆盖 `.bg-primary`、`.text-primary` 这类 Tailwind 语义类名。

可在 Notion Config 表或 `themes/starter/config.js` 中配置：

```js
STARTER_COLOR_PRIMARY: '#3758f9'
STARTER_COLOR_PRIMARY_HOVER: '#1b44c8'
STARTER_COLOR_DARK: '#111928'
STARTER_COLOR_TEXT_MUTED: '#637381'
```

也可以在全局主题工具中切换到 Starter 后查看当前调色板，复制需要覆盖的配置项。

旧版本可以通过修改GLOBAL_CSS的方式来调整主题的颜色：修改方式如下图：

![image.png](/legacy/a3d3a1f5aa3ed592.png)


### 调色示例

以下是调成紫色的示例，在GLOBAL_CSS中添加以下两行：

```CSS
.bg-primary{background-color:purple !important;}
.text-primary{color:purple !important;}
.sticky .signUpBtn {background-color:purple !important;}
```

其中：第一行是主背景色调；第二行是提示文字的色调；第三行是右上角Sign Up按钮的背景色。

![image.png](/legacy/dcd9540a1058309a.png)

这里的purple就是我的颜色，您可以参考以下文章获取更多颜色的名称

[CSS 颜色代码大全 CSS颜色对照表-CSDN博客](https://blog.csdn.net/hnyanzijun1/article/details/118931973)

文章浏览阅读5w次，点赞52次，收藏430次。HTML及CSS常用颜色英文词汇            黑色      银色      灰色      白色      茶色      红色      紫色      紫红               black       silver       gray       white       maroon       red       purple       fuchsia              #000000      #C0C0C0    _css颜色


### 调色示例2

例如我还可以输入16进制的色号

```CSS
.bg-primary{background-color:#008080	!important;}
.text-primary{color:#008080	!important;}
.sticky .signUpBtn {background-color:#008080 !important;}
```

![image.png](/legacy/86057560eb7ad8a5.png)


### Logo

`/themes/starter/config.js` 对应配置 ,我目前是没有设置图片，直接用站点标题作为logo ； 支持设置成图片： 建议是设置两个logo图，一个深色一个浅色。

```JavaScript
// 默认只展示Logo文字，如果设置了logo图片，会在文字左侧显示图标
  STARTER_LOGO: '', // 普通logo图片 示例：/images/starter/logo/logo.svg
  STARTER_LOGO_WHITE: '', // 透明底浅色logo 示例： /images/starter/logo/logo-white.svg
```

![Untitled](/legacy/c873f55d2195e897.png)
![Untitled](/legacy/ea41f17a01f208ae.png)


### Hero

核心宣传区块

![Untitled](/legacy/8412dffa11f0419e.png)

相关配置和对应配置

```JavaScript
// 英雄区块导航
  STARTER_HERO_TITLE_1: '开源且免费的基于 Notion 笔记的网站构建工具', // 英雄区文字
  STARTER_HERO_TITLE_2: '通过笔记无感知地建站、成倍放大您的价值', // 英雄区文字
  STARTER_HERO_TITLE_3: '使用最新技术构建', // 英雄区文字

  // 中间两个按钮
  STARTER_HERO_BUTTON_1_TEXT: '开始体验', // 英雄区按钮
  STARTER_HERO_BUTTON_1_URL: '/user-guide/deploy-vercel', // 英雄区按钮
  STARTER_HERO_BUTTON_2_TEXT: '在Github上关注', // 英雄区按钮
  STARTER_HERO_BUTTON_2_URL: 'https://github.com/notionnext-org/NotionNext', // 英雄区按钮
  STARTER_HERO_PREVIEW_IMAGE: '/images/starter/hero/hero-image.webp', // 产品预览图 ，默认读取public目录下图片； 您可以上传自己的图片至/public/starter/hero目录下；
```


### NAV 导航栏

导航栏顶部中央菜单 在Notion中通过配置Menu菜单实现。右侧按钮在此配置

```JavaScript
// MENU ， 菜单部分不在此处配置，请在Notion数据库中添加MENU

  // 顶部右侧导航暗流
  STARTER_NAV_BUTTON_1_TEXT: 'Sign In',
  STARTER_NAV_BUTTON_1_URL: '/signin',

  STARTER_NAV_BUTTON_2_TEXT: 'Sign Up',
  STARTER_NAV_BUTTON_2_URL: '/signup',
```

![Untitled](/legacy/b2e1008d9686abef.png)


### Feature 特性介绍

支持固定4个特性

![Untitled](/legacy/75ddbe0cb8b1ef31.png)

```JavaScript
// 特性区块
  STARTER_FEATURE_TITLE: '特性', // 特性
  STARTER_FEATURE_TEXT_1: 'NotionNext的主要特性', // 特性
  STARTER_FEATURE_TEXT_2: 'NotionNext的愿景是帮助您简单、无感知地稳定地搭建自己的网站，放大品牌的价值。 ', // 特性

  STARTER_FEATURE_1_TITLE_1: '免费且开源', // 特性1
  STARTER_FEATURE_1_TEXT_1: '项目源码在Github上完全开放共享，遵循MIT协议', // 特性1
  STARTER_FEATURE_1_BUTTON_TEXT: '了解更多', // 特性1
  STARTER_FEATURE_1_BUTTON_URL: 'https://github.com/notionnext-org/NotionNext', // 特性1

  STARTER_FEATURE_2_TITLE_1: '多种主题定制', // 特性2
  STARTER_FEATURE_2_TEXT_1: '数十种主题,适用于不同场景，总有一款适合你', // 特性2
  STARTER_FEATURE_2_BUTTON_TEXT: '了解更多', // 特性2
  STARTER_FEATURE_2_BUTTON_URL: '/user-guide/themes/overview', // 特性2

  STARTER_FEATURE_3_TITLE_1: '优秀的性能', // 特性3
  STARTER_FEATURE_3_TEXT_1: '基于NextJS开发，更快的响应速度，更好的SEO', // 特性3
  STARTER_FEATURE_3_BUTTON_TEXT: '了解更多', // 特性3
  STARTER_FEATURE_3_BUTTON_URL: '/user-guide/development/nextjs', // 特性3

  STARTER_FEATURE_4_TITLE_1: '便捷的写作体验', // 特性4
  STARTER_FEATURE_4_TEXT_1: '只需在Notion笔记中编修，自动同步到网站', // 特性4
  STARTER_FEATURE_4_BUTTON_TEXT: '了解更多', // 特性4
  STARTER_FEATURE_4_BUTTON_URL: '/user-guide/intro', // 特性4
```


### About 首页介绍

![Untitled](/legacy/96ff97def4e39994.png)

```JavaScript
// 首页ABOUT区块
  STARTER_ABOUT_TITLE: '一套轻量实用的建站解决方案',
  STARTER_ABOUT_TEXT: 'NotionNext的愿景是帮助非技术人员的小白，最低成本、最快速地搭建自己的网站，帮助您将自己的产品与故事高效地传达给世界。 &lt;br /&gt; &lt;br /&gt; 功能强大的Notion笔记，简单快速的Vercel托管平台，组成一个简单的网站',
  STARTER_ABOUT_BUTTON_TEXT: '了解更多',
  STARTER_ABOUT_BUTTON_URL: '/user-guide/intro',
  STARTER_ABOUT_IMAGE_1: '/images/starter/about/about-image-01.jpg',
  STARTER_ABOUT_IMAGE_2: '/images/starter/about/about-image-02.jpg',
  STARTER_ABOUT_TIPS_1: '7000+',
  STARTER_ABOUT_TIPS_2: '博客站点',
  STARTER_ABOUT_TIPS_3: '正在线上运行',
```


### Pricing 价格

定价方案

![Untitled](/legacy/d409016f312f9079.png)

::: warning 注意
NotionNext不提供电商购买相关服务，这里的价格链接可以借助第三方支付平台，例如[Stripe](https://stripe.com/)、[Lemonsqueezy](https://www.lemonsqueezy.com/)、[千寻寄售](https://qianxun1688.com/)以及第三方的电商平台链接等。
:::

```JavaScript
// 首页价格区块
  STARTER_PRICING_TITLE: '价格表',
  STARTER_PRICING_TEXT_1: '很棒的定价计划',
  STARTER_PRICING_TEXT_2: '我们制定了灵活的付费模式，您可以按需选择。（NotionNext免费开源，这里仅演示产品订阅付费功能，请勿下单购买！）',

  STARTER_PRICING_1_TITLE: '入门版',
  STARTER_PRICING_1_PRICE: '19.9',
  STARTER_PRICING_1_PRICE_CURRENCY: '$',
  STARTER_PRICING_1_PRICE_PERIOD: '每月',
  STARTER_PRICING_1_HEADER: '功能点',
  STARTER_PRICING_1_FEATURES: '所有的主题,免费更新,帮助手册', // 英文逗号隔开
  STARTER_PRICING_1_BUTTON_TEXT: '立即购买',
  STARTER_PRICING_1_BUTTON_URL: 'https://tangly1024.lemonsqueezy.com/checkout/buy/c1a38a65-362e-44c5-8065-733fee39eb54',

  STARTER_PRICING_2_TAG: '推荐',
  STARTER_PRICING_2_TITLE: '基础版',
  STARTER_PRICING_2_PRICE: '39.9',
  STARTER_PRICING_2_PRICE_CURRENCY: '$',
  STARTER_PRICING_2_PRICE_PERIOD: '每月',
  STARTER_PRICING_2_HEADER: '功能点',
  STARTER_PRICING_2_FEATURES: '包含入门版,项目源码,内部社群,技术咨询,SEO优化', // 英文逗号隔开
  STARTER_PRICING_2_BUTTON_TEXT: '立即购买',
  STARTER_PRICING_2_BUTTON_URL: 'https://tangly1024.lemonsqueezy.com/checkout/buy/590ad70a-c3b7-4caf-94ec-9ca27bde06d4',

  STARTER_PRICING_3_TITLE: '高级版',
  STARTER_PRICING_3_PRICE: '59.9',
  STARTER_PRICING_3_PRICE_CURRENCY: '$',
  STARTER_PRICING_3_PRICE_PERIOD: '每月',
  STARTER_PRICING_3_HEADER: '功能点',
  STARTER_PRICING_3_FEATURES: '包含基础版,功能定制开发', // 英文逗号隔开
  STARTER_PRICING_3_BUTTON_TEXT: '立即购买',
  STARTER_PRICING_3_BUTTON_URL: 'https://tangly1024.lemonsqueezy.com/checkout/buy/df924d66-09dc-42a4-a632-a6b0c5cc4f28',
```


### TESTIMONIALS 用户评价

支持添加无数个，此处部分不支持NotionConfig支持，请在配置文件中修改

![Untitled](/legacy/935b6f724a3d7438.png)

```JavaScript
STARTER_TESTIMONIALS_TITLE: '用户反馈',
  STARTER_TESTIMONIALS_TEXT_1: '我们的用户怎么说',
  STARTER_TESTIMONIALS_TEXT_2: '数千位站长选择用NotionNext搭建他们的网站,通过帮助手册、交流社群以及技术咨询，大家成功上线了自己的网站',
  STARTER_TESTIMONIALS_STAR_ICON: '/images/starter/testimonials/icon-star.svg', // 评分图标

  // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
  STARTER_TESTIMONIALS_ITEMS: [
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: '感谢大佬的方法。之前尝试过Super、Potion等国外的第三方平台，实现效果一般，个性化程度远不如这个方法，已经用起来了！ ',
      STARTER_TESTIMONIALS_ITEM_AVATAR: 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F22de3fcb-d90d-4271-bc01-f815f476122b%2F4FE0A0C0-E487-4C74-BF8E-6F01A27461B8-14186-000008094BC289A6.jpg?table=collection&id=a320a2cc-6ebe-4a8d-95cc-ea94e63bced9&width=200',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'Ryan_G',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'Ryan`Log 站长',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://blog.gaoran.xyz/'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: '很喜欢这个主题，本代码小白用三天台风假期搭建出来了，还根据大佬的教程弄了自定义域名，十分感谢，已请喝咖啡~',
      STARTER_TESTIMONIALS_ITEM_AVATAR: 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F0d33d169-f932-41ff-ac6b-88a923c08e02%2F%25E5%25A4%25B4%25E5%2583%258F.jfif?table=collection&id=7787658d-d5c0-4f34-8e32-60c523dfaba3&width=400',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'Asenkits',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '阿森的百宝袋 站长',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://asenkits.top/'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: '呜呜呜，经过一个下午的努力，终于把博客部署好啦，非常感谢Tangly1024大佬的框架和教程，这是我有生之年用过的最好用的博客框架┭┮﹏┭┮。从今之后，我就可以在自己的博客里bb啦，( •̀ ω •́ )y ',
      STARTER_TESTIMONIALS_ITEM_AVATAR: 'https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F6c096b44-beb9-48ee-8f92-1efdde47f3a3%2F338962f1-d352-49c7-9a1b-746e35a7005c%2Fhf.png?table=block&id=ce5a48a9-d77a-4843-a3d9-a78cd4f794ce&spaceId=6c096b44-beb9-48ee-8f92-1efdde47f3a3&width=100&userId=27074aef-7216-41ed-baef-d9b53addd870&cache=v2',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'DWIND',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '且听风吟 站长',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://www.dwind.top/'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: '感谢提供这么好的项目哈哈 之前一直不知道怎么部署(别的项目好难好复杂)这个相对非常简单 新手非常友好哦',
      STARTER_TESTIMONIALS_ITEM_AVATAR: 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fd52f6766-3e32-4c3d-8529-46e1f214360f%2Ffavicon.svg?table=collection&id=7d76aad5-a2c4-4d9a-887c-c7913fae4eed&width=400',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: '迪升disheng ',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'AI资源分享 Blog',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://blog.disheng.org/'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: '灰常感谢大佬的博客项目，能将博客和notion结合起来，这一直是我挺期待的博客模式。',
      STARTER_TESTIMONIALS_ITEM_AVATAR: 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fafb21381-f51b-4fd0-9998-800dbeb64dbe%2Favatar.png?table=block&id=195935d2-0d8d-49fc-bd81-1db42ee50840&spaceId=6c096b44-beb9-48ee-8f92-1efdde47f3a3&width=100&userId=27074aef-7216-41ed-baef-d9b53addd870&cache=v2',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'AnJhon',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'Anjhon`s Blog 站长',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://www.anjhon.top'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: '用好久了，太感谢了',
      STARTER_TESTIMONIALS_ITEM_AVATAR: 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fe4f391d7-7d65-4c05-a82c-c6e2c40f06e4%2Fa2a7641a26b367608c6ef28ce9b7e983_(2).png?table=block&id=a386eb0e-4c07-4b18-9ece-bba4e79ce21c&spaceId=6c096b44-beb9-48ee-8f92-1efdde47f3a3&width=100&userId=27074aef-7216-41ed-baef-d9b53addd870&cache=v2',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'LUCEN',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'LUCEN考验辅导 站长',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://www.lucenczz.top/'
    }
  ],
```


### FAQ 常见问题

支持4个

![Untitled](/legacy/6f81a1eb6bdca449.png)

```JavaScript
//   FAQ模块
  STARTER_FAQ_TITLE: '常见问题解答',
  STARTER_FAQ_TEXT_1: '有任何问题吗？请看这里',
  STARTER_FAQ_TEXT_2: '我们收集了常见的用户疑问',

  STARTER_FAQ_1_QUESTION: 'NotionNext有帮助文档吗？',
  STARTER_FAQ_1_ANSWER: 'NotionNext提供了&lt;a href="/user-guide/intro" className="underline"&gt;帮助文档&lt;/a&gt;，操作&lt;a href="https://www.bilibili.com/video/BV1fM4y1L7Qi/" className="underline"&gt;演示视频&lt;/a&gt;，以及&lt;a href="/user-guide/help/community" className="underline"&gt;交流社群&lt;/a&gt;来协助您完成网站的搭建部署',

  STARTER_FAQ_2_QUESTION: '部署后要如何编写文章？',
  STARTER_FAQ_2_ANSWER: '您可以在Notion中之间添加或修改类型为Post的页面，内容将被实时同步在站点中，详情参考&lt;a className="underline" href="/user-guide/notion-database"&gt;《帮助文档》&lt;/a&gt;',

  STARTER_FAQ_3_QUESTION: '站点部署失败，更新失败？',
  STARTER_FAQ_3_ANSWER: '通常是配置修改错误导致，请检查配置或者重试操作步骤，或者通过Vercel后台的Deployments中找到错误日志，并向网友求助',

  STARTER_FAQ_4_QUESTION: '文章没有实时同步？',
  STARTER_FAQ_4_ANSWER: '先检查Notion_Page_ID是否正确配置，其次由于博客的每个页面都有独立缓存，刷新网页后即可解决',
```


### TEAM 团队成员

支持无数个，超出4个会自动换行并居中

![image.png](/legacy/7e86794642721e65.png)

```JavaScript
STARTER_TEAM_TITLE: '团队成员',
  STARTER_TEAM_TEXT_1: '我们的开发者团队',
  STARTER_TEAM_TEXT_2: 'NotionNext 由众多开源技术爱好者们共同合作完成，感谢每一位&lt;a className="underline" href="https://github.com/notionnext-org/NotionNext/graphs/contributors"&gt;贡献者&lt;/a&gt;',

  // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
  STARTER_TEAM_ITEMS: [
    {
      STARTER_TEAM_ITEM_AVATAR: 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fa06c61bb-980e-4180-bc18-c15f92c78bb4%2Ftangly1024.jpg?table=collection&id=8e7acf17-de09-4fa1-abde-b5b80ad4a813&t=8e7acf17-de09-4fa1-abde-b5b80ad4a813&width=100&cache=v2',
      STARTER_TEAM_ITEM_NICKNAME: 'Tangly',
      STARTER_TEAM_ITEM_DESCRIPTION: 'Developer'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: '/images/starter/team/team-01.png',
      STARTER_TEAM_ITEM_NICKNAME: 'Melissa Tatcher',
      STARTER_TEAM_ITEM_DESCRIPTION: 'Marketing Expert'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: '/images/starter/team/team-02.png',
      STARTER_TEAM_ITEM_NICKNAME: 'Stuard Ferrel',
      STARTER_TEAM_ITEM_DESCRIPTION: 'Digital Marketer'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: '/images/starter/team/team-03.png',
      STARTER_TEAM_ITEM_NICKNAME: 'Eva Hudson',
      STARTER_TEAM_ITEM_DESCRIPTION: 'Creative Designer'
    }
  ],
```


### BLOG 文章

此处会显示最新的3篇文章，同时也支持设置数量

![Untitled](/legacy/a8756166d70f07d1.png)

```JavaScript
// 博客文章区块
  STARTER_BLOG_TITLE: '我们的博客',
  STARTER_BLOG_COUNT: 3, // 首页博文区块默认展示前3篇文章
  STARTER_BLOG_TEXT_1: '最近的新闻',
  STARTER_BLOG_TEXT_2: '这里会发布一些关于NotionNext的最新动态，包括新的动向、新的未来计划，以及新功能的特性',
```


### Contact 联系我们

留言板使用NoteForm (https://noteforms.com/)，外部链接

![Untitled](/legacy/070b4cff2ee70539.png)

```JavaScript
// 联系模块
  STARTER_CONTACT_TITLE: '联系我们',
  STARTER_CONTACT_TEXT: '告诉我们您遇到的问题',
  STARTER_CONTACT_LOCATION_TITLE: '我们的位置',
  STARTER_CONTACT_LOCATION_TEXT: '中国，福建',
  STARTER_CONTACT_EMAIL_TITLE: '我们如何帮助您？',
  STARTER_CONTACT_EMAIL_TEXT: 'mail@tangly1024.com',

  // 嵌入外部表单
  STARTER_CONTACT_MSG_EXTERNAL_URL: 'https://noteforms.com/forms/yfctc7', // 基于NoteForm (https://noteforms.com/) 创建，将留言数据存在Notion中
```


### Brands 合作伙伴

放上记账图片和链接，如果不需要链接可以留空白

![Untitled](/legacy/de9c3ac872888e35.png)

```JavaScript
// 合作伙伴的图标
  STARTER_BRANDS: [
    {
      IMAGE: '/images/starter/brands/graygrids.svg',
      IMAGE_WHITE: '/images/starter/brands/graygrids-white.svg',
      URL: 'https://graygrids.com/',
      TITLE: 'graygrids'
    },
    {
      IMAGE: '/images/starter/brands/lineicons.svg',
      IMAGE_WHITE: '/images/starter/brands/lineicons-white.svg',
      URL: 'https://lineicons.com/',
      TITLE: 'lineicons'
    },
    {
      IMAGE: '/images/starter/brands/uideck.svg',
      IMAGE_WHITE: '/images/starter/brands/uideck-white.svg',
      URL: 'https://uideck.com/',
      TITLE: 'uideck'
    },
    {
      IMAGE: '/images/starter/brands/ayroui.svg',
      IMAGE_WHITE: '/images/starter/brands/ayroui-white.svg',
      URL: 'https://ayroui.com/',
      TITLE: 'ayroui'
    },
    {
      IMAGE: '/images/starter/brands/tailgrids.svg',
      IMAGE_WHITE: '/images/starter/brands/tailgrids-white.svg',
      URL: '"https://tailgrids.com/',
      TITLE: 'tailgrids'
    }
  ],
```


### Footer 页脚

页脚的菜单在这里设置，需要改配置文件，不支持NOTION_CONFIG

![Untitled](/legacy/6985ee450a927b33.png)

```JavaScript
STARTER_FOOTER_SLOGAN: '我们通过技术为品牌和公司创造数字体验。',

  // 页脚三列菜单组
  STARTER_FOOTER_LINK_GROUP: [
    {
      TITLE: '关于我们',
      LINK_GROUP: [
        { TITLE: '官方主页', URL: '/#home' },
        { TITLE: '操作文档', URL: '/user-guide/intro' },
        { TITLE: '帮助支持', URL: '/user-guide/help/community-rules' },
        { TITLE: '合作申请', URL: '/user-guide/help/support' }
      ]
    },
    {
      TITLE: '功能特性',
      LINK_GROUP: [
        { TITLE: '部署指南', URL: '/user-guide/deploy-vercel' },
        { TITLE: '升级指南', URL: '/user-guide/update' },
        { TITLE: '最新版本', URL: '/user-guide/changelog/latest' }
      ]
    },
    {
      TITLE: 'Notion写作',
      LINK_GROUP: [
        { TITLE: 'Notion开始写作', URL: '/user-guide/notion-database' },
        { TITLE: '快捷键提升效率', URL: '/user-guide/notion/short-keys' },
        { TITLE: '中国大陆使用Notion', URL: '/user-guide/notion/faster' }
      ]
    }
  ],

  STARTER_FOOTER_BLOG_LATEST_TITLE: '最新文章',

  STARTER_FOOTER_PRIVACY_POLICY_TEXT: '隐私政策',
  STARTER_FOOTER_PRIVACY_POLICY_URL: '/privacy-policy',

  STARTER_FOOTER_PRIVACY_LEGAL_NOTICE_TEXT: '法律声明',
  STARTER_FOOTER_PRIVACY_LEGAL_NOTICE_URL: '/legacy-notice',

  STARTER_FOOTER_PRIVACY_TERMS_OF_SERVICE_TEXT: '服务协议',
  STARTER_FOOTER_PRIVACY_TERMS_OF_SERVICE_URL: '/terms-of-use',
```


### 其它配置

404页面个性化

![Untitled](/legacy/1383c5c86e68e502.png)

页脚会显示2到5篇最新文章，默认最多两篇。

如果需要增加可以添加如下配置:

```JavaScript
const CONFIG = {
  // xxx...xxx

  // 404页面的提示语
  STARTER_404_TITLE: '我们似乎找不到您要找的页面。',
  STARTER_404_TEXT: '抱歉！您要查找的页面不存在。可能已经移动或删除。',
  STARTER_404_BACK: '回到主页',

  STARTER_POST_REDIRECT_ENABLE: true, // 默認開啟重定向
  STARTER_POST_REDIRECT_URL: 'https://blog.tangly1024.com', // 重定向域名
  STARTER_NEWSLETTER: process.env.NEXT_PUBLIC_THEME_STARTER_NEWSLETTER || false // 是否开启邮件订阅 请先配置mailchimp功能 /user-guide/plugins/mailchimp
}
export default CONFIG
```


## Lite模式

20250711版本更新后的功能。

加入了一个便于嵌入的网页模式，在url中拼接`?lite=true`，这样显示的网页会隐藏页头页脚、导航按钮以及其它信息、便于内嵌。

预览效果如下，第一个是默认，第二个是lite版本
[https://www.tangly1024.com/archive](https://www.tangly1024.com/archive)

[https://www.tangly1024.com/archive?lite=true](https://www.tangly1024.com/archive?lite=true)

其它页面也都支持：

[https://www.tangly1024.com/tag/NotionNext](https://www.tangly1024.com/tag/NotionNext)

[https://www.tangly1024.com/tag/NotionNext?lite=true](https://www.tangly1024.com/tag/NotionNext?lite=true)

## 原文链接

https://docs.tangly1024.com/article/notionnext-starter
