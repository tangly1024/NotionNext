import { useGlobal } from '@/lib/global'
import { useId, useRef, useState } from 'react'

/** Shared lock for themes without their own password form and static exports. */
export default function ArticleLock({
  validPassword,
  unlockError,
  unavailable,
  post
}) {
  const { locale } = useGlobal()
  const inputId = useId()
  const passwordInput = useRef(null)
  const submitting = useRef(false)
  const [pending, setPending] = useState(false)
  const [rejected, setRejected] = useState(false)

  const submitPassword = async event => {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    setPending(true)
    setRejected(false)
    try {
      setRejected(!(await validPassword(passwordInput.current.value)))
    } catch {
      setRejected(true)
    } finally {
      submitting.current = false
      setPending(false)
    }
  }

  return (
    <section className='mx-auto w-full max-w-lg px-4 py-16 text-center'>
      {post?.title && (
        <h1 className='mb-6 text-2xl font-semibold'>{post.title}</h1>
      )}
      {unavailable ? (
        <p role='status'>{locale.COMMON.POST_UNLOCK_STATIC}</p>
      ) : (
        <form
          onSubmit={event => {
            void submitPassword(event)
          }}
          className='space-y-4'
        >
          <label htmlFor={inputId} className='block font-semibold'>
            {locale.COMMON.ARTICLE_LOCK_TIPS}
          </label>
          <div className='flex gap-2'>
            <input
              ref={passwordInput}
              id={inputId}
              type='password'
              autoComplete='current-password'
              required
              disabled={pending}
              className='min-w-0 flex-1 rounded border bg-transparent px-3 py-2'
            />
            <button
              type='submit'
              disabled={pending}
              className='rounded border px-4 py-2 disabled:opacity-50'
            >
              {locale.COMMON.SUBMIT}
            </button>
          </div>
          {rejected && !unlockError && (
            <p role='alert' className='text-red-600'>
              {locale.COMMON.PASSWORD_ERROR}
            </p>
          )}
        </form>
      )}
    </section>
  )
}
