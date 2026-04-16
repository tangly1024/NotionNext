import { useRouter } from 'next/router'
import { useMemo } from 'react'

const UI = () => {
  const router = useRouter()
  const message = useMemo(() => {
    if (!router?.query?.msg) {
      return '授权处理中...'
    }

    return Array.isArray(router.query.msg)
      ? router.query.msg[0]
      : router.query.msg
  }, [router?.query?.msg])

  return (
    <main className='min-h-screen bg-white px-6 py-20 text-neutral-900 dark:bg-[#18171d] dark:text-white'>
      <div className='mx-auto max-w-2xl rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-[#1f1d24]'>
        <div className='mb-3 text-sm uppercase tracking-[0.24em] text-neutral-500'>
          Auth Result
        </div>
        <h1 className='mb-4 text-3xl font-bold'>授权结果</h1>
        <p className='break-words text-sm leading-7 text-neutral-600 dark:text-neutral-300'>
          {message}
        </p>
      </div>
    </main>
  )
}

export default UI
