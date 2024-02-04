import Link from 'next/link'
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
        <div id="tags-group" className="dark:border-gray-700 space-y-2">
            {tags.map((tag, index) => {
              const selected = currentTag === tag.name
              return (
                    <Link passHref key={index} href={`/tag/${encodeURIComponent(tag.name)}`}
                        className={'cursor-pointer inline-block  whitespace-nowrap'}
                    >
                        <div className={`${className || ''} 
                            ${selected ? 'text-white bg-blue-600 dark:bg-yellow-600' : ''}  
                            flex items-center hover:bg-blue-600 dark:hover:bg-yellow-600 hover:scale-110 hover:text-white rounded-lg px-2 py-0.5 duration-150 transition-all`}
                        >
                            <div className="text-lg">{tag.name} </div>
                            {tag.count
                              ? (
                                    <sup className="relative ml-1">{tag.count}</sup>
                                )
                              : (
                                    <></>
                                )}
                        </div>
                    </Link>
              )
            })}
        </div>
  )
}

export default TagGroups
