import BLOG from '@/blog.config'
import Image from 'next/image'
import { Router } from 'next/router'
import Card from './Card'
import SocialButton from './SocialButton'
import MenuButtonGroup from './MenuButtonGroup'
export function InfoCard (props) {
  return <Card>
    <div
      className='justify-center items-center flex hover:rotate-45 py-6 hover:scale-105 transform duration-200 cursor-pointer'
      onClick={() => {
        Router.push('/')
      }}
    >
      <Image
        alt={BLOG.AUTHOR}
        width={120}
        height={120}
        loading='lazy'
        src='/avatar.jpg'
        className='rounded-full'
      />
    </div>
    <div className='text-center font-sans text-xl pb-4 dark:text-gray-300'>{BLOG.TITLE}</div>
    <MenuButtonGroup {...props}/>
    <SocialButton />
  </Card>
}
