// 简易 HTTP 客户端：在原生 fetch 之上增加超时与外部 signal 串联。
async function request({ url, method = 'GET', headers = {}, body, signal, timeoutMs = 60000 }) {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(new Error('请求超时')), timeoutMs)
  if (signal) signal.addEventListener('abort', () => controller.abort(signal.reason))

  try {
    const res = await fetch(url, { method, headers, body, signal: controller.signal })
    const text = await res.text()
    if (!res.ok) {
      throw new Error(`${method} ${url} → ${res.status}: ${text.slice(0, 300)}`)
    }
    return { status: res.status, body: text }
  } finally {
    clearTimeout(t)
  }
}

module.exports = { request }
