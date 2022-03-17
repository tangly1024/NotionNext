import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import Card from './components/Card'
import TagItemMini from './components/TagItemMini'
import LayoutBase from './LayoutBase'

export const LayoutTagIndex = props => {
  const { tags } = props
  const { locale } = useGlobal()
  const meta = {
    title: `${locale.COMMON.TAGS} | ${BLOG.TITLE}`,
    description: BLOG.DESCRIPTION,
    type: 'website'
  }
  return (
    <LayoutBase {...props} meta={meta}>
      <Card className='w-full'>
        <div className="dark:text-gray-200 mb-5 ml-4">
          <i className="mr-4 fas fa-tag" />
          {locale.COMMON.TAGS}:
        </div>
        <div id="tags-list" className="duration-200 flex flex-wrap ml-8">
          {tags.map(tag => {
            return (
              <div key={tag.name} className="p-2">
                <TagItemMini key={tag.name} tag={tag} />
              </div>
            )
          })}
        </div>
      </Card>
    </LayoutBase>
  )
}
