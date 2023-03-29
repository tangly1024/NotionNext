// import BLOG from '@/blog.config'
// import Router from 'next/router'
// import React from 'react'
// import SocialButton from './SocialButton'

// const InfoCard = (props) => {
//   const { siteInfo } = props
//   return <>
//     <div className='flex flex-col items-center justify-center '>
//         <div className='hover:rotate-45 hover:scale-125 transform duration-200 cursor-pointer' onClick={ () => { Router.push('/') }}>
//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img src={siteInfo?.icon} className='rounded-full' width={120} alt={BLOG.AUTHOR}/>
//         </div>
//         <div className='text-2xl font-serif dark:text-white py-2 hover:scale-105 transform duration-200'>{BLOG.AUTHOR}</div>
//         <div className='font-light dark:text-white py-2 hover:scale-105 transform duration-200 text-center'>{BLOG.BIO}</div>
//         <SocialButton/>
//     </div>
//   </>
// }

// export default InfoCard
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import Card from './Card'
import SocialButton from './SocialButton'
import MenuGroupCard from './MenuGroupCard'
export function InfoCard (props) {
  const { className, siteInfo } = props
  const router = useRouter()
  return <Card className={className}>
    <div
      className='justify-center items-center flex hover:rotate-45 py-6 hover:scale-105 dark:text-gray-100  transform duration-200 cursor-pointer'
      onClick={() => {
        router.push('/')
      }}
    >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={siteInfo?.icon} className='rounded-full' width={120} alt={BLOG.AUTHOR}/>
    </div>
    <div className='text-center text-xl pb-4'>{BLOG.AUTHOR}</div>
    <div className='text-sm text-center'>{BLOG.BIO}</div>
    <MenuGroupCard {...props}/>
    <SocialButton />
  </Card>
}
