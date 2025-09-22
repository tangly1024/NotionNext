import { siteConfig } from '@/lib/config'
import UnifiedDarkModeButton from '@/components/UnifiedDarkModeButton'
import CONFIG from '../config'

/**
 * 深色模式浮动按钮 (Hexo主题优化版)
 */
export default function ButtonDarkModeFloat() {
  if (!siteConfig('HEXO_WIDGET_DARK_MODE', null, CONFIG)) {
    return <></>
  }

  return (
    <UnifiedDarkModeButton
      variant="float"
      iconSize="text-xs"
      className="dark-mode-float-button"
    />
  )
}
