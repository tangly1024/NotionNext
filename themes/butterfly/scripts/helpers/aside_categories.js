'use strict'

hexo.extend.helper.register('aside_categories', function (categories, options = {}) {
  if (!categories || !Object.prototype.hasOwnProperty.call(categories, 'length')) {
    options = categories || {}
    categories = this.site.categories
  }

  if (!categories || !categories.length) return ''

  const { config } = this
  const showCount = Object.prototype.hasOwnProperty.call(options, 'show_count') ? options.show_count : true
  const depth = options.depth ? parseInt(options.depth, 10) : 0
  const orderby = options.orderby || 'name'
  const order = options.order || 1
  const categoryDir = this.url_for(config.category_dir)
  const limit = options.limit === 0 ? categories.length : (options.limit || categories.length)
  const isExpand = options.expand !== 'none'
  const expandClass = isExpand && options.expand === true ? 'expand' : ''
  const buttonLabel = this._p('aside.more_button')

  const prepareQuery = parent => {
    const query = parent ? { parent } : { parent: { $exists: false } }
    return categories.find(query).sort(orderby, order).filter(cat => cat.length)
  }

  const hierarchicalList = (remaining, level = 0, parent) => {
    let result = ''
    if (remaining > 0) {
      prepareQuery(parent).forEach(cat => {
        if (remaining > 0) {
          remaining -= 1
          let child = ''
          if (!depth || level + 1 < depth) {
            const childList = hierarchicalList(remaining, level + 1, cat._id)
            child = childList.result
            remaining = childList.remaining
          }

          const parentClass = isExpand && !parent && child ? 'parent' : ''
          result += `<li class="card-category-list-item ${parentClass}">`
          result += `<a class="card-category-list-link" href="${this.url_for(cat.path)}">`
          result += `<span class="card-category-list-name">${cat.name}</span>`

          if (showCount) {
            result += `<span class="card-category-list-count">${cat.length}</span>`
          }

          if (isExpand && !parent && child) {
            result += `<i class="fas fa-caret-left ${expandClass}"></i>`
          }

          result += '</a>'

          if (child) {
            result += `<ul class="card-category-list child">${child}</ul>`
          }

          result += '</li>'
        }
      })
    }
    return { result, remaining }
  }

  const list = hierarchicalList(limit)

  const moreButton = categories.length > limit
    ? `<a class="card-more-btn" href="${categoryDir}/" title="${buttonLabel}">
      <i class="fas fa-angle-right"></i></a>`
    : ''

  return `<div class="item-headline">
            <i class="fas fa-folder-open"></i>
            <span>${this._p('aside.card_categories')}</span>
            ${moreButton}
          </div>
          <ul class="card-category-list${isExpand && list.result ? ' expandBtn' : ''}" id="aside-cat-list">
            ${list.result}
          </ul>`
})
