import { useState } from 'react'

/**
 * 订单列表
 */
export default function DashboardItemOrder() {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = 5

  const columns = [
    { key: 'name', label: '商品名称' },
    { key: 'color', label: '颜色' },
    { key: 'category', label: '分类' },
    {
      key: 'accessories',
      label: '配件',
      render: value => (value ? '是' : '否')
    },
    { key: 'available', label: '库存', render: value => (value ? '有' : '无') },
    { key: 'price', label: '价格', render: value => `¥${value}` },
    { key: 'weight', label: '重量' },
    {
      key: 'action',
      label: '操作',
      render: () => (
        <div className='flex items-center space-x-3'>
          <a
            href='#'
            className='font-medium text-blue-600 dark:text-blue-500 hover:underline'>
            编辑
          </a>
          <a
            href='#'
            className='font-medium text-red-600 dark:text-red-500 hover:underline'>
            删除
          </a>
        </div>
      )
    }
  ]

  const data = [
    {
      name: '苹果 MacBook Pro 17"',
      color: '银色',
      category: '笔记本',
      accessories: true,
      available: true,
      price: 2999,
      weight: '3.0 公斤'
    },
    {
      name: '微软 Surface Pro',
      color: '白色',
      category: '笔记本电脑',
      accessories: false,
      available: true,
      price: 1999,
      weight: '1.0 公斤'
    },
    {
      name: 'Magic Mouse 2',
      color: '黑色',
      category: '配件',
      accessories: true,
      available: false,
      price: 99,
      weight: '0.2 公斤'
    },
    {
      name: '苹果手表',
      color: '黑色',
      category: '手表',
      accessories: true,
      available: false,
      price: 199,
      weight: '0.12 公斤'
    },
    {
      name: 'iPad Pro',
      color: '金色',
      category: '平板电脑',
      accessories: false,
      available: true,
      price: 699,
      weight: '1.3 公斤'
    }
  ]

  const onPageChange = page => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className='bg-white rounded-lg shadow-lg p-6 border'>
      <div className='flex flex-col'>
        <Table columns={columns} data={data} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
        <ul className='text-gray-600 list-disc pl-6'>
          <li>订单说明：</li>
          <li className='font-bold'>这只是一个演示页面，不存在真实功能！</li>
        </ul>
      </div>
    </div>
  )
}

/**
 * 分页组件
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav
      aria-label='page-navigation'
      className='w-full flex mx-auto justify-center items-center py-4'>
      <ul className='inline-flex -space-x-px text-sm'>
        {/* 上一页 */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight border border-e-0 rounded-s-lg ${
              currentPage === 1
                ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            }`}>
            上一页
          </button>
        </li>

        {/* 页码列表 */}
        {pages.map(page => (
          <li key={page}>
            <button
              onClick={() => onPageChange(page)}
              className={`flex items-center justify-center px-3 h-8 leading-tight border ${
                currentPage === page
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}>
              {page}
            </button>
          </li>
        ))}

        {/* 下一页 */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center px-3 h-8 leading-tight border rounded-e-lg ${
              currentPage === totalPages
                ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            }`}>
            下一页
          </button>
        </li>
      </ul>
    </nav>
  )
}

/**
 * 表格组件
 */
const Table = ({ columns, data }) => {
  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
        {/* 表头 */}
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th scope='col' className='p-4 w-4'>
              <div className='flex items-center'>
                <input
                  id='checkbox-all'
                  type='checkbox'
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                />
                <label htmlFor='checkbox-all' className='sr-only'>
                  全选
                </label>
              </div>
            </th>
            {columns.map((column, index) => (
              <th
                key={index}
                scope='col'
                className={`${
                  column.key === 'name'
                    ? 'px-6 py-3 w-[25%]'
                    : 'px-4 py-3 w-[10%]'
                }`}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        {/* 表格内容 */}
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
              <td className='w-4 p-4'>
                <div className='flex items-center'>
                  <input
                    id={`checkbox-${index}`}
                    type='checkbox'
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                  />
                  <label htmlFor={`checkbox-${index}`} className='sr-only'>
                    选择
                  </label>
                </div>
              </td>
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`${
                    column.key === 'name'
                      ? 'px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white w-[25%]'
                      : 'px-4 py-4 w-[10%]'
                  }`}>
                  {column.render
                    ? column.render(item[column.key])
                    : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
