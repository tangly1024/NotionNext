# Magzine主题
> 迁移自：[Magzine主题](https://docs.tangly1024.com/article/notion-next-magzine)
> 发布日期：2024-9-14
> 最后编辑：2024-9-14
> 原栏目：⭐ 主题参数


## 主题预览

![Magazine 主题预览](/images/themes-preview/magzine.webp)

::: tip 提示
新主题，需要升级到V4.7.1之后的版本才能使用
:::

::: tip 4.10.10 更新
文章页广告与右侧栏间距已恢复，升级到 `4.10.10` 后同步最新代码并重新部署即可，无需新增配置。
:::

![桌面端](/legacy/e5089e1db6109fc0.png)
![移动端](/legacy/aa0f0b759ff50dec.png)


## 首页说明

这个主题的风格更偏向简约、扁平、专业化。同时首页将文章按照分类栏目陈列，展示逻辑更加清晰。


### 首屏更加突出重点：

1. Notion中的第一篇文章作为置顶，会放大展示在左上角最显眼处侧。

1. 右侧上方是一个宣传位，可以配置标语和跳转的按钮，可以在config.js中找到对应的配置名，并借助NOTION_CONFIG在notion中配置。

1. 右侧下方显示的是Notion中排第二和第三的文章

![image.png](/legacy/68eb43ec152ffbce.png)


### 接下来是最新文章栏目：

Notion中排名靠前的文章，除了首屏展示的文章，剩下的依次排列在这里，最多展示4个，点击查看全部则跳转到归档页面，从而按照发布时间查看所有文章。


### 接下来是分类栏目：

将所有的文章按照分类分组，依次排列，一行就是一组分类的文章，点击全部则是查看这个分类下全部的文章。

![image.png](/legacy/57e778fec3f55d49.png)


### 接下来是推荐文章

这里默认显示标题为“推荐文章”，这里的文章默认获取标签包含“推荐”的文章，这里的标题和标签可以自行配置，在config.js中可以找到。

例如你可以设置为“热门文章”，并且读取Notion中标签包含“hot”的文章。

![image.png](/legacy/7f77dc58f53fb13e.png)


### 然后是公告

公告在Notion中用Notice编辑，这里公告的背景色是绿色，暂时无法通过配置修改，可以通过css样式的方式自行微调。

![image.png](/legacy/a664d6044de7702f.png)


### 然后是页脚

黑色背景的页脚，左侧显示作者信息和网站标题，右侧是自定义的导航菜单，例如友情链接等可以放在这里，菜单是分组的，顶部显示分组名下方陈列菜单名称，点击可以跳转。这些链接需要在config.js中配置，后面会展开说明配置方法。


## 文章详情页面说明

文章详情页，首屏从上往下依次显示分类标签，标题，摘要，封面图。

![image.png](/legacy/fa619a4ca6096f49.png)

文章页向下滚动，第二屏中间是文章内容，左侧是目录，右侧上方是发布事件，中间是最近更新的文章（根据修改时间排列在这里，而非创建时间）

![image.png](/legacy/4889139d65984b9e.png)

文章页再往下滚动，会显示分类导航，以及交流卡片，交流卡片的文字和链接可以在config.js中配置。

![image.png](/legacy/ec1f8d1081abc341.png)

再往下滚动，会显示一个宣传栏，左侧显示的是站点封面图，右侧显示的内容和主页右上角的广告内容一致。

![image.png](/legacy/1a03465abe8b4d24.png)


## 配置部分

在/themes/magzine/config.js 中可以找到该主题支持的所有配置，主要内容和说明如下：

### Magzine 主题调色

Magzine 支持通过语义色变量调整页面背景和滚动条：

```js
MAGZINE_COLOR_BG: '#f6f6f1',
MAGZINE_COLOR_SCROLLBAR: '#4e4e4e'
```

主题工具中的调色板会展示当前值，并可直接复制配置项到 Notion Config。

<details>
<summary>主题支持配置的相关代码，点击展开：</summary>

```JavaScript
const CONFIG = {
  MAGZINE_COLOR_BG: '#f6f6f1',
  MAGZINE_COLOR_SCROLLBAR: '#4e4e4e',

  // 首屏信息栏按钮文字
  MAGZINE_HOME_BANNER_ENABLE: true, // 首屏右上角的宣传位是否开启
  MAGZINE_HOME_BUTTON: true,
  MAGZINE_HOME_BUTTON_URL: '/about',
  MAGZINE_HOME_BUTTON_TEXT: '了解更多',
  MAGZINE_HOME_TITLE: '立即开创您的在线业务。完全免费。',
  MAGZINE_HOME_DESCRIPTION:
    '借助NotionNext，获得助您开创、经营和扩展业务所需的全部工具和帮助。',
  MAGZINE_HOME_TIPS: 'AI时代来临，这是属于超级个体的狂欢盛宴！',

  // 首页按照分类展示的文章列表组件，这里可以设置要屏蔽的分类
  MAGZINE_HOME_HIDDEN_CATEGORY: '分享杂文', //不希望在首页展示的文章分类，用英文逗号隔开

  // 首页底部推荐文章标签, 例如 [推荐] , 最多六篇文章; 若留空白''，则推荐最近更新文章
  MAGZINE_RECOMMEND_POST_TAG: '推荐',
  MAGZINE_RECOMMEND_POST_COUNT: 6,
  MAGZINE_RECOMMEND_POST_TITLE: '推荐文章',
  MAGZINE_RECOMMEND_POST_SORT_BY_UPDATE_TIME: false, // 推荐文章排序，为`true`时将强制按最后修改时间倒序

  // Style
  MAGZINE_RIGHT_PANEL_DARK: process.env.NEXT_PUBLIC_MAGZINE_RIGHT_DARK || false, // 右侧面板深色模式

  MAGZINE_POST_LIST_COVER: true, // 文章列表显示图片封面
  MAGZINE_POST_LIST_PREVIEW: true, // 列表显示文章预览
  MAGZINE_POST_LIST_CATEGORY: true, // 列表显示文章分类
  MAGZINE_POST_LIST_TAG: true, // 列表显示文章标签

  MAGZINE_POST_DETAIL_CATEGORY: true, // 文章显示分类
  MAGZINE_POST_DETAIL_TAG: true, // 文章显示标签

  // 文章页面联系卡
  MAGZINE_SOCIAL_CARD: true, // 是否显示右侧，点击加入社群按钮
  MAGZINE_SOCIAL_CARD_TITLE_1: '交流频道',
  MAGZINE_SOCIAL_CARD_TITLE_2: '加入社群讨论分享',
  MAGZINE_SOCIAL_CARD_TITLE_3: '点击加入社群',
  MAGZINE_SOCIAL_CARD_URL: '/user-guide/help/community',

  // 页脚菜单 结构是 [分组,分组,分组] ，分组对象内容是： {name:'标题',menus:[链接,链接]}
  MAGZINE_FOOTER_LINKS: [
    {
      name: '友情链接',
      menus: [
        { title: 'tangly博客', href: 'https://blog.tangly1024.com' },
        { title: '尘世の歌', href: 'https://chenge.ink' },
        { title: 'LUCEN', href: 'https://www.lucenczz.top/' }
      ]
    },
    {
      name: '开发者',
      menus: [
        { title: 'Github', href: 'https://github.com/notionnext-org/NotionNext' },
        { title: '关于作者', href: '/about' }
      ]
    },

    {
      name: '支持',
      menus: [
        {
          title: '站长社群',
          href: '/user-guide/help/community'
        }
      ]
    },
    {
      name: '解决方案',
      menus: [
        { title: '建站工具', href: 'https://www.tangly1024.com/' },
        { title: 'NotionNext', href: '/user-guide/intro' }
      ]
    }
  ]
}
export default CONFIG
```

</details>


### 页脚菜单详细

页脚菜单结构是 [分组,分组,分组,…] 支持无数个分组。

分组对象内容是： { name:'标题',menus:[链接,链接,…]} ，name是组名，menus是这个分组下有几个链接。

链接对象内容是： { title:’链接显示标题’, href: ’/user-guide/intro’} ，链接可以配置标题和跳转位置。

```JavaScript
// 页脚菜单 结构是 [分组,分组,分组] ，分组对象内容是： {name:'标题',menus:[链接,链接]}
  MAGZINE_FOOTER_LINKS: [
    {
      name: '友情链接',
      menus: [
        { title: 'tangly博客', href: 'https://blog.tangly1024.com' },
        { title: '尘世の歌', href: 'https://chenge.ink' },
        { title: 'LUCEN', href: 'https://www.lucenczz.top/' }
      ]
    },
    {
      name: '开发者',
      menus: [
        { title: 'Github', href: 'https://github.com/notionnext-org/NotionNext' },
        { title: '关于作者', href: '/about' }
      ]
    },

    {
      name: '支持',
      menus: [
        {
          title: '站长社群',
          href: '/user-guide/help/community'
        }
      ]
    },
    {
      name: '解决方案',
      menus: [
        { title: '建站工具', href: 'https://www.tangly1024.com/' },
        { title: 'NotionNext', href: '/user-guide/intro' }
      ]
    }
  ]
```


### 在Notion_Config中配置

这个菜单支持在Notion_Config中配置.（其实基本上所有配置都支持在Notion_Config中配置），不过因为这个参数是一个数组对象,因此要用JSON的形式配置：

配置示例如下,在Notion_Config中添加一个 `MAGZINE_FOOTER_LINKS`，即可

![image.png](/legacy/11f99a973dcfc574.png)

<details>
<summary>可以直接复制使用的模板配置 - 点击展开</summary>

直接复制这里的内容，粘贴到NOTION_CONFIG中的 MAGZINE_FOOTER_LINKS后面即可。
```JavaScript
[
    {
        "name": "友情链接",
        "menus": [
            {
                "title": "Tangly博客",
                "href": "https://blog.tangly1024.com"
            },
            {
                "title": "NotionNext",
                "href": "https://tangly1024.com/"
            }
        ]
    },
    {
        "name": "开发者",
        "menus": [
            {
                "title": "Github",
                "href": "https://github.com/notionnext-org/NotionNext"
            },
            {
                "title": "开发帮助",
                "href": "/user-guide/development/getting-started"
            },
            {
                "title": "功能反馈",
                "href": "https://github.com/notionnext-org/NotionNext/issues/new/choose"
            },
            {
                "title": "技术讨论",
                "href": "https://github.com/notionnext-org/NotionNext/discussions"
            },
            {
                "title": "关于作者",
                "href": "https://blog.tangly1024.com/about"
            }
        ]
    },
    {
        "name": "支持",
        "menus": [
            {
                "title": "站长社群",
                "href": "/user-guide/help/community"
            },
            {
                "title": "咨询与定制",
                "href": "/user-guide/help/support"
            },
            {
                "title": "升级手册",
                "href": "/user-guide/help/support"
            },
            {
                "title": "安装教程",
                "href": "/user-guide/update"
            },
            {
                "title": "SEO推广",
                "href": "https://seo.tangly1024.com/"
            }
        ]
    },
    {
        "name": "解决方案",
        "menus": [
            {
                "title": "建站工具",
                "href": "https://www.tangly1024.com/"
            },
            {
                "title": "NotionNext",
                "href": "/user-guide/intro"
            }
        ]
    }
]
```

</details>

效果如下：

![image.png](/legacy/708c8c565be1518f.png)


## 最后

这里赘述一下，如何将代码中config.js中的复杂对象配置转成json，可以借助AI，或者手动在代码中添加双引号：

![image.png](/legacy/66649f5a34b48b2f.png)

用这种方式，基本上NotionNext中的所有配置都支持用NOTION_CONFIG来进行配置。

## 原文链接

https://docs.tangly1024.com/article/notion-next-magzine
