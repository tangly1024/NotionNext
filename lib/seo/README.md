# SEO内容分析工具

这个模块提供了全面的SEO内容分析功能，帮助优化网站内容的搜索引擎表现。

## 功能特性

### 1. 关键词密度分析
- 分析目标关键词在内容中的密度
- 自动提取高频词汇
- 提供关键词优化建议
- 支持中英文关键词分析

### 2. 标题层级结构检查
- 检查H1-H6标题的层级结构
- 识别标题层级跳跃问题
- 检测空标题和重复H1标签
- 提供标题结构优化建议

### 3. 内容可读性分析
- 计算Flesch可读性评分
- 分析句子长度和段落结构
- 估算阅读时间
- 识别复杂词汇
- 提供可读性改进建议

### 4. 内部链接优化
- 分析内部链接密度
- 检查锚文本质量
- 推荐相关页面链接
- 计算页面相似度
- 提供链接优化建议

## 快速开始

### 基本使用

```javascript
import { SEOContentAnalyzer } from './lib/seo/contentAnalyzer';

const analyzer = new SEOContentAnalyzer();

const result = await analyzer.analyzeContent({
  content: '<h1>标题</h1><p>内容...</p>',
  keywords: ['SEO', '优化'],
  currentUrl: 'https://example.com/page',
  allPages: [/* 所有页面数据 */]
});

console.log('SEO评分:', result.overallScore);
console.log('优化建议:', result.recommendations);
```

### React组件使用

```jsx
import SEOContentAnalyzer from './components/SEOContentAnalyzer';

function MyPage() {
  return (
    <SEOContentAnalyzer
      content={htmlContent}
      keywords={['关键词1', '关键词2']}
      currentUrl="https://example.com/page"
      allPages={allPages}
      onAnalysisComplete={(result) => {
        console.log('分析完成:', result);
      }}
    />
  );
}
```

### 博客文章分析

```javascript
import { analyzePostSEO } from './lib/seo/seoUtils';

// 分析单篇文章
const analysis = await analyzePostSEO(post, allPosts, siteInfo);

// 批量分析
const batchResults = await batchAnalyzeSEO(posts, siteInfo);

// 生成报告
const report = generateSEOReport(batchResults);
```

## API参考

### SEOContentAnalyzer

主要的SEO内容分析类，整合了所有分析功能。

#### 方法

##### `analyzeContent(options)`

分析内容的SEO表现。

**参数:**
- `options.content` (string): 要分析的HTML内容
- `options.keywords` (Array): 目标关键词列表
- `options.currentUrl` (string): 当前页面URL
- `options.allPages` (Array): 所有页面数据

**返回值:**
```javascript
{
  overallScore: 85,           // 综合评分 (0-100)
  recommendations: [...],     // 优化建议列表
  detailed: {
    keywords: {...},          // 关键词分析详情
    headings: {...},          // 标题结构分析
    readability: {...},       // 可读性分析
    links: {...}              // 链接分析
  },
  summary: {
    level: 'good',            // 评级
    description: '...',       // 描述
    issueCount: {...}         // 问题统计
  }
}
```

### KeywordDensityAnalyzer

关键词密度分析器。

#### 方法

##### `analyze(content, keywords)`

分析关键词密度。

**参数:**
- `content` (string): 文本内容
- `keywords` (Array): 关键词列表

**返回值:**
```javascript
{
  totalWords: 500,
  keywordAnalysis: [
    {
      keyword: 'SEO',
      count: 10,
      density: 2.0,
      recommendation: {
        level: 'optimal',
        message: '关键词密度适中'
      }
    }
  ],
  topKeywords: [...],
  overallScore: 85
}
```

### HeadingStructureChecker

标题结构检查器。

#### 方法

##### `analyze(content)`

检查标题层级结构。

**返回值:**
```javascript
{
  headings: [
    {
      level: 1,
      text: '主标题',
      position: 0
    }
  ],
  issues: [
    {
      type: 'missing_h1',
      severity: 'high',
      message: '缺少H1标签'
    }
  ],
  suggestions: [...],
  score: 90
}
```

