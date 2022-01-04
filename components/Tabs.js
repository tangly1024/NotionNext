import React, { useState } from 'react'

/**
 * Tabs切换标签
 * @param {*} param0
 * @returns
 */
const Tabs = ({ children }) => {
  if (!children) {
    return <></>
  }

  let count = children.length
  children.forEach(e => {
    if (!e) {
      count--
    }
  })

  if (count === 1) {
    return <section className='shadow'>
      {children}
    </section>
  }

  const [currentTab, setCurrentTab] = useState(0)
  function tabClickHandle (i) {
    setCurrentTab(i)
  }

  return (
    <section >
      {<div className='shadow hidden lg:block mb-5 py-4 px-5 bg-white dark:bg-gray-800  hover:shadow-xl duration-200'>
        <ul className='flex justify-center space-x-5 pb-4 dark:text-gray-400 text-gray-600'>
          {children.map((item, index) => {
            return <li key={index} className={currentTab === index ? 'font-black border-b' : 'font-extralight cursor-pointer'} onClick={() => { tabClickHandle(index) }}>
              {item?.key}
            </li>
          })}
        </ul>
        {children.map((item, index) => {
          return <section key={index} className={`${currentTab === index ? 'block' : 'hidden'}`}>
              {item}
            </section>
        })}
      </div>}

    </section>)
}

export default Tabs
