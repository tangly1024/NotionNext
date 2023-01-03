import Link from 'next/link'
import HeaderArticle from './components/HeaderArticle'
import LayoutBase from './LayoutBase'

export const LayoutCategoryIndex = props => {
  const { categories } = props

  return (
        <LayoutBase {...props} headerSlot={<HeaderArticle {...props} />} >

            <div className='inner-wrapper'>

                <div className="drop-shadow-xl -mt-32 rounded-md mx-3 px-5 lg:border lg:rounded-xl lg:px-2 lg:py-4 bg-white dark:bg-hexo-black-gray  dark:border-black">

                    <div className='flex justify-center flex-wrap'>
                        {categories.map(e => {
                          return (
                                <Link key={e.name} href={`/category/${e.name}`} passHref>
                                    <div className='duration-300 text-md whitespace-nowrap dark:hover:text-white px-5 cursor-pointer py-2 hover:text-indigo-400' >
                                        <i className={'mr-4 fas fa-folder'} />
                                        {e.name}({e.count})
                                    </div>
                                </Link>
                          )
                        })}
                    </div>
                </div>

            </div>
        </LayoutBase>
  )
}