### ReadabilityAnalyzer

可读性分析器。

#### 方法

##### `analyze(content)`

分析内容可读性。

**返回值:**
```javascript
{
  metrics: {
    wordCount: 500,
    sentenceCount: 25,
    paragraphCount: 5,
    averageWordsPerSentence: 20,
    readingTime: 3,
    fleschScore: 65
  },
  recommendations: [...],
  score: 80,
  readingLevel: {
    level: 'standard',
    description: '标准难度'
  }
}
```

### InternalLinkAnalyzer

内部链接分析器。

#### 方法

##### `analyze(content, currentUrl, allPages)`

分析内部链接结构。

**返回值:**
```javascript
{
  links: [
    {
      href: '/page1',
      anchorText: '链接文本',
      position: 100,
      isInternal: true
    }
  ],
  metrics: {
    totalInternalLinks: 5,
    linkDensity: '1.0',
    uniqueLinks: 4,
    emptyAnchorTexts: 0
  },
  suggestions: [...],
  score: 85,
  relatedPages: [...]
}
```

## 工具函数

### analyzePostSEO(post, allPosts, siteInfo)

分析博客文章的SEO表现。

### batchAnalyzeSEO(posts, siteInfo)

批量分析多篇文章。

### generateSEOReport(analysisResults)

生成SEO分析报告。

### generateSEORecommendations(analysis)

生成具体的优化建议。

## 评分标准

### 综合评分 (0-100)

- **90-100**: 优秀 - SEO优化程度极佳
- **80-89**: 良好 - SEO优化程度良好
- **70-79**: 一般 - 有改进空间
- **60-69**: 较差 - 需要改进
- **0-59**: 很差 - 急需改进

### 各项指标权重

- 关键词优化: 25%
- 标题结构: 25%
- 可读性: 25%
- 内部链接: 25%

## 最佳实践

### 关键词优化

1. **密度控制**: 关键词密度保持在0.5%-3%之间
2. **自然分布**: 关键词应自然地分布在内容中
3. **长尾关键词**: 使用相关的长尾关键词
4. **避免堆砌**: 不要过度使用关键词

### 标题结构

1. **唯一H1**: 每个页面只使用一个H1标签
2. **层级递进**: 标题层级应该逐级递进
3. **描述性**: 标题应该准确描述内容
4. **长度适中**: 标题长度应该适中

### 可读性优化

1. **句子长度**: 平均句子长度控制在20词以内
2. **段落结构**: 每段不超过5句话
3. **简单词汇**: 使用通俗易懂的词汇
4. **逻辑清晰**: 内容结构要逻辑清晰

### 内部链接

1. **链接密度**: 内部链接密度保持在1%-3%
2. **锚文本**: 使用描述性的锚文本
3. **相关性**: 链接到相关的内容页面
4. **用户体验**: 不要过度使用链接

## 配置选项

### 自定义停用词

```javascript
const customStopWords = ['自定义', '停用词'];
// 在分析器中使用自定义停用词
```

### 调整评分权重

```javascript
const customWeights = {
  keyword: 0.3,
  heading: 0.2,
  readability: 0.3,
  links: 0.2
};
```

### 可读性参数

```javascript
const readabilityConfig = {
  wordsPerMinute: 200,        // 阅读速度
  optimalSentenceLength: 20,  // 最佳句子长度
  maxParagraphSentences: 5    // 段落最大句子数
};
```

## 故障排除

### 常见问题

1. **分析失败**: 检查内容格式是否正确
2. **评分异常**: 确认关键词和内容匹配
3. **性能问题**: 对于大量内容，考虑分批处理

### 调试模式

```javascript
// 启用调试模式
const analyzer = new SEOContentAnalyzer({ debug: true });
```

## 更新日志

### v1.0.0
- 初始版本发布
- 支持关键词密度分析
- 支持标题结构检查
- 支持可读性分析
- 支持内部链接分析
- 提供React组件
- 支持批量分析

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个工具。

## 支持

如果你在使用过程中遇到问题，请查看文档或提交Issue。