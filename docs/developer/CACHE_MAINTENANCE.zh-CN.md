# 数据缓存与页面重建

维护接口只接受 POST，并返回 `Cache-Control: no-store`。未配置令牌时返回 503，错误令牌返回 401。

- `/api/cache` 使用 `Authorization: Bearer <CACHE_REVALIDATION_TOKEN>`，清理文件、内存和已配置的 Redis 数据缓存；不会自动重建 ISR 页面。
- `/api/revalidate` 使用 `Authorization: Bearer <REVALIDATION_TOKEN>`，按请求范围重建页面。兼容请求体中的 `token` 字段。

请求体支持 `{"path":"/article/example"}`、`{"paths":["/","/article/example"]}` 或 `{"all":true}`。批量输入限制为 1 至 500 个站内路径；不接受完整 URL、API 路径、查询参数或路径穿越片段。

单页和 `paths` 请求默认只重建明确指定的页面，不清空数据缓存，也不自动重建其他语言或列表入口。这保留了单页 webhook 的原有成本；页面仍受底层数据缓存有效期影响。如果必须立即读取新数据，可以显式传入 `{"path":"/article/example","invalidateData":true}`。该选项会清空全站数据缓存，但仍只重建指定路径，宜用于低频人工维护。需要联动的首页、分类或标签页应由调用方放入 `paths`。

`all: true` 会先收集旧路径、清空数据缓存，再收集新路径，覆盖新旧文章、首页、归档、搜索、分类、标签及列表分页，包含配置的语言前缀和构建清单中的历史路径。可用 `paths` 同时补充已知历史 URL。`all: true` 不能与 `invalidateData: false` 同时使用。

Vercel Hobby 旧版计算模式的函数上限为 60 秒，因此 `/api/cache` 和 `/api/revalidate` 均设置了 60 秒上限以兼容未启用 Fluid Compute 的项目。所有请求默认最多重建 25 个路径，可设置整数 `batchSize`（1 至 50）。每批最多并发 3 个页面，运行 45 秒后停止发起新的页面重建，为 Hobby 函数留出返回续传结果的时间。响应中的 `results` 仅包含本批已尝试的页面，`remainingPaths` 是尚未尝试的路径；`complete` 表示没有剩余路径，并不代表全部成功。HTTP 200 表示全部完成且成功，202 表示本批成功但仍有剩余路径，任一已尝试页面失败返回 500，缓存清理或路径发现失败返回 503。

大站点调用流程：

1. 首次发送 `{"all":true,"batchSize":25}`，保存响应中的 `remainingPaths`。
2. 将待处理路径按数量（最多 500 个）和请求体大小（最多 32 KB）拆分，发送 `{"paths":[...],"batchSize":25}`；合并本次响应的剩余路径与本地尚未发送的路径。
3. 重复步骤 2，直至待处理路径为空。将 `results` 中 `revalidated: false` 的路径单独记录并按需重试。

续传不要再传 `all: true` 或 `invalidateData: true`，以免重新清理数据与发现全站路径。这里采用调用方保存进度的同步批次，不在 Serverless 请求结束后运行后台任务。45 秒预算不能中断已经开始的路径发现、缓存清理或 `res.revalidate`；这些步骤本身若超过平台上限，仍可能被平台终止。遇到单页渲染较慢的情况，应减小 `batchSize`，部署平台超时后可安全重试该批路径。

每次数据清理（`/api/cache`、`all: true` 或 `invalidateData: true`）都会更换缓存版本，清理前启动的请求即使后来完成，也不会覆盖新版本的数据。版本号在进程内缓存 1 秒，合并并发读取，避免每次缓存访问都额外读取 Redis 或同步文件；轮换版本后等待 1 秒传播窗口，再完成清理并开始页面重建。

**AI 摘要与调用费用：** `ai_summary_*` 与 Notion 数据共用缓存版本和清理范围。以上任一数据清理操作都会使已缓存的 AI 摘要失效，即使 `AI_SUMMARY_CACHE_TIME` 尚未到期；配置 `AI_SUMMARY_API` 的站点在后续页面重建或访问时可能再次调用摘要服务并产生费用。高频 webhook 宜使用默认的 `path` / `paths` 请求，按需集中执行全量失效。当前维护接口没有保留 AI 摘要的选项；需要跨全量清理复用付费摘要时，应在摘要服务端另行缓存。

**HTTP 状态与重试：** 旧版部分页面重建失败仍返回 200，现在任一已尝试页面失败都会返回 500。即使收到 500，也应读取 JSON 中的 `results` 和 `remainingPaths`：失败页在 `results` 中，不会重复放入 `remainingPaths`；`complete: true` 仅表示所有路径都已尝试。将失败页与尚未尝试的路径合并去重后，以不带 `all` / `invalidateData` 的 `paths` 请求继续处理，避免重复刷新已经成功的页面。

不要为带 `all: true` 或 `invalidateData: true` 的请求配置自动重试；重放会再次清理数据，全站请求还会重新发现路径，并可能重复调用付费摘要 API。收到 503、连接中断或平台超时时，数据清理可能已经执行；先核对服务端日志和已保存的进度，仅对已知路径使用普通 `paths` 请求重试。没有拿到完整路径计划时，应由运维确认是否重新发起全量维护。

**多实例与 Serverless 部署要求：** 所有提供页面数据的实例必须使用同一 `REDIS_URL` 和 Notion 根页面配置，才能共享版本及清理结果。仅使用内存或本地文件时，清理无法使其他隔离实例失效，`res.revalidate` 可能命中其他实例旧数据，不能保证全站立即更新。同一主机的进程也必须共享文件缓存目录。Redis 和内存键按 Notion 根页面配置区分站点；生产共享 Redis 的可用性仍是同步失效的前提。

不在旧站点数据或构建清单中的历史运行时 URL 无法枚举，应通过 `paths` 明确刷新。

回归验证包含真实临时目录中的版本号读写、原子替换和独立模块实例测试。Redis 集成测试须显式配置独立测试实例 `NOTIONNEXT_TEST_REDIS_URL`，然后运行 `yarn jest __tests__/lib/cache/redis.integration.test.js --runInBand`；未配置时跳过，不会连接站点的 `REDIS_URL`。该测试使用随机命名空间，验证真实版本读写及多批 `SCAN` 清理，不执行 `FLUSHDB`。
