import { useState } from 'react'
import { useGlobal } from '@/lib/global'

export default function ArticleLock({ validPassword }) {
  const [error, setError] = useState(false)
  const { locale } = useGlobal()
  const submitPassword = async password => {
    if (validPassword) setError(!(await validPassword(password)))
  }
  return (
    <div className='flex flex-col items-center py-20'>
      <div className='border-2 border-[#0284c7] rounded-sm shadow-[4px_4px_0px_0px_#0284c7] bg-[#ffffff] dark:bg-slate-800 p-8 max-w-sm w-full text-center'>
        <div className='text-3xl mb-4'>{'\u{1F512}'}</div>
        <p className='font-black text-sm text-[#0284c7] uppercase tracking-wider mb-6'>
          Protected Post
        </p>
        <div className='flex gap-2'>
          <input
            id='password'
            type='password'
            placeholder='Password'
            onKeyDown={e => {
              if (e.key === 'Enter' && validPassword)
                submitPassword(e.target.value)
            }}
            className='flex-1 border-[3px] border-[#0284c7] rounded-sm shadow-[2px_2px_0px_0px_#0284c7] px-4 py-2.5 font-extrabold text-sm outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400'
          />
          <button
            onClick={() => {
              const p = document.getElementById('password')
              if (p) void submitPassword(p.value)
            }}
            className='border-2 border-[#0284c7] rounded-sm shadow-[2px_2px_0px_0px_#0284c7] bg-[#fde68a] px-4 py-2.5 font-black text-sm text-[#0284c7] uppercase tracking-wider hover:bg-[#0ea5e9] hover:text-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all'
          >
            Go
          </button>
        </div>
        {error && <p role='alert' className='mt-3 text-red-500'>{locale.COMMON.PASSWORD_ERROR}</p>}
      </div>
    </div>
  )
}
