import Live2D from '@/components/Live2D'
import Announcement from './Announcement'
import Catalog from './Catalog'

export const SideBar = (props) => {
  const { notice } = props
  return (<>
        <aside>
            <Catalog {...props} />
        </aside>

        <aside className="overflow-hidden mb-6">
            <Live2D />
        </aside>
        <aside>
            <Announcement post={notice} />
        </aside>
    </>)
}
