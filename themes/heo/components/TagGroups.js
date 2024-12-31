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
      <div className="text-lg font-bold mb-4 flex items-center group/title">
        <i className="fas fa-tags mr-2 text-blue-500 dark:text-yellow-500 transition-transform duration-300 group-hover/title:animate-bounce"></i>
        标签云
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => {
          const selected = currentTag === tag.name
          return (
            <Link
              passHref
              key={index}
              href={`/tag/${encodeURIComponent(tag.name)}`}
              className="tag-item relative group"
            >
              <div
                className={`
                  ${className || ''} 
                  ${selected
                    ? 'text-white bg-gradient-to-r from-blue-500 to-blue-600 dark:from-yellow-500 dark:to-yellow-600 shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800'
                  }
                  flex items-center rounded-lg px-3 py-1
                  transform transition-all duration-300
                  hover:scale-105 hover:shadow-lg
                  group-hover:bg-gradient-to-r
                  group-hover:from-blue-500 group-hover:to-blue-600
                  dark:group-hover:from-yellow-500 dark:group-hover:to-yellow-600
                  group-hover:text-white
                `}
              >
                <div className="text-sm font-medium">{tag.name}</div>
                {tag.count && (
                  <sup className="ml-1 transform transition-transform group-hover:scale-110">
                    {tag.count}
                  </sup>
                )}

                {/* 悬浮光效 */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shine-slow"></div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <style jsx>{`
        .tag-item::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, #12c2e9, #c471ed, #f64f59);
          border-radius: 10px;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .tag-item:hover::before {
          opacity: 0.5;
          animation: borderGlow 2s linear infinite;
        }

        @keyframes borderGlow {
          0% {
            filter: hue-rotate(0deg);
          }
          100% {
            filter: hue-rotate(360deg);
          }
        }

        @keyframes shine {
          from {
            transform: translateX(-100%) rotate(45deg);
          }
          to {
            transform: translateX(200%) rotate(45deg);
          }
        }

        .animate-shine-slow {
          animation: shine 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default TagGroups
