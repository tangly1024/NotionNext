import SmartLink from '@/components/SmartLink'

/**
 * 标签
 * @param {*} param0
 * @returns
 */
export default function TagItem({ tag }) {
  return (
    <div key={tag.name} className="p-2">
      <SmartLink
        key={tag}
        href={`/tag/${encodeURIComponent(tag.name)}`}
        passHref
        className={`cursor-pointer inline-block rounded duration-200 mr-2 py-1 px-2 text-xs whitespace-nowrap`}
      >
        <div className="font-light hover:scale-105 transition-all duration-200 text-xl dark:text-green-500 hover:bg-gray-100 dark:hover:bg-hexo-black-gray p-2">
          {tag.name + (tag.count ? `(${tag.count})` : '')}{' '}
        </div>
      </SmartLink>
    </div>
  )
}
