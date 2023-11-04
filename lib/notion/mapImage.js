import BLOG from '@/blog.config'

/**
 * 压缩图片
 * 1. Notion图床可以通过指定url-query参数来压缩裁剪图片 例如 ?xx=xx&width=400
 * 2. UnPlash 图片可以通过api q=50 控制压缩质量 width=400 控制图片尺寸
 * @param {*} image
 */
const compressImage = (image, width = 800, quality = 50, fmt = 'webp') => {
  if (!image) {
    return null
  }
  if (image.indexOf(BLOG.NOTION_HOST) === 0 && image.indexOf('amazonaws.com') > 0) {
    return `${image}&width=${width}`
  }
  // 压缩unsplash图片
  if (image.indexOf('https://images.unsplash.com/') === 0) {
    // 将URL解析为一个对象
    const urlObj = new URL(image)
    // 获取URL参数
    const params = new URLSearchParams(urlObj.search)
    // 将q参数的值替换
    params.set('q', quality)
    // 尺寸
    params.set('width', width)
    // 格式
    params.set('fmt', fmt)
    params.set('fm', fmt)
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
  const isNotionImg = ret.indexOf('secure.notion-static.com') > 0 || ret.indexOf('prod-files-secure') > 0
  const isImgBlock = BLOG.IMG_URL_TYPE === 'Notion' || type !== 'block'
  if (isNotionImg && isImgBlock) {
    ret = BLOG.NOTION_HOST + '/image/' + encodeURIComponent(ret) + '?table=' + type + '&id=' + block.id
  }

  if (!isEmoji(ret)) {
    // 随机图片接口优化 防止因url一致而随机结果相同
    const separator = ret.includes('?') ? '&' : '?'
    // 拼接唯一识别参数，防止请求的图片被缓存
    ret = `${ret.trim()}${separator}t=${block.id}`
  }

  // 文章封面
  if (from === 'pageCoverThumbnail') {
    ret = compressImage(ret)
  }

  return ret
}

function isEmoji(str) {
  const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}]/u;
  return emojiRegex.test(str);
}

export { mapImgUrl, compressImage }
