/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return <style jsx global>{`

    // 底色
    .dark body{
        background-color: black;
    }

    /* ========== 自定义排版优化 ========== */

    /* 文章容器 - 增加宽度和内边距 */
    .notion-page-content,
    article,
    .article-wrapper {
      max-width: 800px !important;
      margin: 0 auto !important;
      padding: 2rem 1.5rem !important;
    }

    /* 段落样式 - 增加间距和行高 */
    .notion-text,
    .notion-paragraph,
    article p,
    .notion-page-content p {
      margin-bottom: 1.5rem !important;
      line-height: 1.8 !important;
      font-size: 16px !important;
      color: #374151 !important;
    }

    /* 深色模式段落 */
    .dark .notion-text,
    .dark .notion-paragraph,
    .dark article p {
      color: #e5e7eb !important;
    }

    /* 标题间距优化 */
    .notion-h1,
    article h1,
    h1.notion-h {
      margin-top: 3rem !important;
      margin-bottom: 1.5rem !important;
      font-size: 2.25rem !important;
      font-weight: 700 !important;
      line-height: 1.3 !important;
    }

    .notion-h2,
    article h2,
    h2.notion-h {
      margin-top: 2.5rem !important;
      margin-bottom: 1rem !important;
      font-size: 1.875rem !important;
      font-weight: 600 !important;
      line-height: 1.4 !important;
    }

    .notion-h3,
    article h3,
    h3.notion-h {
      margin-top: 2rem !important;
      margin-bottom: 0.75rem !important;
      font-size: 1.5rem !important;
      font-weight: 600 !important;
      line-height: 1.4 !important;
    }

    /* 代码块样式优化 */
    .notion-code,
    article pre,
    pre.notion-code,
    pre code {
      margin: 1.5rem 0 !important;
      padding: 1.5rem !important;
      border-radius: 8px !important;
      overflow-x: auto !important;
      background: #f6f8fa !important;
      font-size: 14px !important;
      line-height: 1.6 !important;
      border: 1px solid #e5e7eb !important;
    }

    /* 深色模式代码块 */
    .dark .notion-code,
    .dark article pre,
    .dark pre.notion-code {
      background: #1f2937 !important;
      border-color: #374151 !important;
    }

    /* 行内代码 */
    .notion-inline-code,
    article code:not(pre code),
    code.notion-inline-code {
      padding: 0.2em 0.4em !important;
      margin: 0 0.2em !important;
      background: #f3f4f6 !important;
      border-radius: 4px !important;
      font-size: 0.9em !important;
      color: #dc2626 !important;
    }

    /* 深色模式行内代码 */
    .dark .notion-inline-code,
    .dark article code:not(pre code) {
      background: #374151 !important;
      color: #fca5a5 !important;
    }

    /* 列表样式 */
    .notion-list,
    .notion-bulleted-list,
    .notion-numbered-list,
    article ul,
    article ol {
      margin: 1rem 0 !important;
      padding-left: 2rem !important;
    }

    .notion-list-item,
    article li {
      margin: 0.5rem 0 !important;
      line-height: 1.8 !important;
    }

    /* 引用块样式 */
    .notion-quote,
    article blockquote,
    blockquote.notion-quote {
      margin: 1.5rem 0 !important;
      padding: 1rem 1.5rem !important;
      border-left: 4px solid #3b82f6 !important;
      background: #eff6ff !important;
      font-style: italic !important;
      color: #1e40af !important;
    }

    /* 深色模式引用块 */
    .dark .notion-quote,
    .dark article blockquote {
      background: #1e3a8a !important;
      border-left-color: #60a5fa !important;
      color: #bfdbfe !important;
    }

    /* 图片样式 */
    .notion-image,
    .notion-asset-wrapper,
    article img {
      margin: 2rem auto !important;
      border-radius: 8px !important;
      max-width: 100% !important;
      height: auto !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
    }

    /* 响应式设计 */
    @media (max-width: 768px) {
      .notion-page-content,
      article,
      .article-wrapper {
        padding: 1rem !important;
      }

      .notion-h1,
      article h1 {
        font-size: 1.875rem !important;
      }

      .notion-h2,
      article h2 {
        font-size: 1.5rem !important;
      }

      .notion-h3,
      article h3 {
        font-size: 1.25rem !important;
      }
    }

  `}</style>
}

export { Style }
