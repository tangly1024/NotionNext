# HEO主题
> 迁移自：[HEO主题](https://docs.tangly1024.com/article/notionnext-heo)
> 发布日期：2023-7-18
> 最后编辑：2024-9-12
> 原栏目：⭐ 主题参数


## 主题预览

![Heo 主题预览](/images/themes-preview/heo.webp)

::: tip 提示
感谢张洪大佬的设计 [https://blog.zhheo.com/](https://blog.zhheo.com/)
:::


## 主题说明

此主题参考[张洪大佬](https://blog.zhheo.com/)设计开发的[Acrylic-Promote](https://acrylic.zhheo.com/)主题，相似度极高，但很多细节上并非100%复刻，不足之处，日后改进。

![Untitled](/legacy/6a61730d8b966617.png)


## 使用主题

将代码版本更新到4.0以后

将您的默认主题设置为HEO，相关的所有配置都可以在[ /themes/heo/config.js ](https://github.com/notionnext-org/NotionNext/blob/main/themes/heo/config.js)文件中找到。接下来我会介绍这个主题的功能区。

![Untitled](/legacy/c18a66ba4b1525db.png)

## HEO 主题调色

HEO 主题开始支持语义化颜色配置。早期主题中大量使用 Tailwind CSS 固定色名，是为了快速开发；现在可以优先通过 `HEO_COLOR_*` 配置项调整主题色，避免直接修改组件里的 className。

这些配置可以写在 Notion Config、环境变量或 `themes/heo/config.js` 中。Notion Config 优先级更高，适合站长在线调整。

| 配置项 | 默认值 | 影响范围 |
| --- | --- | --- |
| `HEO_COLOR_PRIMARY` | `#4f65f0` | 主按钮、选中态、信息卡主背景、重点链接 |
| `HEO_COLOR_PRIMARY_HOVER` | `#4f46e5` | 主色 hover、信息卡内按钮 |
| `HEO_COLOR_PRIMARY_TEXT` | `#ffffff` | 主色背景上的文字 |
| `HEO_COLOR_ACCENT` | `#dca846` | 深色模式强调色、徽标和辅助高亮 |
| `HEO_COLOR_BG` | `#f7f9fe` | 浅色模式页面背景 |
| `HEO_COLOR_BG_DARK` | `#18171d` | 深色模式页面背景 |
| `HEO_COLOR_CARD` | `#ffffff` | 浅色模式卡片背景 |
| `HEO_COLOR_CARD_DARK` | `#1e1e1e` | 深色模式卡片背景 |
| `HEO_COLOR_CARD_MUTED` | `#f1f3f8` | 浅色弱背景、计数徽标背景 |
| `HEO_COLOR_BORDER` | `#4f46e5` | 浅色模式 hover 边框 |
| `HEO_COLOR_BORDER_DARK` | `#dca846` | 深色模式 hover 边框 |
| `HEO_COLOR_TEXT` | `#111827` | 主文字色 |
| `HEO_COLOR_TEXT_SECONDARY` | `#4b5563` | 次级文字色 |

示例：

```js
HEO_COLOR_PRIMARY: '#7c3aed',
HEO_COLOR_PRIMARY_HOVER: '#6d28d9',
HEO_COLOR_ACCENT: '#f59e0b'
```

后续主题切换工具会逐步加入调色板入口，直接显示当前主题支持的颜色配置键和色值，方便复制到 Notion Config。

图中从上往下分别标注了6个区域，他们分别的功能和配置内容如下：


## 1. 顶部横幅

可以滚动当前的通知内容，并且支持点击跳转到指定链接，配置方式 themes/heo/config.js

```JavaScript
// 首页顶部通知条滚动内容，如不需要可以留空 []
  NOTICE_BAR: [
    { title: '欢迎来到我的博客', url: 'https://blog.tangly1024.com' },
    { title: '访问文档中心获取更多帮助', url: '/user-guide/intro' }
  ],
```


## 2. 英雄区


### 英雄区左侧

1. **左上角的卡牌**点击是随机跳转到一篇文章，此功能无法修改配置，但是可以在源代码[themes/heo/components/Hero.js](https://github.com/notionnext-org/NotionNext/blob/b9f52f386c1a7110a15ba5bf005c8eccb190b1f3/themes/heo/components/Hero.js#L58)中看到。
```JavaScript
// 跳转到任意文章
  function handleClickBanner() {
    const randomIndex = Math.floor(Math.random() * latestPosts.length)
    const randomPost = latestPosts[randomIndex]
    router.push(randomPost.slug) // 跳转到此链接
  }
```

1. **左上卡牌大标题** [themes/heo/config.js](https://github.com/notionnext-org/NotionNext/blob/b9f52f386c1a7110a15ba5bf005c8eccb190b1f3/themes/heo/config.js#L12C1-L15C34)
![Untitled](/legacy/9db05c53471e735b.png)
```JavaScript
// 英雄区(首页顶部大卡)
HERO_TITLE_1: '分享编程',
HERO_TITLE_2: '与思维认知',
HERO_TITLE_3: 'TANGLY1024.COM',
```

1. **左上角卡牌背景滚动图**，会循环展示一些技能的图标，可以在 [themes/heo/config.js](https://github.com/notionnext-org/NotionNext/blob/b9f52f386c1a7110a15ba5bf005c8eccb190b1f3/themes/heo/config.js#L38)中配置
<details>
<summary>展开相关代码</summary>

```JavaScript
// 用户技能图标 ; 两两一组
  GROUP_ICONS: [
    {
      title_1: 'AfterEffect',
      img_1: '/images/heo/20239df3f66615b532ce571eac6d14ff21cf072602.webp',
      color_1: '#989bf8',
      title_2: 'Sketch',
      img_2: '/images/heo/2023e0ded7b724a39f12d59c3dc8fbdc7cbe074202.webp',
      color_2: '#ffffff'
    },
    {
      title_1: 'Docker',
      img_1: '/images/heo/20231108a540b2862d26f8850172e4ea58ed075102.webp',
      color_1: '#57b6e6',
      title_2: 'Photoshop',
      img_2: '/images/heo/2023e4058a91608ea41751c4f102b131f267075902.webp',
      color_2: '#4082c3'
    },
    {
      title_1: 'FinalCutPro',
      img_1: '/images/heo/20233e777652412247dd57fd9b48cf997c01070702.webp',
      color_1: '#ffffff',
      title_2: 'Python',
      img_2: '/images/heo/20235c0731cd4c0c95fc136a8db961fdf963071502.webp',
      color_2: '#ffffff'
    },
    {
      title_1: 'Swift',
      img_1: '/images/heo/202328bbee0b314297917b327df4a704db5c072402.webp',
      color_1: '#eb6840',
      title_2: 'Principle',
      img_2: '/images/heo/2023f76570d2770c8e84801f7e107cd911b5073202.webp',
      color_2: '#8f55ba'
    },
    {
      title_1: 'illustrator',
      img_1: '/images/heo/20237359d71b45ab77829cee5972e36f8c30073902.webp',
      color_1: '#f29e39',
      title_2: 'CSS3',
      img_2: '/images/heo/20237c548846044a20dad68a13c0f0e1502f074602.webp',
      color_2: '#2c51db'
    },
    {
      title_1: 'JS',
      img_1: '/images/heo/2023786e7fc488f453d5fb2be760c96185c0075502.webp',
      color_1: '#f7cb4f',
      title_2: 'HTML',
      img_2: '/images/heo/202372b4d760fd8a497d442140c295655426070302.webp',
      color_2: '#e9572b'
    },
    {
      title_1: 'Git',
      img_1: '/images/heo/2023ffa5707c4e25b6beb3e6a3d286ede4c6071102.webp',
      color_1: '#df5b40',
      title_2: 'Rhino',
      img_2: '/images/heo/20231ca53fa0b09a3ff1df89acd7515e9516173302.webp',
      color_2: '#1f1f1f'
    }
  ],
```

</details>
![Untitled](/legacy/447da302a4673a35.png)

1. **左下角三个导航标签**，点击跳到特定页面，可以在 [themes/heo/configs.js](https://github.com/notionnext-org/NotionNext/blob/b9f52f386c1a7110a15ba5bf005c8eccb190b1f3/themes/heo/config.js#L20-L23) 中配置
![Untitled](/legacy/e35b224d4c228111.png)
```JavaScript
// 英雄区显示三个置顶分类
HERO_CATEGORY_1: { title: '必看精选', url: '/tag/必看精选' },
HERO_CATEGORY_2: { title: '热门文章', url: '/tag/热门文章' },
HERO_CATEGORY_3: { title: '实用教程', url: '/tag/实用教程' },
```
目前这个三个卡牌，默认跳到的是三个**标签归档页**。
什么是标签归档？例如 `/tag/必看精选` 这个链接，展示的是所有标签中包含`必看精选`的文章：
![Untitled](/legacy/a6d453ad6ab998d3.png)
一篇文章可以打多个标签，然后通过访问` /tag/[标签]` 的方式，快速浏览一组包含了同一标签的文章，例如您希望某片文章出现在  `/tag/必看精选` 这个链接 这个链接下，只要给这篇文章打上必看精选的`标签(tag)`即可。
![Untitled](/legacy/9907a9bffcfe3c0c.png)

### 英雄区右侧
显示置顶文章的标题文字，以及跳转链接， 配置方式 [themes/heo/config.js](https://github.com/notionnext-org/NotionNext/blob/b9f52f386c1a7110a15ba5bf005c8eccb190b1f3/themes/heo/config.js#L16-L18)
![Untitled](/legacy/965acb63a2b281e2.png)
```JavaScript
HERO_TITLE_4: '新版上线',
HERO_TITLE_5: 'NotionNext4.0 轻松定制主题',
HERO_TITLE_LINK: 'https://tangly1024.com',
```

#### 推荐置顶文章
点击更多推荐后，可以看到6篇被推荐制定的文章，只有被打了“推荐”标签的文章会在此置顶。
相关配置请查看 themes/heo/config.js
```JavaScript
// 英雄区右侧推荐文章标签, 例如 [推荐] , 最多六篇文章; 若留空白''，则直接推荐最近更新文章
HERO_RECOMMEND_POST_TAG: '推荐',
```
![Untitled](/legacy/ae2293f3d11de6b8.png)

## 3. 文章列表区
![Untitled](/legacy/049f0c2a0fcb13e9.png)
  1. **文章分类**横幅
![Untitled](/legacy/70e274e962db7a32.png)
这里显示您Notion中的所有文章分类，每篇文章可打多个标签，但只能归属于一个分类。
您可以直接在分类栏中输入分类名字，按下回车键即可创建。
![Untitled](/legacy/ca196d12d53b0565.png)
https://notion.so/signed/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F4ff9b53a-b204-4696-8d8c-b4c01bc05e50%2FUntitled.mp4?table=block&id=74bfbeea-9fb8-4208-9399-4b7034d14741
  1. 个人资料卡牌**欢迎语**
此处的文字点击会发生变化，在 [themes/heo/config.js](https://github.com/notionnext-org/NotionNext/blob/b9f52f386c1a7110a15ba5bf005c8eccb190b1f3/themes/heo/config.js#L26-L34) 中配置
![Untitled](/legacy/9221764faff2cd6d.png)
```JavaScript
INFOCARD_GREETINGS: [
    '你好！我是',
    '🔍 分享与热心帮助',
    '🤝 专修交互与设计',
    '🏃 脚踏实地行动派',
    '🏠 智能家居小能手',
    '🤖️ 数码科技爱好者',
    '🧱 团队小组发动机'
  ],
```
`HEO_INFO_CARD_AVATAR_BLUR` 用于控制文章详情页右侧信息卡头像样式。默认值为 `true`，保留原有的大尺寸模糊装饰头像；设置为 `false` 时，文章页头像会与首页信息卡保持一致，显示为普通小头像。

`CONTACT_ORCID` 用于控制 HEO 信息卡中的 ORCID 按钮。填写完整的 ORCID 主页 URL 后，按钮会与现有 GitHub 等社交按钮一起显示；留空时不会渲染。

`HEO_INFO_CARD_ICON_ORCID` 用于覆盖该按钮的 Font Awesome 图标类名，默认值为 `fab fa-orcid`。通常无需修改；如需自定义，可在 Notion Config 中设置同名键，或直接修改 `themes/heo/config.js`。


下方的 Tangly是显示作者名字，在blog.config.js中配置
  1. **公告栏**， 卡牌中间的文字是公告内容
![Untitled](/legacy/ad1cf348d91ede21.png)
公告内容是您Notion模板中类型为`Notice`的文章内容。
![Untitled](/legacy/03a6ffb7ae428bd9.png)

### 移动端-英雄区
在移动端英雄区被精减，默认显示如下：
左侧是两个标签，默认是必看精选和热门文章，第三个标签被隐藏。
右侧默认显示打了《推荐》标签的六篇文章
![Untitled](/legacy/ff98ba4d842a3d0d.png)

## 原文链接

https://docs.tangly1024.com/article/notionnext-heo
