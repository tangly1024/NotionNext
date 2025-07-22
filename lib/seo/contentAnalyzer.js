/**
 * SEO内容分析工具
 * 提供关键词密度分析、标题层级检查、可读性分析等功能
 */

/**
 * 关键词密度分析器
 */
export class KeywordDensityAnalyzer {
  /**
   * 分析文本中的关键词密度
   * @param {string} content - 要分析的内容
   * @param {string[]} keywords - 目标关键词列表
   * @returns {Object} 关键词密度分析结果
   */
  analyze(content, keywords = []) {
    if (!content || typeof content !== 'string') {
      return { error: '内容不能为空' };
    }

    const cleanContent = this.cleanText(content);
    const words = this.extractWords(cleanContent);
    const totalWords = words.length;

    // 分析每个关键词的密度
    const keywordAnalysis = keywords.map(keyword => {
      const keywordCount = this.countKeywordOccurrences(cleanContent, keyword);
      const density = totalWords > 0 ? (keywordCount / totalWords) * 100 : 0;
      
      return {
        keyword,
        count: keywordCount,
        density: parseFloat(density.toFixed(2)),
        recommendation: this.getDensityRecommendation(density)
      };
    });

    // 自动提取高频词汇
    const topKeywords = this.extractTopKeywords(words, 10);

    return {
      totalWords,
      keywordAnalysis,
      topKeywords,
      overallScore: this.calculateOverallScore(keywordAnalysis)
    };
  }

  /**
   * 清理文本，移除HTML标签和特殊字符
   */
  cleanText(content) {
    return content
      .replace(/<[^>]*>/g, '') // 移除HTML标签
      .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ') // 保留中英文字符和空格
      .replace(/\s+/g, ' ') // 合并多个空格
      .trim()
      .toLowerCase();
  }

  /**
   * 提取单词
   */
  extractWords(text) {
    return text.split(/\s+/).filter(word => word.length > 1);
  }

  /**
   * 计算关键词出现次数
   */
  countKeywordOccurrences(content, keyword) {
    const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi');
    const matches = content.match(regex);
    return matches ? matches.length : 0;
  }

  /**
   * 获取密度建议
   */
  getDensityRecommendation(density) {
    if (density < 0.5) {
      return { level: 'low', message: '关键词密度过低，建议适当增加' };
    } else if (density > 3) {
      return { level: 'high', message: '关键词密度过高，可能被视为关键词堆砌' };
    } else {
      return { level: 'optimal', message: '关键词密度适中' };
    }
  }

  /**
   * 提取高频关键词
   */
  extractTopKeywords(words, limit = 10) {
    const wordCount = {};
    const stopWords = new Set(['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);

    words.forEach(word => {
      if (!stopWords.has(word) && word.length > 1) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([word, count]) => ({ word, count }));
  }

  /**
   * 计算整体评分
   */
  calculateOverallScore(keywordAnalysis) {
    if (keywordAnalysis.length === 0) return 0;

    const scores = keywordAnalysis.map(analysis => {
      const { density } = analysis;
      if (density >= 0.5 && density <= 3) return 100;
      if (density < 0.5) return Math.max(0, density * 200);
      return Math.max(0, 100 - (density - 3) * 20);
    });

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }
}

/**
 * 标题层级结构检查器
 */
export class HeadingStructureChecker {
  /**
   * 检查标题层级结构
   * @param {string} content - HTML内容
   * @returns {Object} 标题结构分析结果
   */
  analyze(content) {
    if (!content) {
      return { error: '内容不能为空' };
    }

    const headings = this.extractHeadings(content);
    const issues = this.checkStructureIssues(headings);
    const suggestions = this.generateSuggestions(headings, issues);

    return {
      headings,
      issues,
      suggestions,
      score: this.calculateStructureScore(headings, issues)
    };
  }

  /**
   * 提取标题元素
   */
  extractHeadings(content) {
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
    const headings = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: parseInt(match[1]),
        text: match[2].replace(/<[^>]*>/g, '').trim(),
        position: match.index
      });
    }

    return headings;
  }

