import { siteConfig } from '@/lib/config'

/**
 * 驱动版权
 * @returns
 */
export default function PoweredBy(props) {
  return (
    <div className={`inline text-sm font-serif ${props.className || ''}`}>
      <span className='mr-1'></span>
      <a
        href='https://github.com/tangly1024/NotionNext'
        className='underline justify-start'>
         {siteConfig('VERSION')}
      </a>
      .
    </div>
  )
}
