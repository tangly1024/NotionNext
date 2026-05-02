import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

const PluginCard = ({ rightAreaSlot }) => {
  if (!siteConfig('FUWARI_WIDGET_PLUGIN_AREA', true, CONFIG)) return null
  if (!rightAreaSlot) return null

  return <div className='fuwari-card p-3'>{rightAreaSlot}</div>
}

export default PluginCard

