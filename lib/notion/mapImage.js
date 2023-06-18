import BLOG from '@/blog.config'

/**
 * notion图片可以通过指定url-query参数来压缩裁剪图片 例如 ?width=200
 * @param {*} image
 */
const compressImage = (image) => {
  if (image && image.indexOf(BLOG.NOTION_HOST) === 0) {
    return image + '&width=200'
  }
}

/**
 * 图片映射
 * 1. 如果是 /xx.xx 相对路径格式，则转化为 完整notion域名图片
 * 2. 如果是 bookmark类型的block 图片封面无需处理
 * @param {*} img
 * @param {*} value
 * @returns
 */
const mapImgUrl = (img, block, type = 'block') => {
  if (!img) {
    return null
  }
  let ret = null
  // 相对目录，则视为notion的自带图片
  if (img.startsWith('/')) {
    ret = BLOG.NOTION_HOST + img
  } else {
    ret = img
  }

  // 书签的地址本身就是永久链接，无需处理
  if (block?.type === 'bookmark') {
    ret = img
  }

  // notion 图床转换为永久图床地址
  if (ret.indexOf('secure.notion-static.com') > 0 && (BLOG.IMG_URL_TYPE === 'Notion' || type !== 'block')) {
    ret = BLOG.NOTION_HOST + '/image/' + encodeURIComponent(ret) + '?table=' + type + '&id=' + block.id
  }
  console.log('图床', ret)
  return ret
}

export { mapImgUrl, compressImage }
