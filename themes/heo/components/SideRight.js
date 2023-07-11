import Card from './Card'
import TagGroups from './TagGroups'
import Catalog from './Catalog'
import { InfoCard } from './InfoCard'
import dynamic from 'next/dynamic'
import Announcement from './Announcement'
import Live2D from '@/components/Live2D'

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
    currentTag, rightAreaSlot, notice
  } = props

  console.log('props', props)
  return (
        <div id='sideRight' className='w-72'>

            <InfoCard {...props} className='w-72' />

            <Card>
                <div>Join Us</div>
            </Card>

            <Card>
                <TagGroups tags={tagOptions} currentTag={currentTag} />
            </Card>

            <Announcement post={notice} />

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
