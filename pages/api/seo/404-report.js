import notFoundMonitor from '@/lib/seo/notFoundMonitor'

/**
 * 404错误报告API
 * 处理404错误记录和统计报告
 */
export default async function handler(req, res) {
  const { method } = req

  try {
    switch (method) {
      case 'POST':
        return await handleLogError(req, res)
      case 'GET':
        return await handleGetReport(req, res)
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('404 Report API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * 记录404错误
 */
async function handleLogError(req, res) {
  const {
    path,
    referrer = '',
    userAgent = '',
    timestamp = Date.now()
  } = req.body

  if (!path) {
    return res.status(400).json({ error: 'Path is required' })
  }

  try {
    const error = notFoundMonitor.logError(
      path,
      referrer,
      userAgent,
      timestamp
    )

    return res.status(200).json({
      success: true,
      error: {
        path: error.path,
        count: error.count,
        suggestions: error.suggestions
      }
    })
  } catch (error) {
    console.error('Error logging 404:', error)
    return res.status(500).json({ error: 'Failed to log error' })
  }
}

/**
 * 获取404错误报告
 */
async function handleGetReport(req, res) {
  const {
    limit = '50',
    sortBy = 'count',
    timeRange = null
  } = req.query

  try {
    const options = {
      limit: parseInt(limit),
      sortBy,
      timeRange: timeRange ? JSON.parse(timeRange) : null
    }

    const report = notFoundMonitor.getErrorReport(options)

    return res.status(200).json({
      success: true,
      report
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return res.status(500).json({ error: 'Failed to generate report' })
  }
}