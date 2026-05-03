const fs = require('fs')
const path = require('path')

// 极简零依赖 .env 加载器，与 Next.js 应用运行时的行为一致：
// 从项目根目录读取 .env.local（优先）与 .env，写入 process.env，
// 但不会覆盖已有的环境变量（例如 Vercel 注入或 shell 中显式 export 的值）。
// 两个文件都不存在时静默退出，不报错。
function loadEnv() {
  const projectRoot = path.resolve(__dirname, '..', '..')
  for (const name of ['.env.local', '.env']) {
    const file = path.join(projectRoot, name)
    if (!fs.existsSync(file)) continue
    const content = fs.readFileSync(file, 'utf8')
    for (const raw of content.split(/\r?\n/)) {
      const line = raw.trim()
      if (!line || line.startsWith('#')) continue
      const eq = line.indexOf('=')
      if (eq < 0) continue
      const key = line.slice(0, eq).trim()
      let value = line.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (process.env[key] === undefined) process.env[key] = value
    }
  }
}

module.exports = { loadEnv }
