import Live2D from '@/components/Live2D'
import Announcement from './Announcement'
import Catalog from './Catalog'

export const SideBar = (props) => {
  const { notice } = props
  return (
        <div className="hidden lg:block flex-none sticky top-8 max-w-md border-l dark:border-gray-800 pl-12 border-gray-100">

            <aside >
                <Catalog {...props} />
            </aside>

            <aside className="overflow-hidden mb-6">
                <Live2D />
            </aside>
            <aside>
                <Announcement post={notice} />
            </aside>

        </div>
  )
}
