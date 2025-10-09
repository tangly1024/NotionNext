/**
 * Butterfly
 * label
 * {% label text color %}
 */

'use strict'

const addLabel = args => {
  const [text, className = 'default'] = args
  return `<mark class="hl-label ${className}">${text}</mark>`
}

hexo.extend.tag.register('label', addLabel, { ends: false })