  /**
   * 检查结构问题
   */
  checkStructureIssues(headings) {
    const issues = [];

    // 检查是否有H1标签
    const h1Count = headings.filter(h => h.level === 1).length;
    if (h1Count === 0) {
      issues.push({
        type: 'missing_h1',
        severity: 'high',
        message: '缺少H1标签，每个页面应该有且仅有一个H1标签'
      });
    } else if (h1Count > 1) {
      issues.push({
        type: 'multiple_h1',
        severity: 'high',
        message: `发现${h1Count}个H1标签，建议每个页面只使用一个H1标签`
      });
    }

    // 检查标题层级跳跃
    for (let i = 1; i < headings.length; i++) {
      const current = headings[i];
      const previous = headings[i - 1];
      
      if (current.level - previous.level > 1) {
        issues.push({
          type: 'heading_skip',
          severity: 'medium',
          message: `标题层级跳跃：从H${previous.level}直接跳到H${current.level}`,
          position: current.position
        });
      }
    }

    // 检查空标题
    headings.forEach((heading, index) => {
      if (!heading.text || heading.text.length < 2) {
        issues.push({
          type: 'empty_heading',
          severity: 'medium',
          message: `第${index + 1}个标题内容为空或过短`,
          position: heading.position
        });
      }
    });

    return issues;
  }

  /**
   * 生成优化建议
   */
  generateSuggestions(headings, issues) {
    const suggestions = [];

    // 基于问题生成建议
    issues.forEach(issue => {
      switch (issue.type) {
        case 'missing_h1':
          suggestions.push('添加一个描述页面主要内容的H1标题');
          break;
        case 'multiple_h1':
          suggestions.push('将多余的H1标签改为H2或其他适当的标题级别');
          break;
        case 'heading_skip':
          suggestions.push('确保标题层级递进，避免跳级使用');
          break;
        case 'empty_heading':
          suggestions.push('为所有标题添加有意义的内容');
          break;
      }
    });

    // 通用建议
    if (headings.length < 3) {
      suggestions.push('考虑添加更多子标题来改善内容结构');
    }

    return suggestions;
  }

