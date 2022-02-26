import { useGlobal } from '@/lib/global'
import React from 'react'
import CONFIG_NEXT from '../config_next'

/**
 * 点击召唤目录抽屉
 * 当屏幕下滑500像素后会出现该控件
 * @param props 父组件传入props
 * @returns {JSX.Element}
 * @constructor
 */
const TocDrawerButton = (props) => {
  if (!CONFIG_NEXT.WIDGET_TOC) {
    return <></>
  }
  const { locale } = useGlobal()
  return (<div onClick={props.onClick} className='py-2 px-3 cursor-pointer dark:text-gray-200 text-center transform hover:scale-150 duration-200 flex justify-center items-center' title={locale.POST.TOP} >
    <i className='fas fa-list-ol'/>
  </div>)
}

export default TocDrawerButton
