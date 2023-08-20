import Card from './Card'

export function AnalyticsCard (props) {
  const { postCount } = props
  return <Card>
    <div className='ml-2 mb-3 '>
      <i className='fas fa-chart-area' /> 统计
    </div>
    <div className='text-xs  font-light justify-center mx-7'>
      <div className='inline'>
        <div className='flex justify-between'>
          <i className='fas fa-box-archive' /><span>文章数:</span><span>{postCount}</span>
        </div>
      </div>
      <div className='hidden busuanzi_container_page_pv ml-2'>
        <div className='flex justify-between'>
          <i className='fas fa-eye' /><span>访问量:</span><span className='px-1 busuanzi_value_site_pv'> </span>
        </div>
      </div>
      <div className='hidden busuanzi_container_site_uv ml-2'>
        <div className='flex justify-between'>
          <i className='fas fa-users' /><span>访客数:</span><span className='px-1 busuanzi_value_site_uv'> </span> 
        </div>
      </div>
    </div>
  </Card>
}
