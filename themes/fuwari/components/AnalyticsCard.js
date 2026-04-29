import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

const Item = ({ label, value }) => (
  <div className='fuwari-card fuwari-analytics-item p-3 text-center min-w-0'>
    <div className='text-lg font-semibold leading-none'>{value}</div>
    <div className='fuwari-analytics-label mt-1'>{label}</div>
  </div>
)

const AnalyticsCard = ({ postCount = 0, categoryOptions = [], tagOptions = [] }) => {
  if (!siteConfig('FUWARI_WIDGET_ANALYTICS', true, CONFIG)) return null

  return (
    <section>
      <h3 className='text-sm font-semibold mb-2 tracking-wide uppercase text-[var(--fuwari-muted)] px-1'>
        Analytics
      </h3>
      <div className='grid grid-cols-3 gap-2'>
        <Item label='Posts' value={postCount || 0} />
        <Item label='Categories' value={categoryOptions?.length || 0} />
        <Item label='Tags' value={tagOptions?.length || 0} />
      </div>
    </section>
  )
}

export default AnalyticsCard

