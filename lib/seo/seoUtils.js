/**
 * SEO工具函数
 * 提供SEO相关的实用工具和集成功能
 */

import { SEOContentAnalyzer } from './contentAnalyzer';

/**
 * 优化页面标题
 * @param {string} pageTitle - 页面标题
 * @param {string} siteTitle - 网站标题
 * @returns {string} 优化后的标题
 */
export function optimizePageTitle(pageTitle, siteTitle) {
  if (!pageTitle && !siteTitle) return '';
  if (!pageTitle) return siteTitle;
  if (!siteTitle) return pageTitle;
  
  // 组合标题，确保总长度不超过60字符
  const separator = ' | ';
  const combinedTitle = `${pageTitle}${separator}${siteTitle}`;
  
  if (combinedTitle.length <= 60) {
    return combinedTitle;
  }
  
  // 如果太长，截断页面标题
  const maxPageTitleLength = 60 - separator.length - siteTitle.length;
  if (maxPageTitleLength > 10) {
    return `${pageTitle.substring(0, maxPageTitleLength - 3)}...${separator}${siteTitle}`;
  }
  
  // 如果网站标题太长，只返回页面标题
  return pageTitle.length <= 60 ? pageTitle : pageTitle.substring(0, 57) + '...';
}

/**
 * 优化Meta描述
 * @param {string} description - 原始描述
 * @returns {string} 优化后的描述
 */
export function optimizeMetaDescription(description) {
  if (!description) return '';
  
  // 移除HTML标签
  const cleanDescription = description.replace(/<[^>]*>/g, '').trim();
  
  // 确保长度在120-160字符之间
  if (cleanDescription.length < 120) {
    return cleanDescription;
  }
  
  if (cleanDescription.length <= 160) {
    return cleanDescription;
  }
  
  // 截断到160字符，但尽量在句子边界
  const truncated = cleanDescription.substring(0, 157);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('。'),
    truncated.lastIndexOf('！'),
    truncated.lastIndexOf('？'),
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  );
  
  if (lastSentenceEnd > 100) {
    return cleanDescription.substring(0, lastSentenceEnd + 1);
  }
  
  return truncated + '...';
}

/**
 * 验证Meta描述
 * @param {string} description - 描述文本
 * @returns {Object} 验证结果
 */
export function validateMetaDescription(description) {
  if (!description) {
    return {
      isValid: false,
      issues: ['描述不能为空'],
      suggestions: ['添加页面描述']
    };
  }
  
  const length = description.length;
  const issues = [];
  const suggestions = [];
  
  if (length < 120) {
    issues.push('描述过短');
    suggestions.push('增加描述内容，建议120-160字符');
  }
  
  if (length > 160) {
    issues.push('描述过长');
    suggestions.push('缩短描述内容到160字符以内');
  }
  
  // 检查是否包含HTML标签
  if (/<[^>]*>/.test(description)) {
    issues.push('包含HTML标签');
    suggestions.push('移除HTML标签');
  }
  
  return {
    isValid: issues.length === 0,
    length,
    issues,
    suggestions
  };
}

/**
 * 生成规范URL
 * @param {string} url - 原始URL
 * @param {string} baseUrl - 基础URL
 * @returns {string} 规范URL
 */
export function generateCanonicalUrl(url, baseUrl) {
  if (!url) return baseUrl || '';
  
  // 如果已经是完整URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // 组合基础URL和相对路径
  const cleanBaseUrl = baseUrl?.replace(/\/$/, '') || '';
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  
  return `${cleanBaseUrl}${cleanUrl}`;
}

/**
 * 生成hreflang数据
 * @param {string} currentUrl - 当前URL
 * @param {Array} languages - 支持的语言列表
 * @returns {Array} hreflang数据
 */
