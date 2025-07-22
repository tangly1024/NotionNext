import searchEngineSubmission from '@/lib/seo/searchEngineSubmission'

/**
 * 搜索引擎验证文件生成API
 * 动态生成各搜索引擎的验证文件
 */
export default async function handler(req, res) {
  const { method, query } = req
  const { engine, type, code } = query

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 验证参数
    if (!engine || !type) {
      return res.status(400).json({ error: 'Missing required parameters: engine, type' })
    }

    // 支持的搜索引擎和验证类型
    const supportedEngines = ['google', 'bing', 'baidu', 'yandex']
    const supportedTypes = ['html_file', 'html_tag', 'dns']

    if (!supportedEngines.includes(engine)) {
      return res.status(400).json({ error: 'Unsupported search engine' })
    }

    if (!supportedTypes.includes(type)) {
      return res.status(400).json({ error: 'Unsupported verification type' })
    }

    let content = ''
    let contentType = 'text/plain'
    let filename = ''

    switch (type) {
      case 'html_file':
        content = await generateHtmlFile(engine, code)
        contentType = 'text/html'
        filename = getVerificationFileName(engine, code)
        break

      case 'html_tag':
        content = generateHtmlTag(engine, code)
        contentType = 'text/html'
        break

      case 'dns':
        content = generateDnsRecord(engine, code)
        contentType = 'text/plain'
        break

      default:
        return res.status(400).json({ error: 'Invalid verification type' })
    }

    // 设置响应头
    res.setHeader('Content-Type', contentType)
    if (filename) {
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    }

    return res.status(200).send(content)

  } catch (error) {
    console.error('Verification file generation error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * 生成HTML验证文件
 */
async function generateHtmlFile(engine, code) {
  const verificationCode = code || searchEngineSubmission.getVerificationCode(engine, 'html_file')?.code

  if (!verificationCode) {
    throw new Error(`No verification code found for ${engine}`)
  }

  switch (engine) {
    case 'google':
      return `google-site-verification: ${verificationCode}`

    case 'bing':
      return `<?xml version="1.0"?>
<users>
  <user>${verificationCode}</user>
</users>`

    case 'baidu':
      return verificationCode

    case 'yandex':
      return `<html>
<head>
  <meta name="yandex-verification" content="${verificationCode}" />
</head>
<body>
  <p>Yandex verification file</p>
</body>
</html>`

    default:
      return verificationCode
  }
}

/**
 * 生成HTML标签
 */
function generateHtmlTag(engine, code) {
  const verificationCode = code || searchEngineSubmission.getVerificationCode(engine, 'html_tag')?.code

  if (!verificationCode) {
    throw new Error(`No verification code found for ${engine}`)
  }

  switch (engine) {
    case 'google':
      return `<meta name="google-site-verification" content="${verificationCode}" />`

    case 'bing':
      return `<meta name="msvalidate.01" content="${verificationCode}" />`

    case 'baidu':
      return `<meta name="baidu-site-verification" content="${verificationCode}" />`

    case 'yandex':
      return `<meta name="yandex-verification" content="${verificationCode}" />`

    default:
      return `<meta name="verification" content="${verificationCode}" />`
  }
}

/**
 * 生成DNS记录
 */
function generateDnsRecord(engine, code) {
  const verificationCode = code || searchEngineSubmission.getVerificationCode(engine, 'dns')?.code

  if (!verificationCode) {
    throw new Error(`No verification code found for ${engine}`)
  }

  switch (engine) {
    case 'google':
      return `TXT record for your domain:
Name: @
Value: google-site-verification=${verificationCode}

Or for subdomain:
Name: _google-site-verification
Value: ${verificationCode}`

    case 'bing':
      return `TXT record for your domain:
Name: @
Value: ms-verification=${verificationCode}`

    case 'baidu':
      return `TXT record for your domain:
Name: @
Value: baidu-site-verification=${verificationCode}`

    case 'yandex':
      return `TXT record for your domain:
Name: @
Value: yandex-verification=${verificationCode}`

    default:
      return `TXT record for your domain:
Name: @
Value: ${verificationCode}`
  }
}

/**
 * 获取验证文件名
 */
function getVerificationFileName(engine, code) {
  const verificationCode = code || searchEngineSubmission.getVerificationCode(engine, 'html_file')?.code

  switch (engine) {
    case 'google':
      return `google${verificationCode}.html`

    case 'bing':
      return `BingSiteAuth.xml`

    case 'baidu':
      return `baidu_verify_${verificationCode}.html`

    case 'yandex':
      return `yandex_${verificationCode}.html`

    default:
      return `verification_${verificationCode}.html`
  }
}