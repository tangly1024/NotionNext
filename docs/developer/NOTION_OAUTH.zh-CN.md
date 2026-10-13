# Notion OAuth 授权入口

配置 `OAUTH_CLIENT_ID`、`OAUTH_CLIENT_SECRET`、`OAUTH_REDIRECT_URI`，从 `/api/auth/notion` 开始授权。回调地址可使用 `/api/auth/callback/notion`，也兼容原 `/auth` 入口，需与 Notion 集成配置完全一致。

生产回调地址使用 HTTPS；本机开发可使用 `http://localhost` 或 `http://127.0.0.1`。授权开始时创建有效期 10 分钟的随机 HttpOnly state cookie，回调必须与之匹配，并清除此 cookie。

成功后跳转到固定的 `/auth/result?status=success`。结果页不展示原始 token、个人信息或上游响应，也不把它们写入 URL、页面 props 或日志。授权流程只确认授权：仓库没有消费此 OAuth token 的后续功能，因此不会持久化 token。它不替代 Clerk 登录或管理员权限检查。

未配置返回 503；过期、缺失或不匹配的 state 返回 400；token 交换失败返回 502。旧的直接携带 code 访问回调方式需要重新从授权入口开始。
