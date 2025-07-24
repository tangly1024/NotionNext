/**
 * 结构化数据生成器
 * 生成符合schema.org标准的JSON-LD结构化数据
 */

/**
 * 生成文章结构化数据
 * @param {Object} post 文章数据
 * @param {Object} siteInfo 网站信息
 * @param {string} baseUrl 基础URL
 * @returns {Object} Article schema
 */
export function generateArticleSchema(post, siteInfo, baseUrl) {
  if (!post) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary || post.title,
    image: post.pageCoverThumbnail || post.pageCover || `${baseUrl}/bg_image.jpg`,
    datePublished: post.publishDay,
    dateModified: post.lastEditedDay || post.publishDay,
    author: {
      '@type': 'Organization',
      name: siteInfo?.title || '分享之王'
    },
    publisher: {
      '@type': 'Organization',
      name: siteInfo?.title,
      logo: {
        '@type': 'ImageObject',
        url: siteInfo?.icon || `${baseUrl}/favicon.ico`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/${post.slug}`
    }
  }

  // 添加文章分类
  if (post.category && post.category.length > 0) {
    schema.articleSection = post.category[0]
  }

  // 添加标签
  if (post.tags && post.tags.length > 0) {
    schema.keywords = post.tags.join(', ')
  }

  // 添加字数统计
  if (post.wordCount) {
    schema.wordCount = post.wordCount
  }

  return schema
}

/**
 * 生成网站结构化数据
 * @param {Object} siteInfo 网站信息
 * @param {string} baseUrl 基础URL
 * @returns {Object} WebSite schema
 */
export function generateWebsiteSchema(siteInfo, baseUrl) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteInfo?.title,
    description: siteInfo?.description,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search/{search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  // 添加网站logo
  if (siteInfo?.icon) {
    schema.image = siteInfo.icon
  }

  return schema
}

/**
 * 生成组织结构化数据
 * @param {Object} siteInfo 网站信息
 * @param {string} baseUrl 基础URL
 * @returns {Object} Organization schema
 */
export function generateOrganizationSchema(siteInfo, baseUrl) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteInfo?.title,
    description: siteInfo?.description,
    url: baseUrl
  }

  // 添加logo
  if (siteInfo?.icon) {
    schema.logo = {
      '@type': 'ImageObject',
      url: siteInfo.icon
    }
  }

  // 添加社交媒体链接
  const socialLinks = []
  if (siteInfo?.socialLinks) {
    Object.values(siteInfo.socialLinks).forEach(link => {
      if (link && link.startsWith('http')) {
        socialLinks.push(link)
      }
    })
  }

  if (socialLinks.length > 0) {
    schema.sameAs = socialLinks
  }

  return schema
}

/**
 * 生成面包屑结构化数据
 * @param {Array} breadcrumbs 面包屑数据
 * @param {string} baseUrl 基础URL
 * @returns {Object} BreadcrumbList schema
 */
export function generateBreadcrumbSchema(breadcrumbs, baseUrl) {
  if (!breadcrumbs || breadcrumbs.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${baseUrl}${crumb.url}`
    }))
  }

  return schema
}

/**
 * 生成博客文章列表结构化数据
 * @param {Array} posts 文章列表
 * @param {Object} siteInfo 网站信息
 * @param {string} baseUrl 基础URL
 * @returns {Object} Blog schema
 */
export function generateBlogSchema(posts, siteInfo, baseUrl) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: siteInfo?.title,
    description: siteInfo?.description,
    url: baseUrl,
    author: {
      '@type': 'Organization',
      name: siteInfo?.title || '分享之王'
    }
  }

  // 添加最新文章
  if (posts && posts.length > 0) {
    schema.blogPost = posts.slice(0, 5).map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.summary,
      url: `${baseUrl}/${post.slug}`,
      datePublished: post.publishDay,
      author: {
        '@type': 'Organization',
        name: siteInfo?.title || '分享之王'
      }
    }))
  }

  return schema
}

/**
 * 生成FAQ结构化数据
 * @param {Array} faqs FAQ数据
 * @returns {Object} FAQPage schema
 */
export function generateFAQSchema(faqs) {
  if (!faqs || faqs.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return schema
}

/**
 * 生成产品结构化数据（适用于产品介绍文章）
 * @param {Object} product 产品数据
 * @param {string} baseUrl 基础URL
 * @returns {Object} Product schema
 */
export function generateProductSchema(product, baseUrl) {
  if (!product) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image || `${baseUrl}/bg_image.jpg`
  }

  // 添加品牌信息
  if (product.brand) {
    schema.brand = {
      '@type': 'Brand',
      name: product.brand
    }
  }

  // 添加评分信息
  if (product.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.value,
      reviewCount: product.rating.count
    }
  }

  // 添加价格信息
  if (product.price) {
    schema.offers = {
      '@type': 'Offer',
      price: product.price.amount,
      priceCurrency: product.price.currency || 'USD',
      availability: 'https://schema.org/InStock'
    }
  }

  return schema
}

