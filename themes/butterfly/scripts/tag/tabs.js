/**
 * Tabs
 * transplant from hexo-theme-next
 * modify by Jerry
 */

'use strict'

const postTabs = (args, content) => {
  const tabBlock = /<!--\s*tab (.*?)\s*-->\n([\w\W\s\S]*?)<!--\s*endtab\s*-->/g
  args = args.join(' ').split(',')
  const tabName = args[0] || 'tab'
  const tabActive = Number(args[1]) || 0
  const matches = []
  let match
  let tabId = 0
  let tabNav = ''
  let tabContent = ''
  let noDefault = true

  while ((match = tabBlock.exec(content)) !== null) {
    matches.push(match[1], match[2])
  }

  for (let i = 0; i < matches.length; i += 2) {
    const [tabCaption = '', tabIcon = ''] = matches[i].split('@')
    let postContent = matches[i + 1]

    postContent = hexo.render.renderSync({ text: postContent, engine: 'markdown' }).trim()
    tabId += 1

    const caption = (tabCaption || tabIcon) ? tabCaption : `${tabName} ${tabId}`
    const iconHtml = tabIcon ? `<i class="${tabIcon.trim()}"></i>` : ''
    const isActive = (tabActive > 0 && tabActive === tabId) || (tabActive === 0 && tabId === 1) ? ' active' : ''

    if (isActive) noDefault = false

    tabNav += `<button type="button" class="tab${isActive}">${iconHtml}${caption.trim()}</button>`
    tabContent += `<div class="tab-item-content${isActive}">${postContent}</div>`
  }

  const toTop = '<div class="tab-to-top"><button type="button" aria-label="scroll to top"><i class="fas fa-arrow-up"></i></button></div>'
  tabNav = `<div class="nav-tabs${noDefault ? ' no-default' : ''}">${tabNav}</div>`
  tabContent = `<div class="tab-contents">${tabContent}</div>`

  return `<div class="tabs">${tabNav}${tabContent}${toTop}</div>`
}

hexo.extend.tag.register('tabs', postTabs, { ends: true })
hexo.extend.tag.register('subtabs', postTabs, { ends: true })
hexo.extend.tag.register('subsubtabs', postTabs, { ends: true })
