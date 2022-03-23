import { useGlobal } from '@/lib/global'
import TagItemMini from './components/TagItemMini'
import LayoutBase from './LayoutBase'

export const LayoutTagIndex = props => {
  const { tags } = props
  const { locale } = useGlobal()
  return (
    <LayoutBase {...props}>
      <div className="bg-white dark:bg-gray-700 p-10">
        <div className="dark:text-gray-200 mb-5">
          <i className="mr-4 fas fa-tag" />
          {locale.COMMON.TAGS}:
        </div>
        <div id="tags-list" className="duration-200 flex flex-wrap">
          {tags.map(tag => {
            return (
              <div key={tag.name} className="p-2">
                <TagItemMini key={tag.name} tag={tag} />
              </div>
            )
          })}
        </div>
      </div>
    </LayoutBase>
  )
}
