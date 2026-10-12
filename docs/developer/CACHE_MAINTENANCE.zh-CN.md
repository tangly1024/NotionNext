# 数据缓存与页面重建

维护接口只接受 POST，并返回 `Cache-Control: no-store`。未配置令牌时返回 503，错误令牌返回 401。

- `/api/cache` 使用 `Authorization: Bearer <CACHE_REVALIDATION_TOKEN>`，清理文件、内存和已配置的 Redis 数据缓存；不会自动重建 ISR 页面。
- `/api/revalidate` 使用 `Authorization: Bearer <REVALIDATION_TOKEN>`，先使数据缓存失效，再读取新数据并重建页面。兼容请求体中的 `token` 字段。

请求体支持 `{"path":"/article/example"}`、`{"paths":["/","/article/example"]}` 或 `{"all":true}`。批量输入限制为 1 至 500 个站内路径；不接受完整 URL、API 路径、查询参数或路径穿越片段。

全站请求覆盖新旧文章、首页、归档、搜索、分类、标签及列表分页，包含配置的语言前缀和构建清单中的历史路径。单页请求同时刷新列表入口。响应 `results` 逐项报告结果，任何页面失败均返回 HTTP 500，缓存清理或路径发现失败返回 503。

每次维护都会更换缓存版本，清理前启动的请求即使后来完成，也不会覆盖新版本的数据。同一主机使用文件版本标记；配置 Redis 时通过 Redis 同步多主机版本，Redis 和内存键按 Notion 根页面配置区分站点。隔离的 Serverless 实例需使用共享 Redis。

不在旧站点数据或构建清单中的历史运行时 URL 无法枚举，应通过 `paths` 明确刷新。全站重建仍受平台超时和执行资源限制，大站可分批处理并重试失败路径。
