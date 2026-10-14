import { useGlobal } from '@/lib/global'
import { useEffect, useRef, useState } from 'react'

/**
 * 加密文章校验组件
 * @param {password, validPassword} props
 * @param password 正确的密码
 * @param validPassword(bool) 回调函数，校验正确回调入参为true
 * @returns
 */
export const PostLock = props => {
  const { validPassword } = props
  const { locale } = useGlobal()
  const [showError, setShowError] = useState(false)
  const passwordInputRef = useRef(null)

  const submitPassword = async () => {
    const value = passwordInputRef.current?.value
    if (!(await validPassword(value))) {
      // 触发抖动动画：先取消再加上，让 CSS 动画重新跑
      setShowError(false)
      // 下一帧再设 true，确保动画重启
      requestAnimationFrame(() => setShowError(true))
    } else {
      setShowError(false)
    }
  }

  useEffect(() => {
    // 选中密码输入框并将其聚焦（带空保护，组件未挂载时不会崩）
    passwordInputRef.current?.focus?.()
  }, [])

  return (
    <div
      id='container'
      className='w-full flex justify-center items-center h-96 '>
      <div className='text-center space-y-3'>
        <div className='font-bold dark:text-gray-300 text-black'>
          {locale.COMMON.ARTICLE_LOCK_TIPS}
        </div>
        <div className='flex mx-4'>
          <input
            id='password'
            type='password'
            onKeyDown={e => {
              if (e.key === 'Enter') {
                submitPassword()
              }
            }}
            ref={passwordInputRef} // 绑定ref到passwordInputRef变量
            className='outline-none flex-1 min-w-0 text-sm pl-5 rounded-l transition focus:shadow-lg  font-light leading-10 bg-gray-100 dark:bg-gray-500'></input>
          <div
            onClick={() => { void submitPassword() }}
            className='flex items-center justify-center whitespace-nowrap cursor-pointer px-4 leading-10 bg-[var(--heo-color-primary)] hover:bg-[var(--heo-color-primary-hover)] text-[var(--heo-color-primary-text)] rounded-r duration-300 select-none'>
            <i className={'duration-200 cursor-pointer fas fa-key'} />
            <span className='ml-1'>{locale.COMMON.SUBMIT}</span>
          </div>
        </div>
        <div id='tips'>
          {showError && (
            <div className='text-red-500 animate__shakeX animate__animated'>
              {locale.COMMON.PASSWORD_ERROR}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
