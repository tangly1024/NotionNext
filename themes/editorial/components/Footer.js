import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const since = siteConfig('SINCE')
  const year =
    parseInt(since) < currentYear ? `${since}—${currentYear}` : currentYear

  return (
    <footer className='editorial-footer'>
      <SmartLink href='/' className='editorial-footer-brand'>
        {siteConfig('TITLE')}
      </SmartLink>
      <p>
        © {year} {siteConfig('AUTHOR')}. Built from notes, made for reading.
      </p>
    </footer>
  )
}
