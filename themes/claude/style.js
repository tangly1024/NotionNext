/* eslint-disable react/no-unknown-property */
/**
 * Claude Theme - 模仿 Claude Code Docs 的设计风格
 * 包含浅色和深色模式
 * @returns
 */
const Style = () => {
  return (
    <style jsx global>{`
      /* ========================================
       * FONTS
       * ======================================== */
      @font-face {
        font-family: 'Anthropic Serif Display';
        src: url('/themes/claude/fonts/AnthropicSerif-Display-Regular-Static.otf') format('opentype');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Anthropic Serif Display';
        src: url('/themes/claude/fonts/AnthropicSerif-Display-Semibold-Static.otf') format('opentype');
        font-weight: 600;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Anthropic Sans Text';
        src: url('/themes/claude/fonts/AnthropicSans-Text-Regular-Static.otf') format('opentype');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Anthropic Sans Text';
        src: url('/themes/claude/fonts/AnthropicSans-Text-RegularItalic-Static.otf') format('opentype');
        font-weight: 400;
        font-style: italic;
        font-display: swap;
      }
      @font-face {
        font-family: 'Anthropic Sans Text';
        src: url('/themes/claude/fonts/AnthropicSans-Text-Medium-Static.otf') format('opentype');
        font-weight: 500;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Anthropic Sans Text';
        src: url('/themes/claude/fonts/AnthropicSans-Text-Semibold-Static.otf') format('opentype');
        font-weight: 600;
        font-style: normal;
        font-display: swap;
      }

      /* ========================================
       * CSS VARIABLES
       * ======================================== */
      :root {
        --claude-bg: #FAFAF7;
        --claude-bg-secondary: #F3F3EE;
        --claude-text-primary: #1A1A1A;
        --claude-text-secondary: #5C5C5C;
        --claude-text-tertiary: #8C8C8C;
        --claude-border: #E5E5E0;
        --claude-accent: #DA7756;
        --claude-accent-hover: #C06042;
        --claude-sidebar-bg: #F3F3EE;
        --claude-sidebar-active-bg: rgba(218, 119, 86, 0.08);
        --claude-sidebar-active-text: #DA7756;
        --claude-toc-text: #5C5C5C;
        --claude-toc-active-text: #1A1A1A;
        --claude-toc-active-border: #DA7756;
        --claude-code-bg: #FFFFFF;
        --claude-code-border: rgba(0, 0, 0, 0.1);
        --claude-link: #DA7756;
        --claude-blockquote-border: #E5E5E0;
        --claude-heading-font: 'Anthropic Serif Display', Georgia, 'Times New Roman', serif;
        --claude-body-font: 'Anthropic Sans Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        --claude-mono-font: 'JetBrains Mono', 'SF Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace;
      }

      .dark {
        --claude-bg: #1A1915;
        --claude-bg-secondary: #242320;
        --claude-text-primary: #EAEAE6;
        --claude-text-secondary: #A0A09C;
        --claude-text-tertiary: #6E6E6A;
        --claude-border: #333330;
        --claude-accent: #E08A6E;
        --claude-accent-hover: #DA7756;
        --claude-sidebar-bg: #1E1D1A;
        --claude-sidebar-active-bg: rgba(224, 138, 110, 0.1);
        --claude-sidebar-active-text: #E08A6E;
        --claude-toc-text: #A0A09C;
        --claude-toc-active-text: #EAEAE6;
        --claude-toc-active-border: #E08A6E;
        --claude-code-bg: #0B0C0E;
        --claude-code-border: rgba(255, 255, 255, 0.1);
        --claude-link: #E08A6E;
        --claude-blockquote-border: #333330;
      }

      /* ========================================
       * GLOBAL BASE
       * ======================================== */
      html {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      body {
        font-family: var(--claude-body-font);
        background-color: var(--claude-bg);
        color: var(--claude-text-primary);
        transition: background-color 0.2s ease, color 0.2s ease;
        line-height: 1.7;
      }

      .dark body {
        background-color: var(--claude-bg);
        color: var(--claude-text-primary);
      }

      /* ========================================
       * TYPOGRAPHY — HEADINGS
       * ======================================== */
      h1, h2, h3, h4, h5, h6 {
        font-family: var(--claude-heading-font);
        color: var(--claude-text-primary);
        letter-spacing: -0.02em;
        line-height: 1.3;
      }
      h1 { font-weight: 400; font-size: 2rem; }
      h2 { font-weight: 400; font-size: 1.5rem; margin-top: 2em; }
      h3 { font-weight: 400; font-size: 1.25rem; margin-top: 1.5em; }
      h4 { font-weight: 400; font-size: 1.1rem; }

      .dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6 {
        color: var(--claude-text-primary);
      }

      /* ========================================
       * LINKS
       * ======================================== */
      a {
        color: inherit;
        text-decoration: none;
        transition: color 0.15s ease;
      }
      a:hover {
        color: var(--claude-accent);
      }

      /* ========================================
       * THEME CONTAINER
       * ======================================== */
      #theme-claude {
        background-color: var(--claude-bg);
        color: var(--claude-text-primary);
      }
      .dark #theme-claude {
        background-color: var(--claude-bg);
        color: var(--claude-text-primary);
      }

      /* ========================================
       * LEFT SIDEBAR
       * ======================================== */
      .claude-sidebar {
        background-color: var(--claude-sidebar-bg);
        border-right: 1px solid var(--claude-border);
      }
      .dark .claude-sidebar {
        background-color: var(--claude-sidebar-bg);
        border-right-color: var(--claude-border);
      }

      /* Site title in sidebar */
      .claude-site-title {
        font-family: var(--claude-heading-font);
        font-weight: 400;
        font-size: 1.25rem;
        letter-spacing: -0.02em;
        color: var(--claude-text-primary);
      }
      .claude-site-subtitle {
        font-family: var(--claude-body-font);
        font-size: 0.8125rem;
        color: var(--claude-text-tertiary);
        font-weight: 400;
      }

      /* Nav link items in sidebar */
      .claude-nav-link {
        font-family: var(--claude-body-font);
        color: var(--claude-text-secondary);
        font-size: 0.875rem;
        font-weight: 400;
        padding: 0.375rem 0.75rem;
        border-radius: 6px;
        transition: all 0.15s ease;
        display: block;
      }
      .claude-nav-link:hover {
        color: var(--claude-text-primary);
        background-color: rgba(0, 0, 0, 0.04);
      }
      .dark .claude-nav-link:hover {
        background-color: rgba(255, 255, 255, 0.04);
      }
      .claude-nav-link.active {
        background-color: var(--claude-sidebar-active-bg);
        color: var(--claude-sidebar-active-text);
        font-weight: 500;
      }

      /* Social icons in sidebar */
      .claude-social-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0 0.75rem;
      }
      .claude-social-row a {
        color: var(--claude-text-tertiary);
        font-size: 0.9375rem;
        transition: color 0.15s ease, transform 0.15s ease;
        display: inline-flex;
      }
      .claude-social-row a:hover {
        color: var(--claude-text-primary);
        transform: scale(1.15);
      }

      /* ========================================
       * NOTION CONTENT OVERRIDES
       * ======================================== */
      .notion {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }
      .notion-page {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }

      /* Links inside article */
      #article-wrapper a {
        color: var(--claude-link);
        text-decoration: underline;
        text-decoration-color: rgba(218, 119, 86, 0.3);
        text-underline-offset: 3px;
        text-decoration-thickness: 1px;
        transition: text-decoration-color 0.15s ease;
      }
      #article-wrapper a:hover {
        text-decoration-color: var(--claude-link);
      }

      /* Blockquotes */
      .notion-quote {
        border-left: 3px solid var(--claude-blockquote-border) !important;
        padding-left: 1.5rem !important;
        color: var(--claude-text-secondary) !important;
        font-style: normal !important;
      }

      /* Lists */
      .notion-list {
        color: var(--claude-text-primary);
      }

      /* Horizontal rule */
      .notion-hr {
        border-color: var(--claude-border) !important;
      }

      /* ========================================
       * CODE BLOCKS — Claude Docs style
       * rounded-2xl, white bg, thin scrollbar, copy button
       * ======================================== */
      .notion-code {
        background: var(--claude-code-bg) !important;
        border: 1px solid var(--claude-code-border) !important;
        border-radius: 1rem !important;
        font-family: var(--claude-mono-font) !important;
        font-size: 0.875rem !important;
        line-height: 1.5rem !important;
        padding: 0.875rem 1rem !important;
        position: relative !important;
        overflow-x: auto !important;
        font-variant-ligatures: none;
      }

      /* Code block copy button — match Claude top-right style */
      .notion-code .notion-code-copy-button,
      .notion-code button[aria-label*="copy" i],
      .notion-code button[aria-label*="Copy" i] {
        position: absolute !important;
        top: 0.75rem !important;
        right: 1rem !important;
        width: 26px !important;
        height: 26px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 0.375rem !important;
        backdrop-filter: blur(4px) !important;
        background: transparent !important;
        border: none !important;
        color: var(--claude-text-tertiary) !important;
        cursor: pointer !important;
        opacity: 0 !important;
        transition: opacity 0.15s ease, color 0.15s ease !important;
        z-index: 2 !important;
      }
      .notion-code:hover .notion-code-copy-button,
      .notion-code:hover button[aria-label*="copy" i],
      .notion-code:hover button[aria-label*="Copy" i] {
        opacity: 1 !important;
      }
      .notion-code .notion-code-copy-button:hover,
      .notion-code button[aria-label*="copy" i]:hover,
      .notion-code button[aria-label*="Copy" i]:hover {
        color: var(--claude-text-primary) !important;
      }

      /* Code block language label */
      .notion-code > .notion-code-copy {
        position: absolute !important;
        top: 0 !important;
        right: 0 !important;
      }

      /* Inline code */
      .notion-inline-code {
        background: var(--claude-bg-secondary) !important;
        color: var(--claude-text-primary) !important;
        border: none !important;
        border-radius: 0.375rem !important;
        padding: 0.125rem 0.5rem !important;
        font-size: 0.85em !important;
        font-family: var(--claude-mono-font) !important;
        overflow-wrap: break-word;
        word-break: break-word;
      }

      /* ========================================
       * TABLE OF CONTENTS (RIGHT SIDEBAR)
       * Claude Code Docs "On this page" style
       * No left-border — uses font weight + color
       * Light: active = bold black; Dark: active = terracotta
       * ======================================== */
      .catalog-wrapper {
        padding: 0;
        font-family: var(--claude-body-font);
      }

      /* TOC title — clickable, scrolls to top */
      .catalog-title {
        font-family: var(--claude-body-font) !important;
        font-weight: 600 !important;
        font-size: 0.875rem !important;
        color: var(--claude-text-primary) !important;
        text-transform: none !important;
        letter-spacing: normal !important;
        margin-bottom: 1rem;
        padding: 0;
        transition: color 0.15s ease;
      }
      .catalog-title:hover {
        color: var(--claude-accent) !important;
      }

      /* TOC nav container */
      .toc-nav {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }

      /* TOC items — base */
      .toc-item {
        font-size: 0.875rem;
        line-height: 1.6;
        padding: 0.1875rem 0;
        cursor: pointer;
        text-decoration: none !important;
      }

      /* Inactive state — gray text */
      .toc-item.toc-inactive {
        color: var(--claude-text-tertiary);
        font-weight: 400;
      }
      .toc-item.toc-inactive:hover {
        color: var(--claude-text-secondary);
      }

      /* Highlighted state — ancestor of active item */
      /* Light mode: bold black; Dark mode: terracotta */
      .toc-item.toc-highlighted {
        color: var(--claude-text-primary);
        font-weight: 600;
      }
      .dark .toc-item.toc-highlighted {
        color: var(--claude-accent);
        font-weight: 600;
      }

      /* Active state — the exact current section */
      /* Light mode: bold black; Dark mode: terracotta */
      .toc-item.toc-active {
        color: var(--claude-text-primary);
        font-weight: 600;
      }
      .dark .toc-item.toc-active {
        color: var(--claude-accent);
        font-weight: 600;
      }

      /* L3 items appear with a smooth animation */
      .toc-item {
        animation: tocFadeIn 0.2s ease-out;
      }
      @keyframes tocFadeIn {
        from { opacity: 0; transform: translateY(-4px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* TOC scrollbar */
      .catalog-list {
        scrollbar-width: none;
      }
      .catalog-list::-webkit-scrollbar {
        display: none;
      }

      /* ========================================
       * BLOG NAME / HEADER (in sidebar)
       * ======================================== */
      #blog-name, #blog-name-en {
        font-family: var(--claude-heading-font);
        font-weight: 400;
        letter-spacing: -0.02em;
        color: var(--claude-text-primary);
      }

      /* ========================================
       * SCROLLBAR — Global minimalist
       * ======================================== */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.08);
        border-radius: 3px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.15);
      }
      .dark ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.08);
      }
      .dark ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.15);
      }

      /* Code block scrollbar — thin rounded */
      .notion-code::-webkit-scrollbar,
      pre::-webkit-scrollbar {
        height: 6px;
        width: 6px;
      }
      .notion-code::-webkit-scrollbar-track,
      pre::-webkit-scrollbar-track {
        background: transparent;
      }
      .notion-code::-webkit-scrollbar-thumb,
      pre::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.12);
        border-radius: 3px;
      }
      .notion-code::-webkit-scrollbar-thumb:hover,
      pre::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.2);
      }
      .dark .notion-code::-webkit-scrollbar-thumb,
      .dark pre::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.15);
      }
      .dark .notion-code::-webkit-scrollbar-thumb:hover,
      .dark pre::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.25);
      }
      /* Firefox */
      .notion-code, pre {
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.12) transparent;
      }
      .dark .notion-code, .dark pre {
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
      }

      /* ========================================
       * ARTICLE LIST ITEMS
       * ======================================== */
      .claude-article-item {
        border-bottom: 1px solid var(--claude-border);
        padding-bottom: 1.25rem;
        margin-bottom: 1.25rem;
      }
      .claude-article-item:last-child {
        border-bottom: none;
      }

      /* ========================================
       * FOOTER
       * ======================================== */
      .claude-footer {
        font-size: 0.75rem;
        color: var(--claude-text-tertiary);
        padding: 0.75rem;
      }

      /* Hide scrollbar utility */
      .scroll-hidden::-webkit-scrollbar {
        display: none;
      }
      .scroll-hidden {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}</style>
  )
}

export { Style }
