/**
 * Butterfly
 * chartjs
 * https://www.chartjs.org/
 * {% chartjs [width, abreast, chartId] %}
 * <!-- chart -->
 * <!-- endchart -->
 * <!-- desc -->
 * <!-- enddesc -->
 * {% endchartjs %}
 */

'use strict'

const { escapeHTML } = require('hexo-util')

const chartjs = (args, content) => {
  if (!content) return

  const chartRegex = /<!--\s*chart\s*-->\n([\w\W\s\S]*?)<!--\s*endchart\s*-->/
  const descRegex = /<!--\s*desc\s*-->\n([\w\W\s\S]*?)<!--\s*enddesc\s*-->/
  const selfConfig = args.join(' ').trim()

  const [width = '', layout = false, chartId = ''] = selfConfig.split(',').map(s => s.trim())

  const chartMatch = content.match(chartRegex)
  const descMatch = content.match(descRegex)

  if (!chartMatch) {
    hexo.log.warn('chartjs tag: chart content is required!')
    return
  }

  const chartConfig = chartMatch && chartMatch[1] ? chartMatch[1] : ''
  const descContent = descMatch && descMatch[1] ? descMatch[1] : ''

  const renderedDesc = descContent ? hexo.render.renderSync({ text: descContent, engine: 'markdown' }).trim() : ''

  const descDOM = renderedDesc ? `<div class="chartjs-desc">${renderedDesc}</div>` : ''
  const abreastClass = layout ? ' chartjs-abreast' : ''
  const widthStyle = width ? `data-width="${width}%"` : ''

  return `<div class="chartjs-container${abreastClass}" data-chartjs-id="${chartId}" ${widthStyle}>
            <pre class="chartjs-src" hidden>${escapeHTML(chartConfig)}</pre>
            ${descDOM}
          </div>`
}

hexo.extend.tag.register('chartjs', chartjs, { ends: true })
