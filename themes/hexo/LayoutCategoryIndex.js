import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import Card from './components/Card'
import LayoutBase from './LayoutBase'

export const LayoutCategoryIndex = props => {
  const { categories } = props
  const { locale } = useGlobal()
  return (
    <LayoutBase {...props}>
      <Card className="w-full min-h-screen">
        <div className="dark:text-gray-200 mb-5 mx-3">
          <i className="mr-4 fas fa-th" />
          {locale.COMMON.CATEGORY}:
        </div>
        <div id="category-list" className="duration-200 flex flex-wrap mx-8">
          {categories.map(category => {
            return (
              <Link key={category.name} href={`/category/${category.name}`} passHref>
                <div
                  className={
                    ' duration-300 dark:hover:text-white px-5 cursor-pointer py-2 hover:text-indigo-400'
                  }
                >
                  <i className="mr-4 fas fa-folder" />
                  {category.name}({category.count})
                </div>
              </Link>
            )
          })}
        </div>
      </Card>
    </LayoutBase>
  )
}
