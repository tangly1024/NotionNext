/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return <style jsx global>{`
    html {
      --scrollbarBG: #ffffff00;
      --thumbBG: #b8b8b8;
    }

    body {
      scrollbar-width: thin;
      scrollbar-color: var(--thumbBG) var(--scrollbarBG);
      background-color: #ffffff;
    }

    .dark body {
      background-color: #18181b;
    }

    body::-webkit-scrollbar {
      width: 5px;
    }

    body::-webkit-scrollbar-track {
      background: var(--scrollbarBG);
    }

    body::-webkit-scrollbar-thumb {
      background-color: var(--thumbBG);
    }

    ::selection {
      background: rgba(45, 170, 219, 0.3);
    }

    #theme-nobelium .blog-logo {
      width: 24px;
      height: 24px;
      border-radius: 50% !important;
      object-fit: cover;
    }

    #theme-nobelium .utterances {
      max-width: none !important;
    }

    #theme-nobelium .sticky-nav {
      position: sticky;
      z-index: 10;
      top: -1px;
      backdrop-filter: blur(5px);
      transition: all 0.5s cubic-bezier(0.4, 0, 0, 1);
      border-bottom-color: transparent;
    }

    #theme-nobelium .remove-sticky {
      position: unset;
    }

    #theme-nobelium .sticky-nav-full {
      border-bottom: 1px solid rgba(229, 231, 235, 0.5);
    }

    .dark #theme-nobelium .sticky-nav-full {
      border-bottom-color: rgba(75, 85, 99, 0.5);
    }

    #theme-nobelium .header-name {
      display: none;
      opacity: 0;
      overflow: hidden;
    }

    #theme-nobelium .sticky-nav-full .nav {
      color: #4b5563;
    }

    .dark #theme-nobelium .sticky-nav-full .nav {
      color: #d1d5db;
    }

    #theme-nobelium nav {
      flex-wrap: wrap;
      line-height: 1.5em;
    }

    #theme-nobelium .article-tags::-webkit-scrollbar,
    #theme-nobelium .tag-container ul::-webkit-scrollbar {
      width: 0 !important;
    }

    #theme-nobelium .tag-container ul {
      -ms-overflow-style: none;
      overflow: -moz-scrollbars-none;
      user-select: none;
    }

    #theme-nobelium .notion {
      color: #4b5563;
      overflow-wrap: break-word;
    }

    .dark #theme-nobelium .notion {
      color: #d1d5db;
    }

    #theme-nobelium .notion,
    #theme-nobelium .notion-text,
    #theme-nobelium .notion-quote,
    #theme-nobelium .notion-h-title {
      line-height: 1.8rem;
      padding: 0;
      margin: 0.75rem 0;
    }

    #theme-nobelium .notion-page-link {
      color: inherit;
    }

    #theme-nobelium svg.notion-page-icon {
      display: none;
    }

    #theme-nobelium svg + .notion-page-title-text {
      border-bottom: 0;
    }

    #theme-nobelium .notion-bookmark {
      border: 1px solid #f3f4f6;
      color: inherit;
    }

    #theme-nobelium .notion-bookmark .notion-bookmark-title,
    #theme-nobelium .notion-bookmark .notion-bookmark-link div {
      color: #111827;
    }

    .dark #theme-nobelium .notion-bookmark .notion-bookmark-title,
    .dark #theme-nobelium .notion-bookmark .notion-bookmark-link div {
      color: #e5e7eb;
    }

    #theme-nobelium .notion-bookmark .notion-bookmark-description {
      color: #4b5563;
    }

    .dark #theme-nobelium .notion-bookmark .notion-bookmark-description {
      color: #d1d5db;
    }

    #theme-nobelium .notion-code > code {
      color: #111827;
    }

    #theme-nobelium pre[class*='language-'] {
      line-height: inherit;
    }

    #theme-nobelium .notion-bookmark:hover {
      border-color: #60a5fa;
    }

    #theme-nobelium .notion-viewport {
      z-index: -10;
    }

    #theme-nobelium .notion-asset-caption {
      color: #6b7280;
      text-align: center;
    }

    .dark #theme-nobelium .notion-asset-caption {
      color: #9ca3af;
    }

    #theme-nobelium .notion-full-width,
    #theme-nobelium .notion-page {
      padding-left: 0;
      padding-right: 0;
    }

    #theme-nobelium .notion-page {
      width: auto;
    }

    #theme-nobelium .notion-quote {
      padding: 0.2em 0.9em;
    }

    #theme-nobelium .notion-collection-row {
      display: none;
    }

    #theme-nobelium .notion-list li {
      padding-top: 0;
      padding-bottom: 0;
    }

    #theme-nobelium .notion-hr {
      border-width: 2px;
    }

    @media (min-width: 768px) {
      #theme-nobelium .sticky-nav-full {
        max-width: 100%;
      }

      #theme-nobelium .header-name {
        display: block;
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.4, 0, 0, 1);
      }

      #theme-nobelium .sticky-nav-full .header-name,
      #theme-nobelium .homepage-nav .header-name {
        opacity: 1;
        color: #4b5563;
      }

      .dark #theme-nobelium .sticky-nav-full .header-name,
      .dark #theme-nobelium .homepage-nav .header-name {
        color: #d1d5db;
      }
    }

    @supports not (backdrop-filter: none) {
      #theme-nobelium .sticky-nav {
        backdrop-filter: none;
        background-color: rgba(255, 255, 255, 0.9);
      }

      .dark #theme-nobelium .sticky-nav {
        background-color: rgba(24, 24, 27, 0.9);
      }
    }

  `}</style>
}

export { Style }
