import Live2D from '@/components/Live2D'
import Announcement from './Announcement'

export const SideBar = (props) => {
  const { notice } = props
  return (
      <div className="w-full max-w-lg sticky top-8 border-l dark:border-gray-800 pl-12 border-gray-100">

            <aside>
                <Announcement post={notice}/>
            </aside>

            <aside className="  overflow-hidden mb-6">
                <Live2D />
            </aside>

        </div>
  )
}
