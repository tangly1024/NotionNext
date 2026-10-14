import { useGlobal } from '@/lib/global'
import { useEffect, useRef } from 'react'

/**
 * 文章锁；通过此组件校验密码访问文章
 */
export const PostLock = props => {
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
    passwordInputRef.current?.focus()
  }, [])

  return (
    <div className='flex w-full justify-center py-16'>
      <div className='tl-card w-full max-w-md space-y-4 p-8 text-center'>
        <div className='text-sm font-medium text-[var(--tl-text)]'>
          {locale.COMMON.ARTICLE_LOCK_TIPS}
        </div>
        <div className='tl-search-bar flex overflow-hidden'>
          <input
            id='password'
            type='password'
            onKeyDown={e => {
              if (e.key === 'Enter') {
                submitPassword()
              }
            }}
            ref={passwordInputRef}
            className='min-w-0 flex-1 border-0 bg-transparent py-3 pl-4 text-sm text-[var(--tl-text)] outline-none'
          />
          <button
            type='button'
            onClick={() => { void submitPassword() }}
            className='border-l border-[var(--tl-border)] bg-[var(--tl-accent-soft)] px-4 text-sm font-medium text-[var(--tl-accent)] hover:opacity-90'>
            <i className='fas fa-key mr-1' aria-hidden='true' />
            {locale.COMMON.SUBMIT}
          </button>
        </div>
        <div id='tips' />
      </div>
    </div>
  )
}
