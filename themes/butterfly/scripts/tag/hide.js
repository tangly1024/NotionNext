/**
 * Butterfly
 * @example
 * hideInline
 * {% hideInline content,display,bg,color %}
 * content不能包含當引號，可用 &apos;
 * hideBlock
 * {% hideBlock display,bg,color %}
 * content
 * {% endhideBlock %}
 * hideToggle
 * {% hideToggle display,bg,color %}
 * content
 * {% endhideToggle %}
 */

'use strict'

const parseArgs = args => args.join(' ').split(',')

const generateStyle = (bg, color) => {
  let style = 'style="'
  if (bg) style += `background-color: ${bg};`
  if (color) style += `color: ${color}`
  style += '"'
  return style
}

const hideInline = args => {
  const [content, display = 'Click', bg = false, color = false] = parseArgs(args)
  const style = generateStyle(bg, color)
  return `<span class="hide-inline"><button type="button" class="hide-button" ${style}>${display}</button><span class="hide-content">${content}</span></span>`
}

const hideBlock = (args, content) => {
  const [display = 'Click', bg = false, color = false] = parseArgs(args)
  const style = generateStyle(bg, color)
  const renderedContent = hexo.render.renderSync({ text: content, engine: 'markdown' })
  return `<div class="hide-block"><button type="button" class="hide-button" ${style}>${display}</button><div class="hide-content">${renderedContent}</div></div>`
}

const hideToggle = (args, content) => {
  const [display, bg = false, color = false] = parseArgs(args)
  const style = generateStyle(bg, color)
  const border = bg ? `style="border: 1px solid ${bg}"` : ''
  const renderedContent = hexo.render.renderSync({ text: content, engine: 'markdown' })
  return `<details class="toggle" ${border}><summary class="toggle-button" ${style}>${display}</summary><div class="toggle-content">${renderedContent}</div></details>`
}

hexo.extend.tag.register('hideInline', hideInline)
hexo.extend.tag.register('hideBlock', hideBlock, { ends: true })
hexo.extend.tag.register('hideToggle', hideToggle, { ends: true })
