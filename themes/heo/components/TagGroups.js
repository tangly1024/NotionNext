import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'

/**
 * 标签组
 * @param tags
 * @param currentTag
 * @returns {JSX.Element}
 * @constructor
 */
const TagGroups = ({ tags, className }) => {
  const router = useRouter()
  const { tag: currentTag } = router.query
  if (!tags) return <></>

  return (
    <div id='tags-group' className='dark:border-gray-700 space-y-2'>
      {tags.map((tag, index) => {
        const selected = currentTag === tag.name
        return (
          <SmartLink passHref key={index} href={`/tag/${encodeURIComponent(tag.name)}`}
            className={'cursor-pointer inline-block  whitespace-nowrap'}
          >
            <div className={`${className || ''} 
              ${selected ? 'text-[var(--heo-color-primary-text)] bg-[var(--heo-color-primary)] dark:bg-[var(--heo-color-accent)]' : ''}
              flex items-center hover:bg-[var(--heo-color-primary)] dark:hover:bg-[var(--heo-color-accent)] hover:scale-110 hover:text-[var(--heo-color-primary-text)] rounded-lg px-2 py-0.5 duration-150 transition-all`}
            >
              <div className='text-lg'>{tag.name} </div>
              {tag.count
                ? (
                  <sup className='relative ml-1'>{tag.count}</sup>
                )
                : (
                  <></>
                )}
            </div>
          </SmartLink>
        )
      })}
      <SmartLink
        href={`${siteConfig('SUB_PATH', '')}/tag`}
        className='flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-sm opacity-70 hover:opacity-100 hover:text-[var(--heo-color-primary)] dark:hover:text-[var(--heo-color-accent)] transition-all'>
        <span>查看全部标签</span>
        <i className='fas fa-arrow-right text-xs' />
      </SmartLink>
    </div>
  )
}

export default TagGroups
