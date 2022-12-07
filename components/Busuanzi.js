import busuanzi from '@/lib/busuanzi'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
// import { useRouter } from 'next/router'
import React from 'react'

let path = ''

export default function Busuanzi () {
  const { theme } = useGlobal()
  const Router = useRouter()
  Router.events.on('routeChangeComplete', (url, option) => {
    if (url !== path) {
      path = url
      busuanzi.fetch()
    }
  })

  // 更换主题时更新
  React.useEffect(() => {
    if (theme) {
      busuanzi.fetch()
    }
  }, [theme])
  return null
}
