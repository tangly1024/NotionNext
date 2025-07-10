import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'

/**
 * 加密文章校验组件
 * @param {password, validPassword} props
 * @param password 正确的密码
 * @param validPassword(bool) 回调函数，校验正确回调入参为true
 * @returns
 */
export const ArticleFooter = props => {
  const router = useRouter()
  const { locale } = useGlobal()

  return (
    <div className='flex justify-between font-medium text-gray-500 dark:text-gray-400'>
      <a>
        <button
          onClick={() => {
            void router.push(siteConfig('path') || '/')
          }}
          className='mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100'>
          ← {locale.POST.BACK}
        </button>
      </a>
      <a>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className='mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100'>
          ↑ {locale.POST.TOP}
        </button>
      </a>
    </div>
  )
}
