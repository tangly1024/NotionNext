import NotionPage from '@/components/NotionPage'
import DashboardHeader from '@/components/ui/dashboard/DashboardHeader'
import DashboardBody from '@/components/ui/dashboard/DashboardBody'

/**
 * 仪表盘
 * @param {*} props
 * @returns
 */
export const LayoutDashboard = props => {
  const { post } = props

  return (
    <>
      <div className='container grow'>
        <div className='flex flex-wrap justify-center -mx-4'>
          <div id='container-inner' className='w-full p-4'>
            {post && (
              <div id='article-wrapper' className='mx-auto'>
                <NotionPage {...props} />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 仪表盘 */}
      <DashboardHeader />
      <DashboardBody />
    </>
  )
}
