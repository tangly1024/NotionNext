/**
 * Stylus renderer
 */

'use strict'

hexo.extend.filter.register('stylus:renderer', style => {
  const { syntax_highlighter: syntaxHighlighter, highlight, prismjs } = hexo.config
  let { enable: highlightEnable, line_number: highlightLineNumber } = highlight
  let { enable: prismjsEnable, line_number: prismjsLineNumber } = prismjs

  // for hexo > 7.0
  if (syntaxHighlighter) {
    highlightEnable = syntaxHighlighter === 'highlight.js'
    prismjsEnable = syntaxHighlighter === 'prismjs'
  }

  style.define('$highlight_enable', highlightEnable)
    .define('$highlight_line_number', highlightLineNumber)
    .define('$prismjs_enable', prismjsEnable)
    .define('$prismjs_line_number', prismjsLineNumber)
    .define('$language', hexo.config.language)
  // .import(`${this.source_dir.replace(/\\/g, '/')}_data/css/*`)
})