export function generateHreflangData(currentUrl, languages = []) {
  if (!currentUrl || !Array.isArray(languages) || languages.length === 0) {
    return [];
  }
  
  return languages.map(lang => ({
    hreflang: lang.code,
    href: lang.url || currentUrl.replace(/\/[a-z]{2}\//, `/${lang.code}/`)
  }));
}

/**
 * 生成OG图片URL
 * @param {string} imageUrl - 图片URL
 * @param {string} baseUrl - 基础URL
 * @returns {string} 完整的图片URL
 */
export function generateOgImageUrl(imageUrl, baseUrl) {
  // 如果没有提供图片，使用默认图片
  if (!imageUrl) {
    return baseUrl ? `${baseUrl.replace(/\/$/, '')}/bg_image.jpg` : '/bg_image.jpg';
  }
  
  // 如果已经是完整URL，直接返回
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // 处理相对路径
  if (!baseUrl) {
    return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  }
  
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  
  return `${cleanBaseUrl}${cleanImageUrl}`;
}

/**
 * 提取优化关键词
 * @param {string} content - 内容文本
 * @param {number} limit - 关键词数量限制
 * @returns {Array} 关键词列表
 */
export function extractOptimizedKeywords(content, limit = 10) {
  if (!content) return [];
  
  // 清理文本
  const cleanText = content
    .replace(/<[^>]*>/g, '') // 移除HTML标签
    .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ') // 保留中英文字符
    .toLowerCase()
    .trim();
  
  // 分词
  const words = cleanText.split(/\s+/).filter(word => word.length > 2);
  
  // 统计词频
  const wordCount = {};
  const stopWords = new Set([
    '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这样',
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did'
  ]);
  
  words.forEach(word => {
    if (!stopWords.has(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });
  
  // 按频率排序并返回前N个
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([word]) => word);
}

/**
 * 获取Twitter卡片类型
 * @param {string} imageUrl - 图片URL
 * @param {string} content - 内容
 * @returns {string} Twitter卡片类型
 */
export function getTwitterCardType(imageUrl, content) {
  // 如果有图片，使用大图卡片
  if (imageUrl) {
    return 'summary_large_image';
  }
  
  // 如果内容较长，使用摘要卡片
  if (content && content.length > 200) {
    return 'summary';
  }
  
  // 默认使用摘要卡片
  return 'summary';
}







/**
 * 为博客文章生成SEO分析
 * @param {Object} post - 文章对象
 * @param {Array} allPosts - 所有文章列表
 * @param {Object} siteInfo - 网站信息
 * @returns {Object} SEO分析结果
 */
export function analyzePostSEO(post, allPosts = [], siteInfo = {}) {
  if (!post) {
    throw new Error('文章对象不能为空');
  }

  const analyzer = new SEOContentAnalyzer();
  
  // 准备分析数据
  const content = post.blockMap ? extractNotionContent(post.blockMap) : (post.content || '');
  const keywords = extractKeywordsFromPost(post);
  const currentUrl = `${siteInfo.link || ''}/${post.slug}`;
  
  // 转换文章列表格式
  const allPages = allPosts.map(p => ({
    title: p.title,
    slug: p.slug,
    summary: p.summary,
    tags: p.tags,
    category: p.category
  }));

  try {
    const analysis = analyzer.analyzeContent({
      content,
      keywords,
      currentUrl,
      allPages
    });

    return {
      ...analysis,
      postInfo: {
        title: post.title,
        slug: post.slug,
        publishDate: post.publishDay,
        category: post.category,
        tags: post.tags
      }
    };
  } catch (error) {
    console.error('SEO分析失败:', error);
    return {
      error: error.message,
      postInfo: {
        title: post.title,
        slug: post.slug
      }
    };
  }
}

/**
 * 从Notion块映射中提取内容
 * @param {Object} blockMap - Notion块映射
 * @returns {string} 提取的HTML内容
 */
function extractNotionContent(blockMap) {
  if (!blockMap) return '';

  let content = '';
  
  try {
    Object.values(blockMap).forEach(block => {
      if (block?.value?.type) {
        const blockType = block.value.type;
        const properties = block.value.properties;
        
        switch (blockType) {
          case 'header':
            if (properties?.title) {
              content += `<h1>${extractTextFromRichText(properties.title)}</h1>\n`;
            }
            break;
          case 'sub_header':
            if (properties?.title) {
              content += `<h2>${extractTextFromRichText(properties.title)}</h2>\n`;
            }
            break;
          case 'sub_sub_header':
            if (properties?.title) {
              content += `<h3>${extractTextFromRichText(properties.title)}</h3>\n`;
            }
            break;
          case 'text':
            if (properties?.title) {
              content += `<p>${extractTextFromRichText(properties.title)}</p>\n`;
            }
            break;
          case 'bulleted_list':
          case 'numbered_list':
            if (properties?.title) {
              content += `<li>${extractTextFromRichText(properties.title)}</li>\n`;
            }
            break;
          case 'quote':
            if (properties?.title) {
              content += `<blockquote>${extractTextFromRichText(properties.title)}</blockquote>\n`;
            }
            break;
          case 'code':
            if (properties?.title) {
              content += `<pre><code>${extractTextFromRichText(properties.title)}</code></pre>\n`;
            }
            break;
        }
      }
    });
  } catch (error) {
    console.error('提取Notion内容失败:', error);
  }

  return content;
}

/**
 * 从富文本中提取纯文本
 * @param {Array} richText - 富文本数组
 * @returns {string} 纯文本
 */
function extractTextFromRichText(richText) {
  if (!Array.isArray(richText)) return '';
  
  return richText.map(item => {
    if (Array.isArray(item) && item.length > 0) {
      return item[0] || '';
    }
    return item || '';
  }).join('');
}

/**
 * 从文章中提取关键词
 * @param {Object} post - 文章对象
 * @returns {Array} 关键词数组
 */
function extractKeywordsFromPost(post) {
  const keywords = [];
  
  // 从标题提取关键词
  if (post.title) {
    keywords.push(...extractKeywordsFromText(post.title));
  }
  
  // 从标签提取关键词
  if (post.tags && Array.isArray(post.tags)) {
    keywords.push(...post.tags);
  }
  
  // 从分类提取关键词
  if (post.category) {
    keywords.push(post.category);
  }
  
  // 从摘要提取关键词
  if (post.summary) {
    keywords.push(...extractKeywordsFromText(post.summary));
  }
  
  // 去重并返回
  return [...new Set(keywords.filter(keyword => keyword && keyword.length > 1))];
}

/**
 * 从文本中提取关键词
 * @param {string} text - 文本内容
 * @returns {Array} 关键词数组
 */
function extractKeywordsFromText(text) {
  if (!text) return [];
  
  // 简单的关键词提取逻辑
  return text
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2)
    .filter(word => !isStopWord(word))
    .slice(0, 10); // 限制数量
}

/**
 * 判断是否为停用词
 * @param {string} word - 单词
 * @returns {boolean} 是否为停用词
 */
function isStopWord(word) {
  const stopWords = new Set([
    '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这样',
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'
  ]);
  
  return stopWords.has(word.toLowerCase());
}

/**
 * 生成SEO优化建议
 * @param {Object} analysis - SEO分析结果
 * @returns {Object} 优化建议
 */
export function generateSEORecommendations(analysis) {
  if (!analysis || analysis.error) {
    return { error: '分析结果无效' };
  }

  const recommendations = {
    immediate: [], // 立即修复
    important: [], // 重要优化
    suggested: []  // 建议优化
  };

  // 处理高优先级问题
  analysis.recommendations
    .filter(rec => rec.priority === 'high')
    .forEach(rec => {
      recommendations.immediate.push({
        category: rec.category,
        message: rec.message,
        action: generateActionPlan(rec)
      });
    });

  // 处理中优先级问题
  analysis.recommendations
    .filter(rec => rec.priority === 'medium')
    .forEach(rec => {
      recommendations.important.push({
        category: rec.category,
        message: rec.message,
        action: generateActionPlan(rec)
      });
    });

  // 处理低优先级问题
  analysis.recommendations
    .filter(rec => rec.priority === 'low')
    .forEach(rec => {
      recommendations.suggested.push({
        category: rec.category,
        message: rec.message,
        action: generateActionPlan(rec)
      });
    });

  return recommendations;
}

/**
 * 生成具体的行动计划
 * @param {Object} recommendation - 建议对象
 * @returns {string} 行动计划
 */
function generateActionPlan(recommendation) {
  const actionPlans = {
    keywords: {
      'low': '在内容中自然地增加目标关键词的使用频率',
      'high': '减少关键词使用频率，避免关键词堆砌'
    },
    headings: {
      'missing_h1': '为页面添加一个描述主要内容的H1标题',
      'multiple_h1': '将多余的H1标签改为H2或其他适当级别',
      'heading_skip': '调整标题层级，确保逐级递进',
      'empty_heading': '为空标题添加有意义的内容'
    },
    readability: {
      'sentence_length': '将长句拆分为多个短句',
      'paragraph_length': '将长段落分解为多个短段落',
      'readability': '使用更简单的词汇和句式',
      'vocabulary': '用通俗易懂的词汇替换复杂词汇',
      'content_length': '增加更多有价值的内容'
    },
    links: {
      'link_density_low': '增加相关内容的内部链接',
      'link_density_high': '减少不必要的内部链接',
      'empty_anchor_text': '为链接添加描述性的锚文本',
      'missing_related_links': '添加推荐的相关页面链接'
    }
  };

  // 根据分类和消息内容生成行动计划
  const category = recommendation.category;
  const message = recommendation.message.toLowerCase();

  if (actionPlans[category]) {
    for (const [key, action] of Object.entries(actionPlans[category])) {
      if (message.includes(key) || message.includes(action.substring(0, 10))) {
        return action;
      }
    }
  }

  return '请根据具体情况进行优化';
}

/**
 * 批量分析多篇文章的SEO
 * @param {Array} posts - 文章列表
 * @param {Object} siteInfo - 网站信息
 * @returns {Array} 批量分析结果
 */
export function batchAnalyzeSEO(posts, siteInfo = {}) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return [];
  }

  const results = [];
  
  for (const post of posts) {
    try {
      const analysis = analyzePostSEO(post, posts, siteInfo);
      results.push({
        slug: post.slug,
        title: post.title,
        score: analysis.overallScore || 0,
        issues: analysis.recommendations?.length || 0,
        analysis
      });
    } catch (error) {
      results.push({
        slug: post.slug,
        title: post.title,
        error: error.message
      });
    }
  }

  return results.sort((a, b) => (a.score || 0) - (b.score || 0)); // 按评分排序
}

