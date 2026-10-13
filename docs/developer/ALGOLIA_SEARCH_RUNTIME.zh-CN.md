# Algolia 弹窗搜索

弹窗要求同时配置 `ALGOLIA_APP_ID`、`ALGOLIA_SEARCH_ONLY_APP_KEY`、`ALGOLIA_INDEX`。已配置 `ALGOLIA_APP_ID` 但缺少搜索密钥或索引时，搜索入口回退到本站 `/search` 页面。未配置 `ALGOLIA_APP_ID` 时不启用 Algolia 快捷键、不触发导航，保留主题自身的 Ctrl+K 行为。浏览器只应使用搜索专用密钥。

输入后等待约 600 毫秒发起请求。继续输入、清空输入、关闭弹窗或切换页面后，旧请求的响应不会覆盖当前结果。加载时显示状态；请求失败时显示可重试提示，点击“重试”重新请求当前关键词和页码。
