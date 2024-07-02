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

  const submitPassword = () => {
    const p = document.getElementById('password')
    if (!validPassword(p?.value)) {
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

  return <div id='container' className='w-full flex justify-center items-center h-96 '>
    <div className='text-center space-y-3'>
      <div className='font-bold'>{locale.COMMON.ARTICLE_LOCK_TIPS}</div>
      <div className='flex mx-4'>
        <input id="password" type='password'
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                submitPassword()
              }
            }}
            ref={passwordInputRef} // 绑定ref到passwordInputRef变量
            className='outline-none w-full text-sm pl-5 rounded-l transition focus:shadow-lg dark:text-gray-300 font-light leading-10 text-black bg-gray-100 dark:bg-gray-500'>
        </input>
        <div onClick={submitPassword} className="px-3 whitespace-nowrap cursor-pointer items-center justify-center py-2 bg-green-500 hover:bg-green-400 text-white rounded-r duration-300" >
          <i className={'duration-200 cursor-pointer fas fa-key'} >&nbsp;{locale.COMMON.SUBMIT}</i>
        </div>
      </div>
      <div id='tips'>
      </div>
    </div>
  </div>
}
