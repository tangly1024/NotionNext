import React, { useEffect, useRef } from 'react'

const Collapse = props => {
  const collapseRef = useRef(null)
  const collapseSection = element => {
    const sectionWidth = element.scrollWidth
    requestAnimationFrame(function () {
      element.style.width = sectionWidth + 'px'
      requestAnimationFrame(function () {
        element.style.width = 0 + 'px'
      })
    })
  }
  const expandSection = element => {
    const sectionWidth = element.scrollWidth
    element.style.width = sectionWidth + 'px'
    const clearTime = setTimeout(() => {
      element.style.width = 'auto'
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
    <div ref={collapseRef} style={{ width: '0px' }} className={'overflow-hidden duration-200 ' + props.className}>
      {props.children}
    </div>
  )
}
Collapse.defaultProps = { isOpen: false }

export default Collapse