  /**
   * 计算结构评分
   */
  calculateStructureScore(headings, issues) {
    let score = 100;

    issues.forEach(issue => {
      switch (issue.severity) {
        case 'high':
          score -= 25;
          break;
        case 'medium':
          score -= 15;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    return Math.max(0, score);
  }
}
/**
 *
 内容可读性分析器
 */
export class ReadabilityAnalyzer {
  /**
   * 分析内容可读性
   * @param {string} content - 要分析的内容
   * @returns {Object} 可读性分析结果
   */
  analyze(content) {
    if (!content) {
      return { error: '内容不能为空' };
    }

    const cleanContent = this.cleanText(content);
    const sentences = this.extractSentences(cleanContent);
    const words = this.extractWords(cleanContent);
    const paragraphs = this.extractParagraphs(content);

    const metrics = {
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      averageWordsPerSentence: this.calculateAverageWordsPerSentence(words, sentences),
      averageSentencesPerParagraph: this.calculateAverageSentencesPerParagraph(sentences, paragraphs),
      readingTime: this.estimateReadingTime(words.length),
      fleschScore: this.calculateFleschScore(words, sentences),
      complexWords: this.findComplexWords(words)
    };

    const recommendations = this.generateReadabilityRecommendations(metrics);
    const score = this.calculateReadabilityScore(metrics);

    return {
      metrics,
      recommendations,
      score,
      readingLevel: this.getReadingLevel(metrics.fleschScore)
    };
  }

  /**
   * 清理文本
   */
  cleanText(content) {
    return content
      .replace(/<[^>]*>/g, ' ') // 移除HTML标签
      .replace(/\s+/g, ' ') // 合并空格
      .trim();
  }

  /**
   * 提取句子
   */
  extractSentences(content) {
    return content
      .split(/[.!?。！？]+/)
      .filter(sentence => sentence.trim().length > 5);
  }

  /**
   * 提取单词
   */
  extractWords(content) {
    return content
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  /**
   * 提取段落
   */
  extractParagraphs(content) {
    return content
      .split(/\n\s*\n|<\/p>|<br\s*\/?>/i)
      .filter(para => para.trim().length > 10);
  }

  /**
   * 计算平均每句话的单词数
   */
  calculateAverageWordsPerSentence(words, sentences) {
    return sentences.length > 0 ? Math.round(words.length / sentences.length * 10) / 10 : 0;
  }

  /**
   * 计算平均每段的句子数
   */
  calculateAverageSentencesPerParagraph(sentences, paragraphs) {
    return paragraphs.length > 0 ? Math.round(sentences.length / paragraphs.length * 10) / 10 : 0;
  }

  /**
   * 估算阅读时间（分钟）
   */
  estimateReadingTime(wordCount) {
    const wordsPerMinute = 200; // 平均阅读速度
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * 计算Flesch可读性评分
   */
  calculateFleschScore(words, sentences) {
    if (sentences.length === 0 || words.length === 0) return 0;

    const avgSentenceLength = words.length / sentences.length;
    const avgSyllables = this.calculateAverageSyllables(words);

    // Flesch Reading Ease公式（简化版）
    return Math.max(0, Math.min(100, 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllables)));
  }

  /**
   * 计算平均音节数（简化算法）
   */
  calculateAverageSyllables(words) {
    const totalSyllables = words.reduce((sum, word) => {
      return sum + this.countSyllables(word);
    }, 0);

    return words.length > 0 ? totalSyllables / words.length : 0;
  }

  /**
   * 计算单词音节数（简化算法）
   */
  countSyllables(word) {
    if (!word) return 0;
    
    // 简化的音节计算：主要针对英文
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    // 计算元音组合
    const vowels = word.match(/[aeiouy]+/g);
    let syllables = vowels ? vowels.length : 1;
    
    // 调整规则
    if (word.endsWith('e')) syllables--;
    if (word.endsWith('le') && word.length > 2) syllables++;
    
    return Math.max(1, syllables);
  }

  /**
   * 找出复杂单词
   */
  findComplexWords(words) {
    return words.filter(word => {
      return word.length > 6 || this.countSyllables(word) > 2;
    }).slice(0, 10); // 返回前10个复杂单词
  }

  /**
   * 生成可读性建议
   */
  generateReadabilityRecommendations(metrics) {
    const recommendations = [];

    if (metrics.averageWordsPerSentence > 20) {
      recommendations.push({
        type: 'sentence_length',
        message: '句子过长，建议将长句拆分为多个短句以提高可读性'
      });
    }

    if (metrics.averageSentencesPerParagraph > 5) {
      recommendations.push({
        type: 'paragraph_length',
        message: '段落过长，建议将长段落分解为多个短段落'
      });
    }

    if (metrics.fleschScore < 30) {
      recommendations.push({
        type: 'readability',
        message: '文本可读性较低，建议使用更简单的词汇和句式'
      });
    }

    if (metrics.complexWords.length > 5) {
      recommendations.push({
        type: 'vocabulary',
        message: '复杂词汇较多，考虑使用更通俗易懂的表达方式'
      });
    }

    if (metrics.wordCount < 300) {
      recommendations.push({
        type: 'content_length',
        message: '内容较短，建议增加更多有价值的信息'
      });
    }

    return recommendations;
  }

  /**
   * 计算可读性评分
   */
  calculateReadabilityScore(metrics) {
    let score = 100;

    // 句子长度评分
    if (metrics.averageWordsPerSentence > 25) score -= 20;
    else if (metrics.averageWordsPerSentence > 20) score -= 10;

    // 段落长度评分
    if (metrics.averageSentencesPerParagraph > 6) score -= 15;
    else if (metrics.averageSentencesPerParagraph > 4) score -= 8;

    // Flesch评分影响
    if (metrics.fleschScore < 30) score -= 25;
    else if (metrics.fleschScore < 50) score -= 15;
    else if (metrics.fleschScore < 70) score -= 5;

    // 内容长度评分
    if (metrics.wordCount < 200) score -= 20;
    else if (metrics.wordCount < 300) score -= 10;

    return Math.max(0, score);
  }

  /**
   * 获取阅读难度等级
   */
  getReadingLevel(fleschScore) {
    if (fleschScore >= 90) return { level: 'very_easy', description: '非常容易阅读' };
    if (fleschScore >= 80) return { level: 'easy', description: '容易阅读' };
    if (fleschScore >= 70) return { level: 'fairly_easy', description: '相对容易' };
    if (fleschScore >= 60) return { level: 'standard', description: '标准难度' };
    if (fleschScore >= 50) return { level: 'fairly_difficult', description: '相对困难' };
    if (fleschScore >= 30) return { level: 'difficult', description: '困难' };
    return { level: 'very_difficult', description: '非常困难' };
  }
}

/**
 * 内部链接优化分析器
 */
export class InternalLinkAnalyzer {
  /**
   * 分析内部链接结构
   * @param {string} content - HTML内容
   * @param {string} currentUrl - 当前页面URL
   * @param {Array} allPages - 所有页面数据
   * @returns {Object} 内部链接分析结果
   */
  analyze(content, currentUrl, allPages = []) {
    if (!content) {
      return { error: '内容不能为空' };
    }

    const links = this.extractInternalLinks(content, currentUrl);
    const linkMetrics = this.calculateLinkMetrics(links, content);
    const suggestions = this.generateLinkSuggestions(content, currentUrl, allPages, links);
    const score = this.calculateLinkScore(linkMetrics);

    return {
      links,
      metrics: linkMetrics,
      suggestions,
      score,
      relatedPages: this.findRelatedPages(content, allPages)
    };
  }

  /**
   * 提取内部链接
   */
  extractInternalLinks(content, currentUrl) {
    const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
    const links = [];
    let match;

    const currentDomain = this.extractDomain(currentUrl);

    while ((match = linkRegex.exec(content)) !== null) {
      const href = match[1];
      const anchorText = match[2].replace(/<[^>]*>/g, '').trim();
      
      // 判断是否为内部链接
      if (this.isInternalLink(href, currentDomain)) {
        links.push({
          href,
          anchorText,
          position: match.index,
          isInternal: true
        });
      }
    }

    return links;
  }

  /**
   * 提取域名
   */
  extractDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  }

  /**
   * 判断是否为内部链接
   */
  isInternalLink(href, currentDomain) {
    // 相对链接
    if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
      return true;
    }

    // 绝对链接但同域名
    try {
      const linkDomain = new URL(href).hostname;
      return linkDomain === currentDomain;
    } catch {
      return false;
    }
  }

  /**
   * 计算链接指标
   */
  calculateLinkMetrics(links, content) {
    const totalWords = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    
    return {
      totalInternalLinks: links.length,
      linkDensity: totalWords > 0 ? (links.length / totalWords * 100).toFixed(2) : 0,
      uniqueLinks: [...new Set(links.map(link => link.href))].length,
      averageAnchorTextLength: this.calculateAverageAnchorLength(links),
      emptyAnchorTexts: links.filter(link => !link.anchorText).length
    };
  }

  /**
   * 计算平均锚文本长度
   */
  calculateAverageAnchorLength(links) {
    if (links.length === 0) return 0;
    
    const totalLength = links.reduce((sum, link) => sum + link.anchorText.length, 0);
    return Math.round(totalLength / links.length);
  }

  /**
   * 生成链接优化建议
   */
  generateLinkSuggestions(content, currentUrl, allPages, existingLinks) {
    const suggestions = [];

    // 检查链接密度
    const linkDensity = parseFloat(this.calculateLinkMetrics(existingLinks, content).linkDensity);
    if (linkDensity < 1) {
      suggestions.push({
        type: 'link_density_low',
        message: '内部链接密度较低，建议增加相关内容的内部链接'
      });
    } else if (linkDensity > 5) {
      suggestions.push({
        type: 'link_density_high',
        message: '内部链接密度过高，可能影响用户体验'
      });
    }

    // 检查空锚文本
    const emptyAnchors = existingLinks.filter(link => !link.anchorText || link.anchorText.length < 2);
    if (emptyAnchors.length > 0) {
      suggestions.push({
        type: 'empty_anchor_text',
        message: `发现${emptyAnchors.length}个空或过短的锚文本，建议使用描述性文字`
      });
    }

    // 推荐相关页面链接
    const relatedPages = this.findRelatedPages(content, allPages);
    const existingHrefs = new Set(existingLinks.map(link => link.href));
    
    const missingLinks = relatedPages.filter(page => !existingHrefs.has(page.slug));
    if (missingLinks.length > 0) {
      suggestions.push({
        type: 'missing_related_links',
        message: '发现相关内容，建议添加内部链接',
        relatedPages: missingLinks.slice(0, 5) // 最多推荐5个
      });
    }

    return suggestions;
  }

  /**
   * 查找相关页面
   */
  findRelatedPages(content, allPages) {
    if (!allPages || allPages.length === 0) return [];

    const contentWords = this.extractKeywords(content);
    const relatedPages = [];

    allPages.forEach(page => {
      const pageWords = this.extractKeywords(page.title + ' ' + (page.summary || ''));
      const similarity = this.calculateSimilarity(contentWords, pageWords);
      
      if (similarity > 0.1) { // 相似度阈值
        relatedPages.push({
          ...page,
          similarity: Math.round(similarity * 100)
        });
      }
    });

    return relatedPages
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);
  }

  /**
   * 提取关键词
   */
  extractKeywords(text) {
    if (!text) return [];
    
    return text
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .filter(word => !this.isStopWord(word));
  }

  /**
   * 判断是否为停用词
   */
  isStopWord(word) {
    const stopWords = new Set([
      '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这样',
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'
    ]);
    
    return stopWords.has(word);
  }

  /**
   * 计算文本相似度
   */
  calculateSimilarity(words1, words2) {
    if (words1.length === 0 || words2.length === 0) return 0;

    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size; // Jaccard相似度
  }

  /**
   * 计算链接评分
   */
  calculateLinkScore(metrics) {
    let score = 100;

    // 链接密度评分
    const density = parseFloat(metrics.linkDensity);
    if (density < 0.5) score -= 20;
    else if (density > 5) score -= 25;
    else if (density >= 1 && density <= 3) score += 10;

    // 空锚文本扣分
    if (metrics.emptyAnchorTexts > 0) {
      score -= metrics.emptyAnchorTexts * 10;
    }

    // 链接多样性评分
    if (metrics.totalInternalLinks > 0) {
      const uniqueRatio = metrics.uniqueLinks / metrics.totalInternalLinks;
      if (uniqueRatio < 0.7) score -= 15;
    }

    return Math.max(0, score);
  }
}

/**
 * SEO内容分析主类
 */
export class SEOContentAnalyzer {
  constructor() {
    this.keywordAnalyzer = new KeywordDensityAnalyzer();
    this.headingChecker = new HeadingStructureChecker();
    this.readabilityAnalyzer = new ReadabilityAnalyzer();
    this.linkAnalyzer = new InternalLinkAnalyzer();
  }

