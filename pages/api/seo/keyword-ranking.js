import keywordRankingTracker from '@/lib/seo/keywordRankingTracker'

/**
 * 关键词排名跟踪API
 * 处理关键词管理、排名检查和报告生成
 */
export default async function handler(req, res) {
  const { method } = req

  try {
    switch (method) {
      case 'GET':
        return await handleGetRequest(req, res)
      case 'POST':
        return await handlePostRequest(req, res)
      case 'PUT':
        return await handlePutRequest(req, res)
      case 'DELETE':
        return await handleDeleteRequest(req, res)
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Keyword Ranking API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * 处理GET请求
 */
async function handleGetRequest(req, res) {
  const { action, keywordId, competitorId, days = '30' } = req.query

  try {
    switch (action) {
      case 'keywords':
        return await getKeywords(req, res)
      
      case 'ranking':
        if (!keywordId) {
          return res.status(400).json({ error: 'Keyword ID is required' })
        }
        return await getKeywordRanking(keywordId, req, res)
      
      case 'history':
        if (!keywordId) {
          return res.status(400).json({ error: 'Keyword ID is required' })
        }
        return await getKeywordHistory(keywordId, req, res)
      
      case 'report':
        return await generateReport(req, res)
      
      case 'competitors':
        return await getCompetitors(req, res)
      
      case 'competitor-analysis':
        if (!competitorId) {
          return res.status(400).json({ error: 'Competitor ID is required' })
        }
        return await getCompetitorAnalysis(competitorId, req, res)
      
      case 'stats':
        return await getStats(req, res)
      
      case 'notifications':
        return await getNotifications(req, res)
      
      default:
        return res.status(400).json({ error: 'Invalid action' })
    }
  } catch (error) {
    console.error('GET request error:', error)
    return res.status(500).json({ error: error.message })
  }
}

/**
 * 处理POST请求
 */
async function handlePostRequest(req, res) {
  const { action } = req.body

  try {
    switch (action) {
      case 'add_keyword':
        return await addKeyword(req, res)
      
      case 'check_ranking':
        return await checkRanking(req, res)
      
      case 'check_all':
        return await checkAllRankings(req, res)
      
      case 'add_competitor':
        return await addCompetitor(req, res)
      
      case 'analyze_competitor':
        return await analyzeCompetitor(req, res)
      
      default:
        return res.status(400).json({ error: 'Invalid action' })
    }
  } catch (error) {
    console.error('POST request error:', error)
    return res.status(500).json({ error: error.message })
  }
}

/**
 * 处理PUT请求
 */
async function handlePutRequest(req, res) {
  const { action, keywordId, competitorId } = req.body

  try {
    switch (action) {
      case 'update_keyword':
        if (!keywordId) {
          return res.status(400).json({ error: 'Keyword ID is required' })
        }
        return await updateKeyword(keywordId, req, res)
      
      case 'update_competitor':
        if (!competitorId) {
          return res.status(400).json({ error: 'Competitor ID is required' })
        }
        return await updateCompetitor(competitorId, req, res)
      
      default:
        return res.status(400).json({ error: 'Invalid action' })
    }
  } catch (error) {
    console.error('PUT request error:', error)
    return res.status(500).json({ error: error.message })
  }
}

/**
 * 处理DELETE请求
 */
async function handleDeleteRequest(req, res) {
  const { keywordId, competitorId } = req.query

  try {
    if (keywordId) {
      keywordRankingTracker.removeKeyword(keywordId)
      return res.status(200).json({ 
        success: true, 
        message: 'Keyword removed successfully' 
      })
    }

    if (competitorId) {
      keywordRankingTracker.competitors.delete(competitorId)
      return res.status(200).json({ 
        success: true, 
        message: 'Competitor removed successfully' 
      })
    }

    return res.status(400).json({ error: 'Keyword ID or Competitor ID is required' })
  } catch (error) {
    console.error('DELETE request error:', error)
    return res.status(500).json({ error: error.message })
  }
}

/**
 * 获取关键词列表
 */
async function getKeywords(req, res) {
  const keywords = Array.from(keywordRankingTracker.keywords.values())
  
  return res.status(200).json({
    success: true,
    keywords,
    total: keywords.length
  })
}

/**
 * 获取关键词排名
 */
async function getKeywordRanking(keywordId, req, res) {
  try {
    const results = await keywordRankingTracker.checkKeywordRanking(keywordId)
    
    return res.status(200).json({
      success: true,
      results
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

/**
 * 获取关键词历史
 */
async function getKeywordHistory(keywordId, req, res) {
  const { searchEngine, days = '30' } = req.query
  
  const history = keywordRankingTracker.getKeywordHistory(
    keywordId, 
    searchEngine, 
    parseInt(days)
  )
  
  return res.status(200).json({
    success: true,
    history,
    total: history.length
  })
}

/**
 * 生成排名报告
 */
async function generateReport(req, res) {
  const { 
    keywordIds, 
    searchEngines, 
    days = '30', 
    includeCompetitors = 'false' 
  } = req.query

  const options = {
    keywordIds: keywordIds ? keywordIds.split(',') : null,
    searchEngines: searchEngines ? searchEngines.split(',') : null,
    days: parseInt(days),
    includeCompetitors: includeCompetitors === 'true'
  }

  const report = keywordRankingTracker.generateRankingReport(options)
  
  return res.status(200).json({
    success: true,
    report
  })
}

/**
 * 获取竞争对手列表
 */
async function getCompetitors(req, res) {
  const competitors = Array.from(keywordRankingTracker.competitors.values())
  
  return res.status(200).json({
    success: true,
    competitors,
    total: competitors.length
  })
}

/**
 * 获取竞争对手分析
 */
async function getCompetitorAnalysis(competitorId, req, res) {
  const { keywords } = req.query
  
  if (!keywords) {
    return res.status(400).json({ error: 'Keywords are required' })
  }

  try {
    const keywordList = keywords.split(',')
    const results = await keywordRankingTracker.analyzeCompetitor(competitorId, keywordList)
    
    return res.status(200).json({
      success: true,
      results
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

/**
 * 获取统计信息
 */
async function getStats(req, res) {
  const stats = keywordRankingTracker.getStats()
  
  return res.status(200).json({
    success: true,
    stats
  })
}

/**
 * 获取通知
 */
async function getNotifications(req, res) {
  const { limit = '50' } = req.query
  
  const notifications = keywordRankingTracker.notifications
    .slice(-parseInt(limit))
    .reverse()
  
  return res.status(200).json({
    success: true,
    notifications,
    total: notifications.length
  })
}

/**
 * 添加关键词
 */
async function addKeyword(req, res) {
  const { keyword, targetUrl, searchEngines, location, device, frequency } = req.body

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' })
  }

  try {
    const keywordId = keywordRankingTracker.addKeyword(keyword, {
      targetUrl,
      searchEngines: searchEngines || ['google', 'bing', 'baidu'],
      location: location || 'zh-CN',
      device: device || 'desktop',
      frequency: frequency || 'daily'
    })

    return res.status(200).json({
      success: true,
      keywordId,
      message: 'Keyword added successfully'
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

/**
 * 检查排名
 */
async function checkRanking(req, res) {
  const { keywordId } = req.body

  if (!keywordId) {
    return res.status(400).json({ error: 'Keyword ID is required' })
  }

  try {
    const results = await keywordRankingTracker.checkKeywordRanking(keywordId)
    
    return res.status(200).json({
      success: true,
      results
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

/**
 * 检查所有排名
 */
async function checkAllRankings(req, res) {
  try {
    const results = await keywordRankingTracker.checkAllKeywords()
    
    return res.status(200).json({
      success: true,
      results,
      total: results.length
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

/**
 * 添加竞争对手
 */
async function addCompetitor(req, res) {
  const { domain, keywords } = req.body

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' })
  }

  try {
    const competitorId = keywordRankingTracker.addCompetitor(domain, keywords || [])
    
    return res.status(200).json({
      success: true,
      competitorId,
      message: 'Competitor added successfully'
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

/**
 * 分析竞争对手
 */
async function analyzeCompetitor(req, res) {
  const { competitorId, keywords } = req.body

  if (!competitorId || !keywords) {
    return res.status(400).json({ error: 'Competitor ID and keywords are required' })
  }

  try {
    const results = await keywordRankingTracker.analyzeCompetitor(competitorId, keywords)
    
    return res.status(200).json({
      success: true,
      results
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

/**
 * 更新关键词
 */
async function updateKeyword(keywordId, req, res) {
  const { updates } = req.body

  try {
    keywordRankingTracker.updateKeyword(keywordId, updates)
    
    return res.status(200).json({
      success: true,
      message: 'Keyword updated successfully'
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

/**
 * 更新竞争对手
 */
async function updateCompetitor(competitorId, req, res) {
  const { updates } = req.body

  try {
    const competitor = keywordRankingTracker.competitors.get(competitorId)
    if (!competitor) {
      return res.status(404).json({ error: 'Competitor not found' })
    }

    keywordRankingTracker.competitors.set(competitorId, {
      ...competitor,
      ...updates,
      updatedAt: Date.now()
    })
    
    return res.status(200).json({
      success: true,
      message: 'Competitor updated successfully'
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    })
  }
}