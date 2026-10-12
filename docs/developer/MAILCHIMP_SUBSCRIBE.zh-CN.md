# Mailchimp 邮件订阅

设置 `MAILCHIMP_API_KEY` 和 `MAILCHIMP_LIST_ID` 后可使用订阅接口。数据中心从 API Key 的 `-usN` 后缀读取，不再固定为 us18。

`POST /api/subscribe` 请求体为 `{"email":"reader@example.com","firstName":"Reader","lastName":"Example"}`；姓名可省略。浏览器 helper `subscribeToNewsletter(email, firstName, lastName)` 使用同样的字段。

接口只在 Mailchimp 确认成功时返回成功。重复地址返回 409；无效参数返回 400；Mailchimp 服务错误返回 502；未配置或网络故障返回 503。上游错误详情和 API Key 不会出现在客户端响应中，接口不缓存响应。请求超时为 15 秒。
