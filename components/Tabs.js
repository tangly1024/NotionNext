import React, { useState } from 'react'

/**
 * Tabs切换标签
 * @param {*} param0
 * @returns
 */
const Tabs = ({ className, children }) => {
  if (!children) {
    return <></>
  }

  children = children.filter(c => c !== '')

  let count = 0
  children.forEach(e => {
    if (e) {
      count++
    }
  })

  if (count === 0) {
    return <></>
  }

  if (count === 1) {
    return <section className={'duration-200 ' + className}>
      {children}
    </section>
  }

  const [currentTab, setCurrentTab] = useState(0)

  function tabClickHandle (i) {
    setCurrentTab(i)
  }

  return <div className={'mb-5 duration-200 ' + className}>
    <ul className='flex justify-center space-x-5 pb-4 dark:text-gray-400 text-gray-600'>
      {children.map((item, index) => {
        return <li key={index}
                   className={(currentTab === index ? 'font-black border-b-2 border-red-400 text-red-400 animate__animated animate__jello ' : 'font-extralight cursor-pointer') + ' text-sm font-sans '}
                   onClick={() => {
                     tabClickHandle(index)
                   }}>
          {item?.key}
        </li>
      })}
    </ul>
    <div>
      {children.map((item, index) => {
        return <section key={index} className={ 'animate__animated animate__fadeIn animate__faster'}>
          {currentTab === index && item}
        </section>
      })}
    </div>
  </div>
}

export default Tabs
