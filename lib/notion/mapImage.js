import BLOG from '@/blog.config'

/**
 * 压缩图片
 * 1. Notion图床可以通过指定url-query参数来压缩裁剪图片 例如 ?xx=xx&width=400
 * 2. UnPlash 图片可以通过api q=50 控制压缩质量 width=400 控制图片尺寸
 * @param {*} image
 */
const compressImage = (image, width = 400) => {
  if (!image) {
    return null
  }
  if (image.indexOf(BLOG.NOTION_HOST) === 0) {
    return `${image}&width=${width}`
  }
  // 压缩unsplash图片
  if (image.indexOf('https://images.unsplash.com/') === 0) {
    // 将URL解析为一个对象
    const urlObj = new URL(image)
    // 获取URL参数
    const params = new URLSearchParams(urlObj.search)
    // 将q参数的值替换
    params.set('q', '50')
    // 尺寸
    params.set('width', width)
    // 格式
    params.set('fmt', 'webp')
    // 生成新的URL
    urlObj.search = params.toString()
    return urlObj.toString()
  }

  // 此处还可以添加您的自定义图传的封面图压缩参数。
  // .e.g
  if (image.indexOf('https://your_picture_bed') === 0) {
    return 'do_somethin_here'
  }

  return image
}

/**
 * 图片映射
 * 1. 如果是 /xx.xx 相对路径格式，则转化为 完整notion域名图片
 * 2. 如果是 bookmark类型的block 图片封面无需处理
 * @param {*} img
 * @param {*} value
 * @returns
 */
const mapImgUrl = (img, block, type = 'block', from) => {
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

  // Notion 图床转换为永久地址
  if (ret.indexOf('secure.notion-static.com') > 0 && (BLOG.IMG_URL_TYPE === 'Notion' || type !== 'block')) {
    ret = BLOG.NOTION_HOST + '/image/' + encodeURIComponent(ret) + '?table=' + type + '&id=' + block.id
  }

  // 文章封面
  if (from === 'pageCoverThumbnail') {
    ret = compressImage(ret)
  }

  return ret
}

export { mapImgUrl, compressImage }
