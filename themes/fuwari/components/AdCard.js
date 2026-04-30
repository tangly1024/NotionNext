import { AdSlot } from '@/components/GoogleAdsense'
import WWAds from '@/components/WWAds'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

const AdCard = () => {
  if (!siteConfig('FUWARI_WIDGET_AD', false, CONFIG)) return null

  return (
    <section className='fuwari-card p-5'>
      <h3 className='text-sm font-semibold mb-3 tracking-wide uppercase text-[var(--fuwari-muted)]'>
        Sponsors
      </h3>
      <div className='space-y-3'>
        {siteConfig('FUWARI_WIDGET_WWADS', true, CONFIG) && <WWAds orientation='vertical' />}
        {siteConfig('FUWARI_WIDGET_ADSENSE', false, CONFIG) && <AdSlot />}
      </div>
    </section>
  )
}

export default AdCard

