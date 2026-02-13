import DarkModeButton from '@/components/DarkModeButton'
import { siteConfig } from '@/lib/config'

/**
 * 页脚 — 紧凑风格
 */
export default function Footer(props) {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

  return (
    <footer className='claude-footer'>
      <DarkModeButton className='mb-3' />
      <div>
        &copy; {copyrightDate} {siteConfig('AUTHOR')}
      </div>
    </footer>
  )
}
