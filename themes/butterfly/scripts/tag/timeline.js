/**
 * Timeline tag for Hexo
 * Syntax:
 * {% timeline [headline],[color] %}
 * <!-- timeline [title] -->
 * [content]
 * <!-- endtimeline -->
 * <!-- timeline [title] -->
 * [content]
 * <!-- endtimeline -->
 * {% endtimeline %}
 */

'use strict'

const timeLineFn = (args, content) => {
  // Use named capture groups for better readability
  const tlBlock = /<!--\s*timeline\s*(?<title>.*?)\s*-->\n(?<content>[\s\S]*?)<!--\s*endtimeline\s*-->/g

  // Pre-compile markdown render function
  const renderMd = text => hexo.render.renderSync({ text, engine: 'markdown' })

  // Parse arguments more efficiently
  const [text, color = ''] = args.length ? args.join(' ').split(',') : []

  // Build initial headline if text exists
  const headline = text
    ? `<div class='timeline-item headline'>
        <div class='timeline-item-title'>
          <div class='item-circle'>${renderMd(text)}</div>
        </div>
      </div>`
    : ''

  // Match all timeline blocks in one pass and transform
  const items = Array.from(content.matchAll(tlBlock))
    .map(({ groups: { title, content } }) =>
      `<div class='timeline-item'>
        <div class='timeline-item-title'>
          <div class='item-circle'>${renderMd(title)}</div>
        </div>
        <div class='timeline-item-content'>${renderMd(content)}</div>
      </div>`
    )
    .join('')

  return `<div class="timeline ${color}">${headline}${items}</div>`
}

hexo.extend.tag.register('timeline', timeLineFn, { ends: true })
