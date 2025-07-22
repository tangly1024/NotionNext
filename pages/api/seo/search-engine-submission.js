import searchEngineSubmission from '@/lib/seo/searchEngineSubmission'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'

/**
 * 搜索引擎提交API
 * 处理sitemap提交、URL索引请求和验证码管理
 */
export default async function handler(req, res) {
  const { method } = req

  try {
    // 初始化配置
    const siteUrl = siteConfig('LINK', BLOG.LINK)
    searchEngineSubmission.config.siteUrl = siteUrl

    switch (method) {
      case 'POST':
        return await handleSubmission(req, res)
      case 'GET':
        return await handleGetStatus(req, res)
      case 'PUT':
        return await handleUpdateConfig(req, res)
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Search Engine Submission API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * 处理提交请求
 */
async function handleSubmission(req, res) {
  const { action, engineId, urls, type } = req.body

  try {
    let result

    switch (action) {
      case 'submit_sitemap':
        if (engineId) {
          const sitemapUrl = `${searchEngineSubmission.config.siteUrl}/sitemap.xml`
          result = await searchEngineSubmission.submitSitemapToEngine(engineId, sitemapUrl)
        } else {
          result = await searchEngineSubmission.submitSitemapToAll()
        }
        break

      case 'submit_url':
        if (!urls || urls.length === 0) {
          return res.status(400).json({ error: 'URLs are required' })
        }
        
        if (urls.length === 1) {
          result = await searchEngineSubmission.submitUrlForIndexing(
            urls[0], 
            engineId || 'google', 
            type || 'URL_UPDATED'
          )
        } else {
          result = await searchEngineSubmission.submitUrlsBatch(
            urls, 
            engineId || 'google'
          )
        }
        break

      case 'submit_batch':
        if (!urls || urls.length === 0) {
          return res.status(400).json({ error: 'URLs are required' })
        }
        result = await searchEngineSubmission.submitUrlsBatch(urls, engineId)
        break

      default:
        return res.status(400).json({ error: 'Invalid action' })
    }

    return res.status(200).json({
      success: true,
      result
    })
  } catch (error) {
    console.error('Submission error:', error)
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
}

/**
 * 获取状态信息
 */
async function handleGetStatus(req, res) {
  const { type, engineId, limit } = req.query

  try {
    let data

    switch (type) {
      case 'engines':
        data = searchEngineSubmission.getEngineStatus()
        break

      case 'history':
        data = searchEngineSubmission.getSubmissionHistory(
          engineId, 
          parseInt(limit) || 100
        )
        break

      case 'quota':
        data = getQuotaStatus()
        break

      case 'verification':
        data = getVerificationCodes()
        break

      default:
        data = {
          engines: searchEngineSubmission.getEngineStatus(),
          recentHistory: searchEngineSubmission.getSubmissionHistory(null, 10),
          quota: getQuotaStatus()
        }
    }

    return res.status(200).json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Status error:', error)
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
}

/**
 * 更新配置
 */
async function handleUpdateConfig(req, res) {
  const { action, engineId, method, code, enabled } = req.body

  try {
    switch (action) {
      case 'set_verification':
        if (!engineId || !method || !code) {
          return res.status(400).json({ error: 'Missing required fields' })
        }
        searchEngineSubmission.setVerificationCode(engineId, method, code)
        break

      case 'toggle_engine':
        if (!engineId || enabled === undefined) {
          return res.status(400).json({ error: 'Missing required fields' })
        }
        searchEngineSubmission.searchEngines[engineId].enabled = enabled
        break

      default:
        return res.status(400).json({ error: 'Invalid action' })
    }

    return res.status(200).json({
      success: true,
      message: 'Configuration updated successfully'
    })
  } catch (error) {
    console.error('Config update error:', error)
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
}

/**
 * 获取配额状态
 */
function getQuotaStatus() {
  const today = new Date().toDateString()
  const quota = {}

  for (const [engineId, engine] of Object.entries(searchEngineSubmission.searchEngines)) {
    const usage = searchEngineSubmission.quotaUsage.get(`${engineId}_${today}`) || 0
    quota[engineId] = {
      used: usage,
      limit: engine.quotaLimits?.daily || 0,
      remaining: Math.max(0, (engine.quotaLimits?.daily || 0) - usage),
      percentage: engine.quotaLimits?.daily ? (usage / engine.quotaLimits.daily * 100) : 0
    }
  }

  return quota
}

/**
 * 获取验证码信息
 */
function getVerificationCodes() {
  const codes = {}
  
  for (const [key, verification] of searchEngineSubmission.verificationCodes) {
    const [engineId, method] = key.split('_')
    if (!codes[engineId]) {
      codes[engineId] = {}
    }
    codes[engineId][method] = {
      code: verification.code,
      timestamp: verification.timestamp
    }
  }

  return codes
}