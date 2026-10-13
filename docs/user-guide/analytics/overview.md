# 站点统计相关
> 迁移自：[站点统计相关](https://docs.tangly1024.com/article/notion-next-analytics)
> 发布日期：2023-8-4
> 最后编辑：2024-4-28
> 原栏目：📊 网站统计
> 标签：NotionNext、站点统计

::: tip 提示
作为站长，站点统计功能对于管理和优化你的网站非常重要。它可以提供有关访问者行为、流量来源和网站性能的关键信息，帮助你做出数据驱动的决策和改进网站体验。
:::

站点统计功能的一些主要作用：

1. 访问者分析：站点统计可以提供关于你的访问者的详细信息，包括他们的地理位置、使用的设备和操作系统、浏览器类型等。这些数据可以帮助你了解你的目标受众，优化网站内容和布局以提供更好的用户体验。

1. 流量来源追踪：统计功能可以告诉你访问者是通过搜索引擎、外部链接还是直接输入网址来到你的网站的。这有助于你了解哪些渠道为你带来了最多的流量，以便你可以聚焦于这些渠道，提高网站的可见性和曝光度。

1. 页面分析：你可以了解每个页面的访问量、跳失率、停留时间等指标。通过分析这些数据，你可以确定哪些页面受欢迎，哪些页面需要改进，以及你的访问者在你的网站上的行为模式。

1. 目标跟踪和转化率分析：如果你有特定的目标，比如注册、购买或订阅，站点统计功能可以帮助你追踪这些目标的完成情况。你可以了解转化率、关键转化路径和转化漏斗，以便你可以优化你的网站和营销策略。

常用的站点统计方案包括：

1. Google Analytics：这是最受欢迎的免费网站统计工具之一，提供了广泛的功能和详细的数据分析报告。

1. 百度统计：这是百度提供的一款免费统计工具，特别适用于中文网站。

1. CNZZ统计：这是国内另一款常用的免费统计工具，提供了实时数据监控和细致的访问者分析。

1. Ackee：这是一款自托管的开源统计工具，可以在你自己的服务器上搭建，提供了强大的个性化定制和隐私保护功能。

1. [Clarity](/user-guide/analytics/clarity)统计：最近我才发现的、微软推出的统计工具，很好用，而且在国内访问体验很好。

1. [不蒜子 / Busuanzi](/user-guide/analytics/busuanzi)：轻量的 PV/UV 计数，默认开启；2024 年起官方服务不稳定，已切换到社区维护的 Vercount，详见专页。

这些统计方案在功能和报告类型上略有不同，你可以根据自己的需求选择最适合你的方案。无论你选择哪种方案，站点统计功能都将帮助你更好地了解和优化你的网站。


## 配置相关

```JavaScript
// ----&gt; 站点统计
ANALYTICS_BUSUANZI_ENABLE: true, // 展示网站阅读量、访问数；2024 年起官方服务不稳定，默认改走社区兼容实现 Vercount，详见 /user-guide/analytics/busuanzi
ANALYTICS_BAIDU_ID: process.env.NEXT_PUBLIC_ANALYTICS_BAIDU_ID || '', // e.g 只需要填写百度统计的id，[baidu_id] -&gt; https://hm.baidu.com/hm.js?[baidu_id]
ANALYTICS_CNZZ_ID: process.env.NEXT_PUBLIC_ANALYTICS_CNZZ_ID || '', // 只需要填写站长统计的id, [cnzz_id] -&gt; https://s9.cnzz.com/z_stat.php?id=[cnzz_id]&web_id=[cnzz_id]
ANALYTICS_GOOGLE_ID: process.env.NEXT_PUBLIC_ANALYTICS_GOOGLE_ID || '', // 谷歌Analytics的id e.g: G-XXXXXXXXXX
```

::: tip 不蒜子站点的处理建议
如果你之前一直用不蒜子、现在发现 PV/UV 数字为空，请直接阅读 [不蒜子统计专页](/user-guide/analytics/busuanzi)：
- 默认走 Vercount，升级后会自动从 `busuanzi.ibruce.info` 同步历史 PV/UV，无需手动操作
- 自托管 Vercount / 切回原版不蒜子 / 关闭开关都有明确步骤
- 新增 `NEXT_PUBLIC_BUSUANZI_SCRIPT_URL` 用于自定义脚本地址
:::

### 开启 谷歌统计（GA）

只需在vercel后台添加一个环境变量，值为你的GA-ID即可，无需其他配置

![Untitled](/legacy/58c5d20bf433eff7.png)


#### GA-ID从哪里来？

在[GoogleAnalytics后台](https://analytics.google.com/analytics/web/) 创建你的网站资源，并添加一个数据流（类型为网站）

![Untitled](/legacy/6a54c262b1e64663.png)

在数据流的详情中，可以看到我们所需要的 衡量ID (Analytics-ID)

![Untitled](/legacy/d72bb8754da49d1e.png)


## FAQ

- 统计多久生效？
  - 理论上实时生效，只要在站点安装好后，google后台就能立刻查询到安装结果

- 怎么知道我的统计安装是否生效？
  - 打开网页 → 按F12打开控制台  → 点击元素(Elements)面板 → 在面板中搜索你的衡量ID，如果能搜索相关代码`googletagmanager.com/gtag/js?id=xxxxx`到就是成功的。
![Untitled](/legacy/5af36fcdda61b725.png)

- 配置失效怎么办？
  - 参考站点配置的文档，进行r[edeploy](/user-guide/config-site#c4768010ae7d44609b744e79e2f9959a)

## 原文链接

https://docs.tangly1024.com/article/notion-next-analytics
