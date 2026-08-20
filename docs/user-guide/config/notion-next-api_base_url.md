# API_BASE_URL
> 迁移自：[API_BASE_URL](https://docs.tangly1024.com/article/notion-next-api_base_url)
> 发布日期：2025-10-8
> 最后编辑：2025-10-11
> 原栏目：🛠 站点配置

::: tip 提示
这是一个临时的配置，用于解决4.9.0→4.9.1版本由于notion接口变化产生站点无法编译的异常。并非每一个人都遇到，若你的站点能够正常部署，并且没有出现530异常，则可以忽略此文。
:::

相关提交与说明可参考：[https://github.com/notionnext-org/NotionNext/pull/3632](https://github.com/notionnext-org/NotionNext/pull/3632)


## 配置的作用

在blog.config.js 中可以看到多了一行配置:

```Plain Text
API_BASE_URL: process.env.API_BASE_URL || 'https://app.notion.com/api/v3', // API默认请求地址 ,可配置成自己的 https://&lt;xxxx&gt;.notion.site/api/v3
```

由于Notion官方域名API([https://www.notion.so/api/v3/queryCollection](https://www.notion.so/api/v3/queryCollection)) 无法使用，接口请求均返回530错误，如下图：

![image.png](/legacy/de41efcb078c74fc.png)

解决方法：如果当你阅读此文时，此API页面仍未修复，临时可以使用备用域名进行访问，待notion的dns网络恢复后可以无需再启用此配置。


### 如何获取自定义的url地址：

每个用户自己的notion共享到公网时，notion会分配一个独立域名，格式为：`https://[your-company].notion.site/` 。只需将您的notion页面链接复制到浏览器中打开，即可看到地址栏已自动跳转到个性链接地址。

![image.png](/legacy/32ae4c60c37fc2b9.png)

将个性域名地址拼接成完成的api地址例如：`https://[xxxx].notion.site/api/v3`，然后添加到NotionNext的环境变量`API_BASE_URL`中即可。

::: tip 提示
前提请升级到最新版本的NotionNext，添加环境变量可通过local.env文件**或**vercel环境变量等方式添加
:::

::: tip 提示
理论上可共用同一个api地址，但是为了避免接口**网络拥堵**，大家千万**不要**都用相同的个性域名。请各自获取自己的个性域名，作为api地址的前缀
:::

![image.png](/legacy/cf20c9ab51ddd7c0.png)

![image.png](/legacy/9077ae34f34ffb4f.png)

添加环境变量后，重新启动代码，站点就能恢复正常了。

## 原文链接

https://docs.tangly1024.com/article/notion-next-api_base_url
