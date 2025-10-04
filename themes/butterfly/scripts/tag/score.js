/**
 * Music Score
 * {% score %}
 */

'use strict'

const score = (args, content) => {
  // Escape HTML tags and some special characters, including curly braces
  const escapeHtmlTags = s => {
    const lookup = {
      '&': '&amp;',
      '"': '&quot;',
      "'": '&apos;',
      '<': '&lt;',
      '>': '&gt;',
      '{': '&#123;',
      '}': '&#125;'
    }
    return s.replace(/[&"'<>{}]/g, c => lookup[c])
  }

  const trimmed = content.trim()
  // Split content using six dashes as a delimiter
  const parts = trimmed.split('------')

  if (parts.length < 2) {
    // If no delimiter is found, treat the entire content as the score
    return `<div class="abc-music-sheet">${escapeHtmlTags(trimmed)}</div>`
  }

  // First part is parameters (JSON string), the rest is the score content
  const paramPart = parts[0].trim()
  const scorePart = parts.slice(1).join('------').trim()

  let paramsObj = {}
  try {
    paramsObj = JSON.parse(paramPart)
  } catch (e) {
    console.error('Failed to parse JSON in score tag:', e)
  }

  // Use double quotes for data-params attribute value,
  // ensuring JSON internal double quotes are escaped
  return `<div class="abc-music-sheet" data-params="${escapeHtmlTags(JSON.stringify(paramsObj))}">
    ${escapeHtmlTags(scorePart)}
  </div>`
}

hexo.extend.tag.register('score', score, { ends: true })
