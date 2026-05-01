import { siteConfig } from '@/lib/config'
import DarkModeButton from './DarkModeButton'
import CONFIG from '../config'

/**
 * 页脚 — 紧凑风格
 */
export default function Footer(props) {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const customCopyright = siteConfig('CLAUDE_FOOTER_COPYRIGHT', '', CONFIG)
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

  return (
    <footer className='claude-footer'>
      <DarkModeButton className='mb-3' />
      <div>
        {customCopyright || `© ${copyrightDate} ${siteConfig('AUTHOR')}`}
      </div>
    </footer>
  )
}
