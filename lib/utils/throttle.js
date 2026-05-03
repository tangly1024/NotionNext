export default function throttle(fn, wait = 100) {
  let timer = null
  let lastRun = 0
  let pendingArgs = null

  return (...args) => {
    const now = Date.now()
    const remaining = wait - (now - lastRun)
    pendingArgs = args

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      lastRun = now
      fn(...pendingArgs)
      pendingArgs = null
      return
    }

    if (!timer) {
      timer = setTimeout(() => {
        timer = null
        lastRun = Date.now()
        if (pendingArgs) {
          fn(...pendingArgs)
          pendingArgs = null
        }
      }, remaining)
    }
  }
}
