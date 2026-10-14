# Mailchimp 邮件订阅

设置 `MAILCHIMP_API_KEY` 和 `MAILCHIMP_LIST_ID` 后可使用订阅接口。数据中心从 API Key 的 `-usN` 后缀读取，不再固定为 us18。

`POST /api/subscribe` 请求体为 `{"email":"reader@example.com","firstName":"Reader","lastName":"Example"}`；姓名可省略。浏览器 helper `subscribeToNewsletter(email, firstName, lastName)` 使用同样的字段。

Mailchimp 接受新请求和返回 `Member Exists` 时，接口均返回相同的 200 和中性提示“Subscription request received…”，使这两类请求无法通过响应状态或文案区分。这个结果只表示请求已处理，不承诺该地址已完成订阅。

新建成员使用 `pending` 状态，要求邮箱持有人通过 Mailchimp 确认邮件完成订阅；这也避免归档成员被直接恢复为已订阅。重复地址不会触发 PUT/upsert、再次确认邮件或状态更新，已退订成员不会被自动恢复。需要重新订阅但未收到确认邮件时，应使用站点所有者提供的 Mailchimp 订阅表单或联系站点所有者，按 Mailchimp 的确认流程处理。此接口不查询或公开现有成员状态；第三方对归档、清理或永久删除成员的限制仍可能导致请求被拒绝。

无效参数返回 400；除 `Member Exists` 外的 Mailchimp 400 也返回 400，例如永久删除地址等受上游限制的请求。响应只含固定错误文案，但 HTTP 状态仍可能区分少数地址状态，因此统一提示不代表完全消除了名单探测的可能。其他 Mailchimp 服务错误返回 502；未配置或网络故障返回 503。浏览器 helper 会对非成功响应抛错，Fukasawa 表单及 Landing 的正文、页脚表单展示服务端安全错误文案并允许重试；请求完成前禁用重复提交。成功处理后展示同一中性提示。

服务端记录 Mailchimp HTTP 状态、错误标题和异常信息，并移除 API Key、邮箱和 Authorization 内容；不会记录请求头、完整响应或上游 detail。客户端只收到固定错误文案。接口不缓存响应，请求超时为 15 秒。
