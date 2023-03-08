import Live2D from '@/components/Live2D'
import About from './About'
import Announcement from './Announcement'

export const SideBar = (props) => {
  const { notice } = props
  return (
      <div className="w-full md:w-96 sticky top-8 border-l pl-12 border-gray-100">

            <aside>
                <Announcement post={notice}/>
            </aside>

            <aside>
                <About {...props}/>
            </aside>

            <aside className="  overflow-hidden mb-6">
                <Live2D />
            </aside>

        </div>
  )
}
