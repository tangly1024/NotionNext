
import CategoryList from './CategoryList'
import StickyBar from './StickyBar'
import TagList from './TagList'

/**
 * 博客列表上方嵌入
 * @param {*} props
 * @returns
 */
export default function BlogListBar(props) {
  const { tagOptions, tag } = props
  const { category, categoryOptions } = props
  if (tag) {
    return (
            <StickyBar>
                <TagList tagOptions={tagOptions} currentTag={tag} />
            </StickyBar>
    )
  } else if (category) {
    return (
            <StickyBar>
                <CategoryList currentCategory={category} categoryOptions={categoryOptions} />
            </StickyBar>
    )
  } else {
    return <></>
  }
}
