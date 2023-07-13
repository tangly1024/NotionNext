
import { ArrowRightCircle } from '@/components/HeroIcons'
import Link from 'next/link'

/**
 * 通知横幅
 */
export function NoticeBar() {
  return (
          <notice className="max-w-[86rem] w-full mx-auto flex h-12 mb-4 px-5 font-bold">
              <Link href='https://tangly1024.com' className="bg-white hover:border-indigo-600 duration-200 hover:shadow-md transition-all rounded-xl border w-full h-full flex items-center justify-between px-5">
                  <span className='whitespace-nowrap'>此刻</span>
                  <div className="w-full h-full hover:text-indigo-600 flex justify-center items-center">欢迎来到我的博客</div>
                  <div><ArrowRightCircle className={'w-5 h-5'} /></div>
              </Link>
          </notice>
  )
}
