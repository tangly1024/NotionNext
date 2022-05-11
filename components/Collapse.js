import React from 'react'

/**
 * 折叠面板组件，支持水平折叠、垂直折叠
 * @param {type:['horizontal','vertical'],isOpen} props
 * @returns
 */
const Collapse = props => {
  const collapseRef = React.useRef(null)
  const type = props.type || 'vertical'
  const collapseSection = element => {
    const sectionHeight = element.scrollHeight
    const sectionWidth = element.scrollWidth

    requestAnimationFrame(function () {
      switch (type) {
        case 'horizontal':
          element.style.width = sectionWidth + 'px'
          requestAnimationFrame(function () {
            element.style.width = 0 + 'px'
          })
          break
        case 'vertical':
          element.style.height = sectionHeight + 'px'
          requestAnimationFrame(function () {
            element.style.height = 0 + 'px'
          })
      }
    })
  }

  /**
   * 展开
   * @param {*} element
   */
  const expandSection = element => {
    const sectionHeight = element.scrollHeight
    const sectionWidth = element.scrollWidth
    let clearTime = 0
    switch (type) {
      case 'horizontal':
        element.style.width = sectionWidth + 'px'
        clearTime = setTimeout(() => {
          element.style.width = 'auto'
        }, 400)
        break
      case 'vertical':
        element.style.height = sectionHeight + 'px'
        clearTime = setTimeout(() => {
          element.style.height = 'auto'
        }, 400)
    }

    clearTimeout(clearTime)
  }

  React.useEffect(() => {
    const element = collapseRef.current
    if (props.isOpen) {
      expandSection(element)
    } else {
      collapseSection(element)
    }
  }, [props.isOpen])

  return (
    <div ref={collapseRef} style={type === 'vertical' ? { height: '0px' } : { width: '0px' }} className={'overflow-hidden duration-200 ' + props.className }>
      {props.children}
    </div>
  )
}
Collapse.defaultProps = { isOpen: false }

export default Collapse
