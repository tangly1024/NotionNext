import { batchAnalyzeSEO, generateSEOReport, analyzePostSEO } from '../../../lib/seo/seoUtils';

/**
 * SEO分析API端点
 * 处理SEO分析请求和报告生成
 */
export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: '只支持POST请求' 
    });
  }

  try {
    const { type, data } = req.body;

    switch (type) {
      case 'single':
        return await handleSingleAnalysis(req, res, data);
      case 'batch':
        return await handleBatchAnalysis(req, res, data);
      case 'report':
        return await handleReportGeneration(req, res, data);
      default:
        return res.status(400).json({
          error: 'Invalid type',
          message: '无效的分析类型，支持: single, batch, report'
        });
    }
  } catch (error) {
    console.error('SEO分析API错误:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'SEO分析过程中发生错误'
    });
  }
}

/**
 * 处理单篇文章分析
 */
async function handleSingleAnalysis(req, res, data) {
  const { post, allPosts = [], siteInfo = {} } = data;

  if (!post) {
    return res.status(400).json({
      error: 'Missing post data',
      message: '缺少文章数据'
    });
  }

  try {
    const analysis = analyzePostSEO(post, allPosts, siteInfo);
    
    return res.status(200).json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Analysis failed',
      message: `文章分析失败: ${error.message}`
    });
  }
}

/**
 * 处理批量文章分析
 */
async function handleBatchAnalysis(req, res, data) {
  const { posts = [], siteInfo = {}, options = {} } = data;

  if (!Array.isArray(posts) || posts.length === 0) {
    return res.status(400).json({
      error: 'Missing posts data',
      message: '缺少文章列表数据'
    });
  }

  // 限制批量分析的数量
  const maxBatchSize = options.maxBatchSize || 50;
  if (posts.length > maxBatchSize) {
    return res.status(400).json({
      error: 'Batch size too large',
      message: `批量分析数量不能超过 ${maxBatchSize} 篇文章`
    });
  }

  try {
    const startTime = Date.now();
    const results = batchAnalyzeSEO(posts, siteInfo);
    const endTime = Date.now();
    
    return res.status(200).json({
      success: true,
      data: results,
      meta: {
        totalPosts: posts.length,
        analyzedPosts: results.length,
        processingTime: endTime - startTime,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Batch analysis failed',
      message: `批量分析失败: ${error.message}`
    });
  }
}

/**
 * 处理报告生成
 */
async function handleReportGeneration(req, res, data) {
  const { analysisResults = [], format = 'json' } = data;

  if (!Array.isArray(analysisResults) || analysisResults.length === 0) {
    return res.status(400).json({
      error: 'Missing analysis results',
      message: '缺少分析结果数据'
    });
  }

  try {
    const report = generateSEOReport(analysisResults);
    
    // 添加额外的报告元数据
    const enhancedReport = {
      ...report,
      meta: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
        format: format
      }
    };

    return res.status(200).json({
      success: true,
      data: enhancedReport,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Report generation failed',
      message: `报告生成失败: ${error.message}`
    });
  }
}

/**
 * 获取SEO分析配置
 */
export async function getSEOAnalysisConfig() {
  return {
    maxBatchSize: 50,
    supportedFormats: ['json', 'csv'],
    analysisTypes: ['single', 'batch', 'report'],
    features: {
      keywordAnalysis: true,
      headingStructure: true,
      readabilityAnalysis: true,
      linkAnalysis: true,
      performanceMetrics: false, // 暂未实现
      technicalSEO: false // 暂未实现
    }
  };
}