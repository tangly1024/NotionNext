import SmartLink from '@/components/SmartLink'

function GroupCategory ({ currentCategory, categories }) {
  if (!categories) {
    return <></>
  }

  return <>
    <div id='category-list' className='dark:border-gray-600 flex flex-wrap'>
      {categories.map(category => {
        const selected = currentCategory === category.name
        return (
          <SmartLink
            key={category.name}
            href={`/category/${category.name}`}
            passHref
            className={(selected
              ? 'hover:text-white dark:hover:text-white bg-gray-600 text-white '
              : 'dark:text-gray-400 text-gray-500 hover:text-white hover:bg-gray-500 dark:hover:text-white') +
              '  text-sm w-full items-center duration-300 px-2  cursor-pointer py-1 font-light'}>

            <i className={`${selected ? 'text-white fa-folder-open' : 'fa-folder text-gray-400'} fas mr-2`} />{category.name}({category.count})
          </SmartLink>
        )
      })}
    </div>
  </>
}

export default GroupCategory
