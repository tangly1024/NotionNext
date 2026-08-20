# 基础教程-Tailwind CSS
> 迁移自：[基础教程-Tailwind CSS](https://docs.tangly1024.com/article/about-tailwindcss)
> 发布日期：2021-6-18
> 最后编辑：2024-9-12
> 原栏目：⌨ 开发教程
> 标签：开发
> 摘要：用工程化的CSS方式堆叠界面，能极大地方便界面开发、并且激发设计界面的灵活性

## 前言

[TailwindCSS ](https://www.tailwindcss.cn) 是一个很棒的CSS类库，与其说是类库，不如说是一个超大的样式类工具集合，如果你掌握甚至习惯了 Tailwind 的语法。你会爱上它的。

![Untitled](/legacy/98cb8ecc9423e947.png)
> 每个月 npm 下载量高达 800 万次，jsDelivr 下载量高达 1000 万次，Star 数也突破 40K，依赖于它的 Packge 及 Github Repo 更是成千，足见其受欢迎程度。然而你需要使用它时，Node 的版本最好大于 12.13.0


### TailWindCSS的**粒度**

越往下走，颗粒度越来越大，约束性变高，自由性不足。而 `TailwindCSS` 位于第二层。

```HTML
&lt;div style="{ borderRadius: '0.5rem', padding: '1rem' }"&gt; Click &lt;/div&gt;

-&gt; &lt;div class="rounded-lg p-4"&gt; Click &lt;/div&gt;

&lt;div class="button"&gt; Click &lt;/div&gt;

&lt;Button&gt; Click &lt;/Button&gt;
```

上一代css框架是提供完整的设计输出，是组件级别，位于第四层，颗粒度大、约束性高，自由性不足。例如一个&lt;Input&gt;组件，框架已经帮你写好了所有样式，你只要把类名丢进去，一个input就被美化了。当然bootstrap还提供了sass版本，你可以通过修改变量来实现自定义，但毕竟自定义空间不大。

Tailwind提供的是设计规范，相当于理念层面的素材。比如还是input组件，你需要首先对input进行拆解，它的边框、字体、阴影、圆角等等，你要从框架里面把这些元素挑出来进行组合。

这样做极大的激发了设计师的创作想象力，也为设计师编程提供可能。


## 优点


### 庞大的样式类声明

Tailwind 提供大量的样式类声明，使得我们在编写页面样式的时候，基本可以不用写一行 style 就能实现大部分场景，比如我们有一个div，想通过 flex 布局实现垂直居中功能，我们需要编写如下CSS：

![image](/legacy/57118e6f9ebbd84c.gif)

```CSS
.flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

使用 Tailwind CSS 只需在元素 class 上声明如下：

```HTML
&lt;div class="flex justify-center items-center"&gt;I am a div&lt;/div&gt;
```


### 便捷的响应式

![image](/legacy/d880bc0e466ef0a0.gif)

要实现不同分辨率屏幕下的样式，只需要在样式前加上对应的断点前缀：

![image](/legacy/f90535fe578beafb.png)

```PowerShell
&lt;!-- 默认宽16；中等尺寸屏幕上宽32, 更大的屏幕上尺寸为48 等等 --&gt;
&lt;img class="w-16 md:w-32 lg:w-48" src="..."&gt;
```


### 小巧轻量

生产版本的库大小只有8.7kb

![image](/legacy/80b010ce95fdfcb6.png)


## 简化代码

举一个完整的例子，你可能需要实现下面这样一个效果：

![image](/legacy/18a2c29a364ae52e.jpg)

按照我们正常的写法，需要这样写:

```HTML
&lt;div class="chat-notification"&gt;
  &lt;div class="[chat-notification-logo-wrapper](https://www.zhihu.com/search?q=chat-notification-logo-wrapper&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A1693039814%7D)"&gt;
    &lt;img class="chat-notification-logo" src="/img/logo.svg" alt="ChitChat Logo"&gt;
  &lt;/div&gt;
  &lt;div class="chat-notification-content"&gt;
    &lt;h4 class="chat-notification-title"&gt;ChitChat&lt;/h4&gt;
    &lt;p class="chat-notification-message"&gt;You have a new message!&lt;/p&gt;
  &lt;/div&gt;
&lt;/div&gt;

&lt;style&gt;
  .chat-notification {
    display: flex;
    max-width: 24rem;
    margin: 0 auto;
    padding: 1.5rem;
    border-radius: 0.5rem;
    background-color: #fff;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  .chat-notification-logo-wrapper {
    flex-shrink: 0;
  }
  .chat-notification-logo {
    height: 3rem;
    width: 3rem;
  }
  .chat-notification-content {
    [margin-left](https://www.zhihu.com/search?q=margin-left&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22answer%22%2C%22sourceId%22%3A1693039814%7D): 1.5rem;
    padding-top: 0.25rem;
  }
  .chat-notification-title {
    color: #1a202c;
    font-size: 1.25rem;
    line-height: 1.25;
  }
  .chat-notification-message {
    color: #718096;
    font-size: 1rem;
    line-height: 1.5;
  }
&lt;/style&gt;
```

但是使用Tailwind CSS，你只需要这样写就可以:

```HTML
&lt;div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4"&gt;
  &lt;div class="flex-shrink-0"&gt;
    &lt;img class="h-12 w-12" src="/img/logo.svg" alt="ChitChat Logo"&gt;
  &lt;/div&gt;
  &lt;div&gt;
    &lt;div class="text-xl font-medium text-black"&gt;ChitChat&lt;/div&gt;
    &lt;p class="text-gray-500"&gt;You have a new message!&lt;/p&gt;
  &lt;/div&gt;
&lt;/div&gt;
```


## Visual Studio Code 插件支持

安装了插件后，即可体验飞快的开发

![Untitled](/legacy/1508227f17677dfb.png)

![Untitled](/legacy/4f2f5faa553e21e6.png)


## 官方生态


### 组件参考

[Tailwind CSS Components. Examples and templates](https://tailwindcomponents.com/)

Tailwind CSS examples from components by the community. Tailwind chart, grids, inputs, forms, templates and much more

[Tailwind CSS Components - Tailwind UI](https://tailwindui.com/components)

Beautiful UI components and templates by the creators of Tailwind CSS.


### 内置颜色参考

[Customizing Colors - TailwindCSS中文文档 | TailwindCSS中文网](https://www.tailwindcss.cn/docs/customizing-colors)

Customizing the default color palette for your project.


## 修改样式示例

此方法适合有开发经验的专业人员。


### 以example 主题为例：

如何修改example主题的背景色？在/themes/example/index.js 中 ,找到[ theme-example的这行](https://github.com/notionnext-org/NotionNext/blob/e6c69dbbaecb1419f0ca3fa0a15b44cf24be0df0/themes/example/index.js#L65)：

```JavaScript
&lt;div id='theme-example' className={`${siteConfig('FONT_STYLE')} dark:text-gray-300  bg-white dark:bg-black scroll-smooth`} &gt;
```

![Untitled](/legacy/ae75d3cbe2acf52a.png)

其中`bg-white` 表示默认主题背景色为白色，`dark:bg-black`表示夜间模式的背景色为黑色。

您可以任意调整成自己的色号，按照TailwindCSS的自定义颜色教程，可以如下设置：`bg-[#dca846] dark:bg-[#eeeeee]`

```JavaScript
&lt;div id='theme-example' className={`${siteConfig('FONT_STYLE')} dark:text-gray-300 bg-[#dca846] dark:bg-[#eeeeee] scroll-smooth`} &gt;
```

同理，要修改其他主题的背景色，也可以通过以上步骤

1. 找到主题文件 /tehemes/xx/index.js

1. 找到整体背景色 id=’theme-xx’ className=’bg-day dark:bg-night’ 修改并保存即可。


## 总结

未来的css框架趋势必然是：**更细化，更工程化**。

它的美化效果不一定是最好的。但是它的这种工作方式，定会在不同公司得到发挥，特别是有统一设计团队，要统一UI的公司。对于这些公司而言，写好设计规范，接下来就是拼凑。如何设计师直接通过组合得出效果，对研发人员来说也节省了时间。


## TailwindCss 相关资源

官方文档

[中文文档 - Tailwind CSS 中文文档](https://www.tailwindcss.cn/docs)

Tailwind CSS 是一个功能类优先的 CSS 框架，它由 Adam Wathan 创建。本站提供 Tailwind CSS 官方文档中文翻译致力于为广大国内开发者提供准确的中文文档，助力开发者掌握并使用这一框架。


## 题外-**Tailwind CSS: 从副业产品到2百万美元的故事**

我是 Adam Wathan，Tailwind CSS的发明者。

2020年7月份，Tailwind 的总安装量突破了1千万次，这让我非常惊讶。

我们从Tailwind UI中获得200万美元的收入，这是我们第一个商用的Tailwind CSS产品，是在第一个Tailwind CSS版本发布两年之后。

- 原文链接
[Tailwind CSS: From Side-Project Byproduct to Multi-Million Dollar Business](https://adamwathan.me/tailwindcss-from-side-project-byproduct-to-multi-mullion-dollar-business/)

This was originally posted as a thread on Twitter, but I thought I'd republish it here to give it a proper home. So about a month or so ago, Tailwind cracked 10 million total installs, which given its humble beginnings, completely blows my mind.

- 中文
[独立开发变现周刊（第47期）：Tailwind CSS 从副业产品到2百万美元的故事](https://mp.weixin.qq.com/s/0Osip1_vIWu84Ux2G9CshA)

分享独立开发、产品变现相关内容，每周五发布。\x0d\x0a本内容开源( Github: ljinkai/weekly )

## 原文链接

https://docs.tangly1024.com/article/about-tailwindcss