/**
 * 生成视频结构化数据
 * @param {Object} video 视频数据
 * @param {string} baseUrl 基础URL
 * @returns {Object} VideoObject schema
 */
export function generateVideoSchema(video, baseUrl) {
  if (!video) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnail || `${baseUrl}/bg_image.jpg`,
    uploadDate: video.uploadDate,
    contentUrl: video.url
  }

  // 添加时长
  if (video.duration) {
    schema.duration = video.duration
  }

  // 添加嵌入URL
  if (video.embedUrl) {
    schema.embedUrl = video.embedUrl
  }

  return schema
}

/**
 * 合并多个结构化数据
 * @param {Array} schemas 结构化数据数组
 * @returns {Array} 合并后的结构化数据
 */
export function combineSchemas(schemas) {
  return schemas.filter(schema => schema !== null && schema !== undefined)
}

/**
 * 生成评论结构化数据
 * @param {Array} comments 评论数据
 * @param {string} baseUrl 基础URL
 * @returns {Array} Comment schemas
 */
export function generateCommentSchema(comments, baseUrl) {
  if (!comments || comments.length === 0) return []

  return comments.map(comment => ({
    '@context': 'https://schema.org',
    '@type': 'Comment',
    text: comment.text,
    dateCreated: comment.dateCreated,
    author: {
      '@type': 'Person',
      name: comment.author.name,
      image: comment.author.avatar || `${baseUrl}/avatar.png`
    },
    parentItem: {
      '@type': 'Article',
      '@id': comment.articleUrl
    }
  }))
}

/**
 * 生成软件应用结构化数据
 * @param {Object} software 软件数据
 * @param {string} baseUrl 基础URL
 * @returns {Object} SoftwareApplication schema
 */
export function generateSoftwareSchema(software, baseUrl) {
  if (!software) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: software.name,
    description: software.description,
    applicationCategory: software.category || 'Utility',
    operatingSystem: software.operatingSystem || 'Web',
    url: software.url || baseUrl
  }

  // 添加版本信息
  if (software.version) {
    schema.softwareVersion = software.version
  }

  // 添加评分
  if (software.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: software.rating.value,
      reviewCount: software.rating.count,
      bestRating: software.rating.bestRating || 5,
      worstRating: software.rating.worstRating || 1
    }
  }

  // 添加价格信息
  if (software.price !== undefined) {
    schema.offers = {
      '@type': 'Offer',
      price: software.price,
      priceCurrency: software.currency || 'USD'
    }
  }

  // 添加截图
  if (software.screenshots && software.screenshots.length > 0) {
    schema.screenshot = software.screenshots
  }

  return schema
}

/**
 * 生成课程结构化数据
 * @param {Object} course 课程数据
 * @param {string} baseUrl 基础URL
 * @returns {Object} Course schema
 */
export function generateCourseSchema(course, baseUrl) {
  if (!course) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: course.provider || 'NotionNext'
    }
  }

  // 添加课程URL
  if (course.url) {
    schema.url = course.url
  }

  // 添加课程图片
  if (course.image) {
    schema.image = course.image
  }

  // 添加课程实例
  if (course.courseInstance) {
    schema.hasCourseInstance = {
      '@type': 'CourseInstance',
      courseMode: course.courseInstance.mode || 'online',
      instructor: {
        '@type': 'Person',
        name: course.courseInstance.instructor
      }
    }
  }

  return schema
}

/**
 * 生成事件结构化数据
 * @param {Object} event 事件数据
 * @param {string} baseUrl 基础URL
 * @returns {Object} Event schema
 */
export function generateEventSchema(event, baseUrl) {
  if (!event) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate
  }

  // 添加地点信息
  if (event.location) {
    if (typeof event.location === 'string') {
      schema.location = {
        '@type': 'Place',
        name: event.location
      }
    } else {
      schema.location = {
        '@type': 'Place',
        name: event.location.name,
        address: event.location.address
      }
    }
  }

  // 添加组织者
  if (event.organizer) {
    schema.organizer = {
      '@type': 'Organization',
      name: event.organizer
    }
  }

  // 添加票价信息
  if (event.offers) {
    schema.offers = {
      '@type': 'Offer',
      price: event.offers.price,
      priceCurrency: event.offers.currency || 'USD',
      availability: event.offers.availability || 'https://schema.org/InStock'
    }
  }

  return schema
}

