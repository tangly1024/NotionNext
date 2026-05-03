const { request } = require('./_http')

// DeepSeek 翻译适配器；OpenAI 兼容接口，默认模型 deepseek-chat。
async function translate({ text, sourceLang, targetLang, glossary, hint, signal }) {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY 未设置')

  const baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1'
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat'

  const preserveList = (glossary?.preserve || []).join(', ')
  const langName = { 'zh-CN': 'Simplified Chinese', 'en-US': 'English' }
  const sourceName = langName[sourceLang] || sourceLang
  const targetName = langName[targetLang] || targetLang

  const hintLine =
    hint === 'mermaid'
      ? 'This input is Mermaid diagram code. Translate ONLY the human-readable labels, titles, and node text inside quotes or after `title`. Preserve every keyword, arrow, bracket, color directive, and identifier exactly.'
      : hint === 'plantuml'
      ? 'This input is PlantUML code. Translate ONLY the human-readable labels and titles. Preserve every keyword, arrow, and identifier exactly.'
      : ''

  const system = [
    `You are a professional bilingual translator for technical blog posts.`,
    `Translate from ${sourceName} to ${targetName}.`,
    `Preserve markdown, code, URLs, technical terms exactly.`,
    `Match the original tone (formal/casual).`,
    preserveList
      ? `Always keep these terms verbatim: ${preserveList}.`
      : '',
    hintLine,
    `Output ONLY the translation. No commentary, no quotes, no explanations.`,
    `If the input is empty or only whitespace, output the input unchanged.`
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
    throw new Error(`DeepSeek 返回异常: ${response.body.slice(0, 200)}`)
  }

  return {
    text: data.choices[0].message.content.trim(),
    inputTokens: data.usage?.prompt_tokens || 0,
    outputTokens: data.usage?.completion_tokens || 0
  }
}

module.exports = { translate }
