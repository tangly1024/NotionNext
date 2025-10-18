import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'
import TagItemMiddle from './TagItemMiddle'

export default function BlogListBar(props) {
  const { category, categoryOptions, tag, tagOptions } = props
  const { locale } = useGlobal()

  if (category) {
    return (
            <div className="drop-shadow-xl w-full mt-14 lg:mt-6 rounded-md mx-3 px-5 lg:border lg:rounded-xl lg:px-2 lg:py-4 bg-white dark:bg-hexo-black-gray  dark:border-black">
                <div className='flex justify-center flex-wrap'>
                    {categoryOptions?.map(e => {
                      const selected = e.name === category
                      return (
                            <SmartLink key={e.name} href={`/category/${e.name}`} passHref legacyBehavior>
                                <div className='duration-300 text-md whitespace-nowrap dark:hover:text-white px-5 cursor-pointer py-2 hover:text-indigo-400' >
                                    <i className={`mr-4 fas  ${selected ? 'fa-folder-open' : 'fa-folder'}`} />
                                    {e.name}({e.count})
                                </div>
                            </SmartLink>
                      )
                    })}
                </div>
            </div>

    )
  } else if (tag) {
    return <div className="drop-shadow-xl w-full mt-14 lg:mt-6 rounded-md mx-3 px-5 lg:border lg:rounded-xl lg:px-2 lg:py-4 bg-white dark:bg-hexo-black-gray  dark:border-black">
            <div className="dark:text-gray-200 py-5 text-center  text-2xl">
                <i className="fas fa-tags" />  {locale.COMMON.TAGS}
            </div>
            <div id="tags-list" className="duration-200 flex flex-wrap justify-center pb-12">
                {tagOptions?.map(e => {
                  const selected = tag === e.name
                  return (
                        <div key={e.id} className="p-2">
                            <TagItemMiddle key={e.id} tag={e} selected={selected} />
                        </div>
                  )
                })}
            </div>
        </div>
  } else {
    return <></>
  }
}
