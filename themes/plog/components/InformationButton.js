import { InformationCircle } from '@/components/ui/HeroIcons'
import { useRef } from 'react'
import SlideOvers from './SlideOvers'

/**
 * 显示网站用户信息按钮
 * @returns
 */
export default function InformationButton() {
  const slideOversRef = useRef({})
  const toggleCollapsed = () => {
    slideOversRef.current.toggleSlideOvers()
  }

  return (
    <>
      <div className='cursor-pointer' onClick={toggleCollapsed}>
        <InformationCircle className={'w-5 h-5'} />
      </div>

      <SlideOvers cRef={slideOversRef} />
    </>
  )
}