  /**
   * 综合分析内容SEO
   * @param {Object} options - 分析选项
   * @returns {Object} 综合分析结果
   */
  analyzeContent(options = {}) {
    const {
      content,
      keywords = [],
      currentUrl,
      allPages = []
    } = options;

    if (!content) {
      return { error: '内容不能为空' };
    }

    // 执行各项分析
    const keywordAnalysis = this.keywordAnalyzer.analyze(content, keywords);
    const headingAnalysis = this.headingChecker.analyze(content);
    const readabilityAnalysis = this.readabilityAnalyzer.analyze(content);
    const linkAnalysis = this.linkAnalyzer.analyze(content, currentUrl, allPages);

    // 计算综合评分
    const overallScore = this.calculateOverallScore({
      keyword: keywordAnalysis.overallScore || 0,
      heading: headingAnalysis.score || 0,
      readability: readabilityAnalysis.score || 0,
      links: linkAnalysis.score || 0
    });

    // 生成综合建议
    const recommendations = this.generateOverallRecommendations({
      keywordAnalysis,
      headingAnalysis,
      readabilityAnalysis,
      linkAnalysis
    });

    return {
      overallScore,
      recommendations,
      detailed: {
        keywords: keywordAnalysis,
        headings: headingAnalysis,
        readability: readabilityAnalysis,
        links: linkAnalysis
      },
      summary: this.generateSummary(overallScore, recommendations)
    };
  }