/**
 * 生成SEO报告
 * @param {Array} analysisResults - 分析结果列表
 * @returns {Object} SEO报告
 */
export function generateSEOReport(analysisResults) {
  if (!Array.isArray(analysisResults) || analysisResults.length === 0) {
    return { error: '没有分析结果' };
  }

  const validResults = analysisResults.filter(result => !result.error && result.score !== undefined);
  
  if (validResults.length === 0) {
    return { error: '没有有效的分析结果' };
  }

  const scores = validResults.map(result => result.score);
  const totalIssues = validResults.reduce((sum, result) => sum + (result.issues || 0), 0);

  const report = {
    summary: {
      totalPosts: analysisResults.length,
      analyzedPosts: validResults.length,
      averageScore: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
      totalIssues,
      scoreDistribution: {
        excellent: scores.filter(score => score >= 90).length,
        good: scores.filter(score => score >= 80 && score < 90).length,
        fair: scores.filter(score => score >= 70 && score < 80).length,
        poor: scores.filter(score => score >= 60 && score < 70).length,
        veryPoor: scores.filter(score => score < 60).length
      }
    },
    topPerformers: validResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(result => ({
        title: result.title,
        slug: result.slug,
        score: result.score
      })),
    needsImprovement: validResults
      .sort((a, b) => a.score - b.score)
      .slice(0, 5)
      .map(result => ({
        title: result.title,
        slug: result.slug,
        score: result.score,
        issues: result.issues
      })),
    commonIssues: extractCommonIssues(validResults),
    recommendations: generateGlobalRecommendations(validResults)
  };

  return report;
}

