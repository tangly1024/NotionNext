import Card from './Card'
import TagGroups from './TagGroups'
import Catalog from './Catalog'
import { InfoCard } from './InfoCard'
import dynamic from 'next/dynamic'
import Live2D from '@/components/Live2D'
import FlipCard from '@/components/FlipCard'
import Link from 'next/link'
import { AnalyticsCard } from './AnalyticsCard'

const FaceBookPage = dynamic(
  () => {
    let facebook = <></>
    try {
      facebook = import('@/components/FacebookPage')
    } catch (err) {
      console.error(err)
    }
    return facebook
  },
  { ssr: false }
)

/**
 * Hexo主题右侧栏
 * @param {*} props
 * @returns
 */
export default function SideRight(props) {
  const {
    post, tagOptions,
    currentTag, rightAreaSlot
  } = props

  console.log('props', props)
  return (
        <div id='sideRight' className='hidden xl:block w-72 space-y-4'>

            <InfoCard {...props} className='w-72' />

            <div className={'relative h-28 border rounded-xl lg:p-6 p-4 bg-[#4f65f0] text-white flex flex-col'}>

                <FlipCard
                    className='cursor-pointer'
                    frontContent={
                        <div>
                            <h2 className='font-[1000] text-3xl'>交流频道</h2>
                            <h3 className='pt-2'>加入我们的社群讨论分享</h3>
                            <div className='absolute left-0 top-0 w-full h-full' style={{ background: 'url(https://bu.dusays.com/2023/05/16/64633c4cd36a9.png) center center no-repeat' }}></div>
                        </div>}

                    backContent={<div className='font-[1000] text-xl'>
                        <Link href='https://docs.tangly1024.com/article/how-to-question'>
                            点击查看联系方式
                        </Link>
                    </div>}
                />

            </div>

            {/* 标签和成绩 */}
            <Card className={'sticky top-20 bg-white'}>
                <TagGroups tags={tagOptions} currentTag={currentTag} />
                <hr className='mx-1 flex border-dashed relative my-2'/>
                <AnalyticsCard {...props} />
            </Card>

            <div className='sticky top-20'>
                {post && post.toc && post.toc.length > 1 && <Card>
                    <Catalog toc={post.toc} />
                </Card>}

                {rightAreaSlot}
                <FaceBookPage />
                <Live2D />
            </div>

        </div>
  )
}
