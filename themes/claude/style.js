/* eslint-disable react/no-unknown-property */
/**
 * Claude Theme — 模仿 Claude Code Docs 的设计风格
 * 包含浅色和深色模式
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
        --claude-gh-blue-bg: rgb(9, 105, 218);
        --claude-gh-blue-bg-rgb: 9 105 218;
        --claude-bg: #fff;
        --claude-bg-secondary: #F3F3EE;
        --claude-text-primary: #1A1A1A;
        --claude-text-strong: var(--claude-text-primary);
        --tw-prose-code: #111827;
        --claude-text-secondary: #5C5C5C;
        --claude-text-tertiary: #8C8C8C;
        --claude-border: #E5E5E0;
        --claude-accent: #DA7756;
        --claude-accent-hover: #C06042;
        --claude-sidebar-bg: var(--claude-bg-secondary);
        --claude-sidebar-active-bg: rgba(218, 119, 86, 0.08);
        --claude-sidebar-active-text: var(--claude-accent);
        --claude-profile-name: var(--claude-gh-fg-default);
        --claude-profile-muted: #57606A;
        --claude-profile-border: #D0D7DE;
        --claude-profile-border-strong: #D8DEE4;
        --claude-profile-divider-border: rgb(209 217 224 / 0.7);
        --claude-profile-contact-hover: #24292F;
        --claude-home-card-bg: #F6F8FA;
        --claude-home-card-border: var(--claude-gh-border);
        --claude-home-link: var(--claude-gh-blue-bg);
        --claude-contrib-l0: #EFF2F5;
        --claude-contrib-l1: #ACEEBB;
        --claude-contrib-l2: #4AC26B;
        --claude-contrib-l3: #2DA44E;
        --claude-contrib-l4: #116329;
        --claude-contrib-border: #1F23280D;
        --claude-contrib-label: var(--claude-gh-fg-default);
        --claude-code-bg: var(--claude-bg);
        --claude-code-border: rgb(222 222 222);
        --claude-code-shell-bg: rgb(243 243 243);
        --claude-code-shell-border: rgba(255, 255, 255, 0.1);
        --claude-code-shell-text: rgb(10 10 10);
        --claude-code-text: #657b83;
        --claude-code-token-comment: #93a1a1;
        --claude-code-token-punctuation: #586e75;
        --claude-code-token-keyword: #859900;
        --claude-code-token-string: #2aa198;
        --claude-code-token-number: #268bd2;
        --claude-code-token-function: #b58900;
        --claude-code-token-operator: #657b83;
        --claude-code-token-class-name: #b58900;
        --claude-code-token-attr-name: #2aa198;
        --claude-code-token-tag: #268bd2;
        --claude-code-token-property: #268bd2;
        --claude-code-token-atrule: #859900;
        --claude-code-token-url: #2aa198;
        --claude-code-token-variable: #cb4b16;
        --claude-code-token-important: #cb4b16;
        --claude-code-token-entity: #657b83;
        --claude-code-token-css-string: #2aa198;
        --claude-link: var(--claude-accent);
        --claude-blockquote-border: var(--claude-border);
        --claude-callout-tip-bg: rgb(240 253 244);
        --claude-callout-tip-border: rgb(187 247 208);
        --claude-callout-tip-text: rgb(22, 101, 52);
        --claude-gh-fg-default: rgb(31, 35, 40);
        --claude-gh-fg-muted: rgb(89, 99, 110);
        --claude-gh-border: rgb(209, 217, 224);
        --claude-gh-link: var(--claude-gh-blue-bg);
        --claude-gh-link-hover-bg: rgb(var(--claude-gh-blue-bg-rgb) / 0.08);
        --claude-year-filter-text: var(--claude-gh-fg-muted);
        --claude-year-filter-text-active: #fff;
        --claude-activity-empty-color: var(--claude-gh-fg-muted);
        --claude-gh-font-family: -apple-system, system-ui, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
        --claude-timeline-line: rgba(209, 217, 224, 0.7);
        --claude-badge-bg: rgb(246, 248, 250);
        --claude-badge-border: rgb(255, 255, 255);
        --claude-subpage-bg-light: rgb(253 253 247);
        --claude-heading-font: 'Anthropic Serif Display', Georgia, 'Times New Roman', serif;
        --claude-body-font: 'Anthropic Sans Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        --font-jetbrains-mono: "JetBrains Mono", "JetBrains Mono Fallback", SF Mono, SFMono-Regular, Menlo, Monaco, Cascadia Mono, Segoe UI Mono, Roboto Mono, Oxygen Mono, Ubuntu Monospace, Source Code Pro, Fira Mono, Droid Sans Mono, Consolas, Courier New, monospace;
        --claude-mono-font: var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        --claude-terminal-bg: #ffffff;
        --claude-terminal-bar-bg: #f6f8fa;
        --claude-terminal-border: var(--claude-profile-border);
        --claude-terminal-text: #24292f;
        --claude-terminal-prompt: #57606a;
        --claude-terminal-dot-red: #f85149;
        --claude-terminal-dot-amber: #d29922;
        --claude-terminal-dot-green: #3fb950;
      }

      .dark,
      html[data-theme='dark'] {
        --claude-gh-blue-bg: rgb(31, 111, 235);
        --claude-gh-blue-bg-rgb: 31 111 235;
        --claude-bg: #1A1915;
        --claude-bg-secondary: #242320;
        --claude-text-primary: #9E9E9E;
        --claude-text-strong: #FFFFFF;
        --tw-prose-code: #fff;
        --claude-text-secondary: #A0A09C;
        --claude-text-tertiary: #6E6E6A;
        --claude-border: #333330;
        --claude-accent: #D4A27F;
        --claude-accent-hover: #DA7756;
        --claude-sidebar-bg: #1E1D1A;
        --claude-sidebar-active-bg: rgba(224, 138, 110, 0.1);
        --claude-sidebar-active-text: #E08A6E;
        --claude-profile-name: var(--claude-gh-fg-default);
        --claude-profile-muted: #8B949E;
        --claude-profile-border: #30363D;
        --claude-profile-border-strong: var(--claude-profile-border);
        --claude-profile-divider-border: rgb(48 54 61 / 0.7);
        --claude-profile-contact-hover: var(--claude-gh-fg-default);
        --claude-home-card-bg: rgb(255 255 255 / 0.03);
        --claude-home-card-border: rgb(61, 68, 77);
        --claude-contrib-l0: #151B23;
        --claude-contrib-l1: #033A16;
        --claude-contrib-l2: #196C2E;
        --claude-contrib-l3: #2EA043;
        --claude-contrib-l4: #56D364;
        --claude-contrib-border: var(--claude-profile-border);
        --claude-contrib-label: var(--claude-gh-fg-default);
        --claude-code-bg: var(--claude-bg);
        --claude-code-border: rgba(255, 255, 255, 0.1);
        --claude-code-shell-bg: rgb(255 255 255 / 0.05);
        --claude-code-shell-border: rgba(255, 255, 255, 0.1);
        --claude-code-shell-text: #D4D4D4;
        --claude-code-text: #f8f8f2;
        --claude-code-token-comment: #8292a2;
        --claude-code-token-punctuation: #f8f8f2;
        --claude-code-token-keyword: #66d9ef;
        --claude-code-token-string: #a6e22e;
        --claude-code-token-number: #ae81ff;
        --claude-code-token-function: #e6db74;
        --claude-code-token-operator: #f8f8f2;
        --claude-code-token-class-name: #e6db74;
        --claude-code-token-attr-name: #a6e22e;
        --claude-code-token-tag: #f92672;
        --claude-code-token-property: #f92672;
        --claude-code-token-atrule: #e6db74;
        --claude-code-token-url: #f8f8f2;
        --claude-code-token-variable: #f8f8f2;
        --claude-code-token-important: #fd971f;
        --claude-code-token-entity: #f8f8f2;
        --claude-code-token-css-string: #f8f8f2;
        --claude-link: var(--claude-sidebar-active-text);
        --claude-dark-quote: rgb(134, 239, 172);
        --claude-blockquote-border: var(--claude-border);
        --claude-callout-tip-bg: rgba(22, 163, 74, 0.2);
        --claude-callout-tip-border: rgb(20, 83, 45);
        --claude-callout-tip-text: rgb(134, 239, 172);
        --claude-gh-fg-default: rgb(240, 246, 252);
        --claude-gh-fg-muted: #9198a1;
        --claude-gh-border: rgb(61, 68, 77);
        --claude-gh-link-hover-bg: rgb(var(--claude-gh-blue-bg-rgb) / 0.12);
        --claude-activity-empty-color: var(--claude-gh-fg-muted);
        --claude-timeline-line: rgba(61, 68, 77, 0.7);
        --claude-badge-bg: rgb(33, 40, 48);
        --claude-badge-border: rgb(13, 17, 23);
        --claude-terminal-bg: #0d1117;
        --claude-terminal-bar-bg: #161b22;
        --claude-terminal-border: #30363d;
        --claude-terminal-text: #e6edf3;
        --claude-terminal-prompt: #8b949e;
      }

      /* ========================================
       * GLOBAL BASE
       * ======================================== */
      html {
        -webkit-font-smoothing: auto;
        -moz-osx-font-smoothing: auto;
      }
      html.light,
      html[data-theme='light'] {
        color-scheme: light;
      }
      html.dark,
      html[data-theme='dark'] {
        color-scheme: dark;
      }
      body {
        font-family: var(--claude-body-font);
        background-color: var(--claude-bg);
        color: var(--claude-text-primary);
        font-size: 0.9375rem;
        line-height: 1.7;
      }

      /* Image protection (Claude theme scope) */
      #theme-claude img {
        user-select: none;
        -webkit-user-drag: none;
        -webkit-touch-callout: none;
      }

      /* ========================================
       * TYPOGRAPHY — HEADINGS
       * ======================================== */
      h1, h2, h3, h4, h5, h6 {
        font-family: var(--claude-heading-font);
        color: var(--claude-text-strong);
        letter-spacing: -0.02em;
        line-height: 1.3;
      }
      h1 { font-weight: 400; font-size: 1.75rem; }
      h2 { font-weight: 400; font-size: 1.375rem; margin-top: 2em; }
      h3 { font-weight: 400; font-size: 1.125rem; margin-top: 1.5em; }
      h4 { font-weight: 400; font-size: 1rem; }

      /* ========================================
       * LINKS — no double underlines
       * ======================================== */
      a {
        color: inherit;
        text-decoration: none;
        transition: color 0.15s ease;
      }
      a:hover {
        color: var(--claude-accent);
      }

      /* Article links — terracotta, no underline (Notion already renders its own) */
      #article-wrapper .notion-text {
        font-weight: 400;
      }
      #article-wrapper a {
        color: var(--claude-link);
      }
      #article-wrapper a:hover {
        opacity: 0.8;
      }
      /* Remove Notion's own underline styling for cleaner look if desired */
      #article-wrapper .notion-link {
        border-bottom: none !important;
        text-decoration: underline !important;
        text-decoration-color: rgba(218, 119, 86, 0.3);
        text-underline-offset: 3px;
        text-decoration-thickness: 1px;
      }
      #article-wrapper .notion-link:hover {
        text-decoration-color: var(--claude-link);
      }
      .dark #article-wrapper .notion-link {
        color: var(--claude-text-strong) !important;
        text-decoration-color: var(--claude-accent) !important;
        opacity: 1 !important;
      }
      .dark #article-wrapper .notion-link:hover {
        text-decoration-thickness: 2px !important;
      }
      .dark #article-wrapper .notion-quote .notion-link,
      .dark #article-wrapper .notion-quote a {
        color: var(--claude-callout-tip-text) !important;
        text-decoration-color: var(--claude-callout-tip-text) !important;
        border-bottom-color: var(--claude-callout-tip-text) !important;
      }

      /* ========================================
       * THEME CONTAINER — no transition to prevent reflow
       * ======================================== */
      #theme-claude {
        background-color: var(--claude-bg);
        color: var(--claude-text-primary);
      }
      .light #theme-claude.claude-page-subpage {
        background-color: var(--claude-subpage-bg-light);
      }
      /* ========================================
       * LEFT SIDEBAR — safe to transition (fixed width, no reflow)
       * ======================================== */
      .claude-sidebar {
        background-color: var(--claude-sidebar-bg);
        border-right: 1px solid var(--claude-border);
        transition: background-color 0.15s ease, border-color 0.15s ease;
      }

      .claude-sidebar-profile {
        --width-limit:  min(100%, 320px);
        max-width: --width-limit;
        margin-left: max(
          0px,
          calc((100% - var(--width-limit))) / 2)
        );
        display: flex;
        flex-direction: column;
        gap: 0.875rem;
      }
      .claude-profile-avatar-wrap {
        width: 100%;
        margin: 0 auto;
        position: relative;
      }
      .claude-profile-avatar {
        user-select: none;
        -webkit-user-drag: none;
        -webkit-touch-callout: none;
        width: 100%;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        border-radius: 9999px;
        border: 2px solid var(--claude-profile-border-strong);
      }
      .claude-profile-heading {
        margin-top: 0.5rem;
      }
      .claude-profile-name {
        box-sizing: border-box;
        color: var(--claude-profile-name);
        display: block;
        font-family: -apple-system, system-ui, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
        font-size: 24px;
        font-weight: 600;
        height: 30px;
        line-height: 30px;
        overflow-wrap: break-word;
        overflow-x: hidden;
        overflow-y: hidden;
        width: 100%;
      }
      .claude-profile-bio {
        border-top: 0 solid rgb(229 231 235);
        border-right: 0 solid rgb(229 231 235);
        border-bottom: 0 solid rgb(229 231 235);
        border-left: 0 solid rgb(229 231 235);
        box-sizing: border-box;
        color: var(--claude-profile-name);
        display: block;
        font-family: 'PingFang SC', -apple-system, system-ui, 'Hiragino Sans GB', 'Microsoft YaHei', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Segoe UI', 'Noto Sans SC', HarmonyOS_Regular, 'Helvetica Neue', Helvetica, 'Source Han Sans SC', Arial, sans-serif, 'Apple Color Emoji', 'Noto Sans CJK SC', 'Noto Sans SC';
        font-feature-settings: normal;
        font-size: 15px;
        font-variation-settings: normal;
        font-weight: 400;
        height: 24px;
        line-height: 24px;
        tab-size: 4;
        text-size-adjust: 100%;
        unicode-bidi: isolate;
        -webkit-font-smoothing: auto;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        width: 279px;
        max-width: 100%;
        overflow-wrap: break-word;
      }
      .claude-profile-section {
        border-top: 1px solid var(--claude-profile-divider-border);
        padding-top: 16px;
        margin-top: 16px;
        box-sizing: border-box;
      }
      .claude-profile-contact-section {
        box-sizing: border-box;
        color: rgb(31 35 40);
        color-scheme: light;
        column-gap: 4px;
        display: flex;
        flex-direction: column;
        font-family: -apple-system, system-ui, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
        font-size: 14px;
        font-weight: 400;
        height: auto;
        min-height: 25px;
        line-height: 21px;
        list-style-image: none;
        list-style-position: outside;
        list-style-type: none;
        margin-block-start: 0;
        margin-block-end: 0;
        margin-top: 0;
        margin-bottom: 0;
        overflow-wrap: break-word;
        row-gap: 4px;
        text-size-adjust: 100%;
        unicode-bidi: isolate;
        width: 100%;
        max-width: 100%;
      }
      .dark .claude-profile-contact-section {
        color: var(--claude-profile-name);
        color-scheme: dark;
      }
      .claude-profile-nav-section {
        margin-top: 0;
      }
      .claude-profile-terminal-section {
        margin-top: 12px;
      }
      .claude-terminal {
        width: 100%;
        border: 1px solid var(--claude-terminal-border);
        border-radius: 10px;
        overflow: hidden;
        background: var(--claude-terminal-bg);
      }
      .claude-terminal-bar {
        display: flex;
        align-items: center;
        gap: 6px;
        height: 28px;
        padding: 0 8px;
        border-bottom: 1px solid var(--claude-terminal-border);
        background: var(--claude-terminal-bar-bg);
      }
      .claude-terminal-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
      }
      .claude-terminal-dot-red {
        background: var(--claude-terminal-dot-red);
      }
      .claude-terminal-dot-amber {
        background: var(--claude-terminal-dot-amber);
      }
      .claude-terminal-dot-green {
        background: var(--claude-terminal-dot-green);
      }
      .claude-terminal-body {
        padding: 8px 8px;
      }
      .claude-terminal-line {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: var(--claude-mono-font);
        font-size: 13px;
        line-height: 1.5;
        color: var(--claude-terminal-text);
      }
      .claude-terminal-meta {
        font-size: var(--claude-terminal-meta-font-size, 12px);
        line-height: 1.4;
        color: var(--claude-terminal-prompt);
        margin-bottom: 6px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: clip;
      }
      .claude-terminal-shell {
        gap: 0;
        flex-wrap: nowrap;
        white-space: pre;
        font-size: var(--claude-terminal-shell-font-size, 13px);
      }
      .claude-terminal-shell-text {
        color: var(--claude-terminal-text);
      }
      .claude-terminal-command {
        color: var(--claude-terminal-text);
        text-decoration: none;
        transition: color 0.15s ease;
      }
      .claude-terminal-command:hover {
        color: var(--claude-sidebar-active-text);
        text-decoration: none;
      }
      .claude-terminal-cursor {
        width: 0.62em;
        min-width: 8px;
        height: 1.1em;
        border-radius: 1px;
        margin-left: 1px;
        background: currentColor;
        opacity: 0.8;
        animation: claudeTerminalCursorBlink 1s steps(1) infinite;
      }
      @keyframes claudeTerminalCursorBlink {
        0%,
        49% {
          opacity: 0.9;
        }
        50%,
        100% {
          opacity: 0;
        }
      }
      .claude-profile-contact-row {
        display: flex;
        align-items: center;
        gap: 4px;
        color: inherit;
        font-size: inherit;
        line-height: inherit;
        font-family: inherit;
        font-weight: inherit;
        text-decoration: none;
        transition: color 0.15s ease;
        margin: 0;
        padding: 0;
        width: 100%;
        box-sizing: border-box;
      }
      .claude-profile-contact-row:hover {
        color: var(--claude-sidebar-active-text);
      }
      .claude-profile-contact-icon {
        width: 16px;
        min-width: 16px;
        text-align: left;
        margin: 0;
        padding: 0;
        line-height: 21px;
        display: inline-block;
        opacity: 0.9;
      }
      .claude-profile-contact-value {
        overflow-wrap: anywhere;
      }

      /* Site title */
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

      /* Nav links */
      .claude-nav-link {
        font-family: var(--claude-body-font);
        color: var(--claude-profile-name);
        font-size: 0.875rem;
        font-weight: 400;
        padding: 0.3125rem 0.75rem;
        border-radius: 6px;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .claude-nav-link:hover {
        color: var(--claude-sidebar-active-text);
        background-color: transparent;
      }
      .dark .claude-nav-link:hover {
        background-color: transparent;
      }
      .claude-nav-link.active {
        background-color: var(--claude-sidebar-active-bg);
        color: var(--claude-sidebar-active-text);
        font-weight: 500;
      }
      .claude-profile-nav-section .claude-nav-link {
        border-radius: 0.375rem;
        padding: 0.35rem 0;
      }
      .claude-nav-icon,
      .claude-nav-icon-emoji {
        width: 16px;
        min-width: 16px;
        flex: 0 0 16px;
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        line-height: 1;
        opacity: 0.9;
        color: inherit;
      }
      .claude-nav-icon {
        font-size: inherit;
      }
      .claude-nav-label {
        min-width: 0;
        overflow-wrap: anywhere;
        color: inherit;
      }

      .claude-nav-group {
        display: flex;
        flex-direction: column;
      }
      .claude-nav-parent-row {
        display: flex;
        align-items: stretch;
        gap: 0;
      }
      .claude-nav-parent-link {
        flex: 1 1 auto;
        min-width: 0;
        display: block;
        text-decoration: none;
        color: inherit;
      }
      .claude-nav-parent-fallback {
        flex: 1 1 auto;
        min-width: 0;
        cursor: pointer;
      }
      .claude-nav-submenu-toggle {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.25rem;
        min-width: 2.25rem;
        padding: 0;
        margin: 0;
        border: none;
        background: transparent;
        color: var(--claude-text-tertiary);
        cursor: pointer;
        border-radius: 6px;
        transition: color 0.15s ease, background-color 0.15s ease;
      }
      .claude-nav-submenu-toggle:hover {
        color: var(--claude-sidebar-active-text);
        background-color: var(--claude-sidebar-active-bg);
      }
      .claude-nav-chevron {
        font-size: 0.75rem;
        transition: transform 0.2s ease;
      }
      .claude-nav-chevron-open {
        transform: rotate(-180deg);
      }
      .claude-nav-submenu {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
        padding: 0.125rem 0 0.375rem 0;
        margin-left: 0.625rem;
        padding-left: 0.625rem;
        border-left: 1px solid var(--claude-profile-divider-border);
      }
      .claude-profile-nav-section .claude-nav-submenu {
        margin-left: 0.5rem;
      }
      .claude-nav-sublink {
        padding-left: 0.625rem;
      }

      /* Social icons */
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
       * HOME PROFILE LAYOUT
       * ======================================== */
      .claude-profile-home {
        display: block;
      }
      .claude-profile-home-main {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .claude-profile-home-timeline {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 116px;
        gap: 1.5rem;
        align-items: start;
      }
      .claude-profile-home-timeline-main {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .claude-readme-card,
      .claude-contrib-card {
        background: var(--claude-home-card-bg);
        border: 1px solid var(--claude-home-card-border);
        border-radius: 8px;
      }
      .claude-contrib-section,
      .claude-activity-section {
        display: block;
      }
      .claude-readme-card {
        background: var(--claude-bg);
        display: block;
        color: var(--claude-text-primary);
        text-decoration: none;
        padding: 1.125rem 1.25rem;
      }
      .dark .claude-readme-card .markdown-body,
      html[data-theme='dark'] .claude-readme-card .markdown-body {
        color-scheme: dark;
        --fgColor-accent: #4493f8;
        --bgColor-attention-muted: #bb800926;
        --bgColor-default: var(--claude-bg);
        --bgColor-muted: #151b23;
        --bgColor-neutral-muted: #656c7633;
        --borderColor-accent-emphasis: #1f6feb;
        --borderColor-attention-emphasis: #9e6a03;
        --borderColor-danger-emphasis: #da3633;
        --borderColor-default: #3d444d;
        --borderColor-done-emphasis: #8957e5;
        --borderColor-success-emphasis: #238636;
        --color-prettylights-syntax-brackethighlighter-angle: #9198a1;
        --color-prettylights-syntax-brackethighlighter-unmatched: #f85149;
        --color-prettylights-syntax-carriage-return-bg: #b62324;
        --color-prettylights-syntax-carriage-return-text: #f0f6fc;
        --color-prettylights-syntax-comment: #9198a1;
        --color-prettylights-syntax-constant: #79c0ff;
        --color-prettylights-syntax-constant-other-reference-link: #a5d6ff;
        --color-prettylights-syntax-entity: #d2a8ff;
        --color-prettylights-syntax-entity-tag: #7ee787;
        --color-prettylights-syntax-keyword: #ff7b72;
        --color-prettylights-syntax-markup-bold: #f0f6fc;
        --color-prettylights-syntax-markup-changed-bg: #5a1e02;
        --color-prettylights-syntax-markup-changed-text: #ffdfb6;
        --color-prettylights-syntax-markup-deleted-bg: #67060c;
        --color-prettylights-syntax-markup-deleted-text: #ffdcd7;
        --color-prettylights-syntax-markup-heading: #1f6feb;
        --color-prettylights-syntax-markup-ignored-bg: #1158c7;
        --color-prettylights-syntax-markup-ignored-text: #f0f6fc;
        --color-prettylights-syntax-markup-inserted-bg: #033a16;
        --color-prettylights-syntax-markup-inserted-text: #aff5b4;
        --color-prettylights-syntax-markup-italic: #f0f6fc;
        --color-prettylights-syntax-markup-list: #f2cc60;
        --color-prettylights-syntax-meta-diff-range: #d2a8ff;
        --color-prettylights-syntax-storage-modifier-import: #f0f6fc;
        --color-prettylights-syntax-string: #a5d6ff;
        --color-prettylights-syntax-string-regexp: #7ee787;
        --color-prettylights-syntax-sublimelinter-gutter-mark: #3d444d;
        --color-prettylights-syntax-variable: #ffa657;
        --fgColor-attention: #d29922;
        --fgColor-danger: #f85149;
        --fgColor-default: #f0f6fc;
        --fgColor-done: #ab7df8;
        --fgColor-muted: #9198a1;
        --fgColor-success: #3fb950;
        --borderColor-muted: #3d444db3;
        --color-prettylights-syntax-invalid-illegal-bg: var(--bgColor-danger-muted);
        --color-prettylights-syntax-invalid-illegal-text: var(--fgColor-danger);
        --focus-outlineColor: var(--borderColor-accent-emphasis);
        --borderColor-neutral-muted: var(--borderColor-muted);
      }
      .light .claude-readme-card .markdown-body,
      html[data-theme='light'] .claude-readme-card .markdown-body {
        color-scheme: light;
        --fgColor-danger: #d1242f;
        --bgColor-attention-muted: #fff8c5;
        --bgColor-muted: #f6f8fa;
        --bgColor-neutral-muted: #818b981f;
        --borderColor-accent-emphasis: #0969da;
        --borderColor-attention-emphasis: #9a6700;
        --borderColor-danger-emphasis: #cf222e;
        --borderColor-default: #d1d9e0;
        --borderColor-done-emphasis: #8250df;
        --borderColor-success-emphasis: #1a7f37;
        --color-prettylights-syntax-brackethighlighter-angle: #59636e;
        --color-prettylights-syntax-brackethighlighter-unmatched: #82071e;
        --color-prettylights-syntax-carriage-return-bg: #cf222e;
        --color-prettylights-syntax-carriage-return-text: #f6f8fa;
        --color-prettylights-syntax-comment: #59636e;
        --color-prettylights-syntax-constant: #0550ae;
        --color-prettylights-syntax-constant-other-reference-link: #0a3069;
        --color-prettylights-syntax-entity: #6639ba;
        --color-prettylights-syntax-entity-tag: #0550ae;
        --color-prettylights-syntax-invalid-illegal-text: var(--fgColor-danger);
        --color-prettylights-syntax-keyword: #cf222e;
        --color-prettylights-syntax-markup-changed-bg: #ffd8b5;
        --color-prettylights-syntax-markup-changed-text: #953800;
        --color-prettylights-syntax-markup-deleted-bg: #ffebe9;
        --color-prettylights-syntax-markup-deleted-text: #82071e;
        --color-prettylights-syntax-markup-heading: #0550ae;
        --color-prettylights-syntax-markup-ignored-bg: #0550ae;
        --color-prettylights-syntax-markup-ignored-text: #d1d9e0;
        --color-prettylights-syntax-markup-inserted-bg: #dafbe1;
        --color-prettylights-syntax-markup-inserted-text: #116329;
        --color-prettylights-syntax-markup-list: #3b2300;
        --color-prettylights-syntax-meta-diff-range: #8250df;
        --color-prettylights-syntax-string: #0a3069;
        --color-prettylights-syntax-string-regexp: #116329;
        --color-prettylights-syntax-sublimelinter-gutter-mark: #818b98;
        --color-prettylights-syntax-variable: #953800;
        --fgColor-accent: #0969da;
        --fgColor-attention: #9a6700;
        --fgColor-done: #8250df;
        --fgColor-muted: #59636e;
        --fgColor-success: #1a7f37;
        --bgColor-default: var(--claude-bg);
        --borderColor-muted: #d1d9e0b3;
        --color-prettylights-syntax-invalid-illegal-bg: var(--bgColor-danger-muted);
        --color-prettylights-syntax-markup-bold: #1f2328;
        --color-prettylights-syntax-markup-italic: #1f2328;
        --color-prettylights-syntax-storage-modifier-import: #1f2328;
        --fgColor-default: #1f2328;
        --focus-outlineColor: var(--borderColor-accent-emphasis);
        --borderColor-neutral-muted: var(--borderColor-muted);
      }
      #theme-claude .claude-readme-card .markdown-body {
        background-color: transparent !important;
      }
      #theme-claude .claude-readme-card .markdown-body pre,
      #theme-claude .claude-readme-card .markdown-body .highlight pre,
      #theme-claude .claude-readme-card .markdown-body code,
      #theme-claude .claude-readme-card .markdown-body tt {
        background-color: transparent !important;
      }
      #theme-claude .claude-readme-card .markdown-body h1,
      #theme-claude .claude-readme-card .markdown-body h2,
      #theme-claude .claude-readme-card .markdown-body h3,
      #theme-claude .claude-readme-card .markdown-body h4,
      #theme-claude .claude-readme-card .markdown-body h5,
      #theme-claude .claude-readme-card .markdown-body h6 {
        color: var(--fgColor-default) !important;
        font-family: var(
          --fontStack-sansSerif,
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          'Noto Sans',
          Helvetica,
          Arial,
          sans-serif,
          'Apple Color Emoji',
          'Segoe UI Emoji'
        ) !important;
        letter-spacing: normal !important;
      }
      #theme-claude .claude-readme-card .markdown-body table th,
      #theme-claude .claude-readme-card .markdown-body table td {
        text-align: left !important;
        vertical-align: top;
        font-weight: 400;
      }
      #theme-claude .claude-readme-card .markdown-body table {
        border-collapse: separate !important;
        border-spacing: 0 !important;
        border: 1px solid var(--borderColor-default) !important;
      }
      #theme-claude .claude-readme-card .markdown-body table tr {
        border-top: 0 !important;
      }
      #theme-claude .claude-readme-card .markdown-body table th,
      #theme-claude .claude-readme-card .markdown-body table td {
        border: 0 !important;
        border-right: 1px solid var(--borderColor-default) !important;
        border-bottom: 1px solid var(--borderColor-default) !important;
      }
      #theme-claude .claude-readme-card .markdown-body table tr > *:last-child {
        border-right: 0 !important;
      }
      #theme-claude .claude-readme-card .markdown-body table tbody tr:last-child > * {
        border-bottom: 0 !important;
      }
      #theme-claude .claude-readme-card .markdown-body table thead th,
      #theme-claude .claude-readme-card .markdown-body table th[scope='col'] {
        font-weight: 600;
      }
      #theme-claude .claude-readme-card .markdown-body table tbody th[scope='row'] {
        font-weight: 600;
        background-color: var(--bgColor-muted);
      }
      .claude-readme-card-meta {
        box-sizing: border-box;
        color: var(--claude-gh-fg-default);
        color-scheme: light;
        display: block;
        font-family: "Monaspace Neon", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
        font-size: var(--h6-size, 12px) !important;
        font-weight: 400;
        line-height: 1.5;
        margin-bottom: 16px !important;
        overflow-wrap: break-word;
        text-size-adjust: 100%;
        unicode-bidi: isolate;
      }
      .claude-readme-card-meta-ext {
        display: inline;
        color: var(--claude-gh-fg-muted);
      }
      .dark .claude-readme-card-meta {
        color: rgb(240, 246, 252);
        color-scheme: dark;
      }
      .dark .claude-readme-card-meta-ext {
        color: var(--claude-gh-fg-muted);
      }
      .claude-readme-card-excerpt {
        margin: 0;
        color: var(--claude-text-secondary);
        line-height: 1.7;
        font-size: 0.95rem;
      }
      .claude-contrib-card {
        background: var(--claude-bg);
        padding: 1rem 1rem 0.875rem;
        --claude-contrib-gap: 3px;
        --claude-contrib-cell-size: 11px;
        --claude-contrib-cell-radius: calc(var(--claude-contrib-cell-size) / 5);
        --claude-weekday-width: 1.6rem;
        --claude-weekday-gap: 0.5rem;
      }
      .claude-contrib-title,
      .claude-activity-title {
        box-sizing: border-box;
        color: var(--claude-gh-fg-default);
        color-scheme: light;
        display: block;
        font-family: var(--claude-gh-font-family);
        font-size: var(--h4-size, 16px);
        font-weight: 400;
        height: 24px;
        line-height: 24px;
        margin-block-start: 0;
        margin-block-end: 8px;
        margin-inline-start: 0;
        margin-inline-end: 0;
        margin-top: 0;
        margin-bottom: 8px;
        overflow-wrap: break-word;
        text-size-adjust: 100%;
        unicode-bidi: isolate;
      }
      .dark .claude-contrib-title,
      .dark .claude-activity-title {
        color: var(--claude-gh-fg-default);
        color-scheme: dark;
      }
      .claude-contrib-months {
        position: relative;
        height: 18px;
        margin-left: calc(var(--claude-weekday-width) + var(--claude-weekday-gap));
        margin-bottom: 0.35rem;
        overflow: visible;
      }
      .claude-contrib-months span,
      .claude-contrib-weekday span {
        box-sizing: border-box;
        color: var(--claude-contrib-label);
        display: block;
        font-family: var(--claude-gh-font-family);
        font-size: 12px;
        font-weight: 400;
        height: 18px;
        line-height: 1.5;
        overflow-wrap: break-word;
        text-align: left;
        text-indent: 0;
        text-size-adjust: 100%;
      }
      .claude-contrib-months span {
        position: absolute;
        left: calc(
          var(--claude-marker-week, 0)
            * (var(--claude-contrib-cell-size) + var(--claude-contrib-gap))
        );
        top: 0;
        white-space: nowrap;
      }
      .claude-contrib-grid-wrap {
        display: flex;
        align-items: flex-start;
        gap: var(--claude-weekday-gap);
      }
      .claude-contrib-weekday {
        display: grid;
        grid-template-rows: repeat(7, var(--claude-contrib-cell-size));
        gap: var(--claude-contrib-gap);
        width: var(--claude-weekday-width);
      }
      .claude-contrib-grid {
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: repeat(var(--claude-contrib-week-count, 53), var(--claude-contrib-cell-size));
        grid-template-rows: repeat(7, var(--claude-contrib-cell-size));
        gap: var(--claude-contrib-gap);
        width: 100%;
        min-width: 0;
        overflow: hidden;
        padding-bottom: 0.25rem;
      }
      .claude-contrib-cell {
        width: var(--claude-contrib-cell-size);
        height: var(--claude-contrib-cell-size);
        border-radius: var(--claude-contrib-cell-radius);
        background: var(--claude-contrib-l0);
        box-sizing: border-box;
        padding: 0;
        cursor: default;
        vertical-align: middle;
      }
      .claude-contrib-cell.level-0 {
        background: var(--claude-contrib-l0);
      }
      .claude-contrib-cell.level-1 {
        background: var(--claude-contrib-l1);
      }
      .claude-contrib-cell.level-2 {
        background: var(--claude-contrib-l2);
      }
      .claude-contrib-cell.level-3 {
        background: var(--claude-contrib-l3);
      }
      .claude-contrib-cell.level-4 {
        background: var(--claude-contrib-l4);
      }
      .claude-contrib-cell.is-placeholder {
        background: transparent !important;
        visibility: hidden;
        pointer-events: none;
      }
      .claude-contrib-tooltip {
        position: fixed;
        z-index: 9999;
        pointer-events: none;
        transform: translate(-50%, -100%);
        background: var(--claude-gh-fg-default);
        color: var(--claude-bg);
        border: 1px solid var(--claude-gh-border);
        border-radius: 6px;
        padding: 6px 8px;
        font-family: var(--claude-gh-font-family);
        font-size: 12px;
        line-height: 1.4;
        white-space: nowrap;
        box-shadow: none;
      }
      .dark .claude-contrib-tooltip {
        background: #3d444d;
        color: #fff;
        border-color: var(--claude-gh-border);
        box-shadow: none;
      }
      .claude-contrib-legend {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 0.55rem;
        padding-right: 32px;
      }
      .claude-contrib-legend > span {
        box-sizing: border-box;
        color: var(--claude-gh-fg-muted);
        color-scheme: light;
        display: block;
        font-family: var(--claude-gh-font-family);
        font-size: var(--h6-size, 12px);
        font-weight: 400;
        line-height: 1.5;
        overflow-wrap: break-word;
        text-align: center;
        text-size-adjust: 100%;
      }
      .dark .claude-contrib-legend > span {
        color: var(--claude-gh-fg-muted);
        color-scheme: dark;
      }
      .claude-contrib-legend-cells {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
      }
      .claude-activity-card {
        background: transparent;
        border: 0;
        border-radius: 0;
        padding: 0;
      }
      .claude-activity-year-dropdown {
        display: none;
        position: relative;
        flex-shrink: 0;
      }
      .claude-activity-year-summary {
        list-style: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.125rem;
        min-width: 0;
        width: auto;
        height: 32px;
        padding: 0 0.625rem;
        border: 1px solid var(--claude-gh-border);
        border-radius: 8px;
        background: var(--claude-bg);
        color: var(--claude-gh-fg-default);
        font-family: var(--claude-gh-font-family);
        font-size: 14px;
        font-weight: 600;
        line-height: 1;
        cursor: pointer;
        user-select: none;
        box-sizing: border-box;
      }
      .claude-activity-year-summary::-webkit-details-marker {
        display: none;
      }
      .claude-activity-year-summary-label {
        color: var(--claude-gh-fg-muted);
      }
      .claude-activity-year-summary-main {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.1rem;
      }
      .claude-activity-year-summary-caret {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0;
        color: var(--claude-gh-fg-muted);
      }
      .claude-activity-year-summary-caret.Button-trailingAction {
        margin: 0;
        padding: 0;
      }
      .claude-activity-year-summary-caret svg {
        width: 16px;
        height: 16px;
        fill: currentColor;
      }
      .claude-activity-year-menu {
        list-style: none;
        margin: 8px 0 0;
        padding: 0.35rem 0;
        position: absolute;
        right: 0;
        top: 100%;
        min-width: 146px;
        border: 1px solid var(--claude-gh-border);
        border-radius: 16px;
        background: var(--claude-bg);
        box-shadow: 0 12px 32px rgb(31 35 40 / 0.16);
        z-index: 40;
      }
      .claude-activity-year-option {
        width: 100%;
        border: 0;
        background: transparent;
        color: var(--claude-gh-fg-default);
        display: flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.65rem 0.85rem;
        text-align: left;
        font-family: var(--claude-gh-font-family);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      }
      .claude-activity-year-option:hover {
        background: var(--claude-home-card-bg);
      }
      .claude-activity-year-option-check {
        width: 16px;
        min-width: 16px;
        height: 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--claude-gh-fg-muted);
      }
      .claude-activity-year-option-check svg {
        width: 16px;
        height: 16px;
        fill: currentColor;
      }
      .dark .claude-activity-year-menu {
        box-shadow: 0 16px 36px rgb(0 0 0 / 0.45);
      }
      .claude-activity-empty {
        box-sizing: border-box;
        color: var(--claude-activity-empty-color);
        color-scheme: light;
        display: inline;
        font-family: var(--claude-gh-font-family);
        font-size: var(--h5-size, 14px);
        font-weight: 400;
        height: auto;
        line-height: 1.5;
        margin-top: 0;
        margin-right: 0;
        margin-bottom: 0;
        margin-left: 0;
        overflow-wrap: break-word;
        text-align: center;
        text-size-adjust: 100%;
      }
      .claude-activity-empty-wrap {
        text-align: center;
      }
      .dark .claude-activity-empty {
        color: var(--claude-activity-empty-color);
        color-scheme: dark;
      }
      .claude-activity-group + .claude-activity-group {
        margin-top: 1.5rem;
      }
      .claude-activity-group-title {
        box-sizing: border-box;
        color: var(--claude-gh-fg-default);
        color-scheme: light;
        display: block;
        font-family: var(--claude-gh-font-family);
        font-size: var(--h6-size, 12px);
        font-weight: 600;
        height: 14px;
        line-height: 1.5;
        overflow-wrap: break-word;
        padding-top: 4px;
        padding-right: 8px;
        padding-bottom: 4px;
        border-bottom: 1px solid var(--claude-gh-border);
        text-size-adjust: 100%;
        unicode-bidi: isolate;
        margin-top: 0;
        margin-right: 0;
        margin-bottom: 16px;
        margin-left: 0;
      }
      .claude-activity-group-title-month {
        display: inline-block;
        line-height: 1.5;
        padding-left: 0.5rem;
        padding-right: 0.2rem;
        background: var(--claude-bg);
      }
      .claude-activity-group-title-year {
        color: var(--claude-gh-fg-muted);
        color-scheme: light;
        display: inline-block;
        background: var(--claude-bg);
        font-family: var(--claude-gh-font-family);
        font-size: var(--h6-size, 12px);
        font-weight: 600;
        line-height: 1.5;
        overflow-wrap: break-word;
        text-size-adjust: 100%;
        margin-left: 0.1rem;
        padding-right: 0.75rem;
      }
      .dark .claude-activity-group-title {
        color: var(--claude-gh-fg-default);
        color-scheme: dark;
        border-bottom-color: var(--claude-gh-border);
      }
      .claude-activity-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .claude-activity-item {
        margin-left: 1rem;
        padding: 0.7rem 0 1rem;
        display: flex;
        align-items: flex-start;
        position: relative;
      }
      .claude-activity-item::before {
        background-color: var(--claude-timeline-line);
        content: '';
        width: 0.125rem;
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
      }
      .claude-activity-item-badge {
        box-sizing: border-box;
        background-color: var(--claude-badge-bg);
        border-top: 2px solid var(--claude-badge-border);
        border-right: 2px solid var(--claude-badge-border);
        border-bottom-color: var(--claude-badge-border);
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-left: 2px solid var(--claude-badge-border);
        color: var(--claude-gh-fg-muted);
        color-scheme: light;
        font-family: var(--claude-gh-font-family);
        font-size: 14px;
        font-weight: 400;
        height: 32px;
        line-height: 21px;
        margin-left: -15px;
        margin-right: 8px;
        overflow-wrap: break-word;
        text-size-adjust: 100%;
        unicode-bidi: isolate;
        width: 32px;
        z-index: 1;
        border-top-left-radius: 50%;
        border-top-right-radius: 50%;
        border-bottom-left-radius: 50%;
        border-bottom-right-radius: 50%;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
        display: flex;
        position: relative;
      }
      .claude-activity-item-badge-icon {
        width: 1rem;
        height: 1rem;
        display: block;
        fill: currentColor;
      }
      .dark .claude-activity-item-badge {
        color: var(--claude-gh-fg-muted);
      }
      .claude-activity-item-body {
        color: var(--claude-text-secondary);
        margin-top: 0;
        flex: 1;
        min-width: 0;
      }
      .claude-activity-details {
        width: 100%;
      }
      .claude-activity-summary-toggle {
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        cursor: pointer;
        border-radius: 6px;
        margin: 0;
        padding: 0.125rem 0.25rem 0.125rem 0;
        color: var(--claude-gh-fg-default);
      }
      .claude-activity-summary-toggle::-webkit-details-marker {
        display: none;
      }
      .claude-activity-summary-toggle::marker {
        content: '';
      }
      .claude-activity-summary-toggle:hover {
        color: var(--claude-gh-link);
      }
      .claude-activity-summary-toggle:hover .claude-activity-item-summary,
      .claude-activity-summary-toggle:hover .claude-activity-summary-icons {
        color: var(--claude-gh-link);
      }
      .claude-activity-summary-icons {
        color: var(--claude-gh-fg-muted);
        display: inline-flex;
        align-items: center;
        flex-shrink: 0;
      }
      .claude-activity-summary-icon {
        width: 16px;
        height: 16px;
        display: block;
        fill: currentColor;
      }
      .claude-activity-item-badge,
      .claude-activity-subitem-icon {
        color: var(--claude-gh-fg-muted);
      }
      .claude-activity-summary-toggle .Details-content--open,
      .claude-activity-summary-toggle .Details-content--closed {
        display: inline-flex;
        align-items: center;
      }
      .claude-activity-summary-toggle .claude-activity-item-summary {
        display: block;
        min-height: 0;
        line-height: 1.5;
        padding-top: 0;
      }
      .claude-activity-item-commit .claude-activity-summary-toggle .claude-activity-item-summary {
        align-items: initial;
        padding-top: 0;
      }
      .claude-activity-details .Details-content--closed {
        display: none;
      }
      .claude-activity-details:not([open]) .Details-content--open {
        display: none;
      }
      .claude-activity-details:not([open]) .Details-content--closed {
        display: inline-flex;
      }
      .claude-activity-item-summary {
        color: var(--claude-gh-fg-default);
        font-family: var(--claude-gh-font-family);
        font-size: var(--h4-size, 16px);
        font-weight: 400;
        line-height: 1.25;
        margin: 0;
        min-height: 2rem;
        display: flex;
        align-items: center;
      }
      .claude-activity-item-commit .claude-activity-item-badge {
        align-items: flex-start;
        padding-top: 0.4rem;
      }
      .claude-activity-item-commit .claude-activity-item-summary {
        align-items: flex-start;
        padding-top: 0.4rem;
      }
      .claude-activity-sublist {
        list-style: none;
        margin: 0.55rem 0 0;
        padding: 0;
      }
      .claude-activity-subitem {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.8rem;
        min-width: 0;
        padding: 0.2rem 0;
      }
      .claude-activity-subitem-main {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        min-width: 0;
        flex: 1;
      }
      .claude-activity-item-commit .claude-activity-subitem {
        align-items: center;
      }
      .claude-activity-item-commit .claude-activity-subitem-main {
        gap: 0.75rem;
      }
      .claude-activity-subitem-icon {
        width: 1rem;
        height: 1rem;
        display: block;
        color: var(--claude-gh-fg-muted);
        fill: currentColor;
        flex-shrink: 0;
      }
      .claude-activity-subitem-create .claude-activity-subitem-main {
        display: flex;
        align-items: center;
        width: auto;
        max-width: 100%;
        gap: 0.25rem;
        flex: 1 1 auto;
        height: auto;
        line-height: 1.25;
      }
      .claude-activity-subitem-create .claude-activity-link {
        display: inline-block;
        height: auto;
        line-height: 1.25;
        min-height: 0;
        margin-right: 0;
        position: relative;
        top: -1px;
      }
      .claude-activity-subitem-create .claude-activity-subitem-icon {
        display: block;
        align-self: auto;
        width: 16px;
        height: 16px;
        margin-right: 0.25rem;
      }
      .claude-activity-link {
        --body-font-size: .875rem;
        background-color: transparent;
        box-sizing: border-box;
        color: var(--claude-gh-link);
        color-scheme: light;
        cursor: pointer;
        display: inline;
        font-family: var(--claude-gh-font-family);
        font-size: var(--body-font-size, 14px);
        font-weight: 400;
        height: auto;
        line-height: 1.25;
        list-style-image: none;
        list-style-position: outside;
        list-style-type: none;
        overflow-wrap: break-word;
        text-decoration-color: var(--claude-gh-link);
        text-decoration-line: underline;
        text-decoration-style: solid;
        text-decoration-thickness: auto;
        text-size-adjust: 100%;
        text-underline-offset: 3.2px;
        width: auto;
      }
      .claude-activity-link:hover {
        color: var(--claude-gh-link);
        text-decoration: underline;
      }
      .dark .claude-activity-link { color-scheme: dark; }
      .claude-activity-date {
        box-sizing: border-box;
        color: var(--claude-gh-fg-muted);
        color-scheme: light;
        display: block;
        flex-shrink: 0;
        float: right;
        font-family: var(--claude-gh-font-family);
        font-size: var(--h6-size, 12px);
        font-weight: 400;
        height: 22px;
        line-height: 1.5;
        overflow-wrap: break-word;
        padding-top: 4px;
        text-size-adjust: 100%;
        white-space: nowrap;
      }
      .dark .claude-activity-date { color-scheme: dark; }
      .claude-year-switcher {
        width: 100%;
        max-width: 128px;
      }
      .claude-year-switcher-sticky {
        position: sticky;
        top: 74px;
      }
      .claude-year-filter-list {
        list-style: none;
        list-style-type: none;
        margin: 0;
        padding: 0;
      }
      .claude-year-filter-list > li {
        margin: 0;
      }
      .claude-year-filter-item {
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        box-sizing: border-box;
        color-scheme: light;
        display: block;
        width: 100%;
        border: 0;
        margin-bottom: 8px;
        overflow-wrap: break-word;
        overflow-x: hidden;
        overflow-y: hidden;
        text-overflow: ellipsis;
        padding-top: 8px;
        padding-right: 16px;
        padding-bottom: 8px;
        padding-left: 16px;
        position: relative;
        text-align: left;
        text-decoration: none;
        text-decoration-line: none;
        text-decoration-style: solid;
        text-decoration-thickness: auto;
        text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        text-wrap-mode: nowrap;
        white-space-collapse: collapse;
        white-space: nowrap;
        list-style-type: none;
        font-family: var(--claude-gh-font-family);
        font-size: 12px;
        font-weight: 400;
        line-height: 1.5;
        color: var(--claude-year-filter-text);
        background: transparent;
        cursor: pointer;
        transition: none;
      }
      .dark .claude-year-filter-item {
        color-scheme: dark;
      }
      .claude-year-filter-item.active {
        color: var(--claude-year-filter-text-active);
        background: var(--claude-gh-link);
        font-weight: 500;
      }
      .claude-year-filter-item:focus-visible {
        outline: 2px solid var(--claude-gh-link);
        outline-offset: -2px;
      }
      .claude-year-filter-item.active:focus-visible {
        box-shadow: inset 0 0 0 3px #fff;
      }
      @media (max-width: 767px) {
        .claude-activity-item {
          margin-left: 0.5rem;
        }
        .claude-activity-item-badge {
          width: 1.8rem;
          height: 1.8rem;
          margin-left: calc(1.8rem / -2 + 1px);
          margin-right: 0.55rem;
        }
      }
      @media (max-width: 1023px) {
        .claude-profile-home-timeline {
          grid-template-columns: 1fr;
        }
        .claude-year-switcher {
          display: none;
        }
        .claude-activity-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 8px;
        }
        .claude-activity-header .claude-activity-title {
          margin: 0;
          height: auto;
        }
        .claude-activity-year-dropdown {
          display: block;
        }
        .claude-activity-year-summary-label,
        .claude-activity-year-summary-value {
          box-sizing: border-box;
          color-scheme: light;
          cursor: pointer;
          display: inline;
          font-family: var(--claude-gh-font-family);
          font-feature-settings: normal;
          font-kerning: auto;
          font-language-override: normal;
          font-optical-sizing: auto;
          font-size: 0.875rem;
          font-size-adjust: none;
          font-stretch: 100%;
          font-style: normal;
          font-variant-alternates: normal;
          font-variant-caps: normal;
          font-variant-east-asian: normal;
          font-variant-emoji: normal;
          font-variant-ligatures: normal;
          font-variant-numeric: normal;
          font-variant-position: normal;
          font-variation-settings: normal;
          font-weight: 500;
          height: auto;
          letter-spacing: normal;
          line-height: 1.5;
          overflow-wrap: break-word;
          text-align: center;
          text-indent: 0;
          text-rendering: auto;
          text-shadow: none;
          text-size-adjust: 100%;
          text-transform: none;
          text-wrap-mode: nowrap;
          user-select: none;
          white-space-collapse: collapse;
          width: auto;
          word-spacing: 0;
        }
        .claude-activity-year-summary-main {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.1rem;
        }
        .claude-activity-year-summary-label {
          color: var(--claude-gh-fg-muted);
          fill: var(--claude-gh-fg-muted);
        }
        .claude-activity-year-summary-value {
          color: rgb(37, 41, 46);
          fill: rgb(37, 41, 46);
        }
        .claude-activity-year-summary-caret {
          color: rgb(37, 41, 46);
          fill: rgb(37, 41, 46);
        }
        .dark .claude-activity-year-summary-label,
        .dark .claude-activity-year-summary-value {
          color-scheme: dark;
        }
        .dark .claude-activity-year-summary-label {
          color: var(--claude-gh-fg-muted);
          fill: var(--claude-gh-fg-muted);
        }
        .dark .claude-activity-year-summary-value {
          color: rgb(240, 246, 252);
          fill: rgb(240, 246, 252);
        }
        .dark .claude-activity-year-summary-caret {
          color: rgb(240, 246, 252);
          fill: rgb(240, 246, 252);
        }
      }
      @media (max-width: 767px) {
        .claude-contrib-card {
          --claude-contrib-gap: 2px;
        }
        .claude-contrib-scroll {
          width: 100%;
          min-width: 0;
        }
        .claude-contrib-canvas {
          width: max-content;
          min-width: calc(
            var(--claude-weekday-width) + var(--claude-weekday-gap)
            + var(--claude-contrib-week-count, 53)
            * (var(--claude-contrib-cell-size) + var(--claude-contrib-gap))
            - var(--claude-contrib-gap)
          );
        }
        .claude-contrib-scroll {
          overflow-x: auto;
          overflow-y: hidden;
          padding-bottom: 2px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .claude-contrib-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        .claude-contrib-grid {
          width: max-content;
          min-width: max-content;
          overflow: visible;
        }
      }

      /* ========================================
       * NOTION CONTENT OVERRIDES
       * ======================================== */
      .notion {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }
      .dark .notion {
        color: #9E9E9E !important;
      }
      .notion-page {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      #theme-claude code,
      #theme-claude pre code {
        font-family: var(--claude-mono-font) !important;
      }
      /* Prevent first-paint layout shift: NotionPage removes these nodes after mount */
      #theme-claude #notion-article .notion-collection-page-properties {
        display: none !important;
        margin: 0 !important;
        padding: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
      }

      /* Dark mode — headings white */
      .dark .notion-h1,
      .dark .notion-h2,
      .dark .notion-h3 {
        color: var(--claude-text-strong) !important;
      }
      /* Dark mode — bold text white */
      .dark #article-wrapper b,
      .dark #article-wrapper strong {
        color: var(--claude-text-strong) !important;
      }

      /* Blockquotes — Claude Docs callout style */
      .notion-quote {
        border-left: none !important;
        border: 1px solid var(--claude-callout-tip-border) !important;
        border-radius: 1rem !important;
        background: var(--claude-callout-tip-bg) !important;
        padding: 1rem 1.25rem !important;
        margin: 0 0 1rem !important;
        color: var(--claude-callout-tip-text) !important;
        font-style: normal !important;
      }
      .dark .notion-quote {
        border: 1px solid var(--claude-callout-tip-border) !important;
        border-radius: 16px !important;
        background: var(--claude-callout-tip-bg) !important;
        color: var(--claude-callout-tip-text) !important;
        padding: 16px 20px !important;
        margin: 0 0 1rem !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
      }
      #theme-claude .notion-quote,
      #theme-claude .notion-quote .notion-text,
      #theme-claude .notion-quote .notion-text p,
      #theme-claude .notion-quote .notion-semantic-string {
        font-size: 0.875rem !important;
        line-height: 1.25rem !important;
        font-weight: 400 !important;
        tab-size: 4;
        text-size-adjust: 100%;
        transition-behavior: normal;
        transition-delay: 0s;
        transition-duration: 0s;
        transition-property: none;
        transition-timing-function: ease;
        -webkit-font-smoothing: antialiased;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }
      #theme-claude .notion-quote .notion-text,
      #theme-claude .notion-quote .notion-text p {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }
      /* Quote: descendants inherit quote color + font size (light + dark) */
      #theme-claude .notion-quote .notion-text,
      #theme-claude .notion-quote .notion-text p,
      #theme-claude .notion-quote .notion-semantic-string,
      #theme-claude .notion-quote .notion-link,
      #theme-claude .notion-quote a,
      #theme-claude .notion-quote b,
      #theme-claude .notion-quote strong,
      #theme-claude .notion-quote em,
      #theme-claude .notion-quote i,
      #theme-claude .notion-quote u,
      #theme-claude .notion-quote s,
      #theme-claude .notion-quote del,
      #theme-claude .notion-quote span,
      #theme-claude .notion-quote :not(pre) > code,
      #theme-claude .notion-quote .notion-inline-code {
        color: inherit !important;
        font-size: inherit !important;
      }
      /* Links inside quote */
      .notion-quote a {
        color: inherit !important;
        font-weight: 600 !important;
        text-decoration: underline !important;
        text-underline-offset: 3px !important;
      }

      /* Notion callout block (icon + content) — align with Claude dark tip style */
      .dark #theme-claude .notion-callout {
        display: flex !important;
        align-items: flex-start !important;
        gap: 12px !important;
        margin: 0 0 1rem !important;
        padding: 16px 20px !important;
        border: 1px solid var(--claude-callout-tip-border) !important;
        border-radius: 16px !important;
        background: var(--claude-callout-tip-bg) !important;
        color: var(--claude-callout-tip-text) !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
        line-height: 1.75rem !important;
        font-size: 1rem !important;
      }
      .dark #theme-claude .notion-callout .notion-callout-text {
        margin-left: 0 !important;
        min-width: 0;
        flex: 1 1 auto;
        color: inherit !important;
      }
      .dark #theme-claude .notion-callout .notion-callout-text .notion-text {
        color: inherit !important;
        line-height: 1.75rem !important;
      }
      .dark #theme-claude .notion-callout .notion-page-icon {
        width: 0.875rem !important;
        min-width: 0.875rem !important;
        height: auto !important;
        margin-top: 1px !important;
        color: var(--claude-callout-tip-text) !important;
      }
      .dark #theme-claude .notion-callout svg.notion-page-icon {
        display: block !important;
        width: 0.875rem !important;
        height: auto !important;
        color: var(--claude-callout-tip-text) !important;
        fill: currentColor !important;
      }
      .dark #theme-claude .notion-callout a,
      .dark #theme-claude .notion-callout strong,
      .dark #theme-claude .notion-callout b {
        color: inherit !important;
      }
      .dark #theme-claude .notion-callout a {
        border-bottom-color: currentColor !important;
      }

      /* Horizontal rule */
      .notion-hr {
        border-color: var(--claude-border) !important;
      }

      /* Bookmark / GitHub embed — dark mode text fix */
      .dark .notion-bookmark {
        border-color: var(--claude-border) !important;
        background: var(--claude-bg-secondary) !important;
      }
      .dark .notion-bookmark .notion-bookmark-title {
        color: var(--claude-text-primary) !important;
      }
      .dark .notion-bookmark .notion-bookmark-description {
        color: var(--claude-text-secondary) !important;
      }
      .dark .notion-bookmark .notion-bookmark-link div {
        color: var(--claude-text-tertiary) !important;
      }
      .dark .notion-bookmark .notion-bookmark-link img {
        filter: invert(0.8) !important;
      }
      /* External embeds (GitHub etc.) — dark mode fix */
      .dark .notion-external {
        color: var(--claude-text-primary) !important;
      }
      .dark .notion-external-block {
        border-color: var(--claude-border) !important;
      }
      .dark .notion-external-title {
        color: var(--claude-text-primary) !important;
      }
      .dark .notion-external-block-desc {
        color: var(--claude-text-secondary) !important;
      }
      .dark .notion-external-image svg path {
        fill: var(--claude-text-primary) !important;
      }

      /* ========================================
       * TABLES — Claude Docs style
       * No outer border, horizontal separators only
       * ======================================== */
      .notion-simple-table {
        border-collapse: collapse !important;
        width: 100% !important;
        min-width: 100% !important;
        font-size: 0.9375rem !important;
        line-height: 1.7 !important;
        display: table !important;
        table-layout: auto !important;
        white-space: normal !important;
        border: none !important;
        overflow-x: auto !important;
      }
      .notion-simple-table thead,
      .notion-simple-table tbody {
        display: table-row-group !important;
        width: 100% !important;
      }
      .notion-simple-table tr,
      .notion-simple-table .notion-simple-table-row {
        display: table-row !important;
        width: 100% !important;
        table-layout: auto !important;
      }
      /* All cells — horizontal borders only, no vertical */
      .notion-simple-table td {
        display: table-cell !important;
        width: auto !important;
        border: none !important;
        border-bottom: 1px solid var(--claude-border) !important;
        padding: 0.875rem 1.25rem !important;
        vertical-align: top !important;
        color: var(--claude-text-primary) !important;
        overflow-wrap: break-word !important;
      }
      /* Header row — warm muted color */
      .notion-simple-table tr:first-child td {
        color: #8B8680 !important;
        font-weight: 400 !important;
        font-size: 0.875rem !important;
        border-bottom: 1px solid var(--claude-border) !important;
        padding-top: 0.5rem !important;
        padding-bottom: 0.75rem !important;
        background: transparent !important;
      }
      .dark .notion-simple-table tr:first-child td {
        color: var(--claude-text-strong) !important;
        background: transparent !important;
      }
      /* First column — bold */
      .notion-simple-table td:first-child {
        font-weight: 600 !important;
        white-space: nowrap !important;
      }
      .dark .notion-simple-table td:first-child {
        color: var(--claude-text-strong) !important;
      }
      /* Last row — no bottom border */
      .notion-simple-table tr:last-child td {
        border-bottom: none !important;
      }

      /* ========================================
       * CODE BLOCKS — Claude Docs style
       * Dark mode replication for Notion + Prism structure
       * ======================================== */
      #theme-claude .code-toolbar {
        position: relative !important;
        margin: 1.25rem 0 2rem !important;
        padding: 0 !important;
        display: block !important;
        box-sizing: border-box !important;
        border-radius: 0 !important;
        border: none !important;
        background: transparent !important;
        color: var(--claude-code-shell-text) !important;
        font-family: var(--claude-body-font) !important;
        font-size: 1rem !important;
        font-weight: 400 !important;
        line-height: 1.75rem !important;
        overflow: hidden !important;
        box-shadow: none !important;
        transition: none !important;
      }
      .dark #theme-claude .code-toolbar {
        box-sizing: border-box !important;
        border: none !important;
        border-radius: 0 !important;
        background: transparent !important;
        color: var(--claude-code-shell-text) !important;
      }

      /* Collapse wrapper from PrismMac: remove extra header/borders to avoid double frame */
      #theme-claude .collapse-wrapper {
        width: 100% !important;
        padding: 0 !important;
        margin: 1.25rem 0 2rem !important;
      }
      #theme-claude .collapse-wrapper > div {
        box-sizing: border-box !important;
        background-clip: border-box !important;
        border: none !important;
        border-radius: 0 !important;
        background: transparent !important;
        color: var(--claude-code-shell-text) !important;
        font-family: var(--claude-body-font) !important;
        font-size: 1rem !important;
        font-weight: 400 !important;
        line-height: 1.75rem !important;
        padding: 0 !important;
        box-shadow: none !important;
      }
      .dark #theme-claude .collapse-wrapper > div {
        box-sizing: border-box !important;
        background-clip: border-box !important;
        border: none !important;
        border-radius: 0 !important;
        background: transparent !important;
        color: var(--claude-code-shell-text) !important;
      }
      #theme-claude .collapse-wrapper .code-toolbar {
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        border-radius: 0 !important;
        background: transparent !important;
      }
      #theme-claude .collapse-wrapper > div > div.cursor-pointer.select-none {
        display: none !important;
      }
      #theme-claude .collapse-wrapper > div > div.transition-transform {
        visibility: visible !important;
        height: auto !important;
        border-top: none !important;
      }

      #theme-claude .code-toolbar > pre,
      #theme-claude .notion-code {
        margin: 0 !important;
        border: 1px solid var(--claude-code-border) !important;
        border-radius: 0.875rem !important;
        background: var(--claude-code-bg) !important;
        color: var(--claude-code-text) !important;
        font-family: var(--claude-mono-font) !important;
        font-size: 0.875rem !important;
        line-height: 1.5rem !important;
        padding: 0.875rem 1rem !important;
        position: relative !important;
        overflow-x: auto !important;
        font-variant-ligatures: none !important;
        box-shadow: none !important;
      }

      #theme-claude .code-toolbar > pre > code,
      #theme-claude .notion-code > code {
        display: block !important;
        width: max-content !important;
        min-width: 100% !important;
        color: var(--claude-code-text) !important;
        text-shadow: none !important;
      }
      #theme-claude code[class*='language-'],
      #theme-claude pre[class*='language-'] {
        color: var(--claude-code-text) !important;
      }
      #theme-claude pre[class*='language-'] .token.comment,
      #theme-claude .notion-code .token.comment,
      #theme-claude pre[class*='language-'] .token.prolog,
      #theme-claude .notion-code .token.prolog,
      #theme-claude pre[class*='language-'] .token.doctype,
      #theme-claude .notion-code .token.doctype,
      #theme-claude pre[class*='language-'] .token.cdata,
      #theme-claude .notion-code .token.cdata {
        color: var(--claude-code-token-comment) !important;
      }
      #theme-claude pre[class*='language-'] .token.punctuation,
      #theme-claude .notion-code .token.punctuation {
        color: var(--claude-code-token-punctuation) !important;
      }
      #theme-claude pre[class*='language-'] .token.keyword,
      #theme-claude .notion-code .token.keyword {
        color: var(--claude-code-token-keyword) !important;
      }
      #theme-claude pre[class*='language-'] .token.atrule,
      #theme-claude .notion-code .token.atrule,
      #theme-claude pre[class*='language-'] .token.attr-value,
      #theme-claude .notion-code .token.attr-value {
        color: var(--claude-code-token-atrule) !important;
      }
      #theme-claude pre[class*='language-'] .token.function,
      #theme-claude .notion-code .token.function,
      #theme-claude pre[class*='language-'] .token.class-name,
      #theme-claude .notion-code .token.class-name {
        color: var(--claude-code-token-function) !important;
      }
      #theme-claude pre[class*='language-'] .token.string,
      #theme-claude .notion-code .token.string,
      #theme-claude pre[class*='language-'] .token.char,
      #theme-claude .notion-code .token.char,
      #theme-claude pre[class*='language-'] .token.selector,
      #theme-claude .notion-code .token.selector,
      #theme-claude pre[class*='language-'] .token.attr-name,
      #theme-claude .notion-code .token.attr-name,
      #theme-claude pre[class*='language-'] .token.builtin,
      #theme-claude .notion-code .token.builtin,
      #theme-claude pre[class*='language-'] .token.inserted,
      #theme-claude .notion-code .token.inserted {
        color: var(--claude-code-token-string) !important;
      }
      #theme-claude .language-css .token.string,
      #theme-claude .style .token.string {
        color: var(--claude-code-token-css-string) !important;
      }
      #theme-claude pre[class*='language-'] .token.number,
      #theme-claude .notion-code .token.number,
      #theme-claude pre[class*='language-'] .token.boolean,
      #theme-claude .notion-code .token.boolean {
        color: var(--claude-code-token-number) !important;
      }
      #theme-claude pre[class*='language-'] .token.property,
      #theme-claude .notion-code .token.property,
      #theme-claude pre[class*='language-'] .token.tag,
      #theme-claude .notion-code .token.tag,
      #theme-claude pre[class*='language-'] .token.constant,
      #theme-claude .notion-code .token.constant,
      #theme-claude pre[class*='language-'] .token.symbol,
      #theme-claude .notion-code .token.symbol,
      #theme-claude pre[class*='language-'] .token.deleted,
      #theme-claude .notion-code .token.deleted {
        color: var(--claude-code-token-property) !important;
      }
      #theme-claude pre[class*='language-'] .token.operator,
      #theme-claude .notion-code .token.operator {
        color: var(--claude-code-token-operator) !important;
      }
      #theme-claude pre[class*='language-'] .token.entity,
      #theme-claude .notion-code .token.entity {
        color: var(--claude-code-token-entity) !important;
      }
      #theme-claude pre[class*='language-'] .token.url,
      #theme-claude .notion-code .token.url {
        color: var(--claude-code-token-url) !important;
      }
      #theme-claude pre[class*='language-'] .token.variable,
      #theme-claude .notion-code .token.variable {
        color: var(--claude-code-token-variable) !important;
      }
      #theme-claude pre[class*='language-'] .token.regex,
      #theme-claude .notion-code .token.regex,
      #theme-claude pre[class*='language-'] .token.important,
      #theme-claude .notion-code .token.important {
        color: var(--claude-code-token-important) !important;
      }

      /* Remove residual shadow from Prism themes and global notion.css */
      #theme-claude .code-toolbar,
      #theme-claude .code-toolbar pre,
      #theme-claude pre[class*='language-'],
      #theme-claude .collapse-wrapper > div {
        box-shadow: none !important;
      }
      #theme-claude pre[class*='language-']::before,
      #theme-claude pre[class*='language-']::after {
        content: none !important;
        display: none !important;
        box-shadow: none !important;
      }

      /* Hide Mac-style dots */
      #theme-claude .pre-mac {
        display: none !important;
      }

      /* Prism toolbar: keep only copy button and pin it to top-right */
      #theme-claude .code-toolbar > .toolbar {
        position: absolute !important;
        top: 0.75rem !important;
        right: 0.75rem !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.375rem !important;
        opacity: 1 !important;
        z-index: 5 !important;
      }
      #theme-claude .code-toolbar > .toolbar > .toolbar-item {
        display: inline-flex !important;
        align-items: center !important;
      }
      #theme-claude .code-toolbar > .toolbar > .toolbar-item > span {
        display: none !important;
      }
      #theme-claude .code-toolbar .copy-to-clipboard-button {
        height: 26px !important;
        width: 26px !important;
        min-height: 26px !important;
        min-width: 26px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        border: none !important;
        border-radius: 0.375rem !important;
        background: transparent !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
        cursor: pointer !important;
        font-size: 0 !important;
        line-height: 0 !important;
        position: relative !important;
        color: transparent !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
        background-size: 16px 16px !important;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTgnIGhlaWdodD0nMTgnIHZpZXdCb3g9JzAgMCAxOCAxOCcgZmlsbD0nbm9uZScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNMTQuMjUgNS4yNUg3LjI1QzYuMTQ1NDMgNS4yNSA1LjI1IDYuMTQ1NDMgNS4yNSA3LjI1VjE0LjI1QzUuMjUgMTUuMzU0NiA2LjE0NTQzIDE2LjI1IDcuMjUgMTYuMjVIMTQuMjVDMTUuMzU0NiAxNi4yNSAxNi4yNSAxNS4zNTQ2IDE2LjI1IDE0LjI1VjcuMjVDMTYuMjUgNi4xNDU0MyAxNS4zNTQ2IDUuMjUgMTQuMjUgNS4yNVonIHN0cm9rZT0nIzlDQTNBRicgc3Ryb2tlLXdpZHRoPScxLjUnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgc3Ryb2tlLWxpbmVqb2luPSdyb3VuZCcvPjxwYXRoIGQ9J00yLjgwMTAzIDExLjk5OEwxLjc3MjAzIDUuMDczOTdDMS42MTAwMyAzLjk4MDk3IDIuMzY0MDMgMi45NjM5NyAzLjQ1NjAzIDIuODAxOTdMMTAuMzggMS43NzI5N0MxMS4zMTMgMS42MzM5NyAxMi4xOSAyLjE2Mjk3IDEyLjUyOCAzLjAwMDk3JyBzdHJva2U9JyM5Q0EzQUYnIHN0cm9rZS13aWR0aD0nMS41JyBzdHJva2UtbGluZWNhcD0ncm91bmQnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnLz48L3N2Zz4=') !important;
      }
      .dark #theme-claude .code-toolbar .copy-to-clipboard-button {
        background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTgnIGhlaWdodD0nMTgnIHZpZXdCb3g9JzAgMCAxOCAxOCcgZmlsbD0nbm9uZScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNMTQuMjUgNS4yNUg3LjI1QzYuMTQ1NDMgNS4yNSA1LjI1IDYuMTQ1NDMgNS4yNSA3LjI1VjE0LjI1QzUuMjUgMTUuMzU0NiA2LjE0NTQzIDE2LjI1IDcuMjUgMTYuMjVIMTQuMjVDMTUuMzU0NiAxNi4yNSAxNi4yNSAxNS4zNTQ2IDE2LjI1IDE0LjI1VjcuMjVDMTYuMjUgNi4xNDU0MyAxNS4zNTQ2IDUuMjUgMTQuMjUgNS4yNVonIHN0cm9rZT0nI0ZGRkZGRjY2JyBzdHJva2Utd2lkdGg9JzEuNScgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJyBzdHJva2UtbGluZWpvaW49J3JvdW5kJy8+PHBhdGggZD0nTTIuODAxMDMgMTEuOTk4TDEuNzcyMDMgNS4wNzM5N0MxLjYxMDAzIDMuOTgwOTcgMi4zNjQwMyAyLjk2Mzk3IDMuNDU2MDMgMi44MDE5N0wxMC4zOCAxLjc3Mjk3QzExLjMxMyAxLjYzMzk3IDEyLjE5IDIuMTYyOTcgMTIuNTI4IDMuMDAwOTcnIHN0cm9rZT0nI0ZGRkZGRjY2JyBzdHJva2Utd2lkdGg9JzEuNScgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJyBzdHJva2UtbGluZWpvaW49J3JvdW5kJy8+PC9zdmc+') !important;
      }
      #theme-claude .code-toolbar .copy-to-clipboard-button:hover {
        background-color: rgb(0 0 0 / 0.04) !important;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTgnIGhlaWdodD0nMTgnIHZpZXdCb3g9JzAgMCAxOCAxOCcgZmlsbD0nbm9uZScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNMTQuMjUgNS4yNUg3LjI1QzYuMTQ1NDMgNS4yNSA1LjI1IDYuMTQ1NDMgNS4yNSA3LjI1VjE0LjI1QzUuMjUgMTUuMzU0NiA2LjE0NTQzIDE2LjI1IDcuMjUgMTYuMjVIMTQuMjVDMTUuMzU0NiAxNi4yNSAxNi4yNSAxNS4zNTQ2IDE2LjI1IDE0LjI1VjcuMjVDMTYuMjUgNi4xNDU0MyAxNS4zNTQ2IDUuMjUgMTQuMjUgNS4yNVonIHN0cm9rZT0nIzZCNzI4MCcgc3Ryb2tlLXdpZHRoPScxLjUnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgc3Ryb2tlLWxpbmVqb2luPSdyb3VuZCcvPjxwYXRoIGQ9J00yLjgwMTAzIDExLjk5OEwxLjc3MjAzIDUuMDczOTdDMS42MTAwMyAzLjk4MDk3IDIuMzY0MDMgMi45NjM5NyAzLjQ1NjAzIDIuODAxOTdMMTAuMzggMS43NzI5N0MxMS4zMTMgMS42MzM5NyAxMi4xOSAyLjE2Mjk3IDEyLjUyOCAzLjAwMDk3JyBzdHJva2U9JyM2QjcyODAnIHN0cm9rZS13aWR0aD0nMS41JyBzdHJva2UtbGluZWNhcD0ncm91bmQnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnLz48L3N2Zz4=') !important;
      }
      .dark #theme-claude .code-toolbar .copy-to-clipboard-button:hover {
        background-color: rgb(255 255 255 / 0.06) !important;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTgnIGhlaWdodD0nMTgnIHZpZXdCb3g9JzAgMCAxOCAxOCcgZmlsbD0nbm9uZScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNMTQuMjUgNS4yNUg3LjI1QzYuMTQ1NDMgNS4yNSA1LjI1IDYuMTQ1NDMgNS4yNSA3LjI1VjE0LjI1QzUuMjUgMTUuMzU0NiA2LjE0NTQzIDE2LjI1IDcuMjUgMTYuMjVIMTQuMjVDMTUuMzU0NiAxNi4yNSAxNi4yNSAxNS4zNTQ2IDE2LjI1IDE0LjI1VjcuMjVDMTYuMjUgNi4xNDU0MyAxNS4zNTQ2IDUuMjUgMTQuMjUgNS4yNVonIHN0cm9rZT0nI0ZGRkZGRjk5JyBzdHJva2Utd2lkdGg9JzEuNScgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJyBzdHJva2UtbGluZWpvaW49J3JvdW5kJy8+PHBhdGggZD0nTTIuODAxMDMgMTEuOTk4TDEuNzcyMDMgNS4wNzM5N0MxLjYxMDAzIDMuOTgwOTcgMi4zNjQwMyAyLjk2Mzk3IDMuNDU2MDMgMi44MDE5N0wxMC4zOCAxLjc3Mjk3QzExLjMxMyAxLjYzMzk3IDEyLjE5IDIuMTYyOTcgMTIuNTI4IDMuMDAwOTcnIHN0cm9rZT0nI0ZGRkZGRjk5JyBzdHJva2Utd2lkdGg9JzEuNScgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJyBzdHJva2UtbGluZWpvaW49J3JvdW5kJy8+PC9zdmc+') !important;
      }
      #theme-claude .code-toolbar .copy-to-clipboard-button span {
        display: none !important;
      }

      /* Remove Notion copy button to avoid duplicates */
      #theme-claude .notion-code .notion-code-copy,
      #theme-claude .notion-code .notion-code-copy-button {
        display: none !important;
      }

      /* Inline code (non-pre): chip style */
      #theme-claude :not(pre) > code,
      #theme-claude .notion-inline-code,
      #theme-claude .prose :where(code):not(:where([class~=not-prose], [class~=not-prose] *)) {
        color: var(--tw-prose-code) !important;
        font-weight: 500 !important;
        font-size: 0.875em !important;
        font-variant-ligatures: none !important;
        /* 让浅色模式行内代码块的背景不显示 */
        background-color: transparent !important;
        border-radius: 0.25rem !important;
        padding: 0.125rem 0.375rem !important;
        font-family: var(--claude-mono-font) !important;
      }
      /* light mode: only apply text-current behavior */
      #theme-claude .\\[\\&_code\\]\\:\\!text-current code {
        color: currentColor !important;
      }
      .dark #theme-claude :not(pre) > code,
      .dark #theme-claude .notion-inline-code {
        background-color: transparent !important;
        color: var(--claude-text-strong) !important;
      }
      /* Quote inline code: keep code font */
      #theme-claude .notion-quote :not(pre) > code,
      #theme-claude .notion-quote .notion-inline-code {
        font-family: var(--claude-mono-font) !important;
      }
      .dark #theme-claude .notion-quote :not(pre) > code,
      .dark #theme-claude .notion-quote .notion-inline-code {
        background-color: rgb(255 255 255 / 0.08) !important;
        color: inherit !important;
        font-size: inherit !important;
      }

      /* Code block scrollbar — mirror Claude docs utility behavior */
      #theme-claude .notion-code,
      #theme-claude .code-toolbar pre,
      #theme-claude pre[class*='language-'] {
        overflow-x: auto !important;
        overflow-y: hidden !important;
        --scrollbar-track: transparent;
        --scrollbar-corner: transparent;
        --scrollbar-track-radius: 0.25rem;
        --scrollbar-corner-radius: 0.25rem;
        --scrollbar-thumb-radius: var(--rounded, 0.25rem);
        --scrollbar-thumb: rgb(0 0 0 / 0.15);
        --scrollbar-thumb-hover: rgb(0 0 0 / 0.2);
        --scrollbar-thumb-active: rgb(0 0 0 / 0.2);
        /* Use auto so custom WebKit thickness can take effect reliably */
        scrollbar-width: auto !important;
        scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track) !important;
      }
      .dark #theme-claude .notion-code,
      .dark #theme-claude .code-toolbar pre,
      .dark #theme-claude pre[class*='language-'] {
        --scrollbar-thumb: rgb(255 255 255 / 0.2) !important;
        --scrollbar-thumb-hover: rgb(255 255 255 / 0.25) !important;
        --scrollbar-thumb-active: rgb(255 255 255 / 0.25) !important;
        scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track) !important;
      }
      #theme-claude .notion-code:hover,
      #theme-claude .code-toolbar pre:hover,
      #theme-claude pre[class*='language-']:hover {
        --scrollbar-thumb: var(--scrollbar-thumb-hover) !important;
      }
      #theme-claude .notion-code:active,
      #theme-claude .code-toolbar pre:active,
      #theme-claude pre[class*='language-']:active {
        --scrollbar-thumb: var(--scrollbar-thumb-active) !important;
      }
      #theme-claude .notion-code::-webkit-scrollbar,
      #theme-claude .code-toolbar pre::-webkit-scrollbar,
      #theme-claude pre[class*='language-']::-webkit-scrollbar {
        display: block !important;
        width: 8px !important;
        height: 8px !important;
      }
      #theme-claude .notion-code::-webkit-scrollbar:horizontal,
      #theme-claude .code-toolbar pre::-webkit-scrollbar:horizontal,
      #theme-claude pre[class*='language-']::-webkit-scrollbar:horizontal {
        height: 8px !important;
      }
      #theme-claude .notion-code::-webkit-scrollbar:vertical,
      #theme-claude .code-toolbar pre::-webkit-scrollbar:vertical,
      #theme-claude pre[class*='language-']::-webkit-scrollbar:vertical {
        width: 8px !important;
      }
      #theme-claude .notion-code::-webkit-scrollbar-track,
      #theme-claude .code-toolbar pre::-webkit-scrollbar-track,
      #theme-claude pre[class*='language-']::-webkit-scrollbar-track {
        background-color: var(--scrollbar-track) !important;
        border-radius: var(--scrollbar-track-radius) !important;
      }
      #theme-claude .notion-code::-webkit-scrollbar-corner,
      #theme-claude .code-toolbar pre::-webkit-scrollbar-corner,
      #theme-claude pre[class*='language-']::-webkit-scrollbar-corner {
        background-color: var(--scrollbar-corner) !important;
        border-radius: var(--scrollbar-corner-radius) !important;
      }
      #theme-claude .notion-code::-webkit-scrollbar-thumb,
      #theme-claude .code-toolbar pre::-webkit-scrollbar-thumb,
      #theme-claude pre[class*='language-']::-webkit-scrollbar-thumb {
        background-color: var(--scrollbar-thumb) !important;
        border-radius: var(--scrollbar-thumb-radius) !important;
      }

      /* Force horizontal scrolling instead of wrapping for long code lines */
      #theme-claude .notion-code,
      #theme-claude .code-toolbar pre,
      #theme-claude pre[class*='language-'],
      #theme-claude pre[class*='language-'] code {
        white-space: pre !important;
        word-break: normal !important;
        overflow-wrap: normal !important;
      }

      /* ========================================
       * TABLE OF CONTENTS (RIGHT SIDEBAR)
       * No left-border. Light: bold black; Dark: terracotta
       * ======================================== */
      .catalog-wrapper {
        padding: 0;
        font-family: var(--claude-body-font);
      }

      /* TOC title — clickable, scrolls to top */
      .catalog-title {
        font-family: var(--claude-body-font) !important;
        font-weight: 500 !important;
        font-size: 0.8125rem !important;
        color: var(--claude-text-primary) !important;
        text-transform: none !important;
        letter-spacing: normal !important;
        margin-bottom: 0.75rem;
        padding: 0;
      }
      .catalog-title:hover {
        color: var(--claude-accent) !important;
      }

      /* TOC nav */
      .toc-nav {
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      /* TOC item base */
      .toc-item {
        font-size: 0.875rem;
        line-height: 1.6;
        padding: 0.125rem 0;
        cursor: pointer;
        text-decoration: none !important;
      }

      /* Inactive */
      .toc-item.toc-inactive {
        color: var(--claude-text-tertiary);
        font-weight: 400;
      }
      .dark .toc-item.toc-inactive {
        color: #9E9E9E;
      }
      .toc-item.toc-inactive:hover {
        color: var(--claude-text-secondary);
      }

      /* Highlighted — ancestor of active */
      .toc-item.toc-highlighted {
        color: var(--claude-text-primary);
        font-weight: 600;
      }
      .dark .toc-item.toc-highlighted {
        color: var(--claude-accent);
        font-weight: 600;
      }

      /* Active — current section */
      .toc-item.toc-active {
        color: var(--claude-text-primary);
        font-weight: 600;
      }
      .dark .toc-item.toc-active {
        color: var(--claude-accent);
        font-weight: 600;
      }

      /* TOC scrollbar — hidden */
      .catalog-list {
        scrollbar-width: none;
      }
      .catalog-list::-webkit-scrollbar {
        display: none;
      }

      /* ========================================
       * BLOG NAME / HEADER
       * ======================================== */
      #blog-name, #blog-name-en {
        font-family: var(--claude-heading-font);
        font-weight: 400;
        letter-spacing: -0.02em;
        color: var(--claude-text-primary);
      }
      .dark .claude-site-title,
      .dark .claude-site-subtitle,
      .dark #blog-name,
      .dark #blog-name-en {
        color: var(--claude-text-strong) !important;
      }

      /* ========================================
       * SCROLLBAR — Global minimalist
       * ======================================== */
      ::-webkit-scrollbar {
        width: 5px; height: 5px;
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
      .claude-sidebar .claude-footer {
        width: 100%;
        padding-left: 0.75rem;
        padding-right: 0.75rem;
        text-align: center;
      }

      /* Disable transitions only during color-mode switching */
      html.claude-theme-switching #theme-claude,
      html.claude-theme-switching #theme-claude *,
      html.claude-theme-switching #theme-claude *::before,
      html.claude-theme-switching #theme-claude *::after {
        transition-property: none;
        transition-duration: 0s;
        transition-delay: 0s;
        animation: none;
      }

      /* Hide scrollbar utility */
      .scroll-hidden::-webkit-scrollbar { display: none; }
      .scroll-hidden {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}</style>
  )
}

export { Style }
