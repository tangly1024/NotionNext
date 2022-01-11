import React, { useEffect, useState } from 'react'
import { useGlobal } from '@/lib/global'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListOl } from '@fortawesome/free-solid-svg-icons'
import BLOG from '@/blog.config'

/**
 * 点击召唤目录抽屉
 * 当屏幕下滑500像素后会出现该控件
 * @param props 父组件传入props
 * @returns {JSX.Element}
 * @constructor
 */
const TocDrawerButton = (props) => {
  if (!BLOG.widget?.showToc) {
    return <></>
  }
  const { locale } = useGlobal()
  return (<div onClick={props.onClick} className={'cursor-pointer'}>
      <div className='dark:text-gray-200 text-center transform hover:scale-150 duration-200 text-xs flex justify-center items-center' title={locale.POST.TOP} >
        <FontAwesomeIcon icon={faListOl}/>
      </div>
  </div>)
}

export default TocDrawerButton
