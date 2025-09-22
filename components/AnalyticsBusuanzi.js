/**
 * 不蒜子统计 访客和阅读量
 * @returns
 */
export default function AnalyticsBusuanzi() {
  return (
    <div className='flex gap-x-1'>
      <span className='hidden busuanzi_container_site_pv whitespace-nowrap'>
        <i className='fas fa-eye' />
        <span className='px-1 busuanzi_value_site_pv'> </span>
      </span>
      <span className='hidden busuanzi_container_site_uv whitespace-nowrap'>
        <i className='fas fa-users' />
        <span className='px-1 busuanzi_value_site_uv'> </span>
      </span>
    </div>
  )
}
