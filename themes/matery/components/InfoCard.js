import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import Card from './Card'
import SocialButton from './SocialButton'
import MenuGroupCard from './MenuGroupCard'
import LazyImage from '@/components/LazyImage'
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
    <LazyImage src={siteInfo?.icon} className='rounded-full' width={120} alt={BLOG.AUTHOR}/>
    </div>
    <div className='text-center text-xl pb-4'>{BLOG.AUTHOR}</div>
    <div className='text-sm text-center'>{BLOG.BIO}</div>
    <MenuGroupCard {...props}/>
    <SocialButton />
  </Card>
}