/**
 * 提取常见问题
 * @param {Array} results - 分析结果
 * @returns {Array} 常见问题列表
 */
function extractCommonIssues(results) {
  const issueCount = {};
  
  results.forEach(result => {
    if (result.analysis && result.analysis.recommendations) {
      result.analysis.recommendations.forEach(rec => {
        const key = `${rec.category}:${rec.message.substring(0, 50)}`;
        issueCount[key] = (issueCount[key] || 0) + 1;
      });
    }
  });

  return Object.entries(issueCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([issue, count]) => {
      const [category, message] = issue.split(':');
      return { category, message, count };
    });
}

/**
 * 生成全局优化建议
 * @param {Array} results - 分析结果
 * @returns {Array} 全局建议列表
 */
function generateGlobalRecommendations(results) {
  const recommendations = [];
  const averageScore = results.reduce((sum, result) => sum + result.score, 0) / results.length;

  if (averageScore < 70) {
    recommendations.push({
      priority: 'high',
      message: '整体SEO表现需要改进，建议优先处理高优先级问题'
    });
  }

  const lowScorePosts = results.filter(result => result.score < 60).length;
  if (lowScorePosts > results.length * 0.3) {
    recommendations.push({
      priority: 'high',
      message: `有${lowScorePosts}篇文章SEO评分较低，需要重点优化`
    });
  }

  const highIssuePosts = results.filter(result => result.issues > 5).length;
  if (highIssuePosts > 0) {
    recommendations.push({
      priority: 'medium',
      message: `有${highIssuePosts}篇文章存在较多SEO问题，建议逐步优化`
    });
  }

  return recommendations;
}

/**
 * 导出SEO分析结果
 * @param {Object} report - SEO报告
 * @param {string} format - 导出格式 ('json' | 'csv')
 * @returns {string} 导出内容
 */
export function exportSEOReport(report, format = 'json') {
  if (format === 'json') {
    return JSON.stringify(report, null, 2);
  }
  
  if (format === 'csv') {
    // 简单的CSV导出
    let csv = 'Title,Slug,Score,Issues\n';
    
    if (report.topPerformers) {
      report.topPerformers.forEach(post => {
        csv += `"${post.title}","${post.slug}",${post.score},0\n`;
      });
    }
    
    if (report.needsImprovement) {
      report.needsImprovement.forEach(post => {
        csv += `"${post.title}","${post.slug}",${post.score},${post.issues}\n`;
      });
    }
    
    return csv;
  }
  
  throw new Error('不支持的导出格式');
}