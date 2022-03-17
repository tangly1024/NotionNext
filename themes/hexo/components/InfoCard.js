import BLOG from '@/blog.config'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Card from './Card'
import SocialButton from './SocialButton'
import MenuGroupCard from './MenuGroupCard'
export function InfoCard (props) {
  const { className } = props
  const router = useRouter()
  return <Card className={className}>
    <div
      className='justify-center items-center flex hover:rotate-45 py-6 hover:scale-105 transform duration-200 cursor-pointer'
      onClick={() => {
        router.push('/')
      }}
    >
      <Image
        alt={BLOG.AUTHOR}
        width={120}
        height={120}
        loading='lazy'
        src={BLOG.AVATAR}
        className='rounded-full'
      />
    </div>
    <div className='text-center font-sans text-xl pb-4 dark:text-gray-300'>{BLOG.TITLE}</div>
    <MenuGroupCard {...props}/>
    <SocialButton />
  </Card>
}
