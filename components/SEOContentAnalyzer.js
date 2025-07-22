import { useState, useEffect, useMemo } from 'react'

/**
 * SEO内容分析器组件
 * 分析内容的SEO质量，包括关键词密度、标题结构、可读性等
 */
export default function SEOContentAnalyzer({ 
  content = '', 
  title = '', 
  description = '',
  keywords = [],
  targetKeyword = '',
  onAnalysisComplete,
  showRealTime = true,
  language = 'zh-CN'
}) {
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // 执行内容分析
  const analyzeContent = useMemo(() => {
    if (!content && !title && !description) return null

    const analyzer = new ContentAnalyzer(language)
    return analyzer.analyze({
      content,
      title,
      description,
      keywords,
      targetKeyword
    })
  }, [content, title, description, keywords, targetKeyword, language])

  useEffect(() => {
    if (analyzeContent) {
      setIsAnalyzing(true)
      
      // 模拟异步分析过程
      const timer = setTimeout(() => {
        setAnalysis(analyzeContent)
        setIsAnalyzing(false)
        
        if (typeof onAnalysisComplete === 'function') {
          onAnalysisComplete(analyzeContent)
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [analyzeContent, onAnalysisComplete])

  if (!showRealTime) return null

  return (
    <div className="seo-content-analyzer">
      <div className="analyzer-header">
        <h3 className="text-lg font-semibold mb-4">📊 SEO内容分析</h3>
        {isAnalyzing && (
          <div className="flex items-center text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            分析中...
          </div>
        )}
      </div>

      {analysis && (
        <div className="analysis-results space-y-4">
          {/* 总体评分 */}
          <div className="overall-score bg-white rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">总体SEO评分</span>
              <ScoreBadge score={analysis.overallScore} />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  analysis.overallScore >= 80 ? 'bg-green-500' :
                  analysis.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${analysis.overallScore}%` }}
              ></div>
            </div>
          </div>

          {/* 关键词分析 */}
          <AnalysisSection
            title="🔍 关键词分析"
            items={analysis.keywordAnalysis}
            type="keyword"
          />

          {/* 标题结构分析 */}
          <AnalysisSection
            title="📝 标题结构"
            items={analysis.headingStructure}
            type="heading"
          />

          {/* 可读性分析 */}
          <AnalysisSection
            title="📖 可读性分析"
            items={analysis.readability}
            type="readability"
          />

          {/* 内容质量 */}
          <AnalysisSection
            title="✨ 内容质量"
            items={analysis.contentQuality}
            type="quality"
          />

          {/* 建议 */}
          {analysis.suggestions.length > 0 && (
            <div className="suggestions bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">💡 优化建议</h4>
              <ul className="space-y-1">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-blue-800 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .seo-content-analyzer {
          max-width: 100%;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>
    </div>
  )
}

/**
 * 分析结果区块组件
 */
function AnalysisSection({ title, items, type }) {
  if (!items || items.length === 0) return null

  return (
    <div className="analysis-section bg-white rounded-lg p-4 border">
      <h4 className="font-medium mb-3">{title}</h4>
      <div className="space-y-2">
        {items.map((item, index) => (
          <AnalysisItem key={index} item={item} type={type} />
        ))}
      </div>
    </div>
  )
}

/**
 * 分析项目组件
 */
function AnalysisItem({ item, type }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'error': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      default: return 'ℹ️'
    }
  }

  return (
    <div className={`flex items-start justify-between p-2 rounded ${getStatusColor(item.status)}`}>
      <div className="flex items-start flex-1">
        <span className="mr-2">{getStatusIcon(item.status)}</span>
        <div>
          <div className="font-medium text-sm">{item.label}</div>
          {item.description && (
            <div className="text-xs opacity-75 mt-1">{item.description}</div>
          )}
        </div>
      </div>
      {item.value !== undefined && (
        <div className="text-sm font-mono ml-2">{item.value}</div>
      )}
    </div>
  )
}

/**
 * 评分徽章组件
 */
function ScoreBadge({ score }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
      {score}/100
    </span>
  )
}

/**
 * 内容分析器类
 */
class ContentAnalyzer {
  constructor(language = 'zh-CN') {
    this.language = language
    this.stopWords = this.getStopWords(language)
  }

  analyze({ content, title, description, keywords, targetKeyword }) {
    const analysis = {
      overallScore: 0,
      keywordAnalysis: [],
      headingStructure: [],
      readability: [],
      contentQuality: [],
      suggestions: []
    }

    // 分析关键词
    analysis.keywordAnalysis = this.analyzeKeywords(content, title, description, targetKeyword, keywords)
    
    // 分析标题结构
    analysis.headingStructure = this.analyzeHeadingStructure(content)
    
    // 分析可读性
    analysis.readability = this.analyzeReadability(content)
    
    // 分析内容质量
    analysis.contentQuality = this.analyzeContentQuality(content, title, description)
    
    // 生成建议
    analysis.suggestions = this.generateSuggestions(analysis)
    
    // 计算总体评分
    analysis.overallScore = this.calculateOverallScore(analysis)

    return analysis
  }

  analyzeKeywords(content, title, description, targetKeyword, keywords) {
    const results = []
    const fullText = `${title} ${description} ${content}`.toLowerCase()
    const wordCount = this.getWordCount(content)

    if (targetKeyword) {
      const density = this.calculateKeywordDensity(fullText, targetKeyword)
      const inTitle = title.toLowerCase().includes(targetKeyword.toLowerCase())
      const inDescription = description.toLowerCase().includes(targetKeyword.toLowerCase())
      
      results.push({
        label: `目标关键词: "${targetKeyword}"`,
        value: `${density.toFixed(1)}%`,
        status: this.getKeywordDensityStatus(density),
        description: `在标题中: ${inTitle ? '是' : '否'}, 在描述中: ${inDescription ? '是' : '否'}`
      })
    }

    // 分析其他关键词
    keywords.forEach(keyword => {
      if (keyword !== targetKeyword) {
        const density = this.calculateKeywordDensity(fullText, keyword)
        results.push({
          label: `关键词: "${keyword}"`,
          value: `${density.toFixed(1)}%`,
          status: this.getKeywordDensityStatus(density),
          description: `出现频率分析`
        })
      }
    })

    // 关键词分布分析
    if (wordCount > 0) {
      results.push({
        label: '内容长度',
        value: `${wordCount} 字`,
        status: wordCount >= 300 ? 'good' : wordCount >= 150 ? 'warning' : 'error',
        description: '建议文章长度至少300字'
      })
    }

    return results
  }

  analyzeHeadingStructure(content) {
    const results = []
    const headings = this.extractHeadings(content)
    
    // 检查H1标签
    const h1Count = headings.filter(h => h.level === 1).length
    results.push({
      label: 'H1标题',
      value: `${h1Count} 个`,
      status: h1Count === 1 ? 'good' : h1Count === 0 ? 'error' : 'warning',
      description: h1Count === 1 ? '正确使用一个H1标题' : 
                   h1Count === 0 ? '缺少H1标题' : '存在多个H1标题'
    })

    // 检查标题层级
    const hasProperHierarchy = this.checkHeadingHierarchy(headings)
    results.push({
      label: '标题层级',
      status: hasProperHierarchy ? 'good' : 'warning',
      description: hasProperHierarchy ? '标题层级结构合理' : '标题层级可能存在跳跃'
    })

    // 标题数量
    const totalHeadings = headings.length
    results.push({
      label: '标题总数',
      value: `${totalHeadings} 个`,
      status: totalHeadings >= 3 ? 'good' : totalHeadings >= 1 ? 'warning' : 'error',
      description: '适当的标题数量有助于内容结构化'
    })

    return results
  }

  analyzeReadability(content) {
    const results = []
    const sentences = this.getSentences(content)
    const words = this.getWords(content)
    const paragraphs = this.getParagraphs(content)

    // 平均句子长度
    const avgSentenceLength = words.length / sentences.length || 0
    results.push({
      label: '平均句子长度',
      value: `${avgSentenceLength.toFixed(1)} 字`,
      status: avgSentenceLength <= 20 ? 'good' : avgSentenceLength <= 30 ? 'warning' : 'error',
      description: '建议句子长度控制在20字以内'
    })

    // 段落长度
    const avgParagraphLength = words.length / paragraphs.length || 0
    results.push({
      label: '平均段落长度',
      value: `${avgParagraphLength.toFixed(0)} 字`,
      status: avgParagraphLength <= 150 ? 'good' : avgParagraphLength <= 250 ? 'warning' : 'error',
      description: '建议段落长度控制在150字以内'
    })

    // 可读性评分（简化版）
    const readabilityScore = this.calculateReadabilityScore(content)
    results.push({
      label: '可读性评分',
      value: `${readabilityScore}/100`,
      status: readabilityScore >= 70 ? 'good' : readabilityScore >= 50 ? 'warning' : 'error',
      description: '基于句子长度和词汇复杂度的评分'
    })

    return results
  }

  analyzeContentQuality(content, title, description) {
    const results = []

    // 标题长度
    const titleLength = title.length
    results.push({
      label: '标题长度',
      value: `${titleLength} 字符`,
      status: titleLength >= 30 && titleLength <= 60 ? 'good' : 
              titleLength >= 20 && titleLength <= 80 ? 'warning' : 'error',
      description: '建议标题长度30-60字符'
    })

    // 描述长度
    const descLength = description.length
    results.push({
      label: '描述长度',
      value: `${descLength} 字符`,
      status: descLength >= 120 && descLength <= 160 ? 'good' : 
              descLength >= 80 && descLength <= 200 ? 'warning' : 'error',
      description: '建议描述长度120-160字符'
    })

    // 内容原创性（简单检查）
    const uniqueWords = new Set(this.getWords(content.toLowerCase())).size
    const totalWords = this.getWords(content).length
    const uniqueRatio = uniqueWords / totalWords || 0
    
    results.push({
      label: '词汇丰富度',
      value: `${(uniqueRatio * 100).toFixed(1)}%`,
      status: uniqueRatio >= 0.6 ? 'good' : uniqueRatio >= 0.4 ? 'warning' : 'error',
      description: '词汇多样性反映内容丰富程度'
    })

    // 内部链接检查
    const internalLinks = (content.match(/\[.*?\]\((?!http)/g) || []).length
    results.push({
      label: '内部链接',
      value: `${internalLinks} 个`,
      status: internalLinks >= 2 ? 'good' : internalLinks >= 1 ? 'warning' : 'error',
      description: '适当的内部链接有助于SEO'
    })

    return results
  }

  generateSuggestions(analysis) {
    const suggestions = []

    // 基于分析结果生成建议
    analysis.keywordAnalysis.forEach(item => {
      if (item.status === 'error' && item.label.includes('目标关键词')) {
        suggestions.push('增加目标关键词在内容中的使用频率')
      }
    })

    analysis.headingStructure.forEach(item => {
      if (item.status === 'error' && item.label === 'H1标题') {
        suggestions.push('添加一个H1标题来明确文章主题')
      }
    })

    analysis.readability.forEach(item => {
      if (item.status === 'error' && item.label === '平均句子长度') {
        suggestions.push('缩短句子长度，提高内容可读性')
      }
    })

    analysis.contentQuality.forEach(item => {
      if (item.status === 'error' && item.label === '内部链接') {
        suggestions.push('添加相关的内部链接，提升页面权重')
      }
    })

    return suggestions
  }

  calculateOverallScore(analysis) {
    let totalScore = 0
    let totalItems = 0

    const sections = [analysis.keywordAnalysis, analysis.headingStructure, analysis.readability, analysis.contentQuality]
    
    sections.forEach(section => {
      section.forEach(item => {
        totalItems++
        switch (item.status) {
          case 'good': totalScore += 100; break
          case 'warning': totalScore += 60; break
          case 'error': totalScore += 20; break
          default: totalScore += 50; break
        }
      })
    })

    return totalItems > 0 ? Math.round(totalScore / totalItems) : 0
  }

  // 辅助方法
  calculateKeywordDensity(text, keyword) {
    const keywordCount = (text.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length
    const totalWords = this.getWords(text).length
    return totalWords > 0 ? (keywordCount / totalWords) * 100 : 0
  }

  getKeywordDensityStatus(density) {
    if (density >= 1 && density <= 3) return 'good'
    if (density >= 0.5 && density <= 5) return 'warning'
    return 'error'
  }

  extractHeadings(content) {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const headings = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: match[1].length,
        text: match[2].trim()
      })
    }

    return headings
  }

  checkHeadingHierarchy(headings) {
    for (let i = 1; i < headings.length; i++) {
      const prevLevel = headings[i - 1].level
      const currentLevel = headings[i].level
      
      // 检查是否跳跃了层级（如从H1直接到H3）
      if (currentLevel > prevLevel + 1) {
        return false
      }
    }
    return true
  }

  getWordCount(text) {
    return this.getWords(text).length
  }

  getWords(text) {
    return text.match(/[\u4e00-\u9fa5]|\b\w+\b/g) || []
  }

  getSentences(text) {
    return text.split(/[。！？.!?]+/).filter(s => s.trim().length > 0)
  }

  getParagraphs(text) {
    return text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  }

  calculateReadabilityScore(content) {
    const sentences = this.getSentences(content)
    const words = this.getWords(content)
    const avgSentenceLength = words.length / sentences.length || 0
    
    // 简化的可读性评分
    let score = 100
    if (avgSentenceLength > 20) score -= (avgSentenceLength - 20) * 2
    if (avgSentenceLength > 30) score -= (avgSentenceLength - 30) * 3
    
    return Math.max(0, Math.min(100, Math.round(score)))
  }

  getStopWords(language) {
    const stopWords = {
      'zh-CN': ['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这'],
      'en-US': ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']
    }
    return stopWords[language] || stopWords['en-US']
  }
}