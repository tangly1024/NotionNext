import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { faFolder, faTh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import Card from './components/Card'
import LayoutBase from './LayoutBase'

export const LayoutCategoryIndex = props => {
  const { categories } = props
  const { locale } = useGlobal()
  const meta = {
    title: `${locale.COMMON.CATEGORY} | ${BLOG.TITLE}`,
    description: BLOG.DESCRIPTION,
    type: 'website'
  }
  return (
    <LayoutBase {...props} meta={meta}>
      <Card className="bg-white dark:bg-gray-700 w-full min-h-screen">
        <div className="dark:text-gray-200 mb-5 mx-3">
          <FontAwesomeIcon icon={faTh} className="mr-4" />
          {locale.COMMON.CATEGORY}:
        </div>
        <div id="category-list" className="duration-200 flex flex-wrap mx-8">
          {Object.keys(categories).map(category => {
            return (
              <Link key={category} href={`/category/${category}`} passHref>
                <div
                  className={
                    ' duration-300 dark:hover:text-white rounded-lg px-5 cursor-pointer py-2 hover:bg-blue-600 hover:text-white'
                  }
                >
                  <FontAwesomeIcon icon={faFolder} className="mr-4" />
                  {category}({categories[category]})
                </div>
              </Link>
            )
          })}
        </div>
      </Card>
    </LayoutBase>
  )
}
