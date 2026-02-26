/**
 * 文章相关功能
 */
module.exports = {
  // 文章URL前缀
  POST_URL_PREFIX: process.env.NEXT_PUBLIC_POST_URL_PREFIX ?? 'article',
  // POST类型文章的默认路径前缀，例如默认POST类型的路径是  /article/[slug]
  // 如果此项配置为 '' 空， 则文章将没有前缀路径
  // 支援類似 WP 可自訂文章連結格式的功能：https://wordpress.org/documentation/article/customize-permalinks/，目前只先實作 %year%/%month%/%day%
  // 例：如想連結改成前綴 article + 時間戳記，可變更為： 'article/%year%/%month%/%day%'

  POST_SCHEDULE_PUBLISH:
    process.env.NEXT_PUBLIC_NOTION_SCHEDULE_PUBLISH || true, // 按照文章的发布时间字段，控制自动上下架

  // 分享条
  POST_SHARE_BAR_ENABLE: process.env.NEXT_PUBLIC_POST_SHARE_BAR || 'true', //文章底部分享条开关
  POSTS_SHARE_SERVICES:
    process.env.NEXT_PUBLIC_POST_SHARE_SERVICES ||
    'link,wechat,qq,weibo,email,facebook,twitter,telegram,messenger,line,reddit,whatsapp,linkedin,csdn,juejin', // 分享的服務，按顺序显示,逗号隔开
  // 所有支持的分享服务：link(复制链接),wechat(微信),qq,weibo(微博),email(邮件),facebook,twitter,telegram,messenger,line,reddit,whatsapp,linkedin,vkshare,okshare,tumblr,livejournal,mailru,viber,workplace,pocket,instapaper,hatena

  POST_TITLE_ICON: process.env.NEXT_PUBLIC_POST_TITLE_ICON || true, // 是否显示标题icon
  POST_DISABLE_GALLERY_CLICK:
    process.env.NEXT_PUBLIC_POST_DISABLE_GALLERY_CLICK || false, // 画册视图禁止点击，方便在友链页面的画册插入链接
  POST_LIST_STYLE: process.env.NEXT_PUBLIC_POST_LIST_STYLE || 'page', // ['page','scroll] 文章列表样式:页码分页、单页滚动加载
  POST_LIST_PREVIEW: process.env.NEXT_PUBLIC_POST_PREVIEW || 'false', //  是否在列表加载文章预览
  POST_PREVIEW_LINES: process.env.NEXT_PUBLIC_POST_POST_PREVIEW_LINES || 12, // 预览博客行数
  POST_RECOMMEND_COUNT: process.env.NEXT_PUBLIC_POST_RECOMMEND_COUNT || 6, // 推荐文章数量
  POSTS_PER_PAGE: process.env.NEXT_PUBLIC_POST_PER_PAGE || 12, // post counts per page
  POSTS_SORT_BY: process.env.NEXT_PUBLIC_POST_SORT_BY || 'notion', // 排序方式 'date'按时间,'notion'由notion控制

  // 文章过期提醒配置 p.s. 目前此功能暂时只适用于heo主题
  ARTICLE_EXPIRATION_DAYS:
    process.env.NEXT_PUBLIC_ARTICLE_EXPIRATION_DAYS || 90, // 文章过期提醒阈值（天）
  ARTICLE_EXPIRATION_MESSAGE:
    process.env.NEXT_PUBLIC_ARTICLE_EXPIRATION_MESSAGE ||
    '这篇文章发布于 %%DAYS%% 天前，内容可能已过时，请谨慎参考。', // 过期提示信息，使用 %%DAYS%% 作为天数占位符
  ARTICLE_EXPIRATION_ENABLED:
    process.env.NEXT_PUBLIC_ARTICLE_EXPIRATION_ENABLED || 'false', // 是否启用文章过期提醒

  POST_WAITING_TIME_FOR_404:
    process.env.NEXT_PUBLIC_POST_WAITING_TIME_FOR_404 || '8', // 文章加载超时时间，单位秒；超时后跳转到404页面

  // 标签相关
  TAG_SORT_BY_COUNT: true, // 标签是否按照文章数量倒序排列，文章多的标签排在前。
  IS_TAG_COLOR_DISTINGUISHED:
    process.env.NEXT_PUBLIC_IS_TAG_COLOR_DISTINGUISHED === 'true' || true // 对于名称相同的tag是否区分tag的颜色
}
