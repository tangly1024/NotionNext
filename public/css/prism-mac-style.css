/**
 * @author https://github.com/txs
 * 通用 Mac 风格代码块样式 (NotionNext Universal)
 **/

/* 1. Mac 窗口容器样式 */
.code-toolbar {
  position: relative;
  width: 100%;
  margin: 1rem 0;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(27, 28, 32, 0.94); /* 浅色模式下默认暗底 */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12), 0 18px 44px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

/* 暗色模式适配 */
html.dark .code-toolbar {
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(27, 28, 32, 0.72);
  -webkit-backdrop-filter: saturate(140%) blur(12px);
  backdrop-filter: saturate(140%) blur(12px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35), 0 18px 44px rgba(0, 0, 0, 0.45);
}

/* 2. Mac 三色点 */
.pre-mac {
  position: absolute;
  left: 12px;
  top: 11px;
  z-index: 13;
  display: flex;
  gap: 7px;
}

.pre-mac > span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.pre-mac > span:nth-child(1) { background: #ff5f57; }
.pre-mac > span:nth-child(2) { background: #febc2e; }
.pre-mac > span:nth-child(3) { background: #28c840; }

/* 3. Toolbar 工具栏 (复制按钮、语言标签) */
.code-toolbar > .toolbar {
  position: absolute;
  top: 0;
  right: 0;
  height: 34px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  z-index: 12;
}

.code-toolbar .toolbar-item > button {
  font-size: 12px !important;
  line-height: 1 !important;
  padding: 6px 8px !important;
  border-radius: 999px !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  background: rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 255, 255, 0.82) !important;
  cursor: pointer;
  transition: all 0.2s ease;
}

.code-toolbar .toolbar-item > button:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
}

/* 4. 代码正文排版 */
pre.notion-code {
  font-size: 0.92em !important;
  line-height: 1.6 !important;
  margin: 0 !important;
  padding: 46px 1.1rem 1rem !important;
  border-radius: 0 !important;
  border: none !important;
  background: transparent !important;
  color: rgba(255, 255, 255, 0.9) !important;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

/* 5. 智能折叠 S1 极简 UI */
.collapse-wrapper {
  margin: 1rem 0;
}

.collapse-panel-wrapper {
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.55);
  -webkit-backdrop-filter: saturate(160%) blur(10px);
  backdrop-filter: saturate(160%) blur(10px);
  overflow: hidden;
  transition: all 0.3s ease;
}

html.dark .collapse-panel-wrapper {
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(27, 28, 32, 0.6);
}

.collapse-header {
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  cursor: pointer;
  user-select: none;
  border: none;
  background: transparent;
  color: rgba(60, 60, 67, 0.6);
}

html.dark .collapse-header {
  color: rgba(235, 235, 245, 0.6);
}

.collapse-label {
  font-size: 13px;
  letter-spacing: 0.02em;
}

.collapse-chevron {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
  opacity: 0.8;
}

.collapse-panel-wrapper.is-expanded .collapse-chevron {
  transform: rotate(180deg);
}

.collapse-panel {
  max-height: 0;
  overflow: hidden;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  transition: max-height 0.32s ease;
}

html.dark .collapse-panel {
  border-top-color: rgba(255, 255, 255, 0.08);
}

.collapse-panel.is-expanded {
  max-height: 3000px;
}

/* 6. Prism 代码高亮补丁 (暗底优化) */
.code-toolbar .token.comment,
.code-toolbar .token.prolog,
.code-toolbar .token.doctype,
.code-toolbar .token.cdata { color: rgba(235, 235, 245, 0.46); }
.code-toolbar .token.punctuation { color: rgba(235, 235, 245, 0.6); }
.code-toolbar .token.property,
.code-toolbar .token.tag,
.code-toolbar .token.boolean,
.code-toolbar .token.number,
.code-toolbar .token.constant,
.code-toolbar .token.symbol,
.code-toolbar .token.deleted { color: #7ee787; }
.code-toolbar .token.selector,
.code-toolbar .token.attr-name,
.code-toolbar .token.string,
.code-toolbar .token.char,
.code-toolbar .token.builtin,
.code-toolbar .token.inserted { color: #a5d6ff; }
.code-toolbar .token.atrule,
.code-toolbar .token.attr-value,
.code-toolbar .token.keyword { color: #ff7ab2; }
.code-toolbar .token.function,
.code-toolbar .token.class-name { color: #ffd479; }
