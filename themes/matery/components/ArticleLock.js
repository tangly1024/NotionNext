import { useGlobal } from '@/lib/global'
import { useEffect, useRef } from 'react'

/**
 * 加密文章校验组件
 * @param {password, validPassword} props
 * @param password 正确的密码
 * @param validPassword(bool) 回调函数，校验正确回调入参为true
 * @returns
 */
export const ArticleLock = props => {
  const { validPassword } = props
  const { locale } = useGlobal()
  const submitPassword = async () => {
    const p = document.getElementById('password')
    if (!(await validPassword(p?.value))) {
      const tips = document.getElementById('tips')
      if (tips) {
        tips.innerHTML = ''
        tips.innerHTML = `<div class='text-red-500 animate__shakeX animate__animated'>${locale.COMMON.PASSWORD_ERROR}</div>`
      }
    }
  }

  const passwordInputRef = useRef(null)
  useEffect(() => {
    // 选中密码输入框并将其聚焦
    passwordInputRef.current.focus()
  }, [])

  return (
    <div id='article-wrapper' className='w-full flex justify-center items-center h-96 '>
      <div className='text-center space-y-3 dark:text-gray-300 text-black'>
        <div className='font-bold'>{locale.COMMON.ARTICLE_LOCK_TIPS}</div>
        <div className='flex mx-4'>
          <input
            id='password'
            type='password'
            onKeyDown={e => {
              if (e.key === 'Enter') {
                submitPassword()
              }
            }}
            ref={passwordInputRef}
            className='outline-none flex-1 min-w-0 text-sm pl-5 rounded-l transition focus:shadow-lg font-light leading-10 bg-gray-100 dark:bg-gray-500'
          />
          <div
            onClick={() => { void submitPassword() }}
            className='flex items-center justify-center whitespace-nowrap cursor-pointer px-4 leading-10 bg-indigo-500 hover:bg-indigo-400 text-white rounded-r duration-300 select-none'>
            <i className='duration-200 cursor-pointer fas fa-key' />
            <span className='ml-1'>{locale.COMMON.SUBMIT}</span>
          </div>
        </div>
        <div id='tips' />
      </div>
    </div>
  )
}