/**
 * 生成本地商业结构化数据
 * @param {Object} business 商业数据
 * @param {string} baseUrl 基础URL
 * @returns {Object} LocalBusiness schema
 */
export function generateLocalBusinessSchema(business, baseUrl) {
  if (!business) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description,
    url: business.url || baseUrl
  }

  // 添加地址
  if (business.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country
    }
  }

  // 添加联系信息
  if (business.telephone) {
    schema.telephone = business.telephone
  }

  if (business.email) {
    schema.email = business.email
  }

  // 添加营业时间
  if (business.openingHours) {
    schema.openingHoursSpecification = business.openingHours.map(hours => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes
    }))
  }

  // 添加评分
  if (business.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: business.rating.value,
      reviewCount: business.rating.count
    }
  }

  return schema
}

/**
 * 生成食谱结构化数据
 * @param {Object} recipe 食谱数据
 * @param {string} baseUrl 基础URL
 * @returns {Object} Recipe schema
 */
export function generateRecipeSchema(recipe, baseUrl) {
  if (!recipe) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description: recipe.description,
    image: recipe.image || `${baseUrl}/bg_image.jpg`
  }

  // 添加作者
  if (recipe.author) {
    schema.author = {
      '@type': 'Person',
      name: recipe.author
    }
  }

  // 添加准备时间
  if (recipe.prepTime) {
    schema.prepTime = recipe.prepTime
  }

  if (recipe.cookTime) {
    schema.cookTime = recipe.cookTime
  }

  if (recipe.totalTime) {
    schema.totalTime = recipe.totalTime
  }

  // 添加份量
  if (recipe.recipeYield) {
    schema.recipeYield = recipe.recipeYield
  }

  // 添加食材
  if (recipe.ingredients && recipe.ingredients.length > 0) {
    schema.recipeIngredient = recipe.ingredients
  }

  // 添加制作步骤
  if (recipe.instructions && recipe.instructions.length > 0) {
    schema.recipeInstructions = recipe.instructions.map((instruction, index) => ({
      '@type': 'HowToStep',
      name: `步骤 ${index + 1}`,
      text: instruction
    }))
  }

  // 添加营养信息
  if (recipe.nutrition) {
    schema.nutrition = {
      '@type': 'NutritionInformation',
      calories: recipe.nutrition.calories,
      fatContent: recipe.nutrition.fat,
      carbohydrateContent: recipe.nutrition.carbs,
      proteinContent: recipe.nutrition.protein
    }
  }

  return schema
}

/**
 * 生成新闻文章结构化数据
 * @param {Object} article 新闻文章数据
 * @param {Object} siteInfo 网站信息
 * @param {string} baseUrl 基础URL
 * @returns {Object} NewsArticle schema
 */
export function generateNewsArticleSchema(article, siteInfo, baseUrl) {
  if (!article) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    image: article.image || `${baseUrl}/bg_image.jpg`,
    datePublished: article.publishDate,
    dateModified: article.modifiedDate || article.publishDate,
    author: {
      '@type': 'Organization',
      name: siteInfo?.title || '分享之王'
    },
    publisher: {
      '@type': 'Organization',
      name: siteInfo?.title,
      logo: {
        '@type': 'ImageObject',
        url: siteInfo?.icon || `${baseUrl}/favicon.ico`
      }
    }
  }

  // 添加文章正文
  if (article.articleBody) {
    schema.articleBody = article.articleBody
  }

  // 添加文章分类
  if (article.articleSection) {
    schema.articleSection = article.articleSection
  }

  // 添加关键词
  if (article.keywords) {
    schema.keywords = Array.isArray(article.keywords)
      ? article.keywords.join(', ')
      : article.keywords
  }

  return schema
}

/**
 * 智能检测内容类型并生成相应的结构化数据
 * @param {Object} content 内容数据
 * @param {Object} siteInfo 网站信息
 * @param {string} baseUrl 基础URL
 * @returns {Array} 结构化数据数组
 */
