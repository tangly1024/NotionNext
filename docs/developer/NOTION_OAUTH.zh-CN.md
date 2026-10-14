# Notion OAuth 授权入口

配置 `OAUTH_CLIENT_ID`、`OAUTH_CLIENT_SECRET`、`OAUTH_REDIRECT_URI`，从 `/api/auth/notion` 开始授权。回调地址可使用 `/api/auth/callback/notion`，也兼容原 `/auth` 入口，需与 Notion 集成配置完全一致。

生产回调地址使用 HTTPS；本机开发可使用 `http://localhost` 或 `http://127.0.0.1`。授权开始时创建有效期 10 分钟的随机 HttpOnly state cookie，回调必须与之匹配，并清除此 cookie。

成功后跳转到固定的 `/auth/result?status=success`。结果页不展示原始 token、个人信息或上游响应，也不把它们写入 URL、页面 props 或日志。授权流程只确认授权：仓库没有消费此 OAuth token 的后续功能，因此不会持久化 token。它不替代 Clerk 登录或管理员权限检查。

未配置或回调地址格式不合法时返回 503；过期、缺失或不匹配的 state 返回 400；token 交换失败返回 502。HTTP 回调仅允许主机名为 `localhost` 或 `127.0.0.1`，其他主机（包括局域网 IP）必须使用 HTTPS。

## 升级说明：授权入口的破坏性变更

升级后必须从本站 `/api/auth/notion` 发起授权，让浏览器先获得 state cookie。旧的直接携带 code 访问回调、直接使用 Notion 集成后台生成的 Authorization URL，或从 Notion 侧发起安装，都缺少本站签发的 state cookie，会返回 400，不能沿用。

请把站内和对外分享的授权链接改为本站 `/api/auth/notion`，并让升级前已打开授权页面的用户重新从该入口开始。Notion 集成后台的回调地址仍需与 `OAUTH_REDIRECT_URI` 完全一致；不要通过移除 state 校验兼容旧链接。
