import React from 'react'
import Toc from '@/components/Toc'

const RightAside = ({ toc }) => {
  // 无目录就直接返回空
  if (toc.length < 1) return <></>

  return <aside className='bg-gray-800 px-5 hidden lg:block py-5 hover:shadow-2xl duration-200'>
      <div className='sticky top-8 w-60 overflow-x-auto'>
      <Toc toc={toc}/>
      </div>
    </aside>
}
export default RightAside
