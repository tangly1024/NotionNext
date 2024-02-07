import busuanzi from '@/lib/busuanzi'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
// import { useRouter } from 'next/router'
import { useEffect } from 'react'

let path = ''

export default function Busuanzi () {
  const { theme } = useGlobal()
  const router = useRouter()
  router.events.on('routeChangeComplete', (url, option) => {
    if (url !== path) {
      path = url
      busuanzi.fetch()
    }
  })

  // 更换主题时更新
  useEffect(() => {
    if (theme) {
      busuanzi.fetch()
    }
  }, [theme])
  return null
}
