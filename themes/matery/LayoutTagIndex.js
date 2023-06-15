import { useGlobal } from '@/lib/global'
import HeaderArticle from './components/HeaderArticle'
import TagItemMiddle from './components/TagItemMiddle'
import LayoutBase from './LayoutBase'

export const LayoutTagIndex = props => {
  const { tagOptions } = props
  const { locale } = useGlobal()
  return (
        <LayoutBase {...props} headerSlot={<HeaderArticle {...props} />} >
            <div id='inner-wrapper' className='w-full drop-shadow-xl'>

                <div className="-mt-32 rounded-md mx-3 px-5 lg:border lg:rounded-xl lg:px-2 lg:py-4 bg-white dark:bg-hexo-black-gray  dark:border-black">

                    <div className="dark:text-gray-200 py-5 text-center  text-2xl">
                        <i className="fas fa-tags" />  {locale.COMMON.TAGS}
                    </div>

                    <div id="tags-list" className="duration-200 flex flex-wrap justify-center pb-12">
                        {tagOptions.map(tag => {
                          return (
                                <div key={tag.name} className="p-2">
                                    <TagItemMiddle key={tag.name} tag={tag} />
                                </div>
                          )
                        })}
                    </div>
                </div>
            </div>
        </LayoutBase>
  )
}

export default LayoutTagIndex
