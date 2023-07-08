import { useRouter } from 'next/router'
import LayoutBase from './LayoutBase'
import { useEffect } from 'react'
import CONFIG_GITBOOK from './config_gitbook'
import { isBrowser } from '@/lib/utils'
/**
 * gitbook的首页
 * @param {*} props
 * @returns
 */
export const LayoutIndex = (props) => {
  const router = useRouter()
  // 直接显示指定页面
  useEffect(() => {
    router.push(CONFIG_GITBOOK.INDEX_PAGE).then(() => {
    //   console.log('跳转到指定首页', CONFIG_GITBOOK.INDEX_PAGE)
      setTimeout(() => {
        if (isBrowser()) {
          const article = document.getElementById('notion-article')
          if (!article) {
            console.log('请检查您的Notion数据库中是否包含此slug页面： ', CONFIG_GITBOOK.INDEX_PAGE)
            const containerInner = document.getElementById('container-inner')
            const newHTML = `<h1 class="text-3xl pt-12  dark:text-gray-300">配置有误</h1><blockquote class="notion-quote notion-block-ce76391f3f2842d386468ff1eb705b92"><div>请在您的notion中添加一个slug为${CONFIG_GITBOOK.INDEX_PAGE}的文章</div></blockquote>`
            containerInner?.insertAdjacentHTML('afterbegin', newHTML)
          }
        }
      }, 7 * 1000)
    })
  }, [])
  return <LayoutBase {...props}/>
}

export default LayoutIndex
