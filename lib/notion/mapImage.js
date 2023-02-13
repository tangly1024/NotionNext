/**
 * Notion图片映射处理有emjji的图标
 * @param {*} img
 * @param {*} value
 * @returns
 */
const mapImgUrl = (img, block, type = 'block') => {
  let ret = null
  if (!img) {
    return ret
  }
  // 相对目录，则视为notion的自带图片
  if (img.startsWith('/')) ret = 'https://www.notion.so' + img

  // 书签的地址本身就是永久链接，无需处理
  if (!ret && block?.type === 'bookmark') {
    ret = img
  }

  // notion永久图床地址
  if (!ret && img.indexOf('secure.notion-static.com') > 0) {
    ret = 'https://www.notion.so/image/' + encodeURIComponent(img) + '?table=' + type + '&id=' + block.id
  }

  // 剩余的是第三方图片url或emoji
  if (!ret) {
    ret = img
  }

  return ret
}

export { mapImgUrl }
