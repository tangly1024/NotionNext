const FILE_CDN_HOSTNAME = /^file\.notion\.(?:com|so)$/i

export function convertFileCdnUrl(source) {
  if (typeof source !== 'string') return null
  try {
    const url = new URL(source)
    if (!FILE_CDN_HOSTNAME.test(url.hostname)) return null
    const parts = url.pathname.split('/')
    if (parts.length < 6 || parts[1] !== 'f' || parts[2] !== 'f') return null
    const attachmentId = parts[4]
    const fileName = parts.slice(5).join('/')
    if (!attachmentId || !fileName) return null
    return `attachment:${attachmentId}:${decodeURIComponent(fileName)}`
  } catch {
    return null
  }
}
