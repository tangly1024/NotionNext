import BLOG from '@/blog.config'

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
  const isNotionSignImg = ret.indexOf('https://www.notion.so/image') !== 0 && (ret.indexOf('secure.notion-static.com') > 0 || ret.indexOf('prod-files-secure') > 0)
  const isImgBlock = BLOG.IMG_URL_TYPE === 'Notion' || type !== 'block'
  if (isNotionSignImg && isImgBlock) {
    ret = BLOG.NOTION_HOST + '/image/' + encodeURIComponent(ret) + '?table=' + type + '&id=' + block.id
  }

  if (!isEmoji(ret) && ret.indexOf('notion.so/images/page-cover') < 0) {
    if (BLOG.RANDOM_IMAGE_URL) {
      // 只有配置了随机图片接口，才会替换图片
      const texts = BLOG.RANDOM_IMAGE_REPLACE_TEXT
      let isReplace = false;
      if (texts) {
        const textArr = texts.split(',')
        // 判断是否包含替换的文本
        textArr.forEach(text => {
          if (ret.indexOf(text) > -1) {
            isReplace = true
          }
        })
      } else {
        isReplace = true
      }
      if (isReplace) {
        ret = BLOG.RANDOM_IMAGE_URL
      }
    }

    // 图片url优化，确保每一篇文章的图片url唯一
    if (ret && ret.length > 4) {
      // 图片接口拼接唯一识别参数，防止请求的图片被缓，而导致随机结果相同
      const separator = ret.includes('?') ? '&' : '?'
      ret = `${ret.trim()}${separator}t=${block.id}`
    }
  }

  // 文章封面压缩
  if (from === 'pageCoverThumbnail' || block.type === 'image') {
  // 统一压缩图片
    const width = block?.format?.block_width
    ret = compressImage(ret, width)
  }

  return ret
}

/**
 * 是否是emoji图标
 * @param {*} str
 * @returns
 */
function isEmoji(str) {
  const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{238C}\u{2B06}\u{2B07}\u{2B05}\u{27A1}\u{2194}-\u{2199}\u{2194}\u{21A9}\u{21AA}\u{2934}\u{2935}\u{25AA}\u{25AB}\u{25FE}\u{25FD}\u{25FB}\u{25FC}\u{25B6}\u{25C0}\u{1F200}-\u{1F251}]/u;
  return emojiRegex.test(str);
}

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
    return `${image}&width=${width}&cache=v2`
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

export { mapImgUrl, compressImage }
