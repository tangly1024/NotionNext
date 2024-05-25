import Link from 'next/link'

function GroupCategory({ currentCategory, categoryOptions }) {
  if (!categoryOptions) {
    return <></>
  }

  return (
    <div className='flex items-center'>
      <Link className='mx-2' href='/category'>
        <i className='fas fa-bars' />
      </Link>
      <div
        id='category-list'
        className='dark:border-gray-600 flex flex-wrap py-1'>
        {categoryOptions.map(category => {
          const selected = currentCategory === category.name
          return (
            <Link
              key={category.name}
              href={`/category/${category.name}`}
              passHref
              className={` ${
                selected
                  ? 'bg-green-500 text-white '
                  : 'dark:text-gray-300 hover:bg-green-500 rounded-lg hover:text-white'
              }  whitespace-nowrap overflow-ellipsis items-center px-2 cursor-pointer py-1 font-bold`}>
              {/* <i
                className={`${selected ? 'text-white fa-folder-open' : 'fa-folder text-gray-400'} fas mr-2`}
              /> */}
              {category.name}
              {/* <span className='text-xs flex items-start pl-2 h-full'>
                {category.count}
              </span> */}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default GroupCategory
