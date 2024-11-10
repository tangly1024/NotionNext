import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'

export default function Footer() {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate = parseInt(since) < currentYear ? `${since}-${currentYear}` : currentYear

  return (
    <footer className="border-t bg-background dark:border-gray-700">
      <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {copyrightDate} {siteConfig('AUTHOR')}. All rights reserved.
          </p>
          {/* <div className="flex flex-col items-center gap-4 sm:flex-row">
            <DarkModeButton />
            <p className="text-sm text-muted-foreground">
              &copy; {copyrightDate} {siteConfig('AUTHOR')}. All rights reserved.
            </p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm">
            {siteConfig('BEI_AN') && (
              <Link
                href="https://beian.miit.gov.cn/"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {siteConfig('BEI_AN')}
              </Link>
            )}
            <BeiAnGongAn />
          </nav> */}
        </div>
      </div>
    </footer>
  )
}