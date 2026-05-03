// 翻译提供方选择器：通过 TRANSLATOR_PROVIDER 环境变量或参数指定使用哪个适配器。
const deepseek = require('./deepseek')
const glm = require('./glm')

function getProvider(name) {
  const which = (name || process.env.TRANSLATOR_PROVIDER || 'deepseek').toLowerCase()
  if (which === 'deepseek') return deepseek
  if (which === 'glm') return glm
  throw new Error(`未知的 TRANSLATOR_PROVIDER: ${which}`)
}

module.exports = { getProvider }