export function generateSmartSchema(content, siteInfo, baseUrl) {
  const schemas = []

  // 检测内容类型
  if (content.type === 'Post' || content.type === 'article') {
    // 检查是否为新闻文章
    if (content.category && ['新闻', '资讯', 'news'].includes(content.category[0]?.toLowerCase())) {
      schemas.push(generateNewsArticleSchema(content, siteInfo, baseUrl))
    } else {
      schemas.push(generateArticleSchema(content, siteInfo, baseUrl))
    }
  }

  // 检测是否包含产品信息
  if (content.product) {
    schemas.push(generateProductSchema(content.product, baseUrl))
  }

  // 检测是否包含软件信息
  if (content.software) {
    schemas.push(generateSoftwareSchema(content.software, baseUrl))
  }

  // 检测是否包含课程信息
  if (content.course) {
    schemas.push(generateCourseSchema(content.course, baseUrl))
  }

  // 检测是否包含事件信息
  if (content.event) {
    schemas.push(generateEventSchema(content.event, baseUrl))
  }

  // 检测是否包含食谱信息
  if (content.recipe) {
    schemas.push(generateRecipeSchema(content.recipe, baseUrl))
  }

  // 检测是否包含FAQ
  if (content.faqs && content.faqs.length > 0) {
    schemas.push(generateFAQSchema(content.faqs))
  }

  // 检测是否包含视频
  if (content.video) {
    schemas.push(generateVideoSchema(content.video, baseUrl))
  }

  return combineSchemas(schemas)
}

/**
 * 验证结构化数据
 * @param {Object} schema 结构化数据
 * @returns {Object} 验证结果
 */
export function validateSchema(schema) {
  const result = {
    isValid: true,
    errors: [],
    warnings: []
  }

  if (!schema) {
    result.isValid = false
    result.errors.push('结构化数据为空')
    return result
  }

  // 检查必需字段
  if (!schema['@context']) {
    result.isValid = false
    result.errors.push('缺少@context字段')
  }

  if (!schema['@type']) {
    result.isValid = false
    result.errors.push('缺少@type字段')
  }

  // 根据类型检查特定字段
  switch (schema['@type']) {
    case 'Article':
    case 'NewsArticle':
      if (!schema.headline) {
        result.errors.push(`${schema['@type']}类型缺少headline字段`)
      }
      if (!schema.author) {
        result.errors.push(`${schema['@type']}类型缺少author字段`)
      }
      if (!schema.datePublished) {
        result.warnings.push(`${schema['@type']}类型建议添加datePublished字段`)
      }
      if (!schema.image) {
        result.warnings.push(`${schema['@type']}类型建议添加image字段`)
      }
      break

    case 'WebSite':
      if (!schema.name) {
        result.errors.push('WebSite类型缺少name字段')
      }
      if (!schema.url) {
        result.errors.push('WebSite类型缺少url字段')
      }
      break

    case 'Organization':
      if (!schema.name) {
        result.errors.push('Organization类型缺少name字段')
      }
      break

    case 'Product':
      if (!schema.name) {
        result.errors.push('Product类型缺少name字段')
      }
      if (!schema.description) {
        result.warnings.push('Product类型建议添加description字段')
      }
      break

    case 'Recipe':
      if (!schema.name) {
        result.errors.push('Recipe类型缺少name字段')
      }
      if (!schema.recipeIngredient || schema.recipeIngredient.length === 0) {
        result.warnings.push('Recipe类型建议添加recipeIngredient字段')
      }
      if (!schema.recipeInstructions || schema.recipeInstructions.length === 0) {
        result.warnings.push('Recipe类型建议添加recipeInstructions字段')
      }
      break

    case 'Event':
      if (!schema.name) {
        result.errors.push('Event类型缺少name字段')
      }
      if (!schema.startDate) {
        result.errors.push('Event类型缺少startDate字段')
      }
      break
  }

  // 检查图片URL格式
  if (schema.image && typeof schema.image === 'string') {
    if (!schema.image.startsWith('http') && !schema.image.startsWith('/')) {
      result.warnings.push('图片URL建议使用绝对路径')
    }
  }

  // 检查日期格式
  const dateFields = ['datePublished', 'dateModified', 'startDate', 'endDate']
  dateFields.forEach(field => {
    if (schema[field] && !isValidDate(schema[field])) {
      result.warnings.push(`${field}字段日期格式可能不正确`)
    }
  })

  if (result.errors.length > 0) {
    result.isValid = false
  }

  return result
}

/**
 * 验证日期格式
 * @param {string} dateString 日期字符串
 * @returns {boolean} 是否为有效日期
 */
function isValidDate(dateString) {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date)
}

/**
 * 批量验证多个结构化数据
 * @param {Array} schemas 结构化数据数组
 * @returns {Object} 批量验证结果
 */
export function validateMultipleSchemas(schemas) {
  const results = {
    totalCount: schemas.length,
    validCount: 0,
    invalidCount: 0,
    warningCount: 0,
    details: []
  }

  schemas.forEach((schema, index) => {
    const validation = validateSchema(schema)
    results.details.push({
      index,
      type: schema['@type'],
      ...validation
    })

    if (validation.isValid) {
      results.validCount++
    } else {
      results.invalidCount++
    }

    if (validation.warnings && validation.warnings.length > 0) {
      results.warningCount++
    }
  })

  return results
}