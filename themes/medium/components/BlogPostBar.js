import { useGlobal } from '@/lib/global'

/**
 * 文章列表上方嵌入
 * @param {*} props
 * @returns
 */
export default function BlogPostBar(props) {
  const { tag, category } = props
  const { locale } = useGlobal()

  if (tag) {
    return (

      <div className="px-4">
         
         <span className="inline-flex items-center border border-gray-200 rounded-md px-3 py-1 bg-white text-gray-400 text-base font-light mb-4">
         <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="rgba(100,205,138,1)"><path d="M7.78428 14L8.2047 10H4V8H8.41491L8.94043 3H10.9514L10.4259 8H14.4149L14.9404 3H16.9514L16.4259 8H20V10H16.2157L15.7953 14H20V16H15.5851L15.0596 21H13.0486L13.5741 16H9.58509L9.05957 21H7.04855L7.57407 16H4V14H7.78428ZM9.7953 14H13.7843L14.2047 10H10.2157L9.7953 14Z"></path></svg>
         
         
         {/* {locale.COMMON.TAGS}:*/} {tag}
          </span>
    </div>

    )
  } else if (category) {
    return (
      <div className="px-4">
            <span className="inline-flex items-center border border-gray-200 rounded-md px-3 py-1 bg-white text-gray-400 text-base font-light mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="rgba(100,205,138,1)"><path d="M12.9998 3L12.9996 10.267L19.294 6.63397L20.294 8.36602L14.0006 11.999L20.294 15.634L19.294 17.366L12.9996 13.732L12.9998 21H10.9998L10.9996 13.732L4.70557 17.366L3.70557 15.634L9.99857 12L3.70557 8.36602L4.70557 6.63397L10.9996 10.267L10.9998 3H12.9998Z"></path></svg>
              {/* {locale.COMMON.CATEGORY}: */} {category}
            </span>
          </div>
    )
  } else {
    return <></>
  }
}