  /**
   * 计算综合评分
   */
  calculateOverallScore(scores) {
    const weights = {
      keyword: 0.25,
      heading: 0.25,
      readability: 0.25,
      links: 0.25
    };

    return Math.round(
      scores.keyword * weights.keyword +
      scores.heading * weights.heading +
      scores.readability * weights.readability +
      scores.links * weights.links
    );
  }

  /**
   * 生成综合建议
   */
  generateOverallRecommendations(analyses) {
    const recommendations = [];

    // 收集各分析器的建议
    if (analyses.keywordAnalysis.keywordAnalysis) {
      analyses.keywordAnalysis.keywordAnalysis.forEach(analysis => {
        if (analysis.recommendation.level !== 'optimal') {
          recommendations.push({
            category: 'keywords',
            priority: analysis.recommendation.level === 'high' ? 'high' : 'medium',
            message: `关键词"${analysis.keyword}": ${analysis.recommendation.message}`
          });
        }
      });
    }

    if (analyses.headingAnalysis.issues) {
      analyses.headingAnalysis.issues.forEach(issue => {
        recommendations.push({
          category: 'headings',
          priority: issue.severity,
          message: issue.message
        });
      });
    }

    if (analyses.readabilityAnalysis.recommendations) {
      analyses.readabilityAnalysis.recommendations.forEach(rec => {
        recommendations.push({
          category: 'readability',
          priority: 'medium',
          message: rec.message
        });
      });
    }

    if (analyses.linkAnalysis.suggestions) {
      analyses.linkAnalysis.suggestions.forEach(suggestion => {
        recommendations.push({
          category: 'links',
          priority: suggestion.type.includes('empty') ? 'high' : 'medium',
          message: suggestion.message
        });
      });
    }

    // 按优先级排序
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * 生成分析摘要
   */
  generateSummary(score, recommendations) {
    let level, description;

    if (score >= 90) {
      level = 'excellent';
      description = '内容SEO优化程度极佳';
    } else if (score >= 80) {
      level = 'good';
      description = '内容SEO优化程度良好';
    } else if (score >= 70) {
      level = 'fair';
      description = '内容SEO优化程度一般，有改进空间';
    } else if (score >= 60) {
      level = 'poor';
      description = '内容SEO优化程度较差，需要改进';
    } else {
      level = 'very_poor';
      description = '内容SEO优化程度很差，急需改进';
    }

    const highPriorityIssues = recommendations.filter(rec => rec.priority === 'high').length;
    const mediumPriorityIssues = recommendations.filter(rec => rec.priority === 'medium').length;

    return {
      level,
      description,
      score,
      issueCount: {
        high: highPriorityIssues,
        medium: mediumPriorityIssues,
        total: recommendations.length
      }
    };
  }
}