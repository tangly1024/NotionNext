import busuanzi from '@/lib/busuanzi'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
// import { useRouter } from 'next/router'
import React from 'react'

export default function Busuanzi () {
  const { theme } = useGlobal()
  const router = useRouter()

  // 切换文章时更新
  React.useEffect(() => {
    const busuanziRouteChange = url => {
      busuanzi.fetch()
    }
    router.events.on('routeChangeComplete', busuanziRouteChange)
    return () => {
      router.events.off('routeChangeComplete', busuanziRouteChange)
    }
  }, [router.events])

  // 更换主题时更新
  React.useEffect(() => {
    if (theme) {
      busuanzi.fetch()
    }
  })
  return null
}
