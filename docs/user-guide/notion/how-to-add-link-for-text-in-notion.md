# Notion文字添加超链接
> 迁移自：[Notion文字添加超链接](https://docs.tangly1024.com/article/how-to-add-link-for-text-in-notion)
> 发布日期：2022-6-16
> 最后编辑：2024-9-4
> 原栏目：✒ Notion教程
> 标签：Notion、超链接
> 摘要：Notion可以方便地给文字添加超链接

Notion支持在文本上添加链接，从而实现点击文字跳转到任意指定页面

::: tip 提示
示例效果：
点击跳转到我的另一篇文章 → 《‣》
:::

本篇将介绍如何使用内链和外链，在SEO中[内链和外链都是很重要的指标](https://seo.tangly1024.com/%E4%BA%8C%E3%80%81%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%8E%9F%E7%90%86/seo-backlinks)。


## Notion内链

::: tip 提示
在 [v4.5.2](https://github.com/notionnext-org/NotionNext/releases/tag/v4.5.2) 之前的版本中，添加博客文章的内链，需要在网页中打开你的博客并复制完整url，再粘贴到你的notion中。
:::

例如：浏览器中复制 [https://blog.tangly1024.com/article/the-ai-era](https://blog.tangly1024.com/article/the-ai-era) ，然后将URL粘贴在Notion的文字上，从而实现文字点击跳转 →《[文字链接](https://blog.tangly1024.com/article/the-ai-era)》 。

在4.5.2之后支持自动将Notion内部的Page链接转换成文章链接.


### 使用前提

1. 对应的Notion-Link 也在同一个数据库中。

1. 类型是Post，不能是Page。

1. 不能是当前文章自身链接


### 使用方法一 （复制粘贴）

1. 打开被引用的Notion页面，按下`ctrl+L` 复制页面链接（页面会提示`Copied link` 表示复制成功)
![Untitled](/legacy/52b41dcd35201733.png)

1. 回到当前正在编写的文章，在需要引用的位置按 `ctrl+v` ，然后选择`Mention page` 即可。
![Untitled](/legacy/6f6856fed03dbf0f.png)
链接成功后，会变成如下效果：
![Untitled](/legacy/5a39584c8218603d.png)


### 使用方法二 （@引用）

在需要引入的地方输入一个英文 `@` 符号，此时Notion会弹出一个历史页面搜索框

![notion引用页面](/legacy/e941646ef516edf3.png)

此时直接输入要引用的页面的部分标题，例如输入`文字添加超链接` ，则会根据标题搜索到相关的链接：

![notion搜索引用页面](/legacy/a8f9effdda49541f.png)

使用鼠标点击你要引用的文章、或者用键盘上下键+回车键输入即可完成输入。


## 普通外链

添加普通外链的方式有三种方式，分别是**快速粘贴**、**快捷键**以及**悬浮条。**


### 一、快速粘贴

1. 复制一个超链接，例如网页地址 [`/user-guide/intro`](/user-guide/intro) ;（必须是一个完整的http链接）
![可以在浏览器的地址栏中复制](/legacy/bd119518b8ca46de.png)

1. 回到Notion，用**鼠标选中**要添加链接的词或句。如下图：
![Untitled](/legacy/9bf3b8a5af9a39d9.png)
例如： 点击这段文字跳转到我的主页。

1. 粘贴链接：按下`ctrl+v` 将你刚才复制的链接直接粘贴到文字上即可。
粘贴后可以看到：文字的字体变灰，且多了一个下划线，当鼠标停在文字上会变成手的图标。说明链接就添加完成了~！如下图：
![Untitled](/legacy/2a6eadce0202c439.png)


### 二、快捷键 `ctrl`+`k`

::: tip 提示
经评论区的D_super大佬提醒，可用快捷键添加链接。
:::

选中要添加链接的文字，按下键盘的`ctrl`+`k`（mac系统是`cmd`+`k`），即可弹出链接编辑框，如下图：

![Untitled](/legacy/535c59b91e1f728e.png)

在弹出的编辑框中，粘贴链接，或者直接输入超链接即可。


### 三、悬浮条中操作

除了快速粘贴链接的做法，还可以使用Notion的悬浮条功能。

当我们**选中文字时**，文字顶部会弹出一个悬浮条，在弹出的悬浮框中点击**`Link`**选项即可进行链接的添加与编辑

![Untitled](/legacy/7646cb2036b106dc.png)

在link下的输入框中，输入要跳转的网址，并按下回车键(Enter键)确认。淡然你也可以点击Remove link 移除你不想要的链接。

![Untitled](/legacy/b9d85394d7224f42.png)

## 原文链接

https://docs.tangly1024.com/article/how-to-add-link-for-text-in-notion
