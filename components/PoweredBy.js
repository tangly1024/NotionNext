import { siteConfig } from '@/lib/config'

/**
 * 驱动版权
 * @returns
 */
export default function PoweredBy(props) {
  return (
    <div className={`inline font-serif ${props.className || ''}`}>
      <span className='mr-1 text-yellow-300 text-xs'>Powered by</span>
      <a
        href='https://github.com/tangly1024/NotionNext'
        className='justify-start text-yellow-300 text-xs hover:underline'
      >
        NotionNext {siteConfig('VERSION')}
      </a>
      .
      {/* 新增 IPv6 支持提示，完全匹配hhtb.cn样式 */}
      <span className="ml-4 text-yellow-300 text-xs">
        本网站已支持IPv6访问！
      </span>
    </div>
  )
}
    
