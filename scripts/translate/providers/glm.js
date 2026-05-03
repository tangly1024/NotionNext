const { request } = require('./_http')

// 智谱 GLM 翻译适配器；与 DeepSeek 对应的备选实现。
async function translate({ text, sourceLang, targetLang, glossary, hint, signal }) {
  const apiKey = process.env.GLM_API_KEY
  if (!apiKey) throw new Error('GLM_API_KEY 未设置')

  const baseUrl = process.env.GLM_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4'
  const model = process.env.GLM_MODEL || 'glm-4-plus'

  const preserveList = (glossary?.preserve || []).join(', ')
  const langName = { 'zh-CN': 'Simplified Chinese', 'en-US': 'English' }
  const sourceName = langName[sourceLang] || sourceLang
  const targetName = langName[targetLang] || targetLang

  const hintLine =
    hint === 'mermaid'
      ? 'This input is Mermaid diagram code. Translate ONLY human-readable labels/titles/node text. Preserve every keyword, arrow, bracket, color, and identifier exactly.'
      : hint === 'plantuml'
      ? 'This input is PlantUML code. Translate ONLY labels/titles. Preserve all keywords/arrows/identifiers exactly.'
      : ''

  const system = [
    `You are a professional bilingual translator for technical blog posts.`,
    `Translate from ${sourceName} to ${targetName}.`,
    `Preserve markdown, code, URLs, technical terms exactly.`,
    `Match the original tone.`,
    preserveList ? `Always keep these terms verbatim: ${preserveList}.` : '',
    hintLine,
    `Output ONLY the translation. No commentary.`
  ]
    .filter(Boolean)
    .join(' ')

  const body = {
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: text }
    ],
    temperature: 0.3,
    stream: false
  }

  const response = await request({
    url: `${baseUrl}/chat/completions`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
    signal
  })

  const data = JSON.parse(response.body)
  if (!data.choices?.[0]?.message?.content) {
    throw new Error(`GLM 返回异常: ${response.body.slice(0, 200)}`)
  }

  return {
    text: data.choices[0].message.content.trim(),
    inputTokens: data.usage?.prompt_tokens || 0,
    outputTokens: data.usage?.completion_tokens || 0
  }
}

module.exports = { translate }
