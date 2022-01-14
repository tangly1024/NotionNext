import React, { useEffect, useRef } from 'react'

const Collapse = props => {
  const collapseRef = useRef(null)
  const collapseSection = element => {
    const sectionHeight = element.scrollHeight
    requestAnimationFrame(function () {
      element.style.height = sectionHeight + 'px'
      requestAnimationFrame(function () {
        element.style.height = 0 + 'px'
      })
    })
  }
  const expandSection = element => {
    const sectionHeight = element.scrollHeight
    element.style.height = sectionHeight + 'px'
    const clearTime = setTimeout(() => {
      element.style.height = 'auto'
    }, 400)
    clearTimeout(clearTime)
  }
  useEffect(() => {
    const element = collapseRef.current
    if (props.isOpen) {
      expandSection(element)
    } else {
      collapseSection(element)
    }
  }, [props.isOpen])
  return (
    <div ref={collapseRef} style={{ height: '0px' }} className='overflow-hidden duration-200'>
      {props.children}
    </div>
  )
}
Collapse.defaultProps = { isOpen: false }

export default Collapse
